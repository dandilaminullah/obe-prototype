"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, UserCheck, Filter, Search } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ProfilesPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [cplProfils, setCplProfils] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ id: "", nama: "", deskripsi: "", kurikulum_id: "" });
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
      supabase.from("cpl").select("id, kode"),
      supabase.from("profil_lulusan_cpl").select("*")
    ]);
    if (kurRes.data) setKurikulums(kurRes.data);
    if (profileRes.data) setProfiles(profileRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (cplProfilRes.data) setCplProfils(cplProfilRes.data);
    setLoading(false);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.kurikulum_id) {
      alert("Silakan pilih kurikulum.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (profileForm.id) {
        await supabase
          .from("profil_lulusan")
          .update({ nama: profileForm.nama, deskripsi: profileForm.deskripsi, kurikulum_id: profileForm.kurikulum_id })
          .eq("id", profileForm.id);
      } else {
        await supabase
          .from("profil_lulusan")
          .insert([{ nama: profileForm.nama, deskripsi: profileForm.deskripsi, kurikulum_id: profileForm.kurikulum_id }]);
      }
      setIsProfileModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data profil lulusan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Profil Lulusan ini?")) {
      await supabase.from("profil_lulusan").delete().eq("id", id);
      fetchData();
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    const isBelongsToActiveProdi = role === "ADMIN" && prodiId
      ? kurikulums.some((k) => k.id === p.kurikulum_id)
      : true;
    const matchesKurikulum = selectedKurikulum === "all" || p.kurikulum_id === selectedKurikulum;
    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.kurikulum?.nama && p.kurikulum.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    return isBelongsToActiveProdi && matchesKurikulum && matchesSearch;
  });

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data Profil Lulusan...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Profil Lulusan (PEO)</h1>
          </div>
          <p className="text-slate-500 mt-1">
            Pengelolaan Profil Lulusan (Program Educational Objectives) per Kurikulum Program Studi.
          </p>
        </div>
        <Button
          onClick={() => {
            setProfileForm({ id: "", nama: "", deskripsi: "", kurikulum_id: kurikulums[0]?.id || "" });
            setIsProfileModalOpen(true);
          }}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Profil Lulusan
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
                placeholder="Cari nama profil / deskripsi..."
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
            Daftar Profil Lulusan ({filteredProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-64">Nama Profil (PEO)</TableHead>
                <TableHead>Deskripsi Profil</TableHead>
                <TableHead className="w-48">Kurikulum</TableHead>
                <TableHead className="w-48">CPL Terkait</TableHead>
                <TableHead className="text-right w-32">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((p) => {
                const mappedCplIds = cplProfils.filter((m) => m.profil_id === p.id).map((m) => m.cpl_id);
                const mappedCpls = cpls.filter((c) => mappedCplIds.includes(c.id));

                return (
                  <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-semibold text-slate-800 align-top">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span>{p.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 align-top whitespace-pre-wrap">{p.deskripsi}</TableCell>
                    <TableCell className="align-top text-slate-700 font-medium">
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-xs text-slate-700 inline-block">
                        {p.kurikulum?.nama} ({p.kurikulum?.prodi?.nama})
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {mappedCpls.length > 0 ? (
                          mappedCpls.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800"
                            >
                              {c.kode}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum ada CPL</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setProfileForm({ id: p.id, nama: p.nama, deskripsi: p.deskripsi, kurikulum_id: p.kurikulum_id });
                          setIsProfileModalOpen(true);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleProfileDelete(p.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProfiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Tidak ada data Profil Lulusan yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Profile Form */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {profileForm.id ? "Edit Profil Lulusan" : "Tambah Profil Lulusan"}
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kurikulum *</label>
                <select
                  required
                  className="w-full p-2.5 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={profileForm.kurikulum_id}
                  onChange={(e) => setProfileForm({ ...profileForm, kurikulum_id: e.target.value })}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Profil (PEO) *</label>
                <input
                  required
                  type="text"
                  className="w-full p-2.5 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={profileForm.nama}
                  onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                  placeholder="Contoh: Mobile & Cloud Application Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Profil *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2.5 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={profileForm.deskripsi}
                  onChange={(e) => setProfileForm({ ...profileForm, deskripsi: e.target.value })}
                  placeholder="Deskripsikan peran dan keahlian lulusan dalam 3-5 tahun setelah kelulusan..."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setIsProfileModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
