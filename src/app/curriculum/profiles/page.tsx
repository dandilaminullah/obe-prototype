"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ProfilesPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCplModalOpen, setIsCplModalOpen] = useState(false);
  
  const [profileForm, setProfileForm] = useState({ id: "", nama: "", deskripsi: "", prodi_id: "" });
  const [cplForm, setCplForm] = useState<{id: string, kode: string, kategori: string, deskripsi: string, assigned_profils: string[]}>({ id: "", kode: "", kategori: "Sikap", deskripsi: "", assigned_profils: [] });
  const [cplProfils, setCplProfils] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodiRes, profileRes, cplRes, cplProfilRes] = await Promise.all([
      supabase.from("prodi").select("*").order("created_at"),
      supabase.from("profil_lulusan").select("*, prodi(nama)").order("created_at"),
      supabase.from("cpl").select("*").order("kode"),
      supabase.from("profil_lulusan_cpl").select("*")
    ]);
    if (prodiRes.data) setProdis(prodiRes.data);
    if (profileRes.data) setProfiles(profileRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (cplProfilRes.data) setCplProfils(cplProfilRes.data);
    setLoading(false);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.id) {
      await supabase.from("profil_lulusan").update({ nama: profileForm.nama, deskripsi: profileForm.deskripsi, prodi_id: profileForm.prodi_id }).eq("id", profileForm.id);
    } else {
      await supabase.from("profil_lulusan").insert([{ nama: profileForm.nama, deskripsi: profileForm.deskripsi, prodi_id: profileForm.prodi_id }]);
    }
    setIsProfileModalOpen(false);
    fetchData();
  };

  const handleProfileDelete = async (id: string) => {
    if(confirm("Hapus Profil Lulusan ini?")) {
      await supabase.from("profil_lulusan").delete().eq("id", id);
      fetchData();
    }
  };

  const handleCplSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cplForm.id) {
      await supabase.from("cpl").update({ kode: cplForm.kode, kategori: cplForm.kategori, deskripsi: cplForm.deskripsi }).eq("id", cplForm.id);
      await supabase.from("profil_lulusan_cpl").delete().eq("cpl_id", cplForm.id);
      if (cplForm.assigned_profils.length > 0) {
        await supabase.from("profil_lulusan_cpl").insert(cplForm.assigned_profils.map(pid => ({ cpl_id: cplForm.id, profil_id: pid })));
      }
    } else {
      const { data } = await supabase.from("cpl").insert([{ kode: cplForm.kode, kategori: cplForm.kategori, deskripsi: cplForm.deskripsi }]).select("id").single();
      if (data && cplForm.assigned_profils.length > 0) {
        await supabase.from("profil_lulusan_cpl").insert(cplForm.assigned_profils.map(pid => ({ cpl_id: data.id, profil_id: pid })));
      }
    }
    setIsCplModalOpen(false);
    fetchData();
  };

  const handleCplDelete = async (id: string) => {
    if(confirm("Hapus CPL ini?")) {
      await supabase.from("cpl").delete().eq("id", id);
      fetchData();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Kurikulum (OBC)</h1>
        <p className="text-gray-500">Manajemen Profil Lulusan (PEO) dan Capaian Pembelajaran Lulusan (CPL).</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
            <CardTitle>Profil Lulusan (PEO)</CardTitle>
            <Button onClick={() => { setProfileForm({ id: "", nama: "", deskripsi: "", prodi_id: prodis[0]?.id || "" }); setIsProfileModalOpen(true); }} size="sm">
              <Plus className="w-4 h-4 mr-2" /> Tambah Profil
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Profil</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Prodi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nama}</TableCell>
                    <TableCell className="text-gray-500">{p.deskripsi}</TableCell>
                    <TableCell>{p.prodi?.nama}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => { setProfileForm(p); setIsProfileModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleProfileDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {profiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500">Belum ada data Profil Lulusan</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
            <CardTitle>Capaian Pembelajaran Lulusan (CPL)</CardTitle>
            <Button onClick={() => { setCplForm({ id: "", kode: "", kategori: "Sikap", deskripsi: "", assigned_profils: [] }); setIsCplModalOpen(true); }} size="sm">
              <Plus className="w-4 h-4 mr-2" /> Tambah CPL
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Profil Terkait</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cpls.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.kode}</TableCell>
                    <TableCell><span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded uppercase">{c.kategori || "Umum"}</span></TableCell>
                    <TableCell className="text-gray-500">{c.deskripsi}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cplProfils.filter(m => m.cpl_id === c.id).map(m => {
                          const p = profiles.find(pr => pr.id === m.profil_id);
                          return p ? (
                            <span key={m.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {p.nama}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => { 
                        const assigned = cplProfils.filter(m => m.cpl_id === c.id).map(m => m.profil_id);
                        setCplForm({id: c.id, kode: c.kode, kategori: c.kategori || "Sikap", deskripsi: c.deskripsi, assigned_profils: assigned}); 
                        setIsCplModalOpen(true); 
                      }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleCplDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {cpls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500">Belum ada data CPL</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{profileForm.id ? "Edit Profil Lulusan" : "Tambah Profil Lulusan"}</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Program Studi</label>
                <select required className="w-full p-2 border rounded bg-white" value={profileForm.prodi_id} onChange={e => setProfileForm({...profileForm, prodi_id: e.target.value})}>
                  <option value="" disabled>Pilih Prodi</option>
                  {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Profil (PEO)</label>
                <input required type="text" className="w-full p-2 border rounded" value={profileForm.nama} onChange={e => setProfileForm({...profileForm, nama: e.target.value})} placeholder="Contoh: Mobile Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Profil</label>
                <textarea required className="w-full p-2 border rounded" value={profileForm.deskripsi} onChange={e => setProfileForm({...profileForm, deskripsi: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsProfileModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCplModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{cplForm.id ? "Edit CPL" : "Tambah CPL"}</h2>
            <form onSubmit={handleCplSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Profil Lulusan (PEO)</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-slate-50 space-y-2">
                  {profiles.map(p => (
                    <label key={p.id} className="flex items-center space-x-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={cplForm.assigned_profils.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCplForm({ ...cplForm, assigned_profils: [...cplForm.assigned_profils, p.id] });
                          } else {
                            setCplForm({ ...cplForm, assigned_profils: cplForm.assigned_profils.filter(id => id !== p.id) });
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
                <label className="block text-sm font-medium mb-1">Kode CPL</label>
                <input required type="text" className="w-full p-2 border rounded" value={cplForm.kode} onChange={e => setCplForm({...cplForm, kode: e.target.value})} placeholder="Contoh: CPL-01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select required className="w-full p-2 border rounded bg-white" value={cplForm.kategori} onChange={e => setCplForm({...cplForm, kategori: e.target.value})}>
                  <option value="Sikap">Sikap</option>
                  <option value="Pengetahuan">Pengetahuan</option>
                  <option value="Keterampilan Umum">Keterampilan Umum</option>
                  <option value="Keterampilan Khusus">Keterampilan Khusus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi CPL</label>
                <textarea required className="w-full p-2 border rounded" value={cplForm.deskripsi} onChange={e => setCplForm({...cplForm, deskripsi: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsCplModalOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
