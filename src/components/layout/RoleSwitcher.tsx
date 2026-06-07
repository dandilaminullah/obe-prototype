'use client';

import React from 'react';
import { useUser, UserRole } from '@/context/UserContext';
import { Users, Shield, GraduationCap, Eye } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole } = useUser();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'DOSEN': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'AUDITOR': return <Eye className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm mt-auto mb-4 mx-4">
      <div className="p-1.5 bg-slate-100 rounded-md">
        {getRoleIcon()}
      </div>
      <div className="flex-1">
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
        >
          <option value="ADMIN">Admin Prodi</option>
          <option value="DOSEN">Dosen</option>
          <option value="AUDITOR">Auditor</option>
        </select>
        <div className="text-[10px] text-slate-400 mt-0.5">Aktif sebagai</div>
      </div>
    </div>
  );
}

