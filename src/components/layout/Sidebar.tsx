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
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Master Data",
    items: [
      {
        title: "Jurusan",
        href: "/master/jurusan",
        icon: Building2,
      },
      {
        title: "Program Studi",
        href: "/master/prodi",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Curriculum (OBC)",
    items: [
      {
        title: "Profil Lulusan",
        href: "/curriculum/profiles",
        icon: Target,
      },
      {
        title: "Bahan Kajian",
        href: "/curriculum/bk",
        icon: BookOpen,
      },
      {
        title: "Matrix Mapping",
        href: "/curriculum/mapping",
        icon: Network,
      },
      {
        title: "Curriculum Viewer",
        href: "/curriculum/viewer",
        icon: Eye,
      },
    ],
  },
  {
    title: "Academic (OBLT & OBAE)",
    items: [
      {
        title: "Digital RPS Builder",
        href: "/academic/rps",
        icon: BookOpen,
      },
      {
        title: "Simulasi Asesmen",
        href: "/academic/assessment",
        icon: GraduationCap,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

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
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-slate-100",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 flex-shrink-0",
                            pathname === item.href
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
    </div>
  );
}
