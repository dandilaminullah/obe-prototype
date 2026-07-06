export interface Profile {
  id: string;
  name: string;
  description: string;
}

export interface CPL {
  id: string;
  code: string;
  description: string;
  profileId: string;
}

export interface CplMapping {
  cplId: string;
  weight: number;
}

export interface SubCPMK {
  id: string;
  cpmkId: string;
  description: string;
  weight: number;
}

export interface CPMK {
  id: string;
  kode?: string;
  description?: string;
  deskripsi?: string;
  weight?: number;
  bobot?: number;
  kedalaman_k?: number;
  kedalaman_a?: number;
  kedalaman_p?: number;
  bk_id?: string | null;
}

export interface TopikMateriPembelajaran {
  id: string;
  mata_kuliah_id: string;
  urutan?: number;
  nama: string;
  kedalaman_k: number;
  kedalaman_a: number;
  kedalaman_p: number;
  created_at?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  sks?: number | null;
  sks_teori?: number | null;
  sks_praktikum?: number | null;
  sks_lapangan?: number | null;
  semester?: number | null;
  sifat_mk?: string | null;
  cpmk?: CPMK[];
  sub_cpmk?: SubCPMK[];
  topik_materi?: TopikMateriPembelajaran[];
  learningMethod?: 'REGULAR' | 'TBP' | 'CM' | null;
  mouLink?: string;
}

export interface CurriculumData {
  profiles: Profile[];
  cpl: CPL[];
  courses: Course[];
}
