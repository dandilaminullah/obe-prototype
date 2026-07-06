"use client";

import React, { useState } from "react";
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
  History,
  ClipboardCheck,
  TrendingUp,
  FolderKanban,
  Compass,
  UserCheck,
  Grid,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, UserRole } from "@/context/UserContext";
import { RoleSwitcher } from "./RoleSwitcher";

export interface SubNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subItems?: SubNavItem[];
}

export interface NavSection {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
}

const getNavItems = (role: UserRole): NavSection[] => {
  switch (role) {
    case "SUPERADMIN":
      return [
        {
          title: "Dashboard Super Admin",
          href: "/superadmin",
          icon: LayoutDashboard,
        },
        {
          title: "Master Data",
          items: [
            {
              title: "Jurusan",
              href: "/superadmin/master/jurusan",
              icon: Building2,
            },
            {
              title: "Program Studi",
              href: "/superadmin/master/prodi",
              icon: BookOpen,
            },
            {
              title: "VMTS Perguruan Tinggi",
              href: "/superadmin/master/vmts-pt",
              icon: Target,
            },
            {
              title: "University Value",
              href: "/superadmin/master/university-value",
              icon: GraduationCap,
            },
          ],
        },
      ];

    case "ADMIN":
      return [
        {
          title: "Dashboard Admin",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Evaluasi",
          items: [
            {
              title: "Evaluasi Kurikulum",
              href: "/admin/curriculum/evaluation",
              icon: ClipboardCheck,
            },
            {
              title: "Evaluasi Tracer Study",
              href: "/admin/tracer-study",
              icon: TrendingUp,
            },
          ],
        },
        {
          title: "Curriculum (OBC)",
          items: [
            {
              title: "Fondasi",
              icon: Layers,
              subItems: [
                {
                  title: "Manajemen Kurikulum",
                  href: "/admin/curriculum",
                  icon: FolderKanban,
                },
                {
                  title: "VMTS Prodi",
                  href: "/admin/curriculum/vmts",
                  icon: Compass,
                },
              ],
            },
            {
              title: "Profil Lulusan dan CPL",
              icon: UserCheck,
              subItems: [
                {
                  title: "Profil Lulusan",
                  href: "/admin/curriculum/profiles",
                  icon: UserCheck,
                },
                {
                  title: "CPL",
                  href: "/admin/curriculum/cpl",
                  icon: Target,
                },
                {
                  title: "Matriks PL-CPL",
                  href: "/admin/curriculum/matrix-pl-cpl",
                  icon: Grid,
                },
              ],
            },
            {
              title: "Bahan Kajian dan MK",
              icon: BookOpen,
              subItems: [
                {
                  title: "Bahan Kajian",
                  href: "/admin/curriculum/bk",
                  icon: BookOpen,
                },
                {
                  title: "Mata kuliah",
                  href: "/admin/curriculum/courses",
                  icon: Network,
                },
                {
                  title: "Matriks CPL-BK & CPL-MK",
                  href: "/admin/curriculum/matrix",
                  icon: Grid,
                },
              ],
            },
            {
              title: "Curriculum Viewer",
              href: "/admin/curriculum/viewer",
              icon: Eye,
            },
          ],
        },
      ];

    case "DOSEN":
      return [
        {
          title: "Dashboard Dosen",
          href: "/dosen",
          icon: LayoutDashboard,
        },
        {
          title: "Pelaksanaan (OBLT)",
          items: [
            {
              title: "Digital RPS Builder",
              href: "/dosen/rps",
              icon: BookOpen,
            },
          ],
        },
        {
          title: "Asesmen (OBAE)",
          items: [
            {
              title: "Simulasi Asesmen",
              href: "/dosen/assessment",
              icon: GraduationCap,
            },
            {
              title: "SISTER Auto-Package",
              href: "/dosen/sister",
              icon: FileArchive,
            },
          ],
        },
        {
          title: "Evaluasi (CQI)",
          items: [
            {
              title: "Rencana Aksi Perbaikan",
              href: "/dosen/cqi",
              icon: Target,
            },
          ],
        },
      ];

    case "AUDITOR":
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
            {
              title: "Grading Audit Trail",
              href: "/auditor/audit-trail",
              icon: History,
            },
          ],
        },
      ];

    default:
      return [];
  }
};

function NavSubMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const isAnySubActive = item.subItems?.some(
    (sub) =>
      pathname === sub.href ||
      (sub.href !== "/admin/curriculum" &&
        pathname.startsWith(sub.href + "/")) ||
      (sub.href === "/admin/curriculum" && pathname === "/admin/curriculum"),
  );

  const [isOpen, setIsOpen] = useState(isAnySubActive ?? true);
  const ParentIcon = item.icon || Layers;

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors",
          isAnySubActive
            ? "bg-slate-100 text-primary"
            : "text-foreground hover:bg-slate-100",
        )}
      >
        <div className="flex items-center">
          <ParentIcon
            className={cn(
              "mr-3 h-5 w-5 flex-shrink-0",
              isAnySubActive ? "text-primary" : "text-muted",
            )}
            aria-hidden="true"
          />
          <span>{item.title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isOpen && item.subItems && (
        <div className="pl-6 space-y-1 border-l-2 border-slate-100 ml-4 py-1">
          {item.subItems.map((sub) => {
            const isActive =
              sub.href === "/admin/curriculum"
                ? pathname === "/admin/curriculum"
                : pathname === sub.href || pathname.startsWith(sub.href + "/");

            const SubIcon = sub.icon;

            return (
              <Link
                key={sub.href}
                href={sub.href}
                className={cn(
                  "flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <SubIcon
                  className={cn(
                    "mr-2 h-4 w-4 flex-shrink-0",
                    isActive ? "text-primary" : "text-slate-400",
                  )}
                  aria-hidden="true"
                />
                {sub.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUser();
  const navItems = getNavItems(role);

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-primary font-heading">
          OBE System
        </h1>
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
                    {section.items.map((item, itemIdx) => {
                      if (item.subItems) {
                        return (
                          <NavSubMenu
                            key={itemIdx}
                            item={item}
                            pathname={pathname}
                          />
                        );
                      }

                      if (!item.href) return null;

                      const ItemIcon = item.icon || Target;
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-slate-100",
                          )}
                        >
                          <ItemIcon
                            className={cn(
                              "mr-3 h-5 w-5 flex-shrink-0",
                              isActive ? "text-primary" : "text-muted",
                            )}
                            aria-hidden="true"
                          />
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : section.href ? (
                <Link
                  href={section.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === section.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-slate-100",
                  )}
                >
                  {section.icon && (
                    <section.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        pathname === section.href
                          ? "text-primary"
                          : "text-muted",
                      )}
                      aria-hidden="true"
                    />
                  )}
                  {section.title}
                </Link>
              ) : null}
            </div>
          ))}
        </nav>
      </div>

      <RoleSwitcher />
    </div>
  );
}
