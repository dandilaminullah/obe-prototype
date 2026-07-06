"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function BahanKajianPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");

  const [bks, setBks] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ id: string; kode: string; nama: string; cpl_id: string; kurikulum_id: string }>({
    id: "", kode: "", nama: "", cpl_id: "", kurikulum_id: ""
  });

  useEffect(() => {
    fetchData();
  }, [role, prodiId]);

  const fetchData = async () => {
    setLoading(true);
    let kurQuery = supabase.from("kurikulum").select("*, prodi(nama)").order("tahun_berlaku", { ascending: false });
    if (role === "ADMIN" && prodiId) {
      kurQuery = kurQuery.eq("prodi_id", prodiId);
    }

    const [kurRes, bkRes, cplRes] = await Promise.all([
      kurQuery,
      supabase.from("bahan_kajian").select("*, kurikulum(nama), cpl(kode, deskripsi)").order("kode", { ascending: true }),
      supabase.from("cpl").select("*").order("kode", { ascending: true })
    ]);

    if (kurRes.data && kurRes.data.length > 0) {
      setKurikulums(kurRes.data);
      if (!selectedKurikulum || !kurRes.data.some(k => k.id === selectedKurikulum)) {
        setSelectedKurikulum(kurRes.data[0].id); // Default to newest kurikulum by tahun_berlaku
      }
    } else {
      setKurikulums([]);
      setSelectedKurikulum("");
    }

    if (bkRes.data) setBks(bkRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      kode: formData.kode,
      nama: formData.nama,
      cpl_id: formData.cpl_id || null,
      kurikulum_id: formData.kurikulum_id
    };

    if (formData.id) {
      await supabase.from("bahan_kajian").update(payload).eq("id", formData.id);
    } else {
      await supabase.from("bahan_kajian").insert([payload]);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus Bahan Kajian ini?")) {
      await supabase.from("bahan_kajian").delete().eq("id", id);
      fetchData();
    }
  };

  const filteredBks = bks
    .filter((bk) => (selectedKurikulum ? bk.kurikulum_id === selectedKurikulum : true))
    .filter((bk) => 
      bk.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bk.cpl?.kode && bk.cpl.kode.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.kode.localeCompare(b.kode, undefined, { numeric: true, sensitivity: "base" }));

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Bahan Kajian...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bahan Kajian</h1>
          <p className="text-gray-500">Manajemen Bahan Kajian (Study Material) dan pemetaan ke Capaian Pembelajaran Lulusan (CPL) per Kurikulum.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="p-2 border rounded-md shadow-sm bg-white min-w-[220px] text-sm focus:outline-none focus:border-primary font-medium"
            value={selectedKurikulum}
            onChange={(e) => setSelectedKurikulum(e.target.value)}
          >
            {kurikulums.map(k => (
              <option key={k.id} value={k.id}>
                {k.nama} ({k.prodi?.nama}) - {k.tahun_berlaku}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="overflow-visible">
        <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-slate-100">
          <CardTitle>Daftar Bahan Kajian</CardTitle>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary min-w-[220px]"
                placeholder="Cari kode/nama BK atau CPL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => { setFormData({ id: "", kode: "", nama: "", cpl_id: "", kurikulum_id: selectedKurikulum || kurikulums[0]?.id || "" }); setIsModalOpen(true); }} size="sm">
              <Plus className="w-4 h-4 mr-2" /> Tambah BK
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-visible">
          <Table containerClassName="overflow-visible">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-36">Kode BK</TableHead>
                <TableHead>Nama Bahan Kajian</TableHead>
                <TableHead className="w-64">CPL Terkait</TableHead>
                <TableHead className="text-right w-32">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBks.map((bk) => (
                <TableRow key={bk.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-bold text-slate-800">{bk.kode}</TableCell>
                  <TableCell className="font-medium text-slate-800">{bk.nama}</TableCell>
                  <TableCell className="overflow-visible">
                    {bk.cpl ? (
                      <div className="relative group inline-block">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors">
                          {bk.cpl.kode}
                        </span>
                        
                        {/* Animated Popover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transform translate-y-1.5 group-hover:translate-y-0 transition-all duration-200 ease-out z-50 min-w-[220px] max-w-[300px]">
                          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl p-3 shadow-2xl border border-slate-700/80">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <span className="font-bold text-indigo-300">{bk.cpl.kode}</span>
                              <span className="text-[10px] bg-indigo-900/80 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-700">CPL</span>
                            </div>
                            <p className="text-slate-200 font-normal leading-relaxed text-xs">
                              {bk.cpl.deskripsi}
                            </p>
                          </div>
                          <div className="w-2.5 h-2.5 bg-slate-900/95 rotate-45 mx-auto -mt-1.5 border-r border-b border-slate-700/80"></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum di-set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="secondary" size="sm" onClick={() => {
                      setFormData({ id: bk.id, kode: bk.kode, nama: bk.nama, cpl_id: bk.cpl_id || "", kurikulum_id: bk.kurikulum_id });
                      setIsModalOpen(true);
                    }}>
                      <Pencil className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(bk.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    {bks.length === 0 ? "Belum ada data Bahan Kajian di kurikulum ini." : "Tidak ada Bahan Kajian yang cocok dengan pencarian."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md my-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{formData.id ? "Edit Bahan Kajian" : "Tambah Bahan Kajian"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Kurikulum</label>
                <select 
                  required 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-primary text-sm" 
                  value={formData.kurikulum_id} 
                  onChange={e => setFormData({...formData, kurikulum_id: e.target.value, cpl_id: ""})}
                >
                  <option value="" disabled>Pilih Kurikulum</option>
                  {kurikulums.map(k => <option key={k.id} value={k.id}>{k.nama} ({k.prodi?.nama}) - {k.tahun_berlaku}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Kode BK</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" 
                  value={formData.kode} 
                  onChange={e => setFormData({ ...formData, kode: e.target.value })} 
                  placeholder="Contoh: BK01" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Nama Bahan Kajian</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" 
                  value={formData.nama} 
                  onChange={e => setFormData({ ...formData, nama: e.target.value })} 
                  placeholder="Contoh: Algoritma & Struktur Data" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Target CPL (1 CPL untuk 1 BK)</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-primary text-sm" 
                  value={formData.cpl_id} 
                  onChange={e => setFormData({...formData, cpl_id: e.target.value})}
                >
                  <option value="">-- Pilih CPL Terkait --</option>
                  {cpls
                    .filter(c => c.kurikulum_id === formData.kurikulum_id)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.kode} - {c.deskripsi}
                      </option>
                    ))}
                </select>
                {cpls.filter(c => c.kurikulum_id === formData.kurikulum_id).length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 italic">Belum ada CPL di kurikulum ini.</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
