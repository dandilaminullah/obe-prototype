import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Target, Network, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const features = [
    {
      title: 'Profil Lulusan',
      description: 'Manajemen PEO dan CPL berbasis KKNI.',
      icon: Target,
      href: '/curriculum/profiles',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Matrix Mapping',
      description: 'Pemetaan CPL ke Mata Kuliah (OBC).',
      icon: Network,
      href: '/curriculum/mapping',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Digital RPS Builder',
      description: 'Penjabaran CPL menjadi CPMK & Sub-CPMK (OBLT).',
      icon: BookOpen,
      href: '/academic/rps',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Simulasi Asesmen',
      description: 'Penilaian per Sub-CPMK dan kalkulasi radar chart CPL (OBAE).',
      icon: GraduationCap,
      href: '/academic/assessment',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard OBE System</h1>
        <p className="text-gray-500 mt-2">
          Selamat datang di prototipe Outcome-Based Education Management System (MVP).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-transparent hover:border-blue-200 ring-1 ring-gray-200">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="mt-1">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

