import { createStore } from 'zustand';
import { CurriculumData, Profile, CPL, Course } from '../types/curriculum';
import dummyData from '../../public/data/curriculum.json';

export interface CurriculumState extends CurriculumData {
  updateSubCpmkWeight: (courseId: string, subCpmkId: string, newWeight: number) => void;
  // We can add student grade state later for OBAE
  studentGrades: Record<string, number>; // key: subCpmkId, value: score (0-100)
  updateStudentGrade: (subCpmkId: string, score: number) => void;
}

export const createCurriculumStore = (
  initialProps?: Partial<CurriculumData>
) => {
  return createStore<CurriculumState>()((set) => ({
    profiles: dummyData.profiles,
    cpl: dummyData.cpl,
    courses: dummyData.courses as unknown as Course[],
    studentGrades: {},
    ...initialProps,
    updateSubCpmkWeight: (courseId, subCpmkId, newWeight) =>
      set((state) => ({
        courses: state.courses.map((course) => {
          if (course.id === courseId) {
            return {
              ...course,
              sub_cpmk: course.sub_cpmk.map((sub) =>
                sub.id === subCpmkId ? { ...sub, weight: newWeight } : sub
              ),
            };
          }
          return course;
        }),
      })),
    updateStudentGrade: (subCpmkId, score) =>
      set((state) => ({
        studentGrades: {
          ...state.studentGrades,
          [subCpmkId]: score,
        },
      })),
  }));
};
