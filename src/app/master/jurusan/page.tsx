"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function JurusanPage() {
  const [jurusans, setJurusans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", nama: "" });

  useEffect(() => {
    fetchJurusans();
  }, []);

  const fetchJurusans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("jurusan").select("*").order("created_at", { ascending: true });
    if (!error && data) {
      setJurusans(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from("jurusan").update({ nama: formData.nama }).eq("id", formData.id);
    } else {
      await supabase.from("jurusan").insert([{ nama: formData.nama }]);
    }
    setIsModalOpen(false);
    setFormData({ id: "", nama: "" });
    fetchJurusans();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus jurusan ini?")) {
      await supabase.from("jurusan").delete().eq("id", id);
      fetchJurusans();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Jurusan</h1>
        <Button onClick={() => { setFormData({ id: "", nama: "" }); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jurusan
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 font-semibold text-sm text-slate-600">Nama Jurusan</th>
              <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-slate-500">Loading...</td>
              </tr>
            ) : jurusans.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-slate-500">Belum ada data jurusan.</td>
              </tr>
            ) : (
              jurusans.map((jurusan) => (
                <tr key={jurusan.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-700">{jurusan.nama}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => { setFormData(jurusan); setIsModalOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(jurusan.id)} className="text-red-500 hover:text-red-600">
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
            <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Jurusan" : "Tambah Jurusan"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Jurusan</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Teknik Informatika"
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
