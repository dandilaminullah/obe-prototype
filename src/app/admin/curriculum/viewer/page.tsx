"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";
import { Info } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function CurriculumViewerPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");
  const [courses, setCourses] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, [role, prodiId]);

  useEffect(() => {
    if (selectedKurikulum) {
      fetchCurriculum(selectedKurikulum);
    }
  }, [selectedKurikulum]);

  const fetchInitialData = async () => {
    setLoading(true);
    let query = supabase
      .from("kurikulum")
      .select("*, prodi(nama)")
      .order("tahun_berlaku", { ascending: false });
    if (role === "ADMIN" && prodiId) {
      query = query.eq("prodi_id", prodiId);
    }
    const { data: kurData } = await query;
    if (kurData && kurData.length > 0) {
      setKurikulums(kurData);
      setSelectedKurikulum(kurData[0].id);
    } else {
      setKurikulums([]);
      setSelectedKurikulum("");
      setCourses([]);
      setCpls([]);
      setLoading(false);
    }
  };

  const fetchCurriculum = async (kurikulumId: string) => {
    setLoading(true);

    // Fetch all needed data filtered by this curriculum
    const [coursesRes, cpmkRes, subCpmkRes, mapBkRes, bkRes, cplRes, topikRes] =
      await Promise.all([
        supabase
          .from("mata_kuliah")
          .select("*, kurikulum(prodi(nama))")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase.from("cpmk").select("*").order("kode"),
        supabase.from("sub_cpmk").select("*").order("kode"),
        supabase.from("mata_kuliah_bk").select("*"),
        supabase
          .from("bahan_kajian")
          .select("*")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase
          .from("cpl")
          .select("*")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase
          .from("topik_materi_pembelajaran")
          .select("*")
          .order("urutan", { ascending: true }),
      ]);

    if (coursesRes.data) {
      const enrichedCourses = coursesRes.data.map((course) => {
        // Map the prodi name from the relation
        const courseProdi = course.kurikulum?.prodi;

        // Attach CPMKs and Sub-CPMKs
        const courseCpmks = (cpmkRes.data || [])
          .filter((c) => c.mata_kuliah_id === course.id)
          .map((cpmk) => ({
            ...cpmk,
            bk: (bkRes.data || []).find((b) => b.id === cpmk.bk_id),
            sub_cpmks: (subCpmkRes.data || []).filter(
              (s) => s.cpmk_id === cpmk.id,
            ),
          }));

        // Attach CPLs via BK
        const courseBks = (mapBkRes.data || []).filter(
          (m) => m.mata_kuliah_id === course.id,
        );
        const courseCplIds = Array.from(
          new Set(
            courseBks
              .map(
                (m) => (bkRes.data || []).find((b) => b.id === m.bk_id)?.cpl_id,
              )
              .filter(Boolean),
          ),
        );
        const courseCpls = courseCplIds
          .map((cplId) => (cplRes.data || []).find((c) => c.id === cplId))
          .filter(Boolean);

        // Attach Topik Materi
        const courseTopik = (topikRes.data || []).filter(
          (t) => t.mata_kuliah_id === course.id,
        );

        return {
          ...course,
          prodi: courseProdi,
          cpmks: courseCpmks,
          cpls: courseCpls,
          topik_materi: courseTopik,
        };
      });
      setCourses(enrichedCourses);
    } else {
      setCourses([]);
    }

    if (cplRes.data) {
      setCpls(cplRes.data);
    } else {
      setCpls([]);
    }

    setLoading(false);
  };

  const toRoman = (num: number): string => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num.toString();
  };

  // SKS and Course calculations per semester
  const semestersList = Array.from(
    new Set(courses.map((c) => c.semester).filter(Boolean)),
  ) as number[];
  semestersList.sort((a, b) => b - a); // descending order (highest semester on top)

  const getSemesterSks = (sem: number) => {
    return courses
      .filter((c) => c.semester === sem)
      .reduce((sum, c) => {
        const sksVal =
          c.sks ||
          (c.sks_teori || 0) + (c.sks_praktikum || 0) + (c.sks_lapangan || 0);
        return sum + sksVal;
      }, 0);
  };

  const getSemesterCourseCount = (sem: number) => {
    return courses.filter((c) => c.semester === sem).length;
  };

  const totalCurriculumSks = semestersList.reduce(
    (sum, sem) => sum + getSemesterSks(sem),
    0,
  );

  // Filter CPLs and sort by code
  const curriculumCpls = [...cpls].sort((a, b) =>
    a.kode.localeCompare(b.kode, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  // Wajib courses unmapped to CPLs
  const hasUnmappedWajibCourses = courses.some(
    (c) =>
      (!c.sifat_mk || c.sifat_mk.toLowerCase() === "wajib") &&
      (!c.cpls || c.cpls.length === 0),
  );

  const renderCoursesInCell = (cellCourses: any[]) => {
    if (cellCourses.length === 0) return null;
    return (
      <div className="flex flex-col gap-1.5 p-1 items-center justify-center">
        {cellCourses.map((course) => {
          const courseSks =
            course.sks ||
            (course.sks_teori || 0) +
              (course.sks_praktikum || 0) +
              (course.sks_lapangan || 0);
          return (
            <div
              key={course.id}
              className="w-full max-w-[150px] p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-indigo-400 hover:shadow transition-all text-left relative group cursor-help"
            >
              <div className="font-bold text-slate-800 text-[11px] leading-tight">
                {course.kode}
              </div>
              <div
                className="text-slate-600 text-[10px] leading-tight font-medium mt-0.5 line-clamp-2"
                title={course.nama}
              >
                {course.nama}
              </div>
              <div className="text-slate-400 text-[9px] font-semibold mt-1">
                {courseSks} SKS
              </div>

              {/* Premium Tooltip */}
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left border border-slate-700/80">
                <div className="font-bold text-indigo-300 text-xs mb-0.5 uppercase tracking-wider">
                  Mata Kuliah
                </div>
                <div className="font-bold text-white text-sm mb-1">
                  {course.kode} - {course.nama}
                </div>
                <div className="text-slate-300 text-[11px] space-y-0.5 mt-1 border-t border-slate-800 pt-1.5">
                  <div>
                    <span className="text-slate-400">SKS:</span> {courseSks} (T:
                    {course.sks_teori || 0} P:{course.sks_praktikum || 0} L:
                    {course.sks_lapangan || 0})
                  </div>
                  <div>
                    <span className="text-slate-400">Sifat:</span>{" "}
                    {course.sifat_mk || "Wajib"}
                  </div>
                  {course.prodi?.nama && (
                    <div>
                      <span className="text-slate-400">Prodi:</span>{" "}
                      {course.prodi.nama}
                    </div>
                  )}
                </div>

                {course.cpls && course.cpls.length > 0 && (
                  <div className="border-t border-slate-800 pt-1.5 mt-1.5">
                    <div className="font-semibold text-[10px] text-amber-300 uppercase tracking-wider mb-1">
                      CPL yang Diemban:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.cpls.map((c: any) => (
                        <span
                          key={c.id}
                          className="bg-amber-950/60 text-amber-300 px-1 py-0.5 rounded text-[9px] font-bold border border-amber-900"
                          title={c.deskripsi}
                        >
                          {c.kode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.cpmks && course.cpmks.length > 0 && (
                  <div className="border-t border-slate-800 pt-1.5 mt-1.5">
                    <div className="font-semibold text-[10px] text-emerald-300 uppercase tracking-wider mb-1">
                      CPMK ({course.cpmks.length}):
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                      {course.cpmks.map((c: any) => (
                        <div
                          key={c.id}
                          className="text-[10px] text-slate-300 leading-tight"
                        >
                          <span className="font-bold text-white">{c.kode}</span>
                          : {c.deskripsi}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/80"></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
        <span>Memuat data kurikulum...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Curriculum Viewer
          </h1>
          <p className="text-gray-500 font-medium text-slate-500">
            Tampilan peta sebaran kurikulum dan CPL Mata Kuliah.
          </p>
        </div>
        <div>
          <select
            className="p-2 border border-slate-200 rounded-md shadow-sm bg-white min-w-[220px] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
            value={selectedKurikulum}
            onChange={(e) => setSelectedKurikulum(e.target.value)}
            disabled={kurikulums.length === 0}
          >
            {kurikulums.length === 0 ? (
              <option>Tidak ada kurikulum</option>
            ) : (
              kurikulums.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.prodi?.nama})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 bg-white">
            Belum ada Mata Kuliah yang ditambahkan untuk kurikulum ini.
          </div>
        ) : (
          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Peta Kurikulum (Curriculum Map)
                  </CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Pemetaan sebaran Mata Kuliah berdasarkan Semester dan
                    Capaian Pembelajaran Lulusan (CPL)
                  </p>
                </div>
                <div className="flex items-center text-[11px] text-slate-600 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md border border-blue-100 w-fit">
                  <Info className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-blue-500" />
                  <span>
                    Arahkan kursor ke kode MK untuk melihat rincian info Mata
                    Kuliah & CPMK.
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto max-h-[calc(100vh-280px)] min-h-[350px]">
              <Table
                className="border-collapse w-full min-w-[900px]"
                containerClassName="overflow-visible"
              >
                <TableHeader>
                  <TableRow className="bg-slate-100/90 hover:bg-slate-100/90 border-b border-slate-200">
                    <TableHead
                      rowSpan={2}
                      className="w-16 text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs align-middle"
                    >
                      SMT
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="w-16 text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs align-middle"
                    >
                      SKS
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="w-20 text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs align-middle"
                    >
                      JML MK
                    </TableHead>

                    {curriculumCpls.map((cpl) => (
                      <TableHead
                        key={cpl.id}
                        className="text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs hover:bg-amber-100/60 transition-colors cursor-help group relative bg-amber-50 min-w-[90px]"
                        title={`${cpl.kode}: ${cpl.deskripsi}`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span>{cpl.kode}</span>
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left font-sans">
                            <div className="font-bold text-amber-300 text-xs mb-0.5">
                              {cpl.kode}
                            </div>
                            <div className="text-slate-200 text-[11px] leading-snug font-normal">
                              {cpl.deskripsi}
                            </div>
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                          </div>
                        </div>
                      </TableHead>
                    ))}

                    {hasUnmappedWajibCourses && (
                      <TableHead className="text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs bg-amber-50 min-w-[90px]">
                        Lainnya
                      </TableHead>
                    )}

                    <TableHead className="text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs bg-sky-50 min-w-[120px]">
                      PILIHAN
                    </TableHead>

                    <TableHead className="text-center font-bold text-slate-800 border border-slate-200 p-2 text-xs bg-emerald-50 min-w-[120px]">
                      MKWK
                    </TableHead>
                  </TableRow>

                  <TableRow className="bg-slate-100/90 hover:bg-slate-100/90 border-b border-slate-200">
                    <TableHead
                      colSpan={
                        curriculumCpls.length +
                        (hasUnmappedWajibCourses ? 1 : 0)
                      }
                      className="text-center font-bold text-amber-900 border border-slate-200 p-1.5 text-[10px] tracking-wider uppercase bg-amber-100/50"
                    >
                      MK WAJIB
                    </TableHead>
                    <TableHead className="text-center font-bold text-sky-900 border border-slate-200 p-1.5 text-[10px] tracking-wider uppercase bg-sky-100/50">
                      MK PILIHAN/ MK PENCIRI
                    </TableHead>
                    <TableHead className="text-center font-bold text-emerald-900 border border-slate-200 p-1.5 text-[10px] tracking-wider uppercase bg-emerald-100/50">
                      MKWK
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {semestersList.map((sem) => {
                    const semesterCourses = courses.filter(
                      (c) => c.semester === sem,
                    );

                    const wajibCourses = semesterCourses.filter(
                      (c) =>
                        !c.sifat_mk || c.sifat_mk.toLowerCase() === "wajib",
                    );
                    const pilihanCourses = semesterCourses.filter(
                      (c) => c.sifat_mk?.toLowerCase() === "pilihan",
                    );
                    const mkwkCourses = semesterCourses.filter(
                      (c) => c.sifat_mk?.toLowerCase() === "mkwk",
                    );

                    return (
                      <TableRow key={sem} className="hover:bg-slate-50/50">
                        {/* Semester Header Cell */}
                        <TableCell className="text-center font-bold border border-slate-200 bg-[#b04a37] text-white p-3 align-middle text-sm ">
                          {toRoman(sem)}
                        </TableCell>

                        {/* SKS Cell */}
                        <TableCell className="text-center font-semibold border border-slate-200 text-slate-700 p-3 align-middle text-sm bg-slate-50/30">
                          {getSemesterSks(sem)}
                        </TableCell>

                        {/* JML MK Cell */}
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-600 p-3 align-middle text-sm bg-slate-50/30">
                          {getSemesterCourseCount(sem)}
                        </TableCell>

                        {/* CPL Columns (MK WAJIB) */}
                        {curriculumCpls.map((cpl) => {
                          const coursesForCpl = wajibCourses.filter((course) =>
                            course.cpls?.some((c: any) => c.id === cpl.id),
                          );
                          return (
                            <TableCell
                              key={cpl.id}
                              className="border border-slate-200 p-2 align-middle text-center bg-white min-w-[120px]"
                            >
                              {renderCoursesInCell(coursesForCpl)}
                            </TableCell>
                          );
                        })}

                        {/* Unmapped Wajib Courses Column */}
                        {hasUnmappedWajibCourses && (
                          <TableCell className="border border-slate-200 p-2 align-middle text-center bg-white min-w-[120px]">
                            {renderCoursesInCell(
                              wajibCourses.filter(
                                (c) => !c.cpls || c.cpls.length === 0,
                              ),
                            )}
                          </TableCell>
                        )}

                        {/* MK PILIHAN/ MK PENCIRI Column */}
                        <TableCell className="border border-slate-200 p-2 align-middle text-center bg-sky-50/5 min-w-[140px]">
                          {renderCoursesInCell(pilihanCourses)}
                        </TableCell>

                        {/* MKWK Column */}
                        <TableCell className="border border-slate-200 p-2 align-middle text-center bg-emerald-50/5 min-w-[140px]">
                          {renderCoursesInCell(mkwkCourses)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Bottom total row */}
                  {semestersList.length > 0 && (
                    <TableRow className="bg-slate-100 font-bold hover:bg-slate-100 border-t border-slate-300 sticky bottom-0 z-10 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
                      <TableCell className="text-center border border-slate-200 p-3 align-middle text-xs uppercase text-slate-800 bg-slate-100">
                        SEMESTER
                      </TableCell>
                      <TableCell className="text-center border border-slate-200 p-3 align-middle text-sm text-slate-800 bg-slate-100">
                        {totalCurriculumSks}
                      </TableCell>
                      <TableCell
                        colSpan={
                          1 + // JML MK
                          curriculumCpls.length +
                          (hasUnmappedWajibCourses ? 1 : 0) +
                          1 + // PILIHAN
                          1 // MKWK
                        }
                        className="border border-slate-200 p-3 align-middle bg-slate-100"
                      />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
