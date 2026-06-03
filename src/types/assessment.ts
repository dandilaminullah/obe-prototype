export interface StudentGrade {
  id: string;
  studentId: string;
  subCpmkId: string;
  score: number;
  createdAt: string;
}

export interface GradingAuditTrail {
  id: string;
  gradeId: string;
  oldScore: number;
  newScore: number;
  reason: string;
  ipAddress?: string;
  userId?: string;
  createdAt: string;
}
