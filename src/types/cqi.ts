export interface AuditActionPlan {
  id: string;
  courseId: string;
  gapAnalysis: string;
  improvementPlan: string;
  targetSemester: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'COMPLETED';
  createdAt: string;
}
