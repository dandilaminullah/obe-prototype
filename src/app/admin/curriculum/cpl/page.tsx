"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Target, Filter, Search } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function CplPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [cplProfils, setCplProfils] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isCplModalOpen, setIsCplModalOpen] = useState(false);
  const [cplForm, setCplForm] = useState<{
    id: string;
    kode: string;
    deskripsi: string;
    assigned_profils: string[];
    kurikulum_id: string;
  }>({
    id: "",
    kode: "",
    deskripsi: "",
    assigned_profils: [],
    kurikulum_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [role, prodiId]);

  const fetchData = async () => {
    setLoading(true);
    let kurQuery = supabase.from("kurikulum").select("*, prodi(nama)").order("tahun_berlaku", { ascending: false });
    if (role === "ADMIN" && prodiId) {
      kurQuery = kurQuery.eq("prodi_id", prodiId);
    }

    const [kurRes, profileRes, cplRes, cplProfilRes] = await Promise.all([
      kurQuery,
      supabase.from("profil_lulusan").select("*, kurikulum(nama, prodi(nama))").order("created_at"),
      supabase.from("cpl").select("*, kurikulum(nama, prodi(nama))").order("kode"),
      supabase.from("profil_lulusan_cpl").select("*"),
    ]);
    if (kurRes.data) setKurikulums(kurRes.data);
    if (profileRes.data) setProfiles(profileRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (cplProfilRes.data) setCplProfils(cplProfilRes.data);
    setLoading(false);
  };

  const handleCplSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cplForm.kurikulum_id) {
      alert("Silakan pilih kurikulum.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (cplForm.id) {
        // Update existing CPL
        await supabase
          .from("cpl")
          .update({
            kode: cplForm.kode,
            deskripsi: cplForm.deskripsi,
            kurikulum_id: cplForm.kurikulum_id,
          })
          .eq("id", cplForm.id);

        // Delete old profil mapping and insert new
        await supabase.from("profil_lulusan_cpl").delete().eq("cpl_id", cplForm.id);
        if (cplForm.assigned_profils.length > 0) {
          await supabase
            .from("profil_lulusan_cpl")
            .insert(cplForm.assigned_profils.map((pid) => ({ cpl_id: cplForm.id, profil_id: pid })));
        }
      } else {
        // Insert new CPL
        const { data, error } = await supabase
          .from("cpl")
          .insert([
            {
              kode: cplForm.kode,
              deskripsi: cplForm.deskripsi,
              kurikulum_id: cplForm.kurikulum_id,
            },
          ])
          .select("id")
          .single();

        if (error) throw error;

        if (data && cplForm.assigned_profils.length > 0) {
          await supabase
            .from("profil_lulusan_cpl")
            .insert(cplForm.assigned_profils.map((pid) => ({ cpl_id: data.id, profil_id: pid })));
        }
      }
      setIsCplModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data CPL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCplDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus CPL ini?")) {
      await supabase.from("cpl").delete().eq("id", id);
      fetchData();
    }
  };

  const filteredCpls = cpls.filter((c) => {
    const isBelongsToActiveProdi = role === "ADMIN" && prodiId
      ? kurikulums.some((k) => k.id === c.kurikulum_id)
      : true;
    const matchesKurikulum = selectedKurikulum === "all" || c.kurikulum_id === selectedKurikulum;
    const matchesSearch =
      c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.kurikulum?.nama && c.kurikulum.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    return isBelongsToActiveProdi && matchesKurikulum && matchesSearch;
  });

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data CPL...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Capaian Pembelajaran Lulusan (CPL)</h1>
          </div>
          <p className="text-slate-500 mt-1">
            Pengelolaan Standar Capaian Pembelajaran Lulusan per Kurikulum.
          </p>
        </div>
        <Button
          onClick={() => {
            setCplForm({
              id: "",
              kode: "",
              deskripsi: "",
              assigned_profils: [],
              kurikulum_id: kurikulums[0]?.id || "",
            });
            setIsCplModalOpen(true);
          }}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah CPL
        </Button>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter Kurikulum:</span>
              <select
                className="p-2 border rounded-md shadow-sm bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedKurikulum}
                onChange={(e) => setSelectedKurikulum(e.target.value)}
              >
                <option value="all">Semua Kurikulum</option>
                {kurikulums.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama} ({k.prodi?.nama})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode CPL / deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-800">
            Daftar CPL ({filteredCpls.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-32">Kode</TableHead>
                <TableHead>Deskripsi CPL</TableHead>
                <TableHead className="w-36">Kurikulum</TableHead>
                <TableHead className="w-48">Profil Terkait</TableHead>
                <TableHead className="text-right w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCpls.map((c) => {
                const assignedProfIds = cplProfils.filter((m) => m.cpl_id === c.id).map((m) => m.profil_id);
                const assignedProfList = profiles.filter((p) => assignedProfIds.includes(p.id));

                return (
                  <TableRow key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-primary align-top">{c.kode}</TableCell>
                    <TableCell className="text-slate-600 align-top whitespace-pre-wrap">{c.deskripsi}</TableCell>
                    <TableCell className="align-top text-slate-700 text-xs font-medium">
                      <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 inline-block">
                        {c.kurikulum?.nama}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {assignedProfList.length > 0 ? (
                          assignedProfList.map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {p.nama}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum dipetakan</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const assigned = cplProfils.filter((m) => m.cpl_id === c.id).map((m) => m.profil_id);
                          setCplForm({
                            id: c.id,
                            kode: c.kode,
                            deskripsi: c.deskripsi,
                            assigned_profils: assigned,
                            kurikulum_id: c.kurikulum_id,
                          });
                          setIsCplModalOpen(true);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCplDelete(c.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredCpls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Tidak ada data CPL yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal CPL Form */}
      {isCplModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg my-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{cplForm.id ? "Edit CPL" : "Tambah CPL"}</h2>
            <form onSubmit={handleCplSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kurikulum *</label>
                <select
                  required
                  className="w-full p-2.5 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={cplForm.kurikulum_id}
                  onChange={(e) => setCplForm({ ...cplForm, kurikulum_id: e.target.value, assigned_profils: [] })}
                >
                  <option value="" disabled>
                    Pilih Kurikulum
                  </option>
                  {kurikulums.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.prodi?.nama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode CPL *</label>
                <input
                  required
                  type="text"
                  className="w-full p-2.5 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={cplForm.kode}
                  onChange={(e) => setCplForm({ ...cplForm, kode: e.target.value })}
                  placeholder="Contoh: CPL-01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Profil Lulusan (PEO)</label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-slate-50 space-y-2">
                  {profiles
                    .filter((p) => p.kurikulum_id === cplForm.kurikulum_id)
                    .map((p) => (
                      <label key={p.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                          checked={cplForm.assigned_profils.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCplForm({ ...cplForm, assigned_profils: [...cplForm.assigned_profils, p.id] });
                            } else {
                              setCplForm({
                                ...cplForm,
                                assigned_profils: cplForm.assigned_profils.filter((id) => id !== p.id),
                              });
                            }
                          }}
                        />
                        <span className="text-slate-800 font-medium">{p.nama}</span>
                      </label>
                    ))}
                  {profiles.filter((p) => p.kurikulum_id === cplForm.kurikulum_id).length === 0 && (
                    <span className="text-sm text-slate-400 italic">
                      Pilih kurikulum terlebih dahulu / Belum ada Profil di kurikulum ini
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi CPL *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-2.5 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={cplForm.deskripsi}
                  onChange={(e) => setCplForm({ ...cplForm, deskripsi: e.target.value })}
                  placeholder="Deskripsi kemampuan yang harus dimiliki lulusan..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsCplModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan CPL"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
