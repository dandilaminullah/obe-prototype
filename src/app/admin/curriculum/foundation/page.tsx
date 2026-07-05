"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FoundationPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Form states
  const [form, setForm] = useState<any>({
    visi: "",
    misi: "",
    tujuan: "",
    strategi: "",
    university_value: "",
    evaluasi_kurikulum: "",
    tracer_study: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKurikulum) {
      const kur = kurikulums.find((k) => k.id === selectedKurikulum);
      if (kur) {
        setForm({
          visi: kur.visi || "",
          misi: kur.misi || "",
          tujuan: kur.tujuan || "",
          strategi: kur.strategi || "",
          university_value: kur.university_value || "",
          evaluasi_kurikulum: kur.evaluasi_kurikulum || "",
          tracer_study: kur.tracer_study || "",
        });
      }
    }
  }, [selectedKurikulum, kurikulums]);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: prodiData } = await supabase
      .from("prodi")
      .select("*")
      .order("nama");
    const { data: kurData } = await supabase
      .from("kurikulum")
      .select("*, prodi(nama)")
      .order("tahun_berlaku", { ascending: false });

    if (prodiData) setProdis(prodiData);
    if (kurData && kurData.length > 0) {
      setKurikulums(kurData);
      setSelectedKurikulum(kurData[0].id);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedKurikulum) return;
    setSaving(true);
    const { error } = await supabase
      .from("kurikulum")
      .update(form)
      .eq("id", selectedKurikulum);
    setSaving(false);
    if (error) {
      alert("Gagal menyimpan data");
    } else {
      alert("Data berhasil disimpan");
      fetchInitialData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading)
    return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analisis & Landasan (Foundation)
          </h1>
          <p className="text-gray-500">
            Input landasan kurikulum, evaluasi & tracer study, serta
            penyelarasan VMTS.
          </p>
        </div>
        <div>
          <select
            className="p-2 border rounded-md shadow-sm bg-white min-w-[200px]"
            value={selectedKurikulum}
            onChange={(e) => setSelectedKurikulum(e.target.value)}
          >
            {kurikulums.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama} ({k.prodi?.nama})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Evaluasi Kurikulum & Tracer Study</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hasil Evaluasi Kurikulum
                </label>
                <textarea
                  name="evaluasi_kurikulum"
                  rows={4}
                  className="w-full p-2 border rounded"
                  value={form.evaluasi_kurikulum}
                  onChange={handleChange}
                  placeholder="Mekanisme evaluasi, butir kurikulum yang dievaluasi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hasil Tracer Study
                </label>
                <textarea
                  name="tracer_study"
                  rows={4}
                  className="w-full p-2 border rounded"
                  value={form.tracer_study}
                  onChange={handleChange}
                  placeholder="Hasil studi pelacakan sebagai dasar perumusan CPL..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Penyelarasan VMTS & University Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Visi</label>
                <textarea
                  name="visi"
                  rows={2}
                  className="w-full p-2 border rounded"
                  value={form.visi}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Misi</label>
                <textarea
                  name="misi"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.misi}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tujuan</label>
                <textarea
                  name="tujuan"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.tujuan}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Strategi
                </label>
                <textarea
                  name="strategi"
                  rows={3}
                  className="w-full p-2 border rounded"
                  value={form.strategi}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  University Value
                </label>
                <textarea
                  name="university_value"
                  rows={2}
                  className="w-full p-2 border rounded"
                  value={form.university_value}
                  onChange={handleChange}
                  placeholder="Nilai-nilai yang diperjuangkan perguruan tinggi..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Menyimpan..." : "Simpan Dokumen Foundation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
