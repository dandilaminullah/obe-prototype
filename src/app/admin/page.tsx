"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Target, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";

export default function AdminDashboardPage() {
  const [prodis, setProdis] = useState<any[]>([]);
  const [selectedProdi, setSelectedProdi] = useState<string>("");
  const [cpls, setCpls] = useState<any[]>([]);
  const [cplAverages, setCplAverages] = useState<any[]>([]);
  const [threshold, setThreshold] = useState<number>(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdi();
  }, []);

  useEffect(() => {
    if (selectedProdi) {
      fetchDashboardData(selectedProdi);
    }
  }, [selectedProdi]);

  const fetchProdi = async () => {
    const { data } = await supabase.from("prodi").select("*").order("nama");
    if (data && data.length > 0) {
      setProdis(data);
      setSelectedProdi(data[0].id);
    }
  };

  const fetchDashboardData = async (prodiId: string) => {
    setLoading(true);
    
    const prodi = prodis.find(p => p.id === prodiId);
    if (prodi) setThreshold(prodi.batas_kelulusan_cpl || 60);

    // 1. Fetch CPLs
    const { data: cplData } = await supabase.from("cpl").select("*");
    setCpls(cplData || []);

    // 2. Mocking average CPL scores calculated on the frontend
    // In a real scenario, this would aggregate `nilai` from students
    // related to sub-cpmk -> cpmk -> mk -> cpl.
    if (cplData) {
      const mockAverages = cplData.map(cpl => {
        // Generating random mock average between 40 and 90 for demo
        const avg = Math.floor(Math.random() * (90 - 40 + 1)) + 40;
        return {
          id: cpl.id,
          kode: cpl.kode,
          deskripsi: cpl.deskripsi,
          averageScore: avg,
          isPassed: avg >= (prodi?.batas_kelulusan_cpl || 60)
        };
      });
      setCplAverages(mockAverages);
    }

    setLoading(false);
  };

  const passedCPLs = cplAverages.filter(c => c.isPassed).length;
  const failedCPLs = cplAverages.filter(c => !c.isPassed).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin Prodi</h1>
          <p className="text-slate-500">Monitoring Agregat Capaian Pembelajaran</p>
        </div>
        <div>
          <select 
            className="p-2 border rounded-md shadow-sm bg-white min-w-[200px]"
            value={selectedProdi}
            onChange={(e) => setSelectedProdi(e.target.value)}
          >
            {prodis.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Threshold Kelulusan</p>
                  <h3 className="text-2xl font-bold text-slate-800">{threshold}%</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">CPL Terpenuhi</p>
                  <h3 className="text-2xl font-bold text-green-600">{passedCPLs} <span className="text-sm text-slate-400">/ {cplAverages.length}</span></h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">CPL Di Bawah Threshold</p>
                  <h3 className="text-2xl font-bold text-red-600">{failedCPLs}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agregat Ketercapaian CPL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cplAverages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="kode" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <ReferenceLine y={threshold} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold', fill: 'red', fontSize: 12 }} />
                    <Bar dataKey="averageScore" name="Rata-rata Nilai" radius={[4, 4, 0, 0]}>
                      {
                        cplAverages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isPassed ? "#10b981" : "#ef4444"} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

