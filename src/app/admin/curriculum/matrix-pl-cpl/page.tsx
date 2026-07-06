"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Check, Grid, Layers, Target, UserCheck, Info } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function MatrixPlCplPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");

  const [profiles, setProfiles] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [cplProfils, setCplProfils] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingCell, setUpdatingCell] = useState<{ cplId: string; profilId: string } | null>(null);

  useEffect(() => {
    fetchKurikulums();
  }, [role, prodiId]);

  useEffect(() => {
    if (selectedKurikulum) {
      fetchMatrixData(selectedKurikulum);
    }
  }, [selectedKurikulum]);

  const fetchKurikulums = async () => {
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
      setProfiles([]);
      setCpls([]);
      setCplProfils([]);
      setLoading(false);
    }
  };

  const fetchMatrixData = async (kurikulumId: string) => {
    setLoading(true);
    const [profRes, cplRes, mapRes] = await Promise.all([
      supabase.from("profil_lulusan").select("*").eq("kurikulum_id", kurikulumId).order("created_at"),
      supabase.from("cpl").select("*").eq("kurikulum_id", kurikulumId).order("kode"),
      supabase.from("profil_lulusan_cpl").select("*"),
    ]);

    if (profRes.data) setProfiles(profRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (mapRes.data) setCplProfils(mapRes.data);
    setLoading(false);
  };

  const toggleMapping = async (cplId: string, profilId: string, isAssigned: boolean) => {
    setUpdatingCell({ cplId, profilId });
    try {
      if (isAssigned) {
        await supabase
          .from("profil_lulusan_cpl")
          .delete()
          .match({ cpl_id: cplId, profil_id: profilId });
        setCplProfils((prev) => prev.filter((m) => !(m.cpl_id === cplId && m.profil_id === profilId)));
      } else {
        await supabase.from("profil_lulusan_cpl").insert([{ cpl_id: cplId, profil_id: profilId }]);
        setCplProfils((prev) => [...prev, { cpl_id: cplId, profil_id: profilId }]);
      }
    } catch (err) {
      console.error("Gagal memperbarui pemetaan:", err);
    } finally {
      setUpdatingCell(null);
    }
  };

  // Stats calculation
  const totalProfiles = profiles.length;
  const totalCpls = cpls.length;
  const totalMappings = cplProfils.filter(
    (m) => cpls.some((c) => c.id === m.cpl_id) && profiles.some((p) => p.id === m.profil_id)
  ).length;

  const cplsWithProfiles = cpls.filter((c) =>
    cplProfils.some((m) => m.cpl_id === c.id && profiles.some((p) => p.id === m.profil_id))
  ).length;

  const coveragePercent = totalCpls > 0 ? Math.round((cplsWithProfiles / totalCpls) * 100) : 0;

  if (loading && kurikulums.length === 0) {
    return <div className="p-8 text-center text-slate-500">Memuat data Matriks PL & CPL...</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Grid className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-slate-800">Matriks Pemetaan Profil Lulusan & CPL</h1>
          </div>
          <p className="text-slate-500 mt-1">
            Visualisasi dan pengaturan relasi langsung antara Profil Lulusan (PEO) dan Capaian Pembelajaran Lulusan (CPL).
          </p>
        </div>

        {/* Kurikulum Selector */}
        <div className="flex items-center space-x-2 bg-white p-2 border rounded-lg shadow-sm">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Kurikulum:</span>
          <select
            className="p-1.5 border-0 text-sm font-semibold text-slate-800 bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Profil Lulusan</p>
              <h3 className="text-xl font-bold text-slate-800">{totalProfiles}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Total CPL</p>
              <h3 className="text-xl font-bold text-slate-800">{totalCpls}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Total Relasi Terpetakan</p>
              <h3 className="text-xl font-bold text-slate-800">{totalMappings}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">CPL Terpetakan</p>
              <h3 className="text-xl font-bold text-slate-800">
                {cplsWithProfiles} / {totalCpls} ({coveragePercent}%)
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guide Notice */}
      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg text-sm">
        <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />
        <span>
          Klik pada sel matriks untuk menambah atau menghapus keterhubungan antara <strong>Profil Lulusan</strong> dan{" "}
          <strong>CPL</strong>. Perubahan akan tersimpan secara otomatis.
        </span>
      </div>

      {/* Matrix Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-800">
            Matriks Relasi CPL vs Profil Lulusan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat matriks...</div>
          ) : profiles.length === 0 || cpls.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-base font-semibold text-slate-700 mb-1">Data Belum Lengkap</p>
              <p className="text-sm">
                Pastikan Anda telah mengisi data <strong>Profil Lulusan</strong> dan <strong>CPL</strong> untuk kurikulum ini.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="w-80 min-w-[280px] sticky left-0 bg-slate-100 z-20 shadow-[1px_0_0_0_#e2e8f0]">
                    Kode & Deskripsi CPL
                  </TableHead>
                  {profiles.map((p) => (
                    <TableHead key={p.id} className="text-center min-w-[140px] px-2 py-3">
                      <div className="font-bold text-slate-800 text-sm">{p.nama}</div>
                      <div className="text-[11px] font-normal text-slate-500 line-clamp-1" title={p.deskripsi}>
                        {p.deskripsi}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {cpls.map((cpl) => {
                  const mappedProfilesForCpl = cplProfils.filter((m) => m.cpl_id === cpl.id).map((m) => m.profil_id);

                  return (
                    <TableRow key={cpl.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e2e8f0] py-3">
                        <div className="font-bold text-primary text-sm flex items-center space-x-2">
                          <span>{cpl.kode}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 line-clamp-2" title={cpl.deskripsi}>
                          {cpl.deskripsi}
                        </div>
                      </TableCell>

                      {profiles.map((profil) => {
                        const isAssigned = mappedProfilesForCpl.includes(profil.id);
                        const isUpdating =
                          updatingCell?.cplId === cpl.id && updatingCell?.profilId === profil.id;

                        return (
                          <TableCell key={profil.id} className="text-center p-2 border-l border-slate-100">
                            <button
                              disabled={isUpdating}
                              onClick={() => toggleMapping(cpl.id, profil.id, isAssigned)}
                              title={`${isAssigned ? "Hapus" : "Hubungkan"} ${cpl.kode} dengan ${profil.nama}`}
                              className={`w-full h-12 flex items-center justify-center rounded-lg transition-all border ${
                                isAssigned
                                  ? "bg-primary text-white border-primary shadow-sm hover:bg-primary/90"
                                  : "bg-slate-50 border-slate-200 text-transparent hover:bg-slate-200 hover:text-slate-400"
                              }`}
                            >
                              {isUpdating ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              )}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
