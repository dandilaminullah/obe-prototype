"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { History, Search } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    
    // Fetch logs
    const { data: logData } = await supabase.from("grading_audit_trail").select("*").order("created_at", { ascending: false });
    
    if (logData && logData.length > 0) {
      // Get all unique nilai_ids to fetch the related sub_cpmk and mahasiswa
      const nilaiIds = [...new Set(logData.map(l => l.nilai_id))];
      
      const { data: nilaiData } = await supabase.from("nilai").select("id, mahasiswa(nim, nama), sub_cpmk(kode)").in("id", nilaiIds);
      
      const enrichedLogs = logData.map(log => {
        const n = nilaiData?.find(x => x.id === log.nilai_id);
        return {
          ...log,
          mahasiswa: (n?.mahasiswa as any) || { nim: "-", nama: "Unknown" },
          sub_cpmk_kode: (n?.sub_cpmk as any)?.kode || "Unknown"
        };
      });
      setLogs(enrichedLogs);
    } else {
      setLogs([]);
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Grading Audit Trail (IKU 11)</h1>
          <p className="text-slate-500">Pemantauan riwayat perubahan nilai oleh Dosen untuk menjamin transparansi.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-slate-800">
              <History className="w-5 h-5 mr-2 text-primary" /> Log Perubahan Nilai
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Cari log..." className="pl-9 p-2 border border-slate-300 rounded-md text-sm w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Sub-CPMK</TableHead>
                <TableHead>User (Dosen)</TableHead>
                <TableHead className="text-center">Perubahan</TableHead>
                <TableHead>Alasan (Justifikasi)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Memuat log audit...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Belum ada riwayat perubahan nilai yang tercatat.</TableCell>
                </TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{log.mahasiswa.nama}</div>
                      <div className="text-xs text-slate-500">{log.mahasiswa.nim}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{log.sub_cpmk_kode}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{log.user_id || 'System'}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                        <span className="text-red-500 line-through">{log.nilai_lama}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-green-600">{log.nilai_baru}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm italic text-slate-600 max-w-xs truncate" title={log.alasan}>
                      "{log.alasan}"
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

