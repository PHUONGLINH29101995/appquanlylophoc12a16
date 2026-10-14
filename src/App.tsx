import React, { useState } from 'react';
import { 
  UserRole, 
  KarmaPerk, 
  StudentPerkHold, 
  MoodEntry, 
  TimeCapsuleMessage,
  ClassStudent,
  StudentGradeRecord,
  SchoolRuleItem,
  ViolationRecord,
  ClassGeneralInfo,
  GoogleSheetConfig
} from './types/edtech';
import { 
  INITIAL_PERKS, 
  INITIAL_HEATMAP_DATA, 
  INITIAL_MOODS, 
  INITIAL_CAREER_PATHS, 
  INITIAL_YEARBOOK, 
  INITIAL_CAPSULES 
} from './mockData/initialData';
import { 
  INITIAL_CLASS_STUDENTS,
  INITIAL_GRADES_10_11,
  INITIAL_SCHOOL_RULES,
  INITIAL_VIOLATIONS,
  INITIAL_CLASS_INFO,
  INITIAL_GOOGLE_SHEET_CONFIG
} from './mockData/classDatabaseData';
import { Header } from './components/Header';
import { StrategyConsultantModal } from './components/StrategyConsultantModal';
import { GamificationSection } from './components/GamificationSection';
import { AcademicHeatmapSection } from './components/AcademicHeatmapSection';
import { MentalHealthSection } from './components/MentalHealthSection';
import { CareerGuidanceSection } from './components/CareerGuidanceSection';
import { MemorySpaceSection } from './components/MemorySpaceSection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { GoogleSheetsDatabaseSection } from './components/GoogleSheetsDatabaseSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import { syncGoogleSheetData } from './services/googleSheetsService';
import { SocraticTutorSection } from './components/SocraticTutorSection';
import { ExamCountdownSection } from './components/ExamCountdownSection';
import { SmartHomeroomToolsModal } from './components/SmartHomeroomToolsModal';
import { KarmaTransaction } from './types/edtech';
import { 
  Sparkles, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('database');
  const [karmaPoints, setKarmaPoints] = useState<number>(1650);
  const [streakDays, setStreakDays] = useState<number>(24);
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('gemini_api_key'));
    }
    return false;
  });
  // Tự động mở Modal bắt buộc nhập API key khi chưa có key trong localStorage (AI_INSTRUCTIONS.md)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('gemini_api_key');
    }
    return false;
  });
  const [isHomeroomToolsOpen, setIsHomeroomToolsOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('st-01');

  // Karma History / Audit Log
  const [karmaHistory, setKarmaHistory] = useState<KarmaTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('12a16_karma_history');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return [
      {
        id: 'tx-1',
        studentId: 'st-01',
        studentCode: '12A16-01',
        studentName: 'Nguyễn Minh Quân',
        type: 'grant',
        amount: 150,
        reason: 'Đạt chuỗi chuyên cần 18 ngày và tương trợ bạn học môn Ngữ văn',
        timestamp: '12/10/2026, 16:30:00',
        grantedBy: 'Cô Phương Linh (GVCN)',
      },
      {
        id: 'tx-2',
        studentId: 'st-02',
        studentCode: '12A16-02',
        studentName: 'Trần Thị Mai Anh',
        type: 'grant',
        amount: 100,
        reason: 'Tổ chức tốt phong trào Đôi bạn cùng tiến của Chi đoàn',
        timestamp: '10/10/2026, 09:15:00',
        grantedBy: 'Cô Phương Linh (GVCN)',
      },
    ];
  });

  // Google Sheets Online Database State with LocalStorage Persistence
  const [students, setStudents] = useState<ClassStudent[]>(() => {
    try {
      const saved = localStorage.getItem('12a16_students');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return INITIAL_CLASS_STUDENTS;
  });

  const [grades, setGrades] = useState<StudentGradeRecord[]>(INITIAL_GRADES_10_11);

  const [rules, setRules] = useState<SchoolRuleItem[]>(() => {
    try {
      const saved = localStorage.getItem('12a16_rules');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return INITIAL_SCHOOL_RULES;
  });

  const [violations, setViolations] = useState<ViolationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('12a16_violations');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return INITIAL_VIOLATIONS;
  });

  const [classInfo, setClassInfo] = useState<ClassGeneralInfo>(INITIAL_CLASS_INFO);
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(INITIAL_GOOGLE_SHEET_CONFIG);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Educational Ecosystem state
  const [perks, setPerks] = useState<KarmaPerk[]>(INITIAL_PERKS);
  const [ownedPerks, setOwnedPerks] = useState<StudentPerkHold[]>([
    {
      id: 'hold-1',
      perkId: 'perk-1',
      title: 'Thẻ Tuyên Dương & Miễn Trực Nhật 01 Buổi',
      redeemedAt: '12/10/2026',
      expiresAt: '19/10/2026',
      status: 'active',
      code: 'PERK-12A16-8842',
    },
  ]);
  const [heatmaps] = useState(INITIAL_HEATMAP_DATA);
  const [moods, setMoods] = useState<MoodEntry[]>(INITIAL_MOODS);
  const [careerPaths] = useState(INITIAL_CAREER_PATHS);
  const [yearbook, setYearbook] = useState(INITIAL_YEARBOOK);
  const [capsules, setCapsules] = useState<TimeCapsuleMessage[]>(INITIAL_CAPSULES);

  // Điểm số môn học định kỳ của học sinh (đặc biệt môn Ngữ văn)
  const studentGpa = [
    { subject: 'Ngữ Văn', score: 8.8 },
    { subject: 'Tiếng Anh', score: 8.6 },
    { subject: 'Toán Học', score: 8.4 },
    { subject: 'Vật Lý', score: 8.2 },
  ];

  // Google Sheets Sync Handlers (Hỗ trợ cả Localhost Server và Static SPA trên Vercel)
  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    try {
      const data = await syncGoogleSheetData(sheetConfig);
      if (data.students && data.students.length > 0) {
        setStudents(data.students);
        localStorage.setItem('12a16_students', JSON.stringify(data.students));
        setClassInfo(prev => ({
          ...prev,
          totalStudents: data.students!.length,
          maleCount: data.students!.filter((s: ClassStudent) => s.gender === 'Nam').length,
          femaleCount: data.students!.filter((s: ClassStudent) => s.gender === 'Nữ').length,
        }));
      }
      if (data.rules && data.rules.length > 0) {
        setRules(data.rules);
        localStorage.setItem('12a16_rules', JSON.stringify(data.rules));
      }
      setSheetConfig(prev => ({
        ...prev,
        isConnected: true,
        lastSyncedAt: data.timestamp || new Date().toLocaleString('vi-VN'),
        lastSyncStatus: data.isLive ? 'success' : 'idle',
        lastSyncMessage: data.message,
        syncedCounts: {
          students: data.students ? data.students.length : prev.syncedCounts?.students || 42,
          rules: data.rules ? data.rules.length : prev.syncedCounts?.rules || 12,
        },
      }));
    } catch (err) {
      console.warn('Sync completed in fallback mode:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateSheetConfig = (newConfig: Partial<GoogleSheetConfig>) => {
    setSheetConfig(prev => ({ ...prev, ...newConfig }));
    fetch('/api/google-sheets/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    }).catch(err => console.error(err));
  };

  const handleImportStudents = (newStudents: ClassStudent[]) => {
    setStudents(newStudents);
    localStorage.setItem('12a16_students', JSON.stringify(newStudents));
    setClassInfo(prev => ({
      ...prev,
      totalStudents: newStudents.length,
      maleCount: newStudents.filter(s => s.gender === 'Nam').length,
      femaleCount: newStudents.filter(s => s.gender === 'Nữ').length,
    }));
  };

  const handleImportRules = (newRules: SchoolRuleItem[]) => {
    setRules(newRules);
    localStorage.setItem('12a16_rules', JSON.stringify(newRules));
  };

  const handleResetDefaultData = () => {
    setStudents(INITIAL_CLASS_STUDENTS);
    setRules(INITIAL_SCHOOL_RULES);
    localStorage.removeItem('12a16_students');
    localStorage.removeItem('12a16_rules');
    setClassInfo(INITIAL_CLASS_INFO);
  };

  const handleAddViolation = (newVio: Omit<ViolationRecord, 'id'>) => {
    const id = `vio-${Date.now()}`;
    const record: ViolationRecord = { ...newVio, id };
    setViolations(prev => [record, ...prev]);

    // Trừ điểm rèn luyện Karma của học sinh tương ứng
    setStudents(prev => prev.map(s => {
      if (s.id === newVio.studentId) {
        return {
          ...s,
          karmaPoints: Math.max(0, s.karmaPoints - newVio.deductionPoints),
        };
      }
      return s;
    }));

    if (newVio.studentCode === '12A16-01') {
      setKarmaPoints(prev => Math.max(0, prev - newVio.deductionPoints));
    }

    // Gửi về server
    fetch('/api/google-sheets/record-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVio),
    }).catch(err => console.error(err));
  };

  const handleRemediateViolation = (violationId: string) => {
    setViolations(prev => prev.map(v => {
      if (v.id === violationId) {
        return {
          ...v,
          status: 'Đã khắc phục / Chuộc lỗi bằng Karma',
          remediationAction: 'Đã hoàn thành rèn luyện tích cực và trừ điểm Karma bù đắp',
        };
      }
      return v;
    }));
  };

  // Gamification Handlers
  const handleRedeemPerk = (perk: KarmaPerk) => {
    setKarmaPoints(prev => Math.max(0, prev - perk.cost));
    const randomCode = `PERK-12A16-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHold: StudentPerkHold = {
      id: `hold-${Date.now()}`,
      perkId: perk.id,
      title: perk.title,
      redeemedAt: new Date().toLocaleDateString('vi-VN'),
      expiresAt: new Date(Date.now() + perk.cooldownDays * 86400000).toLocaleDateString('vi-VN'),
      status: 'active',
      code: randomCode,
    };
    setOwnedPerks(prev => [newHold, ...prev]);
  };

  const handleUsePerk = (holdId: string) => {
    setOwnedPerks(prev => prev.map(p => p.id === holdId ? { ...p, status: 'used' } : p));
  };

  const handleAddMood = (newMood: MoodEntry) => {
    setMoods(prev => [newMood, ...prev]);
    setKarmaPoints(prev => prev + 50);
  };

  const handleAddCapsule = (newCapsule: TimeCapsuleMessage) => {
    setCapsules(prev => [newCapsule, ...prev]);
    setKarmaPoints(prev => prev + 100);
  };

  const handleLikeYearbook = (itemId: string) => {
    setYearbook(prev => prev.map(y => y.id === itemId ? { ...y, likes: y.likes + 1 } : y));
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleGrantKarmaPoints = (studentId: string, points: number, reason?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, karmaPoints: s.karmaPoints + points } : s));
    if (studentId === selectedStudentId || student.studentCode === '12A16-01') {
      setKarmaPoints(prev => prev + points);
    }

    const newTx: KarmaTransaction = {
      id: `tx-${Date.now()}`,
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: student.name,
      type: 'grant',
      amount: points,
      reason: reason || 'Khen thưởng nỗ lực học tập và rèn luyện tích cực',
      timestamp: new Date().toLocaleString('vi-VN'),
      grantedBy: 'Cô Phương Linh (GVCN)',
    };

    setKarmaHistory(prev => {
      const next = [newTx, ...prev];
      try {
        localStorage.setItem('12a16_karma_history', JSON.stringify(next));
      } catch (_e) {}
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Sticky Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={(role) => {
          setCurrentRole(role);
          // If switching role, default tab appropriately
          if (role === 'teacher') setActiveTab('overview');
        }}
        karmaPoints={karmaPoints}
        streakDays={streakDays}
        onOpenConsultant={() => setIsConsultantModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudentId={setSelectedStudentId}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* If Active Tab is Database, render GoogleSheetsDatabaseSection regardless of Role */}
        {activeTab === 'database' ? (
          <GoogleSheetsDatabaseSection
            students={students}
            grades={grades}
            rules={rules}
            violations={violations}
            classInfo={classInfo}
            sheetConfig={sheetConfig}
            onUpdateSheetConfig={handleUpdateSheetConfig}
            onSyncGoogleSheet={handleSyncGoogleSheet}
            onAddViolation={handleAddViolation}
            onRemediateViolation={handleRemediateViolation}
            onImportStudents={handleImportStudents}
            onImportRules={handleImportRules}
            onResetDefaultData={handleResetDefaultData}
            isSyncing={isSyncing}
          />
        ) : (
          <>
            {/* STUDENT PERSPECTIVE */}
            {currentRole === 'student' && (
              <div>
                {activeTab === 'gamification' && (
                  <GamificationSection
                    karmaPoints={karmaPoints}
                    streakDays={streakDays}
                    perks={perks}
                    onRedeemPerk={handleRedeemPerk}
                    ownedPerks={ownedPerks}
                    onUsePerk={handleUsePerk}
                  />
                )}

                {activeTab === 'heatmap' && (
                  <AcademicHeatmapSection
                    heatmaps={heatmaps}
                    studentName={`${selectedStudent.name} (${selectedStudent.studentCode})`}
                  />
                )}

                {activeTab === 'socratic-literature' && (
                  <SocraticTutorSection />
                )}

                {activeTab === 'countdown' && (
                  <ExamCountdownSection />
                )}

                {activeTab === 'mental-health' && (
                  <MentalHealthSection
                    moods={moods}
                    onAddMood={handleAddMood}
                  />
                )}

                {activeTab === 'career' && (
                  <CareerGuidanceSection
                    careerPaths={careerPaths}
                    studentGpa={studentGpa}
                  />
                )}

                {activeTab === 'memory' && (
                  <MemorySpaceSection
                    yearbook={yearbook}
                    capsules={capsules}
                    onAddCapsule={handleAddCapsule}
                    onLikeYearbook={handleLikeYearbook}
                  />
                )}
              </div>
            )}

            {/* TEACHER PERSPECTIVE */}
            {currentRole === 'teacher' && (
              <TeacherDashboard
                onGrantKarmaPoints={handleGrantKarmaPoints}
                onOpenDatabase={() => setActiveTab('database')}
                onOpenHomeroomTools={() => setIsHomeroomToolsOpen(true)}
                students={students}
                karmaHistory={karmaHistory}
              />
            )}

            {/* PARENT PERSPECTIVE */}
            {currentRole === 'parent' && (
              <ParentDashboard
                studentName={`${selectedStudent.name} (${selectedStudent.studentCode} - GVCN: Cô Phương Linh)`}
              />
            )}
          </>
        )}

      </main>

      {/* Strategy Consultant Modal Studio */}
      <StrategyConsultantModal
        isOpen={isConsultantModalOpen}
        onClose={() => setIsConsultantModalOpen(false)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Smart Homeroom Tools Modal (Zalo Parent Messenger, CV 5512, Differentiated Matrix) */}
      <SmartHomeroomToolsModal
        isOpen={isHomeroomToolsOpen}
        onClose={() => setIsHomeroomToolsOpen(false)}
        students={students}
        grades={grades}
      />

      {/* Gemini API Key & Model Configuration Modal (AI_INSTRUCTIONS.md) */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => {
          setIsApiKeyModalOpen(false);
          if (typeof window !== 'undefined') {
            setHasApiKey(Boolean(localStorage.getItem('gemini_api_key')));
          }
        }}
        onSave={(key) => setHasApiKey(Boolean(key))}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">LỚP 12A16 - CÔ PHƯƠNG LINH</span>
              <p className="text-[11px] text-slate-400">
                Hệ Thống Quản Lý Giáo Dục Thông Minh & Cơ Sở Dữ Liệu Google Sheet Trực Tuyến
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Mực Sư Phạm & Bảo Mật Dữ Liệu
            </span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('database')}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Database Google Sheet
            </button>
            <span>•</span>
            <span className="text-slate-500">Học bạ Lớp 10-11</span>
            <span>•</span>
            <span className="text-slate-500">Nội quy & Điểm trừ</span>
            <span>•</span>
            <button
              onClick={() => setIsConsultantModalOpen(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Cố Vấn AI
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
