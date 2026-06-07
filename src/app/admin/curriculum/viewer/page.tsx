"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BookOpen, Network, CheckCircle2, ListMinus } from "lucide-react";

export default function CurriculumViewerPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    setLoading(true);
    // Fetch all needed data
    const [coursesRes, cpmkRes, subCpmkRes, mappingRes, cplRes] = await Promise.all([
      supabase.from("mata_kuliah").select("*, prodi(nama)").order("kode"),
      supabase.from("cpmk").select("*").order("kode"),
      supabase.from("sub_cpmk").select("*").order("kode"),
      supabase.from("mata_kuliah_cpl").select("*"),
      supabase.from("cpl").select("*")
    ]);

    if (coursesRes.data) {
      const enrichedCourses = coursesRes.data.map(course => {
        // Attach CPMKs and Sub-CPMKs
        const courseCpmks = (cpmkRes.data || []).filter(c => c.mata_kuliah_id === course.id).map(cpmk => ({
          ...cpmk,
          sub_cpmks: (subCpmkRes.data || []).filter(s => s.cpmk_id === cpmk.id)
        }));

        // Attach CPLs
        const mappings = (mappingRes.data || []).filter(m => m.mata_kuliah_id === course.id);
        const courseCpls = mappings.map(m => {
          const cpl = (cplRes.data || []).find(c => c.id === m.cpl_id);
          return { ...cpl, bobot: m.bobot };
        });

        return { ...course, cpmks: courseCpmks, cpls: courseCpls };
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
                  <p className="text-sm text-slate-500">{course.sks} SKS | {course.prodi?.nama}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-500">
                {course.cpls?.length || 0} CPL | {course.cpmks?.length || 0} CPMK
              </div>
            </div>

            {expandedCourse === course.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-6">
                
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
                          <div className="mt-2 text-xs font-medium text-slate-500">Bobot Relasi: <span className="text-blue-600">{cpl.bobot}</span></div>
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
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800">{cpmk.kode}</span>
                              <span className="mx-2 text-slate-300">|</span>
                              <span className="text-sm text-slate-600">{cpmk.deskripsi}</span>
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

