"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Pencil, ChevronDown, ChevronUp, Layers, Target, Book, Activity, CheckSquare } from "lucide-react";

export default function MappingPage() {
  const [cpls, setCpls] = useState<any[]>([]);
  const [bks, setBks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [prodis, setProdis] = useState<any[]>([]);
  
  const [courseCpls, setCourseCpls] = useState<any[]>([]);
  const [courseBks, setCourseBks] = useState<any[]>([]);
  const [cpmks, setCpmks] = useState<any[]>([]);
  const [subCpmks, setSubCpmks] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Expanded states
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedCpmk, setExpandedCpmk] = useState<string | null>(null);

  // Forms
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<{kode: string, nama: string, sks: number, prodi_id: string, assigned_cpls: string[], assigned_bks: string[], metode_pembelajaran: string, tautan_mou: string}>({ kode: "", nama: "", sks: 3, prodi_id: "", assigned_cpls: [], assigned_bks: [], metode_pembelajaran: "REGULAR", tautan_mou: "" });

  const [isCpmkModalOpen, setIsCpmkModalOpen] = useState(false);
  const [cpmkForm, setCpmkForm] = useState<{id: string, kode: string, deskripsi: string, bobot: number, mata_kuliah_id: string}>({ id: "", kode: "", deskripsi: "", bobot: 0, mata_kuliah_id: "" });

  const [isSubCpmkModalOpen, setIsSubCpmkModalOpen] = useState(false);
  const [subCpmkForm, setSubCpmkForm] = useState<{id: string, kode: string, deskripsi: string, bobot: number, metode_penilaian: string, instrumen_penilaian: string, cpmk_id: string}>({ id: "", kode: "", deskripsi: "", bobot: 0, metode_penilaian: "", instrumen_penilaian: "", cpmk_id: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cplRes, bkRes, courseRes, prodiRes, mapCplRes, mapBkRes, cpmkRes, subRes] = await Promise.all([
      supabase.from("cpl").select("*").order("kode"),
      supabase.from("bahan_kajian").select("*").order("kode"),
      supabase.from("mata_kuliah").select("*, prodi(nama)").order("kode"),
      supabase.from("prodi").select("*").order("nama"),
      supabase.from("mata_kuliah_cpl").select("*"),
      supabase.from("mata_kuliah_bk").select("*"),
      supabase.from("cpmk").select("*").order("kode"),
      supabase.from("sub_cpmk").select("*").order("kode")
    ]);
    if (cplRes.data) setCpls(cplRes.data);
    if (bkRes.data) setBks(bkRes.data);
    if (courseRes.data) setCourses(courseRes.data);
    if (prodiRes.data) setProdis(prodiRes.data);
    if (mapCplRes.data) setCourseCpls(mapCplRes.data);
    if (mapBkRes.data) setCourseBks(mapBkRes.data);
    if (cpmkRes.data) setCpmks(cpmkRes.data);
    if (subRes.data) setSubCpmks(subRes.data);
    setLoading(false);
  };

  // COURSE Handlers
  const handleCourseSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("mata_kuliah").insert([{ 
      kode: courseForm.kode, nama: courseForm.nama, sks: courseForm.sks, prodi_id: courseForm.prodi_id,
      metode_pembelajaran: courseForm.metode_pembelajaran, tautan_mou: courseForm.metode_pembelajaran !== 'REGULAR' ? courseForm.tautan_mou : null
    }]).select("id").single();
    
    if (data && courseForm.assigned_cpls.length > 0) {
      await supabase.from("mata_kuliah_cpl").insert(courseForm.assigned_cpls.map(cplId => ({ mata_kuliah_id: data.id, cpl_id: cplId, bobot: 0 })));
    }
    if (data && courseForm.assigned_bks.length > 0) {
      await supabase.from("mata_kuliah_bk").insert(courseForm.assigned_bks.map(bkId => ({ mata_kuliah_id: data.id, bk_id: bkId })));
    }

    setIsCourseModalOpen(false);
    setCourseForm({ kode: "", nama: "", sks: 3, prodi_id: prodis[0]?.id || "", assigned_cpls: [], assigned_bks: [], metode_pembelajaran: "REGULAR", tautan_mou: "" });
    fetchData();
  };

  const handleCourseDelete = async (id: string) => {
    if (confirm("Hapus mata kuliah ini beserta seluruh CPMK dan Sub-CPMK di dalamnya?")) {
      await supabase.from("mata_kuliah").delete().eq("id", id);
      fetchData();
    }
  };

  // CPMK Handlers
  const handleCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpmkForm.id) {
      await supabase.from("cpmk").update({ kode: cpmkForm.kode, deskripsi: cpmkForm.deskripsi, bobot: cpmkForm.bobot }).eq("id", cpmkForm.id);
    } else {
      await supabase.from("cpmk").insert([{ kode: cpmkForm.kode, deskripsi: cpmkForm.deskripsi, bobot: cpmkForm.bobot, mata_kuliah_id: cpmkForm.mata_kuliah_id }]);
    }
    setIsCpmkModalOpen(false);
    fetchData();
  };
  
  const handleCpmkDelete = async (id: string) => {
    if (confirm("Hapus CPMK ini beserta seluruh Sub-CPMK di dalamnya?")) {
      await supabase.from("cpmk").delete().eq("id", id);
      fetchData();
    }
  };

  // Sub-CPMK Handlers
  const handleSubCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subCpmkForm.id) {
      await supabase.from("sub_cpmk").update({ 
        kode: subCpmkForm.kode, deskripsi: subCpmkForm.deskripsi, bobot: subCpmkForm.bobot, 
        metode_penilaian: subCpmkForm.metode_penilaian, instrumen_penilaian: subCpmkForm.instrumen_penilaian 
      }).eq("id", subCpmkForm.id);
    } else {
      await supabase.from("sub_cpmk").insert([{ 
        kode: subCpmkForm.kode, deskripsi: subCpmkForm.deskripsi, bobot: subCpmkForm.bobot, 
        metode_penilaian: subCpmkForm.metode_penilaian, instrumen_penilaian: subCpmkForm.instrumen_penilaian,
        cpmk_id: subCpmkForm.cpmk_id 
      }]);
    }
    setIsSubCpmkModalOpen(false);
    fetchData();
  };

  const handleSubCpmkDelete = async (id: string) => {
    if (confirm("Hapus Sub-CPMK ini?")) {
      await supabase.from("sub_cpmk").delete().eq("id", id);
      fetchData();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Builder (Curriculum Mapping)</h1>
          <p className="text-gray-500">Bangun hierarki kurikulum Mata Kuliah mulai dari pemetaan CPL/BK hingga ke Sub-CPMK.</p>
        </div>
        <Button onClick={() => { setCourseForm({ kode: "", nama: "", sks: 3, prodi_id: prodis[0]?.id || "", assigned_cpls: [], assigned_bks: [], metode_pembelajaran: "REGULAR", tautan_mou: "" }); setIsCourseModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Mata Kuliah
        </Button>
      </div>

      <div className="space-y-4">
        {courses.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">Belum ada data Mata Kuliah</CardContent>
          </Card>
        )}
        
        {courses.map(course => {
          const isExpanded = expandedCourse === course.id;
          const courseCplsData = courseCpls.filter(m => m.mata_kuliah_id === course.id).map(m => cpls.find(c => c.id === m.cpl_id)).filter(Boolean);
          const courseBksData = courseBks.filter(m => m.mata_kuliah_id === course.id).map(m => bks.find(b => b.id === m.bk_id)).filter(Boolean);
          const courseCpmks = cpmks.filter(c => c.mata_kuliah_id === course.id);

          return (
            <Card key={course.id} className="overflow-hidden border border-slate-200 shadow-sm transition-all duration-200">
              {/* Course Header */}
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : ''}`}
                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Book className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{course.kode} - {course.nama}</h3>
                    <div className="flex items-center text-sm text-slate-500 space-x-4 mt-1">
                      <span>{course.sks} SKS</span>
                      <span>•</span>
                      <span>{course.prodi?.nama}</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">{courseCpmks.length} CPMK</span>
                    </div>
                    {course.metode_pembelajaran && course.metode_pembelajaran !== 'REGULAR' && (
                      <div className="mt-2 text-xs">
                        <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded">IKU 5: {course.metode_pembelajaran === 'TBP' ? 'Team-Based Project' : 'Case Method'}</span>
                        {course.tautan_mou && <a href={course.tautan_mou} target="_blank" rel="noreferrer" className="ml-2 text-blue-500 hover:underline">Lihat Dokumen MoU</a>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleCourseDelete(course.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Course Content */}
              {isExpanded && (
                <div className="p-6 bg-white space-y-8">
                  {/* Mapping Info */}
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center"><Target className="w-4 h-4 mr-2 text-indigo-500" />Target CPL</h4>
                      <div className="flex flex-wrap gap-2">
                        {courseCplsData.length > 0 ? courseCplsData.map((cpl: any) => (
                          <span key={cpl.id} className="px-2.5 py-1 bg-white text-indigo-700 text-xs rounded-md border border-indigo-200 font-semibold shadow-sm" title={cpl.deskripsi}>
                            {cpl.kode}
                          </span>
                        )) : <span className="text-sm text-slate-400 italic">Belum ada CPL</span>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center"><Layers className="w-4 h-4 mr-2 text-orange-500" />Bahan Kajian (BK)</h4>
                      <div className="flex flex-wrap gap-2">
                        {courseBksData.length > 0 ? courseBksData.map((bk: any) => (
                          <span key={bk.id} className="px-2.5 py-1 bg-white text-orange-700 text-xs rounded-md border border-orange-200 font-semibold shadow-sm" title={bk.nama}>
                            {bk.kode}
                          </span>
                        )) : <span className="text-sm text-slate-400 italic">Belum ada BK</span>}
                      </div>
                    </div>
                  </div>

                  {/* CPMK Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 flex items-center text-lg"><Activity className="w-5 h-5 mr-2 text-primary" />Capaian Pembelajaran Mata Kuliah (CPMK)</h4>
                      <Button size="sm" onClick={() => {
                        setCpmkForm({ id: "", kode: "", deskripsi: "", bobot: 0, mata_kuliah_id: course.id });
                        setIsCpmkModalOpen(true);
                      }}>
                        <Plus className="w-4 h-4 mr-2" /> Tambah CPMK
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {courseCpmks.length === 0 ? (
                        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">Belum ada CPMK untuk Mata Kuliah ini. Silakan tambahkan CPMK pertama Anda.</div>
                      ) : (
                        courseCpmks.map(cpmk => {
                          const isCpmkExpanded = expandedCpmk === cpmk.id;
                          const cpmkSubs = subCpmks.filter(s => s.cpmk_id === cpmk.id);
                          
                          return (
                            <div key={cpmk.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => setExpandedCpmk(isCpmkExpanded ? null : cpmk.id)}
                              >
                                <div className="flex items-center space-x-4 flex-1">
                                  <div className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-md text-center shadow-sm">{cpmk.kode}</div>
                                  <div className="text-sm font-medium text-slate-700 flex-1 pr-4 leading-relaxed">{cpmk.deskripsi}</div>
                                  <div className="text-xs font-bold bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full">Bobot: {cpmk.bobot}%</div>
                                </div>
                                <div className="flex items-center space-x-2 pl-4 border-l border-slate-100 ml-4">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                                    e.stopPropagation();
                                    setCpmkForm({ id: cpmk.id, kode: cpmk.kode, deskripsi: cpmk.deskripsi, bobot: cpmk.bobot, mata_kuliah_id: course.id });
                                    setIsCpmkModalOpen(true);
                                  }}><Pencil className="w-4 h-4 text-slate-500" /></Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => {
                                    e.stopPropagation();
                                    handleCpmkDelete(cpmk.id);
                                  }}><Trash2 className="w-4 h-4" /></Button>
                                  {isCpmkExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 ml-1" /> : <ChevronDown className="w-5 h-5 text-slate-400 ml-1" />}
                                </div>
                              </div>

                              {/* Sub-CPMK Section */}
                              {isCpmkExpanded && (
                                <div className="p-5 bg-slate-50 border-t border-slate-200">
                                  <div className="flex flex-col mb-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <h5 className="text-sm font-bold text-slate-700 flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-emerald-600" />Indikator / Sub-CPMK</h5>
                                      <Button size="sm" variant="outline" className="h-8 text-xs bg-white" onClick={() => {
                                        setSubCpmkForm({ id: "", kode: "", deskripsi: "", bobot: 0, metode_penilaian: "", instrumen_penilaian: "", cpmk_id: cpmk.id });
                                        setIsSubCpmkModalOpen(true);
                                      }}>
                                        <Plus className="w-3 h-3 mr-1" /> Tambah Sub-CPMK
                                      </Button>
                                    </div>
                                    
                                    {/* Weight Validation */}
                                    {(() => {
                                      const totalSubWeight = cpmkSubs.reduce((sum, s) => sum + Number(s.bobot || 0), 0);
                                      const isWeightValid = totalSubWeight === 100;
                                      return (
                                        <div className="w-full">
                                          <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span className={isWeightValid ? 'text-slate-600' : 'text-red-600'}>
                                              Total Bobot Sub-CPMK (Validasi 100%)
                                            </span>
                                            <span className={isWeightValid ? 'text-emerald-600' : 'text-red-600'}>{totalSubWeight}% / 100%</span>
                                          </div>
                                          <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${isWeightValid ? 'bg-emerald-500' : (totalSubWeight > 100 ? 'bg-red-500' : 'bg-amber-500')}`} style={{ width: `${Math.min(totalSubWeight, 100)}%` }}></div>
                                          </div>
                                          {!isWeightValid && cpmkSubs.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1">Total bobot Sub-CPMK harus bernilai tepat 100%.</p>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  <div className="space-y-3 pl-3 border-l-2 border-emerald-200">
                                    {cpmkSubs.length === 0 ? (
                                      <div className="text-sm text-slate-400 italic py-2 pl-2">Belum ada Sub-CPMK.</div>
                                    ) : (
                                      cpmkSubs.map(sub => (
                                        <div key={sub.id} className="flex flex-col p-4 bg-white border border-slate-200 shadow-sm rounded-lg ml-2 hover:border-emerald-200 transition-colors">
                                          <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-3 flex-1">
                                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 mt-0.5">{sub.kode}</span>
                                              <p className="text-sm text-slate-700 flex-1 leading-relaxed">{sub.deskripsi}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">Bobot: {sub.bobot}%</span>
                                              <div className="flex space-x-1 border-l border-slate-200 pl-2 ml-2">
                                                <button onClick={() => {
                                                  setSubCpmkForm({ id: sub.id, kode: sub.kode, deskripsi: sub.deskripsi, bobot: sub.bobot, metode_penilaian: sub.metode_penilaian || "", instrumen_penilaian: sub.instrumen_penilaian || "", cpmk_id: cpmk.id });
                                                  setIsSubCpmkModalOpen(true);
                                                }} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleSubCpmkDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                              </div>
                                            </div>
                                          </div>
                                          {/* IKU 7 Info */}
                                          {(sub.metode_penilaian || sub.instrumen_penilaian) && (
                                            <div className="mt-3 ml-20 flex flex-wrap gap-2">
                                              {sub.metode_penilaian && <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Metode: {sub.metode_penilaian}</span>}
                                              {sub.instrumen_penilaian && <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Instrumen: {sub.instrumen_penilaian}</span>}
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* MODALS */}
      {/* 1. Modal Tambah Mata Kuliah */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Tambah Mata Kuliah</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="courseForm" onSubmit={handleCourseSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Program Studi</label>
                  <select required className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={courseForm.prodi_id} onChange={e => setCourseForm({...courseForm, prodi_id: e.target.value})}>
                    <option value="" disabled>Pilih Prodi</option>
                    {prodis.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Kode MK</label>
                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={courseForm.kode} onChange={e => setCourseForm({...courseForm, kode: e.target.value})} placeholder="Contoh: INF101" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">SKS</label>
                    <input required type="number" min="1" max="6" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={courseForm.sks} onChange={e => setCourseForm({...courseForm, sks: parseInt(e.target.value) || 3})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Nama Mata Kuliah</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={courseForm.nama} onChange={e => setCourseForm({...courseForm, nama: e.target.value})} placeholder="Contoh: Pemrograman Web" />
                </div>
                
                <div className="bg-purple-50 p-4 border border-purple-100 rounded-lg space-y-3">
                  <h4 className="text-sm font-bold text-purple-800">Metode Pembelajaran (IKU 5)</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-purple-700">Jenis Metode</label>
                    <select className="w-full p-2.5 border border-purple-200 rounded-lg bg-white outline-none focus:border-purple-400" value={courseForm.metode_pembelajaran} onChange={e => setCourseForm({...courseForm, metode_pembelajaran: e.target.value})}>
                      <option value="REGULAR">Reguler (Bukan TBP/CM)</option>
                      <option value="TBP">Team-Based Project (TBP)</option>
                      <option value="CM">Case Method (CM)</option>
                    </select>
                  </div>
                  {courseForm.metode_pembelajaran !== "REGULAR" && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-purple-700">Tautan Dokumen MoU/MoA Industri</label>
                      <input required type="url" className="w-full p-2.5 border border-purple-200 rounded-lg outline-none focus:border-purple-400" value={courseForm.tautan_mou} onChange={e => setCourseForm({...courseForm, tautan_mou: e.target.value})} placeholder="https://link-ke-dokumen-kerjasama..." />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Target CPL (Multiple Selection)</label>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    {cpls.map(cpl => (
                      <label key={cpl.id} className="flex items-start space-x-3 text-sm p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                          checked={courseForm.assigned_cpls.includes(cpl.id)}
                          onChange={(e) => {
                            if (e.target.checked) setCourseForm({ ...courseForm, assigned_cpls: [...courseForm.assigned_cpls, cpl.id] });
                            else setCourseForm({ ...courseForm, assigned_cpls: courseForm.assigned_cpls.filter(id => id !== cpl.id) });
                          }}
                        />
                        <span className="flex flex-col">
                          <strong className="text-slate-800">{cpl.kode}</strong>
                          <span className="text-slate-500 text-xs mt-0.5 leading-snug">{cpl.deskripsi}</span>
                        </span>
                      </label>
                    ))}
                    {cpls.length === 0 && <span className="text-sm text-slate-400 italic">Belum ada CPL</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Target Bahan Kajian</label>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    {bks.map(bk => (
                      <label key={bk.id} className="flex items-center space-x-3 text-sm p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                          checked={courseForm.assigned_bks.includes(bk.id)}
                          onChange={(e) => {
                            if (e.target.checked) setCourseForm({ ...courseForm, assigned_bks: [...courseForm.assigned_bks, bk.id] });
                            else setCourseForm({ ...courseForm, assigned_bks: courseForm.assigned_bks.filter(id => id !== bk.id) });
                          }}
                        />
                        <span><strong className="text-slate-800">{bk.kode}</strong> - <span className="text-slate-600">{bk.nama}</span></span>
                      </label>
                    ))}
                    {bks.length === 0 && <span className="text-sm text-slate-400 italic">Belum ada Bahan Kajian</span>}
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button type="button" variant="ghost" onClick={() => setIsCourseModalOpen(false)}>Batal</Button>
              <Button type="submit" form="courseForm">Simpan Mata Kuliah</Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal CPMK */}
      {isCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{cpmkForm.id ? "Edit CPMK" : "Tambah CPMK"}</h2>
            </div>
            <div className="p-6">
              <form id="cpmkForm" onSubmit={handleCpmkSave} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Kode CPMK</label>
                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={cpmkForm.kode} onChange={e => setCpmkForm({...cpmkForm, kode: e.target.value})} placeholder="Contoh: CPMK-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Bobot (%)</label>
                    <input required type="number" min="0" max="100" step="0.1" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={cpmkForm.bobot} onChange={e => setCpmkForm({...cpmkForm, bobot: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Deskripsi Capaian</label>
                  <textarea required rows={4} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={cpmkForm.deskripsi} onChange={e => setCpmkForm({...cpmkForm, deskripsi: e.target.value})} placeholder="Deskripsikan capaian spesifik mata kuliah ini..." />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button type="button" variant="ghost" onClick={() => setIsCpmkModalOpen(false)}>Batal</Button>
              <Button type="submit" form="cpmkForm">Simpan CPMK</Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Sub-CPMK */}
      {isSubCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{subCpmkForm.id ? "Edit Sub-CPMK" : "Tambah Sub-CPMK"}</h2>
            </div>
            <div className="p-6">
              <form id="subCpmkForm" onSubmit={handleSubCpmkSave} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Kode Sub-CPMK</label>
                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={subCpmkForm.kode} onChange={e => setSubCpmkForm({...subCpmkForm, kode: e.target.value})} placeholder="Contoh: Sub-CPMK 1.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Bobot (%)</label>
                    <input required type="number" min="0" max="100" step="0.1" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={subCpmkForm.bobot} onChange={e => setSubCpmkForm({...subCpmkForm, bobot: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Deskripsi Sub-Capaian</label>
                  <textarea required rows={3} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={subCpmkForm.deskripsi} onChange={e => setSubCpmkForm({...subCpmkForm, deskripsi: e.target.value})} placeholder="Indikator kinerja spesifik..." />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Informasi Asesmen (IKU 7)</h4>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">Metode Penilaian</label>
                    <input type="text" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" value={subCpmkForm.metode_penilaian} onChange={e => setSubCpmkForm({...subCpmkForm, metode_penilaian: e.target.value})} placeholder="Contoh: Team-Based Project, Kuis, dll" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">Instrumen Penilaian</label>
                    <input type="text" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" value={subCpmkForm.instrumen_penilaian} onChange={e => setSubCpmkForm({...subCpmkForm, instrumen_penilaian: e.target.value})} placeholder="Contoh: Rubrik Penilaian Laporan" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button type="button" variant="ghost" onClick={() => setIsSubCpmkModalOpen(false)}>Batal</Button>
              <Button type="submit" form="subCpmkForm">Simpan Sub-CPMK</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

