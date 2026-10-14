export type UserRole = 'student' | 'teacher' | 'parent' | 'consultant';

export interface KarmaPerk {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
  category: 'classroom' | 'academic' | 'wellness' | 'social';
  cooldownDays: number;
  popularityCount: number;
  isUnlocked?: boolean;
}

export interface StudentPerkHold {
  id: string;
  perkId: string;
  title: string;
  redeemedAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
  code: string;
}

export interface KnowledgeTopic {
  id: string;
  name: string;
  chapter: string;
  masteryScore: number; // 0 - 100
  status: 'mastered' | 'progressing' | 'critical_gap';
  predictedAccuracy: number; // % in national exam
  recommendation: string;
}

export interface SubjectHeatmap {
  subjectId: string;
  subjectName: string;
  icon: string;
  currentGpa: number;
  predictedExamScore: {
    min: number;
    max: number;
    trend: 'up' | 'stable' | 'down';
  };
  topics: KnowledgeTopic[];
}

export interface MoodEntry {
  id: string;
  date: string;
  moodLevel: 1 | 2 | 3 | 4 | 5; // 1: Kiệt sức, 5: Rực rỡ
  moodLabel: string;
  tags: string[];
  note: string;
  aiReflection?: string;
  isEncrypted: boolean;
  safetyLevel: 'safe' | 'mild_stress' | 'high_attention';
}

export interface CareerPath {
  title: string;
  matchScore: number;
  riasecAlign: string;
  description: string;
  salaryOutlook: string;
  demandTrend: 'Rất cao (2026-2035)' | 'Tăng trưởng nhanh' | 'Ổn định';
  suitableMajors: string[];
  keySkills: string[];
}

export interface TimeCapsuleMessage {
  id: string;
  senderName: string;
  recipientType: 'self' | 'class';
  createdDate: string;
  unlockDate: string;
  title: string;
  content: string;
  isSealed: boolean;
  avatar: string;
  audioAttachment?: string;
}

export interface ARYearbookItem {
  id: string;
  studentName: string;
  role: string;
  quote: string;
  photoUrl: string;
  videoMessageUrl: string;
  audioNoteText: string;
  ambition2030: string;
  likes: number;
}

export interface StrategyBriefReport {
  id: string;
  topic: string;
  createdAt: string;
  executiveSummary: string;
  detailedLogic: {
    operationMechanism: string;
    userExperience: string;
  };
  technicalFocus: string;
  humanTouch: string;
  actionPlan: string;
  source: string;
}

// ==========================================
// CƠ SỞ DỮ LIỆU GOOGLE SHEETS LỚP 12A16
// ==========================================

export interface ClassStudent {
  id: string;
  studentCode: string; // VD: 12A16-01
  name: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  group: number; // Tổ 1, 2, 3, 4
  role: string; // Lớp trưởng, Bí thư, Tổ trưởng, Học sinh...
  parentName: string;
  parentPhone: string;
  address: string;
  karmaPoints: number;
  streakDays: number;
  conduct: 'Tốt' | 'Khá' | 'Đạt';
  status: 'active' | 'attention';
  avatar?: string;
  note: string;
}

export interface SubjectScoreSet {
  math: number;
  literature: number;
  english: number;
  physics: number;
  chemistry: number;
  biology: number;
  history: number;
  geography: number;
  civics: number; // GDCD / Kinh tế & Pháp luật
  informatics: number;
}

export interface YearGradeDetail {
  sem1Gpa: number;
  sem2Gpa: number;
  yearGpa: number;
  conduct: 'Tốt' | 'Khá' | 'Đạt';
  academicRank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt';
  subjects: SubjectScoreSet;
}

export interface StudentGradeRecord {
  studentId: string;
  studentCode: string;
  studentName: string;
  grade10: YearGradeDetail;
  grade11: YearGradeDetail;
  grade12PredictedGpa: number;
  trend: 'up' | 'stable' | 'down';
  bestSubject: string;
  needSupportSubject: string;
  targetMajor: string;
  examCombination: string; // D01, A00, A01, C00...
}

export interface SchoolRuleItem {
  id: string;
  code: string; // NQ-01, NQ-02...
  category: 'Chuyên Cần & Giờ Giấc' | 'Đồng Phục & Tác Phong' | 'Kỷ Luật Học Tập' | 'Vệ Sinh & Cơ Sở Vật Chất' | 'Ứng Xử & Văn Hóa Số';
  title: string;
  description: string;
  deductionPoints: number; // Mức điểm trừ (5, 10, 15, 20, 30...)
  severity: 'Nhẹ' | 'Vừa' | 'Nghiêm Trọng';
  remediationMethod: string; // Cách khắc phục tích cực / chuộc lỗi bằng Karma
}

export interface ViolationRecord {
  id: string;
  date: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  ruleId: string;
  ruleCode: string;
  ruleTitle: string;
  category: string;
  deductionPoints: number;
  recordedBy: string; // Ban cờ đỏ, Lớp phó kỷ luật, Cô Phương Linh...
  status: 'Chờ xử lý' | 'Đã nhắc nhở' | 'Đã khắc phục / Chuộc lỗi bằng Karma';
  remediationAction?: string;
  note?: string;
}

export interface ClassGeneralInfo {
  className: string; // 12A16
  academicYear: string; // 2026 - 2027
  homeroomTeacher: string; // Cô Phương Linh
  phone: string;
  email: string;
  room: string;
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  cadres: {
    role: string;
    name: string;
    phone: string;
  }[];
  subjectTeachers: {
    subject: string;
    teacherName: string;
  }[];
  announcements: {
    id: string;
    date: string;
    title: string;
    content: string;
    priority: 'urgent' | 'normal';
  }[];
}

export interface GoogleSheetConfig {
  sheetId: string;
  sheetUrl: string;
  isConnected: boolean;
  lastSyncedAt: string | null;
  autoSync: boolean;
  studentsSheetUrl?: string;
  rulesSheetUrl?: string;
  lastSyncStatus?: 'idle' | 'success' | 'error' | 'syncing';
  lastSyncMessage?: string;
  syncedCounts?: { students: number; rules: number };
  sheetNames: {
    students: string;
    grades: string;
    rules: string;
    violations: string;
    classInfo: string;
  };
}

// ==========================================
// KỸ NĂNG SƯ PHẠM MỚI (SKILL EDUCATION)
// ==========================================

export interface KarmaTransaction {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  type: 'grant' | 'deduct' | 'redeem' | 'remediate';
  amount: number;
  reason: string;
  timestamp: string;
  grantedBy: string;
}

export interface ParentReportMessage {
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  weekNumber: number;
  highlights: string[];
  attendanceStreak: number;
  karmaPoints: number;
  teacherNote: string;
  suggestedHomeAction: string;
  generatedMessage: string;
}

export interface HomeroomLessonPlan {
  id: string;
  topic: string;
  monthTheme: string;
  targetDurationMinutes: number;
  objectives: {
    knowledge: string;
    skills: string;
    attitude: string;
  };
  preparation: {
    teacher: string;
    students: string;
  };
  activities: {
    phase: string;
    duration: string;
    content: string;
    teacherActivity: string;
    studentActivity: string;
  }[];
  homeroomMessage: string;
}

export interface SocraticFeedback {
  topic: string;
  studentDraft: string;
  guidingQuestions: string[];
  criticalThinkingAngles: string[];
  rhetoricalTips: string[];
  improvedVocabulary: { original: string; suggested: string; explanation: string }[];
  encouragement: string;
}

export interface ExamCountdownInfo {
  targetDate: string; // 2027-06-25
  examName: string;
  daysRemaining: number;
  milestones: {
    id: string;
    title: string;
    date: string;
    isCompleted: boolean;
    description: string;
  }[];
}

