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
  description: string;
  weight: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  cpl_mapping: CplMapping[];
  cpmk: CPMK[];
  sub_cpmk: SubCPMK[];
}

export interface CurriculumData {
  profiles: Profile[];
  cpl: CPL[];
  courses: Course[];
}
