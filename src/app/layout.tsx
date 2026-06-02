import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { CurriculumProvider } from '../context/CurriculumContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export const metadata: Metadata = {
  title: 'OBE Management System',
  description: 'Sistem Manajemen Outcome-Based Education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className={`font-sans bg-[#F8FAFC] text-[#1E293B]`}>
        <CurriculumProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </CurriculumProvider>
      </body>
    </html>
  );
}
