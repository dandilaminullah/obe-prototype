'use client';

import React, { useEffect, useState } from 'react';
import { useUser, UserRole } from '@/context/UserContext';
import { Users, Shield, GraduationCap, Eye, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function RoleSwitcher() {
  const { role, setRole, prodiId, setProdiId } = useUser();
  const [prodis, setProdis] = useState<any[]>([]);

  useEffect(() => {
    const fetchProdis = async () => {
      const { data } = await supabase.from('prodi').select('*').order('nama');
      if (data) {
        setProdis(data);
        if (!prodiId && data.length > 0) {
          setProdiId(data[0].id);
        }
      }
    };
    fetchProdis();
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProdiId(e.target.value);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'SUPERADMIN': return <Shield className="w-4 h-4 text-red-600" />;
      case 'ADMIN': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'DOSEN': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'AUDITOR': return <Eye className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="mt-auto mb-4 mx-4 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-slate-100 last:border-0">
        <div className="p-1.5 bg-slate-100 rounded-md">
          {getRoleIcon()}
        </div>
        <div className="flex-1">
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Admin Prodi</option>
            <option value="DOSEN">Dosen</option>
            <option value="AUDITOR">Auditor</option>
          </select>
          <div className="text-[10px] text-slate-400 mt-0.5">Aktif sebagai</div>
        </div>
      </div>

      {role === 'ADMIN' && (
        <div className="flex items-center gap-2 p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
            <Building2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <select
              value={prodiId}
              onChange={handleProdiChange}
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer truncate"
            >
              {prodis.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
            <div className="text-[10px] text-slate-400 mt-0.5">Program Studi</div>
          </div>
        </div>
      )}
    </div>
  );
}

