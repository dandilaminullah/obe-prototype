"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Target, Pencil, Plus, CheckCircle2 } from "lucide-react";

export default function SuperAdminVMTSPTPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [vmtsPt, setVmtsPt] = useState({
    visi_pt: "",
    misi_pt: "",
    tujuan_pt: "",
    strategi_pt: "",
  });

  const [formData, setFormData] = useState({
    visi_pt: "",
    misi_pt: "",
    tujuan_pt: "",
    strategi_pt: "",
  });

  useEffect(() => {
    fetchVMTSPT();
  }, []);

  const fetchVMTSPT = async () => {
    setLoading(true);
    // Fetch VMTS PT data from kurikulum records
    const { data } = await supabase.from("kurikulum").select("visi_pt, misi_pt, tujuan_pt, strategi_pt").limit(1);

    if (data && data.length > 0) {
      setVmtsPt({
        visi_pt: data[0].visi_pt || "",
        misi_pt: data[0].misi_pt || "",
        tujuan_pt: data[0].tujuan_pt || "",
        strategi_pt: data[0].strategi_pt || "",
      });
    }
    setLoading(false);
  };

  const openModal = () => {
    setFormData({ ...vmtsPt });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Update all kurikulum rows with the PT VMTS
    const { error } = await supabase
      .from("kurikulum")
      .update({
        visi_pt: formData.visi_pt,
        misi_pt: formData.misi_pt,
        tujuan_pt: formData.tujuan_pt,
        strategi_pt: formData.strategi_pt,
      })
      .neq("id", "00000000-0000-0000-0000-000000000000"); // update all

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan data VMTS PT: " + error.message);
    } else {
      alert("VMTS Perguruan Tinggi berhasil disimpan!");
      setVmtsPt(formData);
      setIsModalOpen(false);
    }
  };

  const hasData = Boolean(
    vmtsPt.visi_pt?.trim() ||
    vmtsPt.misi_pt?.trim() ||
    vmtsPt.tujuan_pt?.trim() ||
    vmtsPt.strategi_pt?.trim()
  );

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading VMTS Perguruan Tinggi...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">VMTS Perguruan Tinggi</h1>
          <p className="text-slate-500">Master Data Visi, Misi, Tujuan & Strategi Perguruan Tinggi</p>
        </div>
        <Button onClick={openModal}>
          {hasData ? (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit VMTS PT
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Tambah VMTS PT
            </>
          )}
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center space-x-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Visi, Misi, Tujuan & Strategi Perguruan Tinggi
            </CardTitle>
            <p className="text-xs text-slate-500">Rumusan VMTS resmi institusi Perguruan Tinggi</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {hasData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                  Visi Perguruan Tinggi
                </h4>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                  {vmtsPt.visi_pt || "-"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                  Misi Perguruan Tinggi
                </h4>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                  {vmtsPt.misi_pt || "-"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                  Tujuan Perguruan Tinggi
                </h4>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                  {vmtsPt.tujuan_pt || "-"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                  Strategi Perguruan Tinggi
                </h4>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                  {vmtsPt.strategi_pt || "-"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
              Belum ada data VMTS Perguruan Tinggi. Klik <strong>Tambah VMTS PT</strong> untuk menambahkan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Form Edit / Tambah */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {hasData ? "Edit VMTS Perguruan Tinggi" : "Tambah VMTS Perguruan Tinggi"}
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
                  Visi Perguruan Tinggi
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                  value={formData.visi_pt}
                  onChange={(e) => setFormData({ ...formData, visi_pt: e.target.value })}
                  placeholder="Visi Perguruan Tinggi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Misi Perguruan Tinggi
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                  value={formData.misi_pt}
                  onChange={(e) => setFormData({ ...formData, misi_pt: e.target.value })}
                  placeholder="Misi Perguruan Tinggi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tujuan Perguruan Tinggi
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                  value={formData.tujuan_pt}
                  onChange={(e) => setFormData({ ...formData, tujuan_pt: e.target.value })}
                  placeholder="Tujuan Perguruan Tinggi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Strategi Perguruan Tinggi
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                  value={formData.strategi_pt}
                  onChange={(e) => setFormData({ ...formData, strategi_pt: e.target.value })}
                  placeholder="Strategi Perguruan Tinggi..."
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
