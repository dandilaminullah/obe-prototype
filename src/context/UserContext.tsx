'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'DOSEN' | 'AUDITOR';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  prodiId: string;
  setProdiId: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('SUPERADMIN');
  const [prodiId, setProdiIdState] = useState<string>('');

  useEffect(() => {
    // Read from cookie on mount
    const match = document.cookie.match(new RegExp('(^| )userRole=([^;]+)'));
    if (match) {
      const savedRole = match[2] as UserRole;
      if (['SUPERADMIN', 'ADMIN', 'DOSEN', 'AUDITOR'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    } else {
      document.cookie = `userRole=SUPERADMIN; path=/; max-age=31536000`;
    }

    const prodiMatch = document.cookie.match(new RegExp('(^| )prodiId=([^;]+)'));
    if (prodiMatch) {
      setProdiIdState(prodiMatch[2]);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    document.cookie = `userRole=${newRole}; path=/; max-age=31536000`;
    
    let targetPath = '/';
    if (newRole === 'SUPERADMIN') {
      targetPath = '/superadmin';
    } else if (newRole === 'ADMIN') {
      targetPath = '/admin';
    } else if (newRole === 'DOSEN') {
      targetPath = '/dosen';
    } else if (newRole === 'AUDITOR') {
      targetPath = '/auditor';
    }

    window.location.href = targetPath; 
  };

  const setProdiId = (newProdiId: string) => {
    setProdiIdState(newProdiId);
    document.cookie = `prodiId=${newProdiId}; path=/; max-age=31536000`;
  };

  return (
    <UserContext.Provider value={{ role, setRole, prodiId, setProdiId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
