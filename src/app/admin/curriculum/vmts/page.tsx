"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import { Plus, Pencil, BookOpen, Target, Building, CheckCircle2 } from "lucide-react";

export default function VMTSPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Active modal state: 'keilmuan' | 'prodi' | 'pt' | null
  const [activeModal, setActiveModal] = useState<"keilmuan" | "prodi" | "pt" | null>(null);

  // Data states
  const [vmtsData, setVmtsData] = useState<any>({
    visi_keilmuan: "",
    visi: "",
    misi: "",
    tujuan: "",
    strategi: "",
    visi_pt: "",
    misi_pt: "",
    tujuan_pt: "",
    strategi_pt: "",
    university_value: "",
  });

  // Modal form states
  const [modalForm, setModalForm] = useState<any>({});

  useEffect(() => {
    fetchKurikulums();
  }, [role, prodiId]);

  useEffect(() => {
    if (selectedKurikulum) {
      const kur = kurikulums.find((k) => k.id === selectedKurikulum);
      if (kur) {
        setVmtsData({
          visi_keilmuan: kur.visi_keilmuan || "",
          visi: kur.visi || "",
          misi: kur.misi || "",
          tujuan: kur.tujuan || "",
          strategi: kur.strategi || "",
          visi_pt: kur.visi_pt || "",
          misi_pt: kur.misi_pt || "",
          tujuan_pt: kur.tujuan_pt || "",
          strategi_pt: kur.strategi_pt || "",
          university_value: kur.university_value || "",
        });
      }
    }
  }, [selectedKurikulum, kurikulums]);

  const fetchKurikulums = async () => {
    setLoading(true);
    let query = supabase
      .from("kurikulum")
      .select("*, prodi(nama)")
      .order("tahun_berlaku", { ascending: false });

    if (role === "ADMIN" && prodiId) {
      query = query.eq("prodi_id", prodiId);
    }

    const { data } = await query;
    if (data && data.length > 0) {
      setKurikulums(data);
      setSelectedKurikulum(data[0].id);
    } else {
      setKurikulums([]);
      setSelectedKurikulum("");
    }
    setLoading(false);
  };

  const openEditModal = (type: "keilmuan" | "prodi" | "pt") => {
    if (type === "keilmuan") {
      setModalForm({ visi_keilmuan: vmtsData.visi_keilmuan });
    } else if (type === "prodi") {
      setModalForm({
        visi: vmtsData.visi,
        misi: vmtsData.misi,
        tujuan: vmtsData.tujuan,
        strategi: vmtsData.strategi,
      });
    } else if (type === "pt") {
      setModalForm({
        visi_pt: vmtsData.visi_pt,
        misi_pt: vmtsData.misi_pt,
        tujuan_pt: vmtsData.tujuan_pt,
        strategi_pt: vmtsData.strategi_pt,
        university_value: vmtsData.university_value,
      });
    }
    setActiveModal(type);
  };

  const handleSaveModal = async () => {
    if (!selectedKurikulum) {
      alert("Silakan pilih kurikulum terlebih dahulu.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("kurikulum")
      .update(modalForm)
      .eq("id", selectedKurikulum);

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan data: " + error.message);
    } else {
      alert("Data berhasil disimpan!");
      setVmtsData({ ...vmtsData, ...modalForm });
      setActiveModal(null);
      fetchKurikulums();
    }
  };

  // Helper boolean checks if data exists for each card
  const hasKeilmuanData = Boolean(vmtsData.visi_keilmuan?.trim());
  const hasProdiData = Boolean(
    vmtsData.visi?.trim() ||
    vmtsData.misi?.trim() ||
    vmtsData.tujuan?.trim() ||
    vmtsData.strategi?.trim()
  );
  const hasPtData = Boolean(
    vmtsData.visi_pt?.trim() ||
    vmtsData.misi_pt?.trim() ||
    vmtsData.tujuan_pt?.trim() ||
    vmtsData.strategi_pt?.trim() ||
    vmtsData.university_value?.trim()
  );

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading data VMTS...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Visi, Misi, Tujuan & Strategi (VMTS)
          </h1>
          <p className="text-slate-500">
            Pengelolaan VMTS Program Studi & Perguruan Tinggi
          </p>
        </div>
        {kurikulums.length > 0 && (
          <div>
            <select
              className="p-2 border rounded-md shadow-sm bg-white min-w-[220px] text-sm font-medium"
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
        )}
      </div>

      {kurikulums.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center text-amber-800">
          Belum ada kurikulum yang terdaftar. Silakan buat kurikulum terlebih dahulu pada menu <strong>Manajemen Kurikulum</strong>.
        </div>
      ) : (
        <div className="space-y-6">
          {/* CARD 1: Visi Keilmuan Prodi */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 py-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Visi Keilmuan Prodi
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Visi spesifik keilmuan dan spesialisasi akademis Program Studi
                  </p>
                </div>
              </div>
              <Button
                variant={hasKeilmuanData ? "secondary" : "primary"}
                size="sm"
                onClick={() => openEditModal("keilmuan")}
              >
                {hasKeilmuanData ? (
                  <>
                    <Pencil className="w-4 h-4 mr-1.5" /> Edit Data
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Data
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {hasKeilmuanData ? (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-1">
                    Visi Keilmuan
                  </h4>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {vmtsData.visi_keilmuan}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  Belum ada data Visi Keilmuan Prodi. Klik tombol <strong>Tambah Data</strong> untuk menambahkan.
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 2: Visi Misi Tujuan Strategi Prodi */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 py-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Visi, Misi, Tujuan & Strategi Prodi
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Rumusan VMTS resmi Program Studi
                  </p>
                </div>
              </div>
              <Button
                variant={hasProdiData ? "secondary" : "primary"}
                size="sm"
                onClick={() => openEditModal("prodi")}
              >
                {hasProdiData ? (
                  <>
                    <Pencil className="w-4 h-4 mr-1.5" /> Edit Data
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Data
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {hasProdiData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-semibold uppercase text-purple-600 mb-1">
                      Visi Prodi
                    </h4>
                    <p className="text-slate-700 whitespace-pre-line text-sm">
                      {vmtsData.visi || "-"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-semibold uppercase text-purple-600 mb-1">
                      Misi Prodi
                    </h4>
                    <p className="text-slate-700 whitespace-pre-line text-sm">
                      {vmtsData.misi || "-"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-semibold uppercase text-purple-600 mb-1">
                      Tujuan Prodi
                    </h4>
                    <p className="text-slate-700 whitespace-pre-line text-sm">
                      {vmtsData.tujuan || "-"}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-semibold uppercase text-purple-600 mb-1">
                      Strategi Prodi
                    </h4>
                    <p className="text-slate-700 whitespace-pre-line text-sm">
                      {vmtsData.strategi || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  Belum ada data VMTS Prodi. Klik tombol <strong>Tambah Data</strong> untuk menambahkan.
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 3: Visi Misi Tujuan Strategi Perguruan Tinggi */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 py-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Visi, Misi, Tujuan & Strategi Perguruan Tinggi
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Penyelarasan VMTS Perguruan Tinggi & Nilai-Nilai Institusi (University Value)
                  </p>
                </div>
              </div>
              <Button
                variant={hasPtData ? "secondary" : "primary"}
                size="sm"
                onClick={() => openEditModal("pt")}
              >
                {hasPtData ? (
                  <>
                    <Pencil className="w-4 h-4 mr-1.5" /> Edit Data
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Data
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {hasPtData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                        Visi Perguruan Tinggi
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm">
                        {vmtsData.visi_pt || "-"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                        Misi Perguruan Tinggi
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm">
                        {vmtsData.misi_pt || "-"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                        Tujuan Perguruan Tinggi
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm">
                        {vmtsData.tujuan_pt || "-"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">
                        Strategi Perguruan Tinggi
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line text-sm">
                        {vmtsData.strategi_pt || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="text-xs font-semibold uppercase text-emerald-700 mb-1 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Nilai-Nilai Perguruan Tinggi (University Value)
                    </h4>
                    <p className="text-slate-700 whitespace-pre-line text-sm">
                      {vmtsData.university_value || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  Belum ada data VMTS Perguruan Tinggi. Klik tombol <strong>Tambah Data</strong> untuk menambahkan.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL EDIT / TAMBAH DATA */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {activeModal === "keilmuan" && "Kelola Visi Keilmuan Prodi"}
                {activeModal === "prodi" && "Kelola VMTS Program Studi"}
                {activeModal === "pt" && "Kelola VMTS Perguruan Tinggi"}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Form Card 1: Keilmuan */}
              {activeModal === "keilmuan" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Visi Keilmuan Prodi
                  </label>
                  <textarea
                    rows={5}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={modalForm.visi_keilmuan || ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, visi_keilmuan: e.target.value })
                    }
                    placeholder="Masukkan deskripsi visi keilmuan dan keunggulan akademis spesifik program studi..."
                  />
                </div>
              )}

              {/* Form Card 2: VMTS Prodi */}
              {activeModal === "prodi" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Visi Prodi
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.visi || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, visi: e.target.value })
                      }
                      placeholder="Visi Program Studi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Misi Prodi
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.misi || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, misi: e.target.value })
                      }
                      placeholder="Misi Program Studi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tujuan Prodi
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.tujuan || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, tujuan: e.target.value })
                      }
                      placeholder="Tujuan Program Studi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Strategi Prodi
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.strategi || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, strategi: e.target.value })
                      }
                      placeholder="Strategi Pencapaian Program Studi..."
                    />
                  </div>
                </>
              )}

              {/* Form Card 3: VMTS PT */}
              {activeModal === "pt" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Visi Perguruan Tinggi
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.visi_pt || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, visi_pt: e.target.value })
                      }
                      placeholder="Visi Perguruan Tinggi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Misi Perguruan Tinggi
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.misi_pt || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, misi_pt: e.target.value })
                      }
                      placeholder="Misi Perguruan Tinggi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tujuan Perguruan Tinggi
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.tujuan_pt || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, tujuan_pt: e.target.value })
                      }
                      placeholder="Tujuan Perguruan Tinggi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Strategi Perguruan Tinggi
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.strategi_pt || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, strategi_pt: e.target.value })
                      }
                      placeholder="Strategi Perguruan Tinggi..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nilai-Nilai Perguruan Tinggi (University Value)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                      value={modalForm.university_value || ""}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, university_value: e.target.value })
                      }
                      placeholder="Nilai-nilai perguruan tinggi (misal: Integritas, Inovasi, Inklusivitas)..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-xl">
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Batal
              </Button>
              <Button onClick={handleSaveModal} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
