'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'DOSEN' | 'AUDITOR';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('ADMIN'); // Default role
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Read from cookie on mount
    const match = document.cookie.match(new RegExp('(^| )userRole=([^;]+)'));
    if (match) {
      const savedRole = match[2] as UserRole;
      if (['ADMIN', 'DOSEN', 'AUDITOR'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    } else {
      // If no cookie, set default cookie
      document.cookie = `userRole=ADMIN; path=/; max-age=31536000`;
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    document.cookie = `userRole=${newRole}; path=/; max-age=31536000`;
    // We reload to let the middleware handle the redirect based on the new role
    window.location.href = '/'; 
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <UserContext.Provider value={{ role, setRole }}>
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
