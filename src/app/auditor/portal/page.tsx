"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BookOpen, Target, Network } from "lucide-react";

export default function AuditorPortalPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    setLoading(true);
    
    // Fetch all required data
    const [coursesRes, cpmkRes, subCpmkRes, mappingRes, cplRes] = await Promise.all([
      supabase.from("mata_kuliah").select("*, prodi(nama)").order("kode"),
      supabase.from("cpmk").select("*"),
      supabase.from("sub_cpmk").select("*"),
      supabase.from("mata_kuliah_cpl").select("*"),
      supabase.from("cpl").select("*")
    ]);

    if (coursesRes.data) {
      const enrichedCourses = coursesRes.data.map(course => {
        // Attach CPMKs
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

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data kurikulum...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portal Auditor (AMI)</h1>
        <p className="text-gray-500">Akses read-only untuk memverifikasi keselarasan kurikulum (CPL - CPMK - Sub-CPMK).</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.length === 0 ? (
          <div className="text-center text-slate-500 p-8 bg-white border border-slate-200 rounded-lg">Belum ada data mata kuliah.</div>
        ) : (
          courses.map(course => (
            <Card key={course.id} className="overflow-hidden border-blue-100">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    {course.kode} - {course.nama}
                  </CardTitle>
                  <div className="text-sm text-slate-500 mt-1">SKS: {course.sks} • Prodi: {course.prodi?.nama} • Metode: {course.metode_pembelajaran}</div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* CPL Section */}
                  <div className="p-4 bg-white">
                    <h4 className="font-semibold text-slate-700 flex items-center mb-4 text-sm">
                      <Target className="w-4 h-4 mr-2 text-purple-600" /> Pembebanan CPL (Luaran Program)
                    </h4>
                    {course.cpls && course.cpls.length > 0 ? (
                      <div className="space-y-3">
                        {course.cpls.map((cpl: any) => (
                          <div key={cpl.id} className="bg-purple-50/50 p-3 rounded-md border border-purple-100 text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-purple-800">{cpl.kode}</span>
                              <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Bobot: {cpl.bobot}</span>
                            </div>
                            <span className="text-slate-600">{cpl.deskripsi}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Belum ada CPL yang dipetakan.</p>
                    )}
                  </div>

                  {/* CPMK Section */}
                  <div className="p-4 bg-slate-50/30">
                    <h4 className="font-semibold text-slate-700 flex items-center mb-4 text-sm">
                      <Network className="w-4 h-4 mr-2 text-emerald-600" /> Penjabaran CPMK & Sub-CPMK
                    </h4>
                    {course.cpmks && course.cpmks.length > 0 ? (
                      <div className="space-y-4">
                        {course.cpmks.map((cpmk: any) => (
                          <div key={cpmk.id} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-slate-800">{cpmk.kode}</span>
                              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Bobot: {cpmk.bobot}%</span>
                            </div>
                            <p className="text-slate-600 mb-3">{cpmk.deskripsi}</p>
                            
                            {/* Sub-CPMK */}
                            {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 && (
                              <div className="pl-3 border-l-2 border-emerald-200 space-y-2 mt-2">
                                {cpmk.sub_cpmks.map((sub: any) => (
                                  <div key={sub.id} className="bg-emerald-50/50 p-2 rounded text-xs border border-emerald-100">
                                    <div className="flex justify-between font-medium text-emerald-800 mb-1">
                                      <span>{sub.kode}</span>
                                      <span>Bobot: {sub.bobot}%</span>
                                    </div>
                                    <span className="text-slate-600">{sub.deskripsi}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Belum ada penjabaran CPMK.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

