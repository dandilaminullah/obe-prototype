"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BookOpen, Network, CheckCircle2, ListMinus, ListOrdered } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function CurriculumViewerPage() {
  const { role, prodiId } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCurriculum();
  }, [role, prodiId]);

  const fetchCurriculum = async () => {
    setLoading(true);
    let kurQuery = supabase.from("kurikulum").select("id");
    if (role === "ADMIN" && prodiId) {
      kurQuery = kurQuery.eq("prodi_id", prodiId);
    }
    const { data: kurData } = await kurQuery;
    const validKurIds = kurData ? kurData.map((k) => k.id) : [];

    if (role === "ADMIN" && prodiId && validKurIds.length === 0) {
      setCourses([]);
      setLoading(false);
      return;
    }

    let courseQuery = supabase.from("mata_kuliah").select("*, prodi(nama)").order("kode");
    if (role === "ADMIN" && prodiId && validKurIds.length > 0) {
      courseQuery = courseQuery.in("kurikulum_id", validKurIds);
    }

    // Fetch all needed data
    const [coursesRes, cpmkRes, subCpmkRes, mapBkRes, bkRes, cplRes, topikRes] = await Promise.all([
      courseQuery,
      supabase.from("cpmk").select("*").order("kode"),
      supabase.from("sub_cpmk").select("*").order("kode"),
      supabase.from("mata_kuliah_bk").select("*"),
      supabase.from("bahan_kajian").select("*"),
      supabase.from("cpl").select("*"),
      supabase.from("topik_materi_pembelajaran").select("*").order("urutan", { ascending: true })
    ]);

    if (coursesRes.data) {
      const enrichedCourses = coursesRes.data.map(course => {
        // Attach CPMKs and Sub-CPMKs
        const courseCpmks = (cpmkRes.data || []).filter(c => c.mata_kuliah_id === course.id).map(cpmk => ({
          ...cpmk,
          bk: (bkRes.data || []).find(b => b.id === cpmk.bk_id),
          sub_cpmks: (subCpmkRes.data || []).filter(s => s.cpmk_id === cpmk.id)
        }));

        // Attach CPLs via BK
        const courseBks = (mapBkRes.data || []).filter(m => m.mata_kuliah_id === course.id);
        const courseCplIds = Array.from(new Set(
          courseBks.map(m => (bkRes.data || []).find(b => b.id === m.bk_id)?.cpl_id).filter(Boolean)
        ));
        const courseCpls = courseCplIds.map(cplId => (cplRes.data || []).find(c => c.id === cplId)).filter(Boolean);

        // Attach Topik Materi
        const courseTopik = (topikRes.data || []).filter(t => t.mata_kuliah_id === course.id);

        return { ...course, cpmks: courseCpmks, cpls: courseCpls, topik_materi: courseTopik };
      });
      setCourses(enrichedCourses);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat Hierarki Kurikulum...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Curriculum Viewer</h1>
        <p className="text-gray-500">Tampilan hierarkis Mata Kuliah, CPL yang diusung, CPMK, dan Sub-CPMK.</p>
      </div>

      <div className="space-y-4">
        {courses.map(course => (
          <Card key={course.id} className="overflow-hidden border-slate-200 shadow-sm transition-all">
            <div 
              className="p-4 bg-white hover:bg-slate-50 cursor-pointer flex justify-between items-center"
              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{course.kode} - {course.nama}</h3>
                  <p className="text-sm text-slate-500">
                    {course.sks || ((course.sks_teori || 0) + (course.sks_praktikum || 0) + (course.sks_lapangan || 0))} SKS (T:{course.sks_teori || 0} P:{course.sks_praktikum || 0} K:{course.sks_lapangan || 0}) | {course.prodi?.nama}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-500">
                {course.topik_materi?.length || 0} Topik | {course.cpls?.length || 0} CPL | {course.cpmks?.length || 0} CPMK
              </div>
            </div>

            {expandedCourse === course.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-6">
                
                {/* Topik Materi Pembelajaran Section */}
                <div>
                  <h4 className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    <ListOrdered className="w-4 h-4 mr-2 text-indigo-600" /> Topik Materi Pembelajaran (Kedalaman KAP)
                  </h4>
                  {course.topik_materi && course.topik_materi.length > 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                            <th className="py-2 px-3 w-10 text-center">No</th>
                            <th className="py-2 px-3">Topik Materi</th>
                            <th className="py-2 px-3 text-center w-36">Kedalaman KAP</th>
                            <th className="py-2 px-3 text-center w-24">Bobot</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {course.topik_materi.map((topik: any, idx: number) => {
                            const w = Number(topik.kedalaman_k || 0) + Number(topik.kedalaman_a || 0) + Number(topik.kedalaman_p || 0);
                            return (
                              <tr key={topik.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                <td className="py-2 px-3 font-medium text-slate-800">{topik.nama}</td>
                                <td className="py-2 px-3 text-center">
                                  <div className="inline-flex space-x-1 text-xs">
                                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">K:{topik.kedalaman_k}</span>
                                    <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">A:{topik.kedalaman_a}</span>
                                    <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">P:{topik.kedalaman_p}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-center font-bold text-indigo-700">{w}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Belum ada topik materi pembelajaran yang ditambahkan.</p>
                  )}
                </div>

                {/* CPL Section */}
                <div>
                  <h4 className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    <Network className="w-4 h-4 mr-2" /> Capaian Pembelajaran Lulusan (CPL)
                  </h4>
                  {course.cpls && course.cpls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.cpls.map((cpl: any) => (
                        <div key={cpl.id} className="bg-white p-3 rounded border border-slate-200 text-sm">
                          <span className="font-semibold text-primary">{cpl.kode}</span>
                          <span className="mx-2 text-slate-300">|</span>
                          <span className="text-slate-600">{cpl.deskripsi}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Belum ada CPL yang dipetakan ke Mata Kuliah ini.</p>
                  )}
                </div>

                {/* CPMK Section */}
                <div>
                  <h4 className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    <ListMinus className="w-4 h-4 mr-2" /> Penjabaran CPMK & Sub-CPMK
                  </h4>
                  {course.cpmks && course.cpmks.length > 0 ? (
                    <div className="space-y-4">
                      {course.cpmks.map((cpmk: any) => (
                        <div key={cpmk.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="bg-slate-100/50 p-3 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex-1 flex items-center space-x-2 flex-wrap">
                              <span className="font-semibold text-slate-800">{cpmk.kode}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-sm text-slate-600">{cpmk.deskripsi}</span>
                              {cpmk.bk && (
                                <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200" title={cpmk.bk.nama}>
                                  BK: {cpmk.bk.kode} - {cpmk.bk.nama}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                              Bobot: {cpmk.bobot}%
                            </span>
                          </div>
                          
                          <div className="p-3 bg-white">
                            {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 ? (
                              <ul className="space-y-2">
                                {cpmk.sub_cpmks.map((sub: any) => (
                                  <li key={sub.id} className="flex items-start text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 text-slate-700">
                                      <span className="font-medium">{sub.kode}:</span> {sub.deskripsi}
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
                                      Bobot: {sub.bobot}%
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-400 italic px-6">Belum ada Sub-CPMK</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Belum ada CPMK yang dijabarkan untuk Mata Kuliah ini.</p>
                  )}
                </div>

              </div>
            )}
          </Card>
        ))}
        {courses.length === 0 && !loading && (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
            Belum ada Mata Kuliah yang ditambahkan.
          </div>
        )}
      </div>
    </div>
  );
}

