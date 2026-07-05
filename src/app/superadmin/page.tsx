"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Building2, BookOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  const [jurusanCount, setJurusanCount] = useState<number>(0);
  const [prodiCount, setProdiCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const [jurusanRes, prodiRes] = await Promise.all([
      supabase.from("jurusan").select("id", { count: "exact" }),
      supabase.from("prodi").select("id", { count: "exact" }),
    ]);

    if (jurusanRes.count !== null) setJurusanCount(jurusanRes.count);
    if (prodiRes.count !== null) setProdiCount(prodiRes.count);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Super Admin</h1>
          <p className="text-slate-500">Pengelolaan Master Data Perguruan Tinggi (Jurusan & Program Studi)</p>
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Total Jurusan</p>
                <h3 className="text-2xl font-bold text-slate-800">{jurusanCount}</h3>
                <Link href="/superadmin/master/jurusan" className="text-xs text-purple-600 hover:underline mt-1 inline-block">
                  Kelola Jurusan &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Total Program Studi</p>
                <h3 className="text-2xl font-bold text-slate-800">{prodiCount}</h3>
                <Link href="/superadmin/master/prodi" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                  Kelola Program Studi &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Otoritas Akses</p>
                <h3 className="text-base font-semibold text-emerald-700">Super Admin</h3>
                <p className="text-xs text-slate-400 mt-1">Akses Penuh Master Data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
