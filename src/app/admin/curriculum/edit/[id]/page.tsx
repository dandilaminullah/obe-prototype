"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function EditCurriculumPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    nama: "",
    tahun_berlaku: new Date().getFullYear(),
    ketua_tim: "",
    landasan_filosofis: "",
    landasan_sosiologis: "",
    landasan_historis: "",
    landasan_hukum: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchKurikulum();
  }, []);

  const fetchKurikulum = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kurikulum')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setForm({
        nama: data.nama || "",
        tahun_berlaku: data.tahun_berlaku || new Date().getFullYear(),
        ketua_tim: data.ketua_tim || "",
        landasan_filosofis: data.landasan_filosofis || "",
        landasan_sosiologis: data.landasan_sosiologis || "",
        landasan_historis: data.landasan_historis || "",
        landasan_hukum: data.landasan_hukum || "",
      });
    } else {
      alert("Kurikulum tidak ditemukan");
      router.push("/admin/curriculum");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("kurikulum")
      .update(form)
      .eq('id', params.id);
      
    setSaving(false);
    
    if (error) {
      alert("Gagal menyimpan kurikulum: " + error.message);
    } else {
      alert("Kurikulum berhasil diperbarui");
      router.push("/admin/curriculum");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Kurikulum
        </h1>
        <p className="text-gray-500">
          Perbarui informasi dan landasan kurikulum
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Kurikulum
                </label>
                <input
                  type="text"
                  name="nama"
                  className="w-full p-2 border rounded"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Misal: Kurikulum OBE 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tahun Berlaku
                </label>
                <input
                  type="number"
                  name="tahun_berlaku"
                  className="w-full p-2 border rounded"
                  value={form.tahun_berlaku}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ketua Tim Kurikulum
                </label>
                <input
                  type="text"
                  name="ketua_tim"
                  className="w-full p-2 border rounded"
                  value={form.ketua_tim}
                  onChange={handleChange}
                  placeholder="Nama Ketua Tim"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Landasan Kurikulum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Landasan Filosofis
                </label>
                <textarea
                  name="landasan_filosofis"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.landasan_filosofis}
                  onChange={handleChange}
                  placeholder="Falsafah perenialisme, esensialisme, progresivisme..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Landasan Sosiologis
                </label>
                <textarea
                  name="landasan_sosiologis"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.landasan_sosiologis}
                  onChange={handleChange}
                  placeholder="Kaitan antara individu dan masyarakat..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Landasan Historis
                </label>
                <textarea
                  name="landasan_historis"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.landasan_historis}
                  onChange={handleChange}
                  placeholder="Perkembangan historis program studi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Landasan Hukum
                </label>
                <textarea
                  name="landasan_hukum"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.landasan_hukum}
                  onChange={handleChange}
                  placeholder="UU, Permendikbud..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => router.push('/admin/curriculum')}>
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving} className="w-48">
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
