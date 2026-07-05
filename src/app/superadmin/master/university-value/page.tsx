"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Pencil, Plus, CheckCircle2 } from "lucide-react";

export default function SuperAdminUniversityValuePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [universityValue, setUniversityValue] = useState("");
  const [formData, setFormData] = useState("");

  useEffect(() => {
    fetchUniversityValue();
  }, []);

  const fetchUniversityValue = async () => {
    setLoading(true);
    const { data } = await supabase.from("kurikulum").select("university_value").limit(1);

    if (data && data.length > 0) {
      setUniversityValue(data[0].university_value || "");
    }
    setLoading(false);
  };

  const openModal = () => {
    setFormData(universityValue);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("kurikulum")
      .update({ university_value: formData })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan University Value: " + error.message);
    } else {
      alert("University Value berhasil disimpan!");
      setUniversityValue(formData);
      setIsModalOpen(false);
    }
  };

  const hasData = Boolean(universityValue?.trim());

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading University Value...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">University Value</h1>
          <p className="text-slate-500">Master Data Nilai-Nilai Institusi Perguruan Tinggi</p>
        </div>
        <Button onClick={openModal}>
          {hasData ? (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit University Value
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Tambah University Value
            </>
          )}
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center space-x-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              University Value (Nilai-Nilai Institusi Perguruan Tinggi)
            </CardTitle>
            <p className="text-xs text-slate-500">Prinsip dasar dan nilai luhur yang diperjuangkan Perguruan Tinggi</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {hasData ? (
            <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                Nilai-Nilai Utama Perguruan Tinggi:
              </div>
              <p className="text-slate-700 whitespace-pre-line text-base leading-relaxed pl-6">
                {universityValue}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
              Belum ada data University Value. Klik <strong>Tambah University Value</strong> untuk menambahkan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Form Edit / Tambah */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {hasData ? "Edit University Value" : "Tambah University Value"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi / Daftar University Value
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  placeholder="Misal: Integritas, Inovasi, Inklusivitas, Keunggulan Akademis..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
