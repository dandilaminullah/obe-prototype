"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function BahanKajianPage() {
  const [bks, setBks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [bkProfils, setBkProfils] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ id: string; kode: string; nama: string; deskripsi: string; assigned_profils: string[] }>({
    id: "", kode: "", nama: "", deskripsi: "", assigned_profils: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [bkRes, profileRes, mapRes] = await Promise.all([
      supabase.from("bahan_kajian").select("*").order("kode"),
      supabase.from("profil_lulusan").select("*, prodi(nama)").order("nama"),
      supabase.from("profil_lulusan_bk").select("*")
    ]);
    if (bkRes.data) setBks(bkRes.data);
    if (profileRes.data) setProfiles(profileRes.data);
    if (mapRes.data) setBkProfils(mapRes.data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from("bahan_kajian").update({ kode: formData.kode, nama: formData.nama, deskripsi: formData.deskripsi }).eq("id", formData.id);
      await supabase.from("profil_lulusan_bk").delete().eq("bk_id", formData.id);
      
      if (formData.assigned_profils.length > 0) {
        await supabase.from("profil_lulusan_bk").insert(
          formData.assigned_profils.map(pid => ({ bk_id: formData.id, profil_id: pid }))
        );
      }
    } else {
      const { data } = await supabase.from("bahan_kajian").insert([{ kode: formData.kode, nama: formData.nama, deskripsi: formData.deskripsi }]).select("id").single();
      if (data && formData.assigned_profils.length > 0) {
        await supabase.from("profil_lulusan_bk").insert(
          formData.assigned_profils.map(pid => ({ bk_id: data.id, profil_id: pid }))
        );
      }
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bahan Kajian</h1>
        <p className="text-gray-500">Manajemen Bahan Kajian (Study Material) dan pemetaannya terhadap Profil Lulusan.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
          <CardTitle>Daftar Bahan Kajian</CardTitle>
          <Button onClick={() => { setFormData({ id: "", kode: "", nama: "", deskripsi: "", assigned_profils: [] }); setIsModalOpen(true); }} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Tambah BK
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Bahan Kajian</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Profil Terkait</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bks.map((bk) => (
                <TableRow key={bk.id}>
                  <TableCell className="font-medium">{bk.kode}</TableCell>
                  <TableCell>{bk.nama}</TableCell>
                  <TableCell className="text-gray-500">{bk.deskripsi}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bkProfils.filter(m => m.bk_id === bk.id).map(m => {
                        const p = profiles.find(pr => pr.id === m.profil_id);
                        return p ? (
                          <span key={m.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {p.nama}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => {
                      const assigned = bkProfils.filter(m => m.bk_id === bk.id).map(m => m.profil_id);
                      setFormData({ id: bk.id, kode: bk.kode, nama: bk.nama, deskripsi: bk.deskripsi, assigned_profils: assigned });
                      setIsModalOpen(true);
                    }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(bk.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">Belum ada data Bahan Kajian</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Bahan Kajian" : "Tambah Bahan Kajian"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode BK</label>
                <input required type="text" className="w-full p-2 border rounded" value={formData.kode} onChange={e => setFormData({ ...formData, kode: e.target.value })} placeholder="Contoh: BK01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama BK</label>
                <input required type="text" className="w-full p-2 border rounded" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Algoritma & Struktur Data" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Profil Lulusan (Multiple Selection)</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-slate-50 space-y-2">
                  {profiles.map(p => (
                    <label key={p.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.assigned_profils.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, assigned_profils: [...formData.assigned_profils, p.id] });
                          } else {
                            setFormData({ ...formData, assigned_profils: formData.assigned_profils.filter(id => id !== p.id) });
                          }
                        }}
                      />
                      <span><strong className="text-slate-700">{p.nama}</strong> - <span className="text-slate-500">{p.prodi?.nama}</span></span>
                    </label>
                  ))}
                  {profiles.length === 0 && <span className="text-sm text-slate-400 italic">Belum ada Profil Lulusan</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea className="w-full p-2 border rounded" value={formData.deskripsi || ""} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
