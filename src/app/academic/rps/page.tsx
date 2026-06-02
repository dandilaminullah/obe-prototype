"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/Table";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { CheckCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";

export default function RPSBuilderPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [cpmks, setCpmks] = useState<any[]>([]);
  const [subCpmks, setSubCpmks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const [isCpmkModalOpen, setIsCpmkModalOpen] = useState(false);
  const [cpmkForm, setCpmkForm] = useState({ kode: "", deskripsi: "", bobot: 0 });

  const [isSubCpmkModalOpen, setIsSubCpmkModalOpen] = useState(false);
  const [subCpmkForm, setSubCpmkForm] = useState({ kode: "", deskripsi: "", bobot: 0, cpmk_id: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCpmkAndSubCpmk(selectedCourseId);
    } else {
      setCpmks([]);
      setSubCpmks([]);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from("mata_kuliah").select("*").order("kode");
    if (data) {
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
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

  if (loading && courses.length === 0) return <div className="p-8 text-center">Loading...</div>;

  const totalCpmkWeight = cpmks.reduce((acc, curr) => acc + (curr.bobot || 0), 0);
  const isCpmkValid = totalCpmkWeight === 100;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital RPS Builder</h1>
          <p className="text-gray-500">Jabarkan CPMK menjadi Sub-CPMK dan tentukan bobot penilaian.</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <label className="text-sm font-medium text-gray-700">Pilih Mata Kuliah:</label>
        <select 
          className="border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="" disabled>Pilih Mata Kuliah</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.kode} - {c.nama}</option>
          ))}
        </select>
        
        {selectedCourseId && (
          <Button onClick={() => setIsCpmkModalOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Tambah CPMK
          </Button>
        )}
      </div>

      {selectedCourseId && cpmks.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Total Bobot CPMK: {totalCpmkWeight}%</h3>
            {!isCpmkValid && <p className="text-xs text-red-500">* Total bobot CPMK untuk Mata Kuliah ini harus 100%.</p>}
          </div>
        </div>
      )}

      {selectedCourseId && (
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
                      <CardDescription className="mt-1">{cpmk.deskripsi}</CardDescription>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-sm font-medium">Bobot CPMK ini terhadap MK (%):</span>
                        <Input type="number" className="w-20 h-8" value={cpmk.bobot} onChange={(e) => handleCpmkWeightChange(cpmk.id, e.target.value)} />
                      </div>
                    </div>
                    <div className="text-sm text-right flex flex-col items-end gap-2">
                      <div>
                        <span className="font-semibold text-gray-700">Total Bobot Sub-CPMK: </span>
                        <span className={`font-bold ${isValid ? "text-green-600" : "text-red-500"}`}>
                          {totalWeight}%
                        </span>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => { setSubCpmkForm({ kode: "", deskripsi: "", bobot: 0, cpmk_id: cpmk.id }); setIsSubCpmkModalOpen(true); }}>
                        <Plus className="w-3 h-3 mr-1" /> Sub-CPMK
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
                            <TableCell className="font-medium">{sub.kode}</TableCell>
                            <TableCell>{sub.deskripsi}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="w-full text-right"
                                value={sub.bobot}
                                onChange={(e) => handleWeightChange(sub.id, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleSubCpmkDelete(sub.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-2">Belum ada Sub-CPMK</p>
                  )}
                  
                  {!isValid && relatedSubCpmk.length > 0 && (
                    <p className="mt-3 text-xs text-red-500 font-medium">
                      * Peringatan: Total bobot Sub-CPMK dalam satu CPMK harus bernilai 100%. Saat ini {totalWeight}%.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah CPMK</h2>
            <form onSubmit={handleCpmkSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode CPMK</label>
                <input required type="text" className="w-full p-2 border rounded" value={cpmkForm.kode} onChange={e => setCpmkForm({...cpmkForm, kode: e.target.value})} placeholder="Contoh: CPMK-1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea required className="w-full p-2 border rounded" value={cpmkForm.deskripsi} onChange={e => setCpmkForm({...cpmkForm, deskripsi: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bobot thd MK (%)</label>
                <input required type="number" className="w-full p-2 border rounded" value={cpmkForm.bobot} onChange={e => setCpmkForm({...cpmkForm, bobot: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsCpmkModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Sub-CPMK</h2>
            <form onSubmit={handleSubCpmkSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode Sub-CPMK</label>
                <input required type="text" className="w-full p-2 border rounded" value={subCpmkForm.kode} onChange={e => setSubCpmkForm({...subCpmkForm, kode: e.target.value})} placeholder="Contoh: L1" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi / Materi</label>
                <textarea required className="w-full p-2 border rounded" value={subCpmkForm.deskripsi} onChange={e => setSubCpmkForm({...subCpmkForm, deskripsi: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bobot thd CPMK (%)</label>
                <input required type="number" className="w-full p-2 border rounded" value={subCpmkForm.bobot} onChange={e => setSubCpmkForm({...subCpmkForm, bobot: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsSubCpmkModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
