"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";

export default function RPSBuilderPage() {
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");

  const [courses, setCourses] = useState<any[]>([]);
  const [cpmks, setCpmks] = useState<any[]>([]);
  const [subCpmks, setSubCpmks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const [isCpmkModalOpen, setIsCpmkModalOpen] = useState(false);
  const [cpmkForm, setCpmkForm] = useState({ kode: "", deskripsi: "", bobot: 0 });

  const [isSubCpmkModalOpen, setIsSubCpmkModalOpen] = useState(false);
  const [subCpmkForm, setSubCpmkForm] = useState({ kode: "", deskripsi: "", bobot: 0, cpmk_id: "" });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKurikulum) {
      fetchCourses(selectedKurikulum);
    }
  }, [selectedKurikulum]);

  useEffect(() => {
    if (selectedCourseId) {
      const course = courses.find(c => c.id === selectedCourseId);
      setSelectedCourse(course);
      fetchCpmkAndSubCpmk(selectedCourseId);
    } else {
      setSelectedCourse(null);
      setCpmks([]);
      setSubCpmks([]);
    }
  }, [selectedCourseId, courses]);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: kurData } = await supabase.from("kurikulum").select("*, prodi(nama)").order("tahun_berlaku", { ascending: false });
    if (kurData && kurData.length > 0) {
      setKurikulums(kurData);
      setSelectedKurikulum(kurData[0].id);
    } else {
      setLoading(false);
    }
  };

  const fetchCourses = async (kurikulumId: string) => {
    setLoading(true);
    const { data } = await supabase.from("mata_kuliah").select("*").eq("kurikulum_id", kurikulumId).order("semester").order("kode");
    if (data) {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
      } else {
        setSelectedCourseId("");
      }
    }
    setLoading(false);
  };

  const fetchCpmkAndSubCpmk = async (courseId: string) => {
    const { data: cData } = await supabase.from("cpmk").select("*").eq("mata_kuliah_id", courseId).order("kode");
    if (cData) {
      setCpmks(cData);
      const cpmkIds = cData.map(c => c.id);
      if (cpmkIds.length > 0) {
        const { data: sData } = await supabase.from("sub_cpmk").select("*").in("cpmk_id", cpmkIds).order("kode");
        if (sData) setSubCpmks(sData);
        else setSubCpmks([]);
      } else {
        setSubCpmks([]);
      }
    } else {
      setCpmks([]);
      setSubCpmks([]);
    }
  };

  const handleCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("cpmk").insert([{ ...cpmkForm, mata_kuliah_id: selectedCourseId }]);
    setIsCpmkModalOpen(false);
    setCpmkForm({ kode: "", deskripsi: "", bobot: 0 });
    fetchCpmkAndSubCpmk(selectedCourseId);
  };

  const handleCpmkDelete = async (id: string) => {
    if(confirm("Hapus CPMK ini?")) {
      await supabase.from("cpmk").delete().eq("id", id);
      fetchCpmkAndSubCpmk(selectedCourseId);
    }
  };

  const handleSubCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("sub_cpmk").insert([{ ...subCpmkForm }]);
    setIsSubCpmkModalOpen(false);
    setSubCpmkForm({ kode: "", deskripsi: "", bobot: 0, cpmk_id: "" });
    fetchCpmkAndSubCpmk(selectedCourseId);
  };

  const handleSubCpmkDelete = async (id: string) => {
    if(confirm("Hapus Sub-CPMK ini?")) {
      await supabase.from("sub_cpmk").delete().eq("id", id);
      fetchCpmkAndSubCpmk(selectedCourseId);
    }
  };

  const handleWeightChange = async (subId: string, value: string) => {
    const num = parseFloat(value) || 0;
    
    // Optimistic update
    setSubCpmks(prev => prev.map(s => s.id === subId ? { ...s, bobot: num } : s));

    await supabase.from("sub_cpmk").update({ bobot: num }).eq("id", subId);
  };

  const handleCpmkWeightChange = async (cpmkId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setCpmks(prev => prev.map(c => c.id === cpmkId ? { ...c, bobot: num } : c));
    await supabase.from("cpmk").update({ bobot: num }).eq("id", cpmkId);
  }

  const handleUpdateCourseMethod = async () => {
    if (!selectedCourse) return;
    
    // Validate IKU 5
    if ((selectedCourse.metode_pembelajaran === 'TBP' || selectedCourse.metode_pembelajaran === 'CM') && !selectedCourse.tautan_mou) {
      alert("Tautan dokumen MoU/MoA wajib diisi untuk metode Case Method atau Team-Based Project (IKU 5).");
      return;
    }

    await supabase.from("mata_kuliah").update({
      metode_pembelajaran: selectedCourse.metode_pembelajaran,
      tautan_mou: selectedCourse.tautan_mou
    }).eq("id", selectedCourse.id);
    
    alert("Metode pembelajaran berhasil diperbarui.");
    if (selectedKurikulum) fetchCourses(selectedKurikulum);
  };

  if (loading && kurikulums.length === 0) return <div className="p-8 text-center">Loading...</div>;

  const totalCpmkWeight = cpmks.reduce((acc, curr) => acc + (curr.bobot || 0), 0);
  const isCpmkValid = totalCpmkWeight === 100;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital RPS Builder</h1>
          <p className="text-gray-500">Jabarkan CPMK menjadi Sub-CPMK dan tentukan bobot penilaian per Mata Kuliah.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Kurikulum:</label>
            <select 
              className="border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
              value={selectedKurikulum}
              onChange={(e) => setSelectedKurikulum(e.target.value)}
            >
              {kurikulums.map(k => (
                <option key={k.id} value={k.id}>{k.nama} ({k.prodi?.nama})</option>
              ))}
            </select>
        </div>
        <div className="flex items-center space-x-2 flex-1 w-full">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Mata Kuliah:</label>
            <select 
              className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="" disabled>-- Pilih Mata Kuliah --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>Smt {c.semester}: {c.kode} - {c.nama}</option>
              ))}
            </select>
            
            {selectedCourseId && (
              <Button onClick={() => setIsCpmkModalOpen(true)} size="sm" className="shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Tambah CPMK
              </Button>
            )}
        </div>
      </div>

      {!selectedCourseId ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">Silakan pilih Mata Kuliah terlebih dahulu.</CardContent>
          </Card>
      ) : (
          <>
            <Card className="bg-slate-50 border-blue-100">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Metode Pembelajaran (IKU 5)</label>
                  <select 
                    className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white"
                    value={selectedCourse?.metode_pembelajaran || "REGULAR"}
                    onChange={(e) => setSelectedCourse({...selectedCourse, metode_pembelajaran: e.target.value})}
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="CM">Case Method (CM)</option>
                    <option value="TBP">Team-Based Project (TBP)</option>
                  </select>
                </div>
                
                {(selectedCourse?.metode_pembelajaran === 'CM' || selectedCourse?.metode_pembelajaran === 'TBP') && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-red-600 mb-1">Tautan MoU/MoA Industri *wajib</label>
                    <Input 
                      type="url" 
                      placeholder="https://link-to-mou.com" 
                      value={selectedCourse?.tautan_mou || ""}
                      onChange={(e) => setSelectedCourse({...selectedCourse, tautan_mou: e.target.value})}
                      className="border-red-200 focus:ring-red-500 bg-white"
                    />
                  </div>
                )}
                
                <Button variant="secondary" onClick={handleUpdateCourseMethod}>Simpan Metode</Button>
              </CardContent>
            </Card>

            {cpmks.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Total Bobot CPMK: {totalCpmkWeight}%</h3>
                  {!isCpmkValid && <p className="text-xs text-red-500">* Total bobot CPMK untuk Mata Kuliah ini harus bernilai tepat 100%.</p>}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {cpmks.map((cpmk) => {
                const relatedSubCpmk = subCpmks.filter(sub => sub.cpmk_id === cpmk.id);
                const totalWeight = relatedSubCpmk.reduce((acc, curr) => acc + (curr.bobot || 0), 0);
                const isValid = totalWeight === 100;

                return (
                  <Card key={cpmk.id} className={isValid ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-md flex items-center space-x-2">
                            <span>{cpmk.kode}</span>
                            {isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <Button variant="ghost" size="sm" className="text-red-500 h-6 w-6 p-0 ml-2" onClick={() => handleCpmkDelete(cpmk.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </CardTitle>
                          <CardDescription className="mt-1 text-slate-800">{cpmk.deskripsi}</CardDescription>
                          <div className="mt-3 flex items-center space-x-2">
                            <span className="text-sm font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded">Bobot thd MK:</span>
                            <div className="relative">
                              <Input type="number" className="w-24 h-8 pr-6" value={cpmk.bobot} onChange={(e) => handleCpmkWeightChange(cpmk.id, e.target.value)} />
                              <span className="absolute right-2 top-1.5 text-sm font-medium text-slate-400">%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-right flex flex-col items-end gap-2">
                          <div>
                            <span className="font-semibold text-gray-700">Total Bobot Sub-CPMK: </span>
                            <span className={`font-bold ${isValid ? "text-green-600" : "text-red-500"}`}>
                              {totalWeight}%
                            </span>
                          </div>
                          <Button size="sm" variant="secondary" className="bg-white border-slate-200 shadow-sm" onClick={() => { setSubCpmkForm({ kode: "", deskripsi: "", bobot: 0, cpmk_id: cpmk.id }); setIsSubCpmkModalOpen(true); }}>
                            <Plus className="w-3 h-3 mr-1" /> Tambah Sub-CPMK
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {relatedSubCpmk.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-32">Kode</TableHead>
                              <TableHead>Deskripsi Penilaian / Materi</TableHead>
                              <TableHead className="w-32 text-center">Bobot (%)</TableHead>
                              <TableHead className="w-16"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {relatedSubCpmk.map((sub) => (
                              <TableRow key={sub.id}>
                                <TableCell className="font-bold text-slate-700">{sub.kode}</TableCell>
                                <TableCell>{sub.deskripsi}</TableCell>
                                <TableCell>
                                  <div className="relative">
                                    <Input
                                        type="number"
                                        className="w-full pr-6 h-8 text-right bg-slate-50 focus:bg-white"
                                        value={sub.bobot}
                                        onChange={(e) => handleWeightChange(sub.id, e.target.value)}
                                    />
                                    <span className="absolute right-2 top-1.5 text-xs font-medium text-slate-400">%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleSubCpmkDelete(sub.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-slate-400 text-center py-4 border border-dashed rounded-lg">Belum ada Sub-CPMK</p>
                      )}
                      
                      {!isValid && relatedSubCpmk.length > 0 && (
                        <p className="mt-3 text-xs text-red-500 font-medium">
                          * Peringatan: Total bobot Sub-CPMK dalam satu CPMK harus bernilai tepat 100%. Saat ini {totalWeight}%.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
      )}

      {/* MODALS */}
      {isCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Tambah CPMK</h2>
            <form onSubmit={handleCpmkSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode CPMK</label>
                <input required type="text" className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={cpmkForm.kode} onChange={e => setCpmkForm({...cpmkForm, kode: e.target.value})} placeholder="Contoh: CPMK-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea required rows={3} className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={cpmkForm.deskripsi} onChange={e => setCpmkForm({...cpmkForm, deskripsi: e.target.value})} placeholder="Capaian spesifik MK" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bobot thd MK (%)</label>
                <input required type="number" min="0" max="100" step="0.1" className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={cpmkForm.bobot} onChange={e => setCpmkForm({...cpmkForm, bobot: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsCpmkModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Tambah Sub-CPMK</h2>
            <form onSubmit={handleSubCpmkSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode Sub-CPMK</label>
                <input required type="text" className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={subCpmkForm.kode} onChange={e => setSubCpmkForm({...subCpmkForm, kode: e.target.value})} placeholder="Contoh: L1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi / Materi</label>
                <textarea required rows={3} className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={subCpmkForm.deskripsi} onChange={e => setSubCpmkForm({...subCpmkForm, deskripsi: e.target.value})} placeholder="Indikator pencapaian/materi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bobot thd CPMK (%)</label>
                <input required type="number" min="0" max="100" step="0.1" className="w-full p-2.5 border border-slate-300 rounded focus:border-primary outline-none" value={subCpmkForm.bobot} onChange={e => setSubCpmkForm({...subCpmkForm, bobot: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsSubCpmkModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
