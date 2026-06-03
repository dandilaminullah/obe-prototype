"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/Table";
import { Check } from "lucide-react";

export default function MatrixMappingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [bks, setBks] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [courseBks, setCourseBks] = useState<any[]>([]);
  const [courseCpls, setCourseCpls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bk" | "cpl">("bk");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [courseRes, bkRes, cplRes, mapBkRes, mapCplRes] = await Promise.all([
      supabase.from("mata_kuliah").select("*").order("kode"),
      supabase.from("bahan_kajian").select("*").order("kode"),
      supabase.from("cpl").select("*").order("kode"),
      supabase.from("mata_kuliah_bk").select("*"),
      supabase.from("mata_kuliah_cpl").select("*")
    ]);
    if (courseRes.data) setCourses(courseRes.data);
    if (bkRes.data) setBks(bkRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (mapBkRes.data) setCourseBks(mapBkRes.data);
    if (mapCplRes.data) setCourseCpls(mapCplRes.data);
    setLoading(false);
  };

  const toggleCourseBk = async (courseId: string, bkId: string, isAssigned: boolean) => {
    if (isAssigned) {
      await supabase.from("mata_kuliah_bk").delete().match({ mata_kuliah_id: courseId, bk_id: bkId });
      setCourseBks(prev => prev.filter(m => !(m.mata_kuliah_id === courseId && m.bk_id === bkId)));
    } else {
      await supabase.from("mata_kuliah_bk").insert([{ mata_kuliah_id: courseId, bk_id: bkId }]);
      setCourseBks(prev => [...prev, { mata_kuliah_id: courseId, bk_id: bkId }]);
    }
  };

  const toggleCourseCpl = async (courseId: string, cplId: string, isAssigned: boolean) => {
    if (isAssigned) {
      await supabase.from("mata_kuliah_cpl").delete().match({ mata_kuliah_id: courseId, cpl_id: cplId });
      setCourseCpls(prev => prev.filter(m => !(m.mata_kuliah_id === courseId && m.cpl_id === cplId)));
    } else {
      await supabase.from("mata_kuliah_cpl").insert([{ mata_kuliah_id: courseId, cpl_id: cplId, bobot: 0 }]);
      setCourseCpls(prev => [...prev, { mata_kuliah_id: courseId, cpl_id: cplId, bobot: 0 }]);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Matriks Kurikulum</h1>
        <p className="text-gray-500">Visualisasi pemetaan Mata Kuliah ke Bahan Kajian (BK) dan Capaian Pembelajaran Lulusan (CPL).</p>
      </div>

      <div className="flex space-x-2 border-b border-slate-200">
        <button 
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'bk' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('bk')}
        >
          Matriks MK - BK
        </button>
        <button 
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'cpl' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('cpl')}
        >
          Matriks MK - CPL
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriks Pemetaan {activeTab === 'bk' ? 'Bahan Kajian (BK)' : 'Capaian Pembelajaran (CPL)'}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64 min-w-[250px] sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e2e8f0]">Mata Kuliah</TableHead>
                {activeTab === 'bk' 
                  ? bks.map(bk => <TableHead key={bk.id} className="text-center min-w-[100px]" title={bk.nama}>{bk.kode}</TableHead>)
                  : cpls.map(cpl => <TableHead key={cpl.id} className="text-center min-w-[100px]" title={cpl.deskripsi}>{cpl.kode}</TableHead>)
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e2e8f0]">
                    {course.kode} - {course.nama}
                  </TableCell>
                  {activeTab === 'bk' 
                    ? bks.map(bk => {
                        const isAssigned = courseBks.some(m => m.mata_kuliah_id === course.id && m.bk_id === bk.id);
                        return (
                          <TableCell key={bk.id} className="text-center p-1">
                            <button 
                              onClick={() => toggleCourseBk(course.id, bk.id, isAssigned)}
                              className={`w-full h-10 flex items-center justify-center rounded transition-colors ${isAssigned ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-slate-100 text-transparent'}`}
                            >
                              {isAssigned && <Check className="w-5 h-5" />}
                            </button>
                          </TableCell>
                        );
                      })
                    : cpls.map(cpl => {
                        const isAssigned = courseCpls.some(m => m.mata_kuliah_id === course.id && m.cpl_id === cpl.id);
                        return (
                          <TableCell key={cpl.id} className="text-center p-1">
                            <button 
                              onClick={() => toggleCourseCpl(course.id, cpl.id, isAssigned)}
                              className={`w-full h-10 flex items-center justify-center rounded transition-colors ${isAssigned ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'hover:bg-slate-100 text-transparent'}`}
                            >
                              {isAssigned && <Check className="w-5 h-5" />}
                            </button>
                          </TableCell>
                        );
                      })
                  }
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={(activeTab === 'bk' ? bks.length : cpls.length) + 1} className="text-center py-8 text-slate-500">
                    Belum ada data Mata Kuliah.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
