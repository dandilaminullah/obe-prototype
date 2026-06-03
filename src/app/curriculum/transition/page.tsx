"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { RefreshCw, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function CurriculumTransitionPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("mata_kuliah").select("*").order("kode");
    if (data) setCourses(data);
    setLoading(false);
  };

  const handleDecision = (courseId: string, decision: string) => {
    // In a real app, this would save the transition mapping to a database table
    alert(`Keputusan untuk mata kuliah disimpan: ${decision}`);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Validasi Transisi Kurikulum</h1>
        <p className="text-gray-500">Alat bantu pengambilan keputusan manual untuk memetakan mata kuliah kurikulum lama ke kurikulum baru berdasarkan kedekatan CPL.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><RefreshCw className="w-5 h-5 mr-2 text-primary" /> Analisis Mata Kuliah</CardTitle>
          <CardDescription>Tentukan tindakan (Pertahankan, Integrasikan, atau Hapus) untuk setiap mata kuliah yang ada saat beralih ke kurikulum baru.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Mata Kuliah Lama</TableHead>
                <TableHead>SKS</TableHead>
                <TableHead>Rekomendasi Sistem</TableHead>
                <TableHead className="text-center">Keputusan Manual (Prodi)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, idx) => {
                // Mock logic for recommendation
                const isCore = idx % 2 === 0;
                const isOutdated = idx % 5 === 0;
                
                let recText = "Pertahankan";
                let recIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" />;
                let recClass = "text-emerald-700 bg-emerald-50 border-emerald-200";

                if (isOutdated) {
                  recText = "Hapus";
                  recIcon = <ShieldAlert className="w-4 h-4 text-red-500 mr-1" />;
                  recClass = "text-red-700 bg-red-50 border-red-200";
                } else if (!isCore) {
                  recText = "Integrasikan";
                  recIcon = <ArrowRight className="w-4 h-4 text-amber-500 mr-1" />;
                  recClass = "text-amber-700 bg-amber-50 border-amber-200";
                }

                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.kode}</TableCell>
                    <TableCell>{course.nama}</TableCell>
                    <TableCell>{course.sks}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${recClass}`}>
                        {recIcon} {recText}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200" onClick={() => handleDecision(course.id, 'Pertahankan')}>Pertahankan</Button>
                        <Button size="sm" variant="outline" className="text-amber-600 hover:bg-amber-50 hover:border-amber-200" onClick={() => handleDecision(course.id, 'Integrasikan')}>Integrasikan</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => handleDecision(course.id, 'Hapus')}>Hapus</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada mata kuliah yang dievaluasi.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
