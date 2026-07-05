"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function CurriculumPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKurikulums();
  }, [role, prodiId]);

  const fetchKurikulums = async () => {
    setLoading(true);
    let query = supabase
      .from("kurikulum")
      .select("*, prodi(nama)")
      .order("tahun_berlaku", { ascending: false });

    // If Admin Prodi, only show their own prodi
    if (role === "ADMIN" && prodiId) {
      query = query.eq("prodi_id", prodiId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setKurikulums(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus kurikulum ini?")) {
      await supabase.from("kurikulum").delete().eq("id", id);
      fetchKurikulums();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Kurikulum</h1>
          <p className="text-slate-500">Kelola daftar kurikulum yang ada</p>
        </div>
        {(role === "ADMIN" || role === "SUPERADMIN") && (
          <Link href="/admin/curriculum/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kurikulum
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 font-semibold text-sm text-slate-600">Nama Kurikulum</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Program Studi</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Tahun Berlaku</th>
              <th className="p-4 font-semibold text-sm text-slate-600">Ketua Tim</th>
              <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">Loading...</td>
              </tr>
            ) : kurikulums.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">Belum ada data kurikulum.</td>
              </tr>
            ) : (
              kurikulums.map((kur) => (
                <tr key={kur.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-700 font-medium">{kur.nama}</td>
                  <td className="p-4 text-sm text-slate-700">{kur.prodi?.nama}</td>
                  <td className="p-4 text-sm text-slate-700">{kur.tahun_berlaku}</td>
                  <td className="p-4 text-sm text-slate-700">{kur.ketua_tim || "-"}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/curriculum/edit/${kur.id}`}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(kur.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
