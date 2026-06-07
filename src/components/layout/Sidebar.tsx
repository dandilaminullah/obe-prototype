"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Network,
  BookOpen,
  GraduationCap,
  Building2,
  Eye,
  FileArchive,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, UserRole } from "@/context/UserContext";
import { RoleSwitcher } from "./RoleSwitcher";

const getNavItems = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return [
        {
          title: "Dashboard Admin",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Master Data",
          items: [
            { title: "Jurusan", href: "/admin/master/jurusan", icon: Building2 },
            { title: "Program Studi", href: "/admin/master/prodi", icon: BookOpen },
          ],
        },
        {
          title: "Curriculum (OBC)",
          items: [
            { title: "Profil Lulusan", href: "/admin/curriculum/profiles", icon: Target },
            { title: "Bahan Kajian", href: "/admin/curriculum/bk", icon: BookOpen },
            { title: "Course Builder", href: "/admin/curriculum/mapping", icon: Network },
            { title: "Matriks Kurikulum", href: "/admin/curriculum/matrix", icon: Target },
            { title: "Curriculum Viewer", href: "/admin/curriculum/viewer", icon: Eye },
          ],
        },
      ];
    case 'DOSEN':
      return [
        {
          title: "Dashboard Dosen",
          href: "/dosen",
          icon: LayoutDashboard,
        },
        {
          title: "Pelaksanaan (OBLT)",
          items: [
            { title: "Digital RPS Builder", href: "/dosen/rps", icon: BookOpen },
          ],
        },
        {
          title: "Asesmen (OBAE)",
          items: [
            { title: "Simulasi Asesmen", href: "/dosen/assessment", icon: GraduationCap },
            { title: "SISTER Auto-Package", href: "/dosen/sister", icon: FileArchive },
          ],
        },
        {
          title: "Evaluasi (CQI)",
          items: [
            { title: "Rencana Aksi Perbaikan", href: "/dosen/cqi", icon: Target },
          ],
        },
      ];
    case 'AUDITOR':
      return [
        {
          title: "Dashboard Auditor",
          href: "/auditor",
          icon: LayoutDashboard,
        },
        {
          title: "Audit Mutu Internal",
          items: [
            { title: "Portal Auditor", href: "/auditor/portal", icon: Eye },
            { title: "Grading Audit Trail", href: "/auditor/audit-trail", icon: History },
          ],
        },
      ];
    default:
      return [];
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUser();
  const navItems = getNavItems(role);

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-primary font-heading">OBE System</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-4">
          {navItems.map((section, idx) => (
            <div key={idx}>
              {section.items ? (
                <>
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          pathname === item.href || pathname.startsWith(item.href + '/')
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-slate-100",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 flex-shrink-0",
                            pathname === item.href || pathname.startsWith(item.href + '/')
                              ? "text-primary"
                              : "text-muted",
                          )}
                          aria-hidden="true"
                        />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={section.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === section.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-slate-100",
                  )}
                >
                  <section.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      pathname === section.href
                        ? "text-primary"
                        : "text-muted",
                    )}
                    aria-hidden="true"
                  />
                  {section.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <RoleSwitcher />
    </div>
  );
}

