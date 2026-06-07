"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, FileText, CheckCircle, Clock } from "lucide-react";

export default function SisterPackagePage() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SISTER Auto-Package</h1>
        <p className="text-gray-500">Unduh paket bukti kinerja (RPS, presensi, portofolio nilai) untuk pelaporan BKD.</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Paket Bukti Kinerja Semester Ini
          </CardTitle>
          <CardDescription>
            Sistem secara otomatis mengumpulkan semua dokumen terkait pelaksanaan pembelajaran untuk dilaporkan ke SISTER.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-slate-50">
              <h4 className="font-medium text-slate-800 mb-2">Dokumen yang akan disertakan (ZIP):</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> RPS Digital Mata Kuliah</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Bukti Pelaksanaan Evaluasi / Asesmen</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Portofolio Nilai Mahasiswa (Sub-CPMK)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Dokumen Rencana Aksi Perbaikan (CQI)</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Rekap Presensi (Integrasi belum tersedia)</li>
              </ul>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleDownload} 
                disabled={downloading || downloaded}
                className="w-full sm:w-auto"
              >
                {downloading ? (
                  <>Memproses ZIP...</>
                ) : downloaded ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Berhasil Diunduh</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Unduh Paket SISTER</>
                )}
              </Button>
            </div>
            {downloaded && (
              <p className="text-sm text-green-600 text-right mt-2 font-medium">
                SISTER_Package_Genap_2026.zip berhasil dibuat! (Mockup)
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

