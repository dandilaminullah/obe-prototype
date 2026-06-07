"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { AlertCircle, FileText, CheckCircle, Clock } from "lucide-react";

export default function CQIPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [actionPlans, setActionPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState<{id: string, mata_kuliah_id: string, analisis_kesenjangan: string, rencana_perbaikan: string, target_semester: string, status: string}>({
    id: "", mata_kuliah_id: "", analisis_kesenjangan: "", rencana_perbaikan: "", target_semester: "", status: "DRAFT"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [courseRes, planRes] = await Promise.all([
      supabase.from("mata_kuliah").select("*").order("kode"),
      supabase.from("rencana_aksi_perbaikan").select("*, mata_kuliah(kode, nama)").order("created_at", { ascending: false })
    ]);
    if (courseRes.data) setCourses(courseRes.data);
    if (planRes.data) setActionPlans(planRes.data);
    setLoading(false);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (planForm.id) {
      await supabase.from("rencana_aksi_perbaikan").update({
        analisis_kesenjangan: planForm.analisis_kesenjangan,
        rencana_perbaikan: planForm.rencana_perbaikan,
        target_semester: planForm.target_semester,
        status: planForm.status
      }).eq("id", planForm.id);
    } else {
      await supabase.from("rencana_aksi_perbaikan").insert([{
        mata_kuliah_id: planForm.mata_kuliah_id,
        analisis_kesenjangan: planForm.analisis_kesenjangan,
        rencana_perbaikan: planForm.rencana_perbaikan,
        target_semester: planForm.target_semester,
        status: planForm.status
      }]);
    }
    setIsPlanModalOpen(false);
    fetchData();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium flex items-center w-max"><Clock className="w-3 h-3 mr-1"/> Draft</span>;
      case 'SUBMITTED': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center w-max"><FileText className="w-3 h-3 mr-1"/> Diajukan</span>;
      case 'APPROVED': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center w-max"><CheckCircle className="w-3 h-3 mr-1"/> Disetujui</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{status}</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portal Auditor (CQI)</h1>
        <p className="text-gray-500">Audit Mutu Internal (AMI) & Rencana Aksi Perbaikan Berkelanjutan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Kesenjangan Ditemukan</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">4 Mata Kuliah</h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg"><AlertCircle className="w-6 h-6 text-amber-600"/></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Rencana Aksi Diajukan</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{actionPlans.filter(p => p.status === 'SUBMITTED').length} Dokumen</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg"><FileText className="w-6 h-6 text-blue-600"/></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Rencana Aksi Disetujui</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{actionPlans.filter(p => p.status === 'APPROVED').length} Dokumen</h3>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle className="w-6 h-6 text-emerald-600"/></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div>
            <CardTitle>Dokumen Rencana Aksi Perbaikan</CardTitle>
            <CardDescription>Daftar usulan perbaikan berkelanjutan dari Kaprodi/Dosen.</CardDescription>
          </div>
          <Button onClick={() => {
            setPlanForm({ id: "", mata_kuliah_id: courses[0]?.id || "", analisis_kesenjangan: "", rencana_perbaikan: "", target_semester: "", status: "DRAFT" });
            setIsPlanModalOpen(true);
          }}>
            Buat Rencana Aksi
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mata Kuliah</TableHead>
                <TableHead>Target Semester</TableHead>
                <TableHead>Analisis Kesenjangan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionPlans.map(plan => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.mata_kuliah?.kode} - {plan.mata_kuliah?.nama}</TableCell>
                  <TableCell>{plan.target_semester}</TableCell>
                  <TableCell className="max-w-xs truncate" title={plan.analisis_kesenjangan}>{plan.analisis_kesenjangan}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setPlanForm(plan);
                      setIsPlanModalOpen(true);
                    }}>Detail / Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {actionPlans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada dokumen rencana perbaikan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{planForm.id ? "Detail Rencana Aksi" : "Buat Rencana Aksi Baru"}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="planForm" onSubmit={handleSavePlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Mata Kuliah Ditingkatkan</label>
                    <select required className="w-full p-2 border rounded-lg bg-white outline-none focus:border-primary" value={planForm.mata_kuliah_id} onChange={e => setPlanForm({...planForm, mata_kuliah_id: e.target.value})} disabled={!!planForm.id}>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.kode} - {c.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Semester Eksekusi</label>
                    <input required type="text" className="w-full p-2 border rounded-lg outline-none focus:border-primary" value={planForm.target_semester} onChange={e => setPlanForm({...planForm, target_semester: e.target.value})} placeholder="Contoh: Ganjil 2026/2027" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Analisis Kesenjangan (Gap Analysis)</label>
                  <textarea required rows={3} className="w-full p-2 border rounded-lg outline-none focus:border-primary bg-slate-50" value={planForm.analisis_kesenjangan} onChange={e => setPlanForm({...planForm, analisis_kesenjangan: e.target.value})} placeholder="Sebutkan akar permasalahan mengapa capaian di bawah standar..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Rencana Perbaikan</label>
                  <textarea required rows={4} className="w-full p-2 border rounded-lg outline-none focus:border-primary bg-slate-50" value={planForm.rencana_perbaikan} onChange={e => setPlanForm({...planForm, rencana_perbaikan: e.target.value})} placeholder="Langkah-langkah perbaikan yang akan dilakukan (misal: perbaikan modul, pergantian metode mengajar)..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status Pengajuan</label>
                  <select required className="w-full p-2 border rounded-lg bg-white outline-none focus:border-primary" value={planForm.status} onChange={e => setPlanForm({...planForm, status: e.target.value})}>
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Diajukan ke Auditor</option>
                    <option value="APPROVED">Disetujui Auditor</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button type="button" variant="ghost" onClick={() => setIsPlanModalOpen(false)}>Batal</Button>
              <Button type="submit" form="planForm">Simpan Rencana</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

