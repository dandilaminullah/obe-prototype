"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RadarChart, RadarDataPoint } from "@/components/charts/RadarChart";
import { Plus, AlertTriangle, History, Info } from "lucide-react";

export default function AssessmentPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [selectedProdiId, setSelectedProdiId] = useState("");
  
  const [mahasiswas, setMahasiswas] = useState<any[]>([]);
  const [selectedMahasiswaId, setSelectedMahasiswaId] = useState("");

  const [courses, setCourses] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [isMahasiswaModalOpen, setIsMahasiswaModalOpen] = useState(false);
  const [mahasiswaForm, setMahasiswaForm] = useState({ nim: "", nama: "" });

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // For Grade Changes with Reason
  const [pendingGradeChange, setPendingGradeChange] = useState<{subCpmkId: string, oldVal: number, newVal: number} | null>(null);
  const [changeReason, setChangeReason] = useState("");
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  useEffect(() => {
    fetchProdis();
  }, []);

  useEffect(() => {
    if (selectedProdiId) {
      fetchMahasiswas(selectedProdiId);
      fetchCurriculum(selectedProdiId);
    }
  }, [selectedProdiId]);

  useEffect(() => {
    if (selectedMahasiswaId) {
      fetchGrades(selectedMahasiswaId);
    } else {
      setGrades({});
    }
  }, [selectedMahasiswaId]);

  const fetchProdis = async () => {
    setLoading(true);
    const { data } = await supabase.from("prodi").select("*").order("nama");
    if (data) {
      setProdis(data);
      if (data.length > 0) setSelectedProdiId(data[0].id);
    }
    setLoading(false);
  };

  const fetchMahasiswas = async (prodiId: string) => {
    const { data } = await supabase.from("mahasiswa").select("*").eq("prodi_id", prodiId).order("nama");
    if (data) {
      setMahasiswas(data);
      if (data.length > 0 && !selectedMahasiswaId) setSelectedMahasiswaId(data[0].id);
    } else {
      setMahasiswas([]);
      setSelectedMahasiswaId("");
    }
  };

  const fetchCurriculum = async (prodiId: string) => {
    const [courseRes, cpmkRes, subRes, mapRes, cplRes, profilRes, cplProfilRes] = await Promise.all([
      supabase.from("mata_kuliah").select("*").eq("prodi_id", prodiId),
      supabase.from("cpmk").select("*"),
      supabase.from("sub_cpmk").select("*"),
      supabase.from("mata_kuliah_cpl").select("*"),
      supabase.from("cpl").select("*"),
      supabase.from("profil_lulusan").select("*").eq("prodi_id", prodiId),
      supabase.from("profil_lulusan_cpl").select("*")
    ]);

    // Build the hierarchy for courses
    if (courseRes.data) {
      const enrichedCourses = courseRes.data.map(course => {
        const cpmks = (cpmkRes.data || []).filter(c => c.mata_kuliah_id === course.id);
        const enrichedCpmks = cpmks.map(cpmk => ({
          ...cpmk,
          sub_cpmks: (subRes.data || []).filter(s => s.cpmk_id === cpmk.id)
        }));
        
        const mappings = (mapRes.data || []).filter(m => m.mata_kuliah_id === course.id);
        
        return {
          ...course,
          cpmks: enrichedCpmks,
          cpl_mapping: mappings
        };
      });
      setCourses(enrichedCourses);
    }

    if (cplRes.data && profilRes.data && cplProfilRes.data) {
      const profilIds = profilRes.data.map(p => p.id);
      const relevantCplIds = cplProfilRes.data.filter(m => profilIds.includes(m.profil_id)).map(m => m.cpl_id);
      const relevantCpls = cplRes.data.filter(c => relevantCplIds.includes(c.id));
      setCpls(relevantCpls);
    }
  };

  const fetchGrades = async (mahasiswaId: string) => {
    const { data } = await supabase.from("nilai").select("*").eq("mahasiswa_id", mahasiswaId);
    if (data) {
      const gradesMap: Record<string, number> = {};
      data.forEach(n => gradesMap[n.sub_cpmk_id] = n.nilai);
      setGrades(gradesMap);
    }
  };

  const handleGradeChange = async (subCpmkId: string, value: string) => {
    if (!selectedMahasiswaId) return;

    const num = parseFloat(value);
    const validNum = isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
    
    const existingVal = grades[subCpmkId];

    // If there is an existing value and it's different, prompt for reason (IKU 11)
    if (existingVal !== undefined && existingVal !== validNum && !isNaN(num)) {
      setPendingGradeChange({ subCpmkId, oldVal: existingVal, newVal: validNum });
      setChangeReason("");
      setIsReasonModalOpen(true);
      return;
    }

    await applyGradeChange(subCpmkId, validNum, isNaN(num));
  };

  const applyGradeChange = async (subCpmkId: string, validNum: number, isEmpty: boolean, reason?: string) => {
    // Optimistic update
    setGrades(prev => ({ ...prev, [subCpmkId]: validNum }));

    if (isEmpty) {
      await supabase.from("nilai").delete().match({ mahasiswa_id: selectedMahasiswaId, sub_cpmk_id: subCpmkId });
      setGrades(prev => { const n = {...prev}; delete n[subCpmkId]; return n; });
    } else {
      const { data: existing } = await supabase.from("nilai").select("id, nilai").match({ mahasiswa_id: selectedMahasiswaId, sub_cpmk_id: subCpmkId }).maybeSingle();
      
      let nilaiId;
      if (existing) {
        await supabase.from("nilai").update({ nilai: validNum }).eq("id", existing.id);
        nilaiId = existing.id;
      } else {
        const { data: newNilai } = await supabase.from("nilai").insert([{ mahasiswa_id: selectedMahasiswaId, sub_cpmk_id: subCpmkId, nilai: validNum }]).select("id").single();
        nilaiId = newNilai?.id;
      }

      // Insert Audit Trail if there's a reason
      if (reason && nilaiId && existing) {
        await supabase.from("grading_audit_trail").insert([{
          nilai_id: nilaiId,
          nilai_lama: existing.nilai,
          nilai_baru: validNum,
          alasan: reason,
          user_id: "Dosen" // Mock User
        }]);
      }
    }
  };

  const confirmGradeChange = async () => {
    if (pendingGradeChange && changeReason.trim()) {
      await applyGradeChange(pendingGradeChange.subCpmkId, pendingGradeChange.newVal, false, changeReason);
      setIsReasonModalOpen(false);
      setPendingGradeChange(null);
    } else {
      alert("Alasan perubahan nilai wajib diisi untuk Audit Trail (IKU 11).");
    }
  };

  const viewAuditTrail = async () => {
    if (!selectedMahasiswaId) return;
    setIsAuditModalOpen(true);
    setAuditLoading(true);
    
    // Get all nilai ids for this student
    const { data: nilaiData } = await supabase.from("nilai").select("id, sub_cpmk(kode)").eq("mahasiswa_id", selectedMahasiswaId);
    if (nilaiData && nilaiData.length > 0) {
      const nilaiIds = nilaiData.map(n => n.id);
      const { data: logs } = await supabase.from("grading_audit_trail").select("*").in("nilai_id", nilaiIds).order("created_at", { ascending: false });
      
      const enrichedLogs = logs?.map(log => {
        const n = nilaiData.find(x => x.id === log.nilai_id);
        return { ...log, sub_cpmk_kode: (n?.sub_cpmk as any)?.kode || "Unknown" };
      });
      setAuditLogs(enrichedLogs || []);
    } else {
      setAuditLogs([]);
    }
    setAuditLoading(false);
  };

  const handleSaveMahasiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("mahasiswa").insert([{ ...mahasiswaForm, prodi_id: selectedProdiId }]);
    setIsMahasiswaModalOpen(false);
    setMahasiswaForm({ nim: "", nama: "" });
    fetchMahasiswas(selectedProdiId);
  };

  const cplAchievement = useMemo(() => {
    const achievement: Record<string, number> = {};
    cpls.forEach(c => achievement[c.id] = 0);

    courses.forEach(course => {
      let courseScore = 0;
      
      course.cpmks.forEach((cpmk: any) => {
        let cpmkScore = 0;
        cpmk.sub_cpmks.forEach((sub: any) => {
          const grade = grades[sub.id] || 0;
          cpmkScore += grade * ((sub.bobot || 0) / 100);
        });
        courseScore += cpmkScore * ((cpmk.bobot || 0) / 100);
      });

      course.cpl_mapping.forEach((mapping: any) => {
        if (achievement[mapping.cpl_id] !== undefined) {
          achievement[mapping.cpl_id] += courseScore * (mapping.bobot || 0);
        }
      });
    });

    return cpls.map(c => ({
      subject: c.kode,
      A: Math.min(100, Math.round(achievement[c.id] || 0)),
      fullMark: 100,
    }));
  }, [cpls, courses, grades]);

  const selectedProdi = prodis.find(p => p.id === selectedProdiId);
  const threshold = selectedProdi?.batas_kelulusan_cpl || 60;

  if (loading && prodis.length === 0) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Simulasi Asesmen & Evaluasi (OBAE)</h1>
        <p className="text-gray-500">Pilih Mahasiswa dan input nilai per Sub-CPMK untuk menghitung persentase ketercapaian CPL.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Program Studi</label>
          <select 
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
            value={selectedProdiId}
            onChange={(e) => setSelectedProdiId(e.target.value)}
          >
            {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Mahasiswa</label>
          <div className="flex gap-2">
            <select 
              className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
              value={selectedMahasiswaId}
              onChange={(e) => setSelectedMahasiswaId(e.target.value)}
            >
              <option value="" disabled>-- Pilih Mahasiswa --</option>
              {mahasiswas.map(m => <option key={m.id} value={m.id}>{m.nim} - {m.nama}</option>)}
            </select>
            <Button onClick={() => setIsMahasiswaModalOpen(true)} size="sm" className="shrink-0" disabled={!selectedProdiId}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button onClick={viewAuditTrail} size="sm" variant="outline" className="shrink-0 text-slate-600" disabled={!selectedMahasiswaId} title="Lihat Grading Audit Trail (IKU 11)">
              <History className="w-4 h-4 mr-2" /> Audit Trail
            </Button>
          </div>
        </div>
      </div>

      {!selectedMahasiswaId ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
          Silakan pilih atau tambahkan mahasiswa terlebih dahulu.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {courses.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Belum ada Mata Kuliah di prodi ini.</p>
            ) : courses.map(course => (
              <Card key={course.id}>
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 rounded-t-xl">
                  <CardTitle>{course.kode} - {course.nama}</CardTitle>
                  <CardDescription>Input Nilai (0 - 100) untuk setiap instrumen penilaian / Sub-CPMK</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {course.cpmks.map((cpmk: any) => (
                    <div key={cpmk.id} className="mb-6 last:mb-0">
                      <h4 className="font-semibold text-slate-700 mb-2">{cpmk.kode} <span className="font-normal text-sm text-slate-500">({cpmk.deskripsi})</span></h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-24">Sub-CPMK</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="w-24 text-center">Bobot</TableHead>
                            <TableHead className="w-32 text-center">Nilai</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cpmk.sub_cpmks.map((sub: any) => (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">{sub.kode}</TableCell>
                              <TableCell className="text-sm text-gray-600">{sub.deskripsi}</TableCell>
                              <TableCell className="text-center">{sub.bobot}%</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="text-right"
                                  value={grades[sub.id] !== undefined ? grades[sub.id] : ''}
                                  placeholder="0"
                                  onBlur={(e) => handleGradeChange(sub.id, e.target.value)}
                                  onChange={(e) => {
                                    // Local state update only, DB update on blur
                                    const val = parseFloat(e.target.value);
                                    if(!isNaN(val)) setGrades(prev => ({ ...prev, [sub.id]: val }));
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                          {cpmk.sub_cpmks.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-sm text-slate-400 py-2">Belum ada Sub-CPMK</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                  {course.cpmks.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-4">Belum ada CPMK</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="xl:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Capaian CPL Mahasiswa</CardTitle>
                <CardDescription>Radar chart visualisasi pencapaian CPL secara real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {cpls.length > 0 ? (
                  <>
                    {/* Early Warning System (EWS) - IKU 1 */}
                    {cplAchievement.some(c => c.A < threshold) && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start text-sm">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Early Warning System (EWS):</strong>
                          <p>Mahasiswa ini memiliki Capaian CPL di bawah ambang batas prodi ({threshold}%). Harap Dosen Wali segera menindaklanjuti untuk mencegah keterlambatan studi (IKU 1 - AEE).</p>
                        </div>
                      </div>
                    )}

                    <RadarChart data={cplAchievement} />
                    
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Detail Capaian:</h4>
                      {cplAchievement.map(point => (
                        <div key={point.subject} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{point.subject}</span>
                          <span className={`font-bold ${point.A >= 70 ? 'text-green-600' : point.A >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                            {point.A}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">Belum ada CPL yang didefinisikan untuk prodi ini.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isMahasiswaModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Mahasiswa</h2>
            <form onSubmit={handleSaveMahasiswa} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">NIM</label>
                <input required type="text" className="w-full p-2 border rounded" value={mahasiswaForm.nim} onChange={e => setMahasiswaForm({...mahasiswaForm, nim: e.target.value})} placeholder="Contoh: 1301201234" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input required type="text" className="w-full p-2 border rounded" value={mahasiswaForm.nama} onChange={e => setMahasiswaForm({...mahasiswaForm, nama: e.target.value})} placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsMahasiswaModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reason for Audit Trail */}
      {isReasonModalOpen && pendingGradeChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center text-amber-700">
              <Info className="w-5 h-5 mr-2" /> Konfirmasi Perubahan Nilai
            </h2>
            <div className="mb-4 text-sm text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-100">
              Perubahan nilai telah terdeteksi. Sesuai <strong>IKU 11 (Integritas Akademik)</strong>, mohon berikan alasan perubahan ini untuk dicatat pada Audit Trail.
              <ul className="mt-2 font-medium">
                <li>Nilai Lama: {pendingGradeChange.oldVal}</li>
                <li>Nilai Baru: {pendingGradeChange.newVal}</li>
              </ul>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); confirmGradeChange(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Alasan Perubahan</label>
                <textarea 
                  required 
                  className="w-full p-2 border border-slate-300 rounded focus:border-amber-500 outline-none" 
                  rows={3}
                  value={changeReason} 
                  onChange={e => setChangeReason(e.target.value)} 
                  placeholder="Contoh: Mahasiswa melakukan perbaikan tugas / Kesalahan input dosen" 
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => {
                  // Revert locally
                  setGrades(prev => ({ ...prev, [pendingGradeChange.subCpmkId]: pendingGradeChange.oldVal }));
                  setIsReasonModalOpen(false);
                  setPendingGradeChange(null);
                }}>Batal (Kembalikan)</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Audit Trail Log */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center text-slate-800">
                <History className="w-5 h-5 mr-2 text-primary" /> Grading Audit Trail
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsAuditModalOpen(false)}>Tutup</Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {auditLoading ? (
                <div className="text-center text-slate-500 py-8">Memuat riwayat...</div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center text-slate-500 py-8 bg-white border border-slate-200 rounded-lg">Belum ada riwayat perubahan nilai untuk mahasiswa ini.</div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs mr-2">{log.sub_cpmk_kode}</span>
                          <span className="text-sm text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{log.user_id}</span>
                      </div>
                      <div className="flex items-center space-x-3 my-2 text-sm font-medium">
                        <span className="text-red-500 line-through">{log.nilai_lama}</span>
                        <span>➔</span>
                        <span className="text-green-600">{log.nilai_baru}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 text-sm text-slate-600 italic">
                        "{log.alasan}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

