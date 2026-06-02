"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function ProdiPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [jurusans, setJurusans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", nama: "", jurusan_id: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodiRes, jurusanRes] = await Promise.all([
      supabase.from("prodi").select("*, jurusan(nama)").order("created_at", { ascending: true }),
      supabase.from("jurusan").select("*").order("created_at", { ascending: true })
    ]);
    
    if (!prodiRes.error && prodiRes.data) setProdis(prodiRes.data);
    if (!jurusanRes.error && jurusanRes.data) setJurusans(jurusanRes.data);
    
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from("prodi").update({ 
        nama: formData.nama,
        jurusan_id: formData.jurusan_id
      }).eq("id", formData.id);
    } else {
      await supabase.from("prodi").insert([{ 
        nama: formData.nama,
        jurusan_id: formData.jurusan_id
      }]);
    }
    setIsModalOpen(false);
    setFormData({ id: "", nama: "", jurusan_id: "" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus prodi ini?")) {
      await supabase.from("prodi").delete().eq("id", id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Program Studi</h1>
        <Button onClick={() => { setFormData({ id: "", nama: "", jurusan_id: jurusans[0]?.id || "" }); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prodi
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 font-semibold text-sm text-slate-600">Nama Prodi</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Jurusan</th>
              <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-500">Loading...</td>
              </tr>
            ) : prodis.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-500">Belum ada data prodi.</td>
              </tr>
            ) : (
              prodis.map((prodi) => (
                <tr key={prodi.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-700">{prodi.nama}</td>
                  <td className="p-4 text-sm text-slate-700">{prodi.jurusan?.nama}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => { setFormData({ id: prodi.id, nama: prodi.nama, jurusan_id: prodi.jurusan_id }); setIsModalOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(prodi.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Prodi" : "Tambah Prodi"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                <select
                  required
                  className="w-full p-2 border rounded-md bg-white"
                  value={formData.jurusan_id}
                  onChange={(e) => setFormData({ ...formData, jurusan_id: e.target.value })}
                >
                  <option value="" disabled>Pilih Jurusan</option>
                  {jurusans.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Prodi</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: S1 Teknik Informatika"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
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
