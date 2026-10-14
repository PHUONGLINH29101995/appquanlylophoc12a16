import React, { useState } from 'react';
import { 
  ClassStudent, 
  StudentGradeRecord, 
  SchoolRuleItem, 
  ViolationRecord, 
  ClassGeneralInfo, 
  GoogleSheetConfig 
} from '../types/edtech';
import { 
  Database, 
  FileSpreadsheet, 
  Users, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Plus, 
  Settings, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  Phone, 
  MapPin, 
  ChevronRight, 
  X,
  FileText,
  UserCheck,
  Flame,
  ArrowUpRight,
  Upload,
  FileUp,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  fetchGoogleSheetCsvClient, 
  parseStudentsCsv, 
  parseRulesCsv 
} from '../services/googleSheetsService';

interface GoogleSheetsDatabaseSectionProps {
  students: ClassStudent[];
  grades: StudentGradeRecord[];
  rules: SchoolRuleItem[];
  violations: ViolationRecord[];
  classInfo: ClassGeneralInfo;
  sheetConfig: GoogleSheetConfig;
  onUpdateSheetConfig: (newConfig: Partial<GoogleSheetConfig>) => void;
  onSyncGoogleSheet: () => Promise<void>;
  onAddViolation: (violation: Omit<ViolationRecord, 'id'>) => void;
  onRemediateViolation: (violationId: string) => void;
  onImportStudents?: (newStudents: ClassStudent[]) => void;
  onImportRules?: (newRules: SchoolRuleItem[]) => void;
  onResetDefaultData?: () => void;
  isSyncing: boolean;
}

export const GoogleSheetsDatabaseSection: React.FC<GoogleSheetsDatabaseSectionProps> = ({
  students,
  grades,
  rules,
  violations,
  classInfo,
  sheetConfig,
  onUpdateSheetConfig,
  onSyncGoogleSheet,
  onAddViolation,
  onRemediateViolation,
  onImportStudents,
  onImportRules,
  onResetDefaultData,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'grades' | 'rules' | 'violations' | 'overview' | 'config'>('overview');
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedRuleCategory, setSelectedRuleCategory] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  
  // Modals
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<ClassStudent | null>(null);
  const [selectedGradeDetail, setSelectedGradeDetail] = useState<StudentGradeRecord | null>(null);
  const [isAddViolationModalOpen, setIsAddViolationModalOpen] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Connection testing state
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; accessible?: boolean; isAuthRequired?: boolean; message: string } | null>(null);

  // Direct CSV Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importType, setImportType] = useState<'students' | 'rules'>('students');
  const [rawCsvInput, setRawCsvInput] = useState<string>('');
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);

  // New violation form
  const [newVioStudentId, setNewVioStudentId] = useState<string>(students[0]?.id || '');
  const [newVioRuleId, setNewVioRuleId] = useState<string>(rules[0]?.id || '');
  const [newVioRecordedBy, setNewVioRecordedBy] = useState<string>('Cô Phương Linh (GVCN)');
  const [newVioNote, setNewVioNote] = useState<string>('');

  // Config form state
  const [customSheetId, setCustomSheetId] = useState<string>(sheetConfig.sheetId);
  const [customSheetUrl, setCustomSheetUrl] = useState<string>(sheetConfig.sheetUrl);
  const [customStudentsSheetUrl, setCustomStudentsSheetUrl] = useState<string>(sheetConfig.studentsSheetUrl || '');
  const [customRulesSheetUrl, setCustomRulesSheetUrl] = useState<string>(sheetConfig.rulesSheetUrl || '');

  const handleManualSync = async () => {
    await onSyncGoogleSheet();
    setSyncSuccessMessage(`Đã đồng bộ trực tuyến thành công với Google Sheet: ${students.length} học sinh và ${rules.length} nội quy!`);
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const resp = await fetch('/api/google-sheets/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: customSheetUrl.trim(),
          sheetId: customSheetId.trim(),
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setTestResult(data);
        return;
      }
    } catch (_e) {
      // Backend server không phản hồi (chế độ Static Vercel), kiểm tra trực tiếp client-side
    }

    // Client-side testing directly against Google Sheet
    try {
      const clientTest = await fetchGoogleSheetCsvClient(
        customSheetId.trim(),
        undefined,
        customSheetUrl.trim()
      );
      if (clientTest.success) {
        setTestResult({
          success: true,
          message: 'Kết nối trực tuyến tới Google Sheet thành công! Bảng tính công khai và sẵn sàng đồng bộ.',
          previewRows: 5,
        });
      } else if (clientTest.isAuthRequired) {
        setTestResult({
          success: false,
          isAuthRequired: true,
          message: 'Google Sheet đang ở chế độ Riêng tư (Private). Vui lòng đổi quyền chia sẻ sang "Bất kỳ ai có đường liên kết đều có thể xem" (Viewer).',
        });
      } else {
        setTestResult({
          success: false,
          message: clientTest.error || 'Không thể đọc dữ liệu từ Google Sheet. Vui lòng kiểm tra lại URL.',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'Lỗi kiểm tra kết nối: ' + e.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSheetConfig({
      sheetId: customSheetId.trim(),
      sheetUrl: customSheetUrl.trim(),
      studentsSheetUrl: customStudentsSheetUrl.trim(),
      rulesSheetUrl: customRulesSheetUrl.trim(),
      lastSyncedAt: new Date().toLocaleString('vi-VN'),
    });
    setSyncSuccessMessage('Đã lưu cấu hình kết nối Google Sheet thành công!');
    setTimeout(() => setSyncSuccessMessage(null), 3000);
  };

  // Import CSV text directly (Hỗ trợ cả Backend và Client-side)
  const handleParseAndImportCsv = async () => {
    if (!rawCsvInput.trim()) {
      setImportStatusMessage('Vui lòng dán hoặc chọn nội dung tệp CSV.');
      return;
    }

    let parsedItems: any[] = [];

    // 1. Thử gọi backend nếu có
    try {
      const resp = await fetch('/api/google-sheets/parse-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText: rawCsvInput,
          type: importType,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.items) {
          parsedItems = data.items;
        }
      }
    } catch (_e) {
      // Backend không có sẵn
    }

    // 2. Phân tích trực tiếp phía Client nếu backend chưa trả về items
    if (parsedItems.length === 0) {
      try {
        if (importType === 'students') {
          parsedItems = parseStudentsCsv(rawCsvInput);
        } else if (importType === 'rules') {
          parsedItems = parseRulesCsv(rawCsvInput);
        }
      } catch (err: any) {
        setImportStatusMessage('Lỗi phân tích CSV client-side: ' + err.message);
        return;
      }
    }

    if (parsedItems.length > 0) {
      if (importType === 'students' && onImportStudents) {
        onImportStudents(parsedItems);
        setSyncSuccessMessage(`Đã nạp thành công ${parsedItems.length} học sinh vào hệ thống!`);
      } else if (importType === 'rules' && onImportRules) {
        onImportRules(parsedItems);
        setSyncSuccessMessage(`Đã nạp thành công ${parsedItems.length} nội quy nhà trường vào hệ thống!`);
      }
      setIsImportModalOpen(false);
      setRawCsvInput('');
      setImportStatusMessage(null);
      setTimeout(() => setSyncSuccessMessage(null), 3500);
    } else {
      setImportStatusMessage('Không nhận diện được dòng dữ liệu hợp lệ trong nội dung CSV đã nhập.');
    }
  };

  const handleQuickAddViolationForRule = (ruleId: string) => {
    setNewVioRuleId(ruleId);
    if (!newVioStudentId && students[0]) setNewVioStudentId(students[0].id);
    setIsAddViolationModalOpen(true);
  };

  const handleCreateViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newVioStudentId);
    const rule = rules.find(r => r.id === newVioRuleId);
    if (!student || !rule) return;

    onAddViolation({
      date: new Date().toLocaleDateString('vi-VN'),
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: student.name,
      ruleId: rule.id,
      ruleCode: rule.code,
      ruleTitle: rule.title,
      category: rule.category,
      deductionPoints: rule.deductionPoints,
      recordedBy: newVioRecordedBy,
      status: 'Chờ xử lý',
      note: newVioNote || 'Ghi nhận vào sổ nề nếp lớp 12A16',
      remediationAction: rule.remediationMethod,
    });

    setIsAddViolationModalOpen(false);
    setNewVioNote('');
    setSyncSuccessMessage(`Đã ghi nhận vi phạm và trừ ${rule.deductionPoints} điểm của học sinh ${student.name}!`);
    setTimeout(() => setSyncSuccessMessage(null), 3500);
  };

  // CSV Template download
  const handleDownloadCsvTemplate = (type: 'students' | 'grades' | 'rules' | 'violations') => {
    let content = '';
    let filename = '';

    if (type === 'students') {
      filename = '12A16_DANH_SACH_HOC_SINH.csv';
      content = 'Mã Học Sinh,Họ Và Tên,Ngày Sinh,Giới Tính,Tổ,Chức Vụ,Điểm Karma,Chuỗi Chuyên Cần,Hạnh Kiểm,Tên Phụ Huynh,SĐT Phụ Huynh,Địa Chỉ\n' +
        students.map(s => `"${s.studentCode}","${s.name}","${s.dob}","${s.gender}",${s.group},"${s.role}",${s.karmaPoints},${s.streakDays},"${s.conduct}","${s.parentName}","${s.parentPhone}","${s.address}"`).join('\n');
    } else if (type === 'grades') {
      filename = '12A16_DIEM_SO_LOP_10_11.csv';
      content = 'Mã HS,Họ Tên,GPA Lớp 10 HK1,GPA Lớp 10 HK2,GPA Lớp 10 Cả Năm,GPA Lớp 11 HK1,GPA Lớp 11 HK2,GPA Lớp 11 Cả Năm,Xếp Loại 11,Dự Báo Lớp 12,Môn Thế Mạnh,Môn Cần Bổ Khuyết,Tổ Hợp Xét Tuyển,Ngành Mục Tiêu\n' +
        grades.map(g => `"${g.studentCode}","${g.studentName}",${g.grade10.sem1Gpa},${g.grade10.sem2Gpa},${g.grade10.yearGpa},${g.grade11.sem1Gpa},${g.grade11.sem2Gpa},${g.grade11.yearGpa},"${g.grade11.academicRank}",${g.grade12PredictedGpa},"${g.bestSubject}","${g.needSupportSubject}","${g.examCombination}","${g.targetMajor}"`).join('\n');
    } else if (type === 'rules') {
      filename = '12A16_NOI_QUY_NHA_TRUONG.csv';
      content = 'Mã Nội Quy,Danh Mục,Hành Vi Quy Định,Mức Điểm Trừ,Mức Độ,Phương Pháp Khắc Phục Tích Cực\n' +
        rules.map(r => `"${r.code}","${r.category}","${r.title}",${r.deductionPoints},"${r.severity}","${r.remediationMethod}"`).join('\n');
    } else {
      filename = '12A16_NHAT_KY_VI_PHAM.csv';
      content = 'Ngày,Mã HS,Tên Học Sinh,Mã Lỗi,Nội Dung Vi Phạm,Điểm Trừ,Người Ghi Nhận,Trạng Thái,Biện Pháp Khắc Phục,Ghi Chú\n' +
        violations.map(v => `"${v.date}","${v.studentCode}","${v.studentName}","${v.ruleCode}","${v.ruleTitle}",${v.deductionPoints},"${v.recordedBy}","${v.status}","${v.remediationAction || ''}","${v.note || ''}"`).join('\n');
    }

    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredStudents = students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    return matchQuery && matchGroup;
  });

  const filteredGrades = grades.filter(g => {
    const matchQuery = g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.examCombination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = selectedGradeFilter === 'all' 
      ? true 
      : selectedGradeFilter === 'up' 
        ? g.trend === 'up' 
        : selectedGradeFilter === 'excellent' 
          ? g.grade11.yearGpa >= 9.0 
          : g.grade11.yearGpa >= 8.0;
    return matchQuery && matchFilter;
  });

  const filteredRules = rules.filter(r => {
    const matchQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedRuleCategory === 'all' || r.category === selectedRuleCategory;
    return matchQuery && matchCategory;
  });

  const totalDeductionPoints = violations.reduce((acc, v) => acc + v.deductionPoints, 0);
  const resolvedViolationsCount = violations.filter(v => v.status.includes('khắc phục')).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner: Database Identity & Google Sheet Live Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Google Sheet Database Trực Tuyến
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
                {classInfo.academicYear} • GVCN: {classInfo.homeroomTeacher}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              LỚP 12A16 - CÔ PHƯƠNG LINH
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Cơ sở dữ liệu giáo dục trực tuyến kết nối hai chiều từ Google Sheet: Quản lý danh sách {students.length} học sinh, học bạ điểm số Lớp 10 & 11, Bộ khung {rules.length} nội quy nhà trường và Nhật ký điểm trừ vi phạm gắn liền cơ chế giáo dục tích cực.
            </p>
          </div>

          {/* Quick Actions & Live Connection Pill */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang Đồng Bộ Dữ Liệu...' : 'Đồng Bộ Từ Google Sheet'}</span>
            </button>

            {sheetConfig.sheetUrl && (
              <a
                href={sheetConfig.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-400/30 text-xs font-bold transition-all"
                title="Mở Google Sheet trên Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                <span>Mở Google Sheet trên Drive</span>
              </a>
            )}

            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Trạng thái: <strong className="text-emerald-300">{sheetConfig.isConnected ? 'Đã Kết Nối' : 'Chưa Kết Nối'}</strong></span>
              </div>
              <span className="text-[11px] text-slate-400">{sheetConfig.lastSyncedAt || 'Vừa cập nhật'}</span>
            </div>
          </div>
        </div>

        {/* Sync alert banner */}
        {syncSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex items-center overflow-x-auto no-scrollbar gap-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tổng Quan 12A16</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Học Sinh ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'grades'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Điểm Số Lớp 10 & 11</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Nội Quy & Điểm Trừ</span>
        </button>

        <button
          onClick={() => setActiveTab('violations')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'violations'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Nhật Ký Vi Phạm ({violations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ml-auto ${
            activeTab === 'config'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cấu Hình & Tải Mẫu</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW LỚP 12A16 */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Sĩ Số Lớp 12A16</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{classInfo.totalStudents} Học Sinh</div>
              <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <span>{classInfo.maleCount} Nam</span> • <span>{classInfo.femaleCount} Nữ</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Điểm Rèn Luyện TB</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">1,385 EXP</div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Xếp loại Tốt & Khá
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>GPA Lớp 11 (TB Lớp)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">8.48 / 10</div>
              <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Tăng +0.35 so với Lớp 10
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Vi Phạm Trong Tháng</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-rose-600">{violations.length} Trường Hợp</div>
              <div className="text-xs text-emerald-600 font-semibold">
                {resolvedViolationsCount}/{violations.length} Đã Khắc Phục Bằng Karma
              </div>
            </div>
          </div>

          {/* Class Cadres & Teacher Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Homeroom Teacher Profile */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  PL
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Giáo Viên Chủ Nhiệm</span>
                  <h3 className="text-lg font-black text-slate-900">{classInfo.homeroomTeacher}</h3>
                  <p className="text-xs text-slate-500">Bộ Môn: Ngữ Văn 12 • Tổ Trưởng Chuyên Môn</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-indigo-100/70 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><Phone className="w-3.5 h-3.5 text-indigo-600" /> Điện thoại liên hệ:</span>
                  <span className="font-bold text-slate-900">{classInfo.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> Phòng học chính:</span>
                  <span className="font-bold text-slate-900">{classInfo.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><Calendar className="w-3.5 h-3.5 text-indigo-600" /> Giờ sinh hoạt:</span>
                  <span className="font-bold text-slate-900">Sáng Thứ Bảy (Tiết 5)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-600/10 text-indigo-900 text-xs font-medium leading-relaxed">
                « Lớp 12A16 là một đại gia đình 42 thành viên. Chúng ta cùng nhau rèn luyện đức - trí - thể - mỹ, bứt phá mọi mục tiêu và bước vào cánh cổng trường Đại học với tư thế vững vàng nhất! »
              </div>
            </div>

            {/* Ban Cán Sự Lớp */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  Ban Cán Sự & Tổ Trưởng Lớp 12A16
                </h3>
                <span className="text-xs font-bold text-slate-500">9 Thành viên chủ chốt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {classInfo.cadres.map((cadre, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                      {cadre.role}
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm mt-1">{cadre.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {cadre.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements & Subject Teachers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Announcements */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                Thông Báo Chủ Nhiệm Từ Cô Phương Linh
              </h3>
              <div className="space-y-3">
                {classInfo.announcements.map(ann => (
                  <div key={ann.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 text-xs sm:text-sm">{ann.title}</span>
                      <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Teachers list */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Hội Đồng Giáo Viên Bộ Môn Lớp 12A16
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {classInfo.subjectTeachers.map((st, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col">
                    <span className="text-[11px] font-bold text-indigo-700">{st.subject}</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5">{st.teacherName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DANH SÁCH & THÔNG TIN HỌC SINH */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Data Source Info Strip */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-950">
                Nguồn Dữ Liệu: Google Sheet Trực Tuyến (Trang tính: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800">{sheetConfig.sheetNames.students}</code>)
              </span>
              <span className="text-slate-500">• Tổng số {students.length} Học Sinh</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Đồng bộ lại</span>
              </button>
              {onImportStudents && (
                <button
                  onClick={() => {
                    setImportType('students');
                    setIsImportModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  <FileUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Nhập CSV Danh Sách</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên, mã học sinh, chức vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc Tổ:
              </span>
              {(['all', 1, 2, 3, 4] as const).map(grp => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedGroup === grp
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grp === 'all' ? 'Tất cả' : `Tổ ${grp}`}
                </button>
              ))}

              <button
                onClick={() => handleDownloadCsvTemplate('students')}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                title="Tải file CSV danh sách học sinh"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Mã HS</th>
                    <th className="py-3.5 px-4">Họ Và Tên</th>
                    <th className="py-3.5 px-4">Ngày Sinh</th>
                    <th className="py-3.5 px-4">Giới Tính</th>
                    <th className="py-3.5 px-4">Tổ</th>
                    <th className="py-3.5 px-4">Chức Vụ</th>
                    <th className="py-3.5 px-4">Điểm Karma EXP</th>
                    <th className="py-3.5 px-4">Chuyên Cần</th>
                    <th className="py-3.5 px-4">Hạnh Kiểm</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{st.studentCode}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedStudentDetail(st)}
                          className="font-extrabold text-slate-900 hover:text-indigo-600 text-left"
                        >
                          {st.name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{st.dob}</td>
                      <td className="py-3 px-4 text-slate-600">{st.gender}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                          Tổ {st.group}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          st.role.includes('Trưởng') || st.role.includes('Bí Thư')
                            ? 'bg-indigo-100 text-indigo-800 font-bold'
                            : st.role.includes('Phó')
                              ? 'bg-sky-100 text-sky-800'
                              : 'text-slate-600'
                        }`}>
                          {st.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-amber-600 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {st.karmaPoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-semibold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                          {st.streakDays} ngày
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          {st.conduct}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudentDetail(st)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors"
                        >
                          Hồ Sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Hiển thị <strong>{filteredStudents.length}</strong> / <strong>{students.length}</strong> học sinh lớp 12A16</span>
              <span className="text-emerald-700 font-medium">Đồng bộ từ Google Sheet: {sheetConfig.sheetNames.students}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ĐIỂM SỐ CHI TIẾT LỚP 10 & 11 */}
      {/* ======================================================== */}
      {activeTab === 'grades' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc tổ hợp (D01, A00...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setSelectedGradeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedGradeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedGradeFilter('up')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedGradeFilter === 'up' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tiến bộ (↗)
              </button>
              <button
                onClick={() => setSelectedGradeFilter('excellent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedGradeFilter === 'excellent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Xuất Sắc (GPA ≥ 9.0)
              </button>

              <button
                onClick={() => handleDownloadCsvTemplate('grades')}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Xuất CSV Điểm</span>
              </button>
            </div>
          </div>

          {/* Grades Comparison Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Mã HS</th>
                    <th className="py-3.5 px-4">Họ Và Tên</th>
                    <th className="py-3.5 px-4">GPA Lớp 10</th>
                    <th className="py-3.5 px-4">GPA Lớp 11</th>
                    <th className="py-3.5 px-4">Tiến Độ</th>
                    <th className="py-3.5 px-4">Xếp Loại 11</th>
                    <th className="py-3.5 px-4">Dự Báo Lớp 12</th>
                    <th className="py-3.5 px-4">Môn Thế Mạnh</th>
                    <th className="py-3.5 px-4">Tổ Hợp Xét Tuyển</th>
                    <th className="py-3.5 px-4 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.map((g) => (
                    <tr key={g.studentId} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{g.studentCode}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">{g.studentName}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700">{g.grade10.yearGpa.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">HK1: {g.grade10.sem1Gpa} | HK2: {g.grade10.sem2Gpa}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-indigo-900 text-sm">{g.grade11.yearGpa.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">HK1: {g.grade11.sem1Gpa} | HK2: {g.grade11.sem2Gpa}</span>
                      </td>
                      <td className="py-3 px-4">
                        {g.grade11.yearGpa > g.grade10.yearGpa ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                            <TrendingUp className="w-3 h-3" /> +{(g.grade11.yearGpa - g.grade10.yearGpa).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-semibold text-[11px]">Ổn định</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          g.grade11.academicRank === 'Xuất sắc'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : g.grade11.academicRank === 'Giỏi'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.grade11.academicRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-sky-700">{g.grade12PredictedGpa}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {g.bestSubject}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{g.examCombination}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedGradeDetail(g)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px]"
                        >
                          10 Môn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: NỘI QUY NHÀ TRƯỜNG & KHUNG ĐIỂM TRỪ */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Data Source Info Strip */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-indigo-950">
                Nguồn Dữ Liệu: Google Sheet Trực Tuyến (Trang tính: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-700">{sheetConfig.sheetNames.rules}</code>)
              </span>
              <span className="text-slate-500">• {rules.length} Quy Định Học Đường Chuẩn Mực</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Đồng bộ lại</span>
              </button>
              {onImportRules && (
                <button
                  onClick={() => {
                    setImportType('rules');
                    setIsImportModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  <FileUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nhập CSV Nội Quy</span>
                </button>
              )}
            </div>
          </div>

          {/* Category filter bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm nội quy, mức trừ điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'Chuyên Cần & Giờ Giấc', 'Đồng Phục & Tác Phong', 'Kỷ Luật Học Tập', 'Vệ Sinh & Cơ Sở Vật Chất', 'Ứng Xử & Văn Hóa Số'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedRuleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    selectedRuleCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất Cả 5 Nhóm' : cat}
                </button>
              ))}

              <button
                onClick={() => handleDownloadCsvTemplate('rules')}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Rules List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <div 
                key={rule.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-mono font-black text-xs">
                      {rule.code}
                    </span>
                    
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-black text-xs">
                      Trừ -{rule.deductionPoints} Điểm
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {rule.category}
                  </span>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {rule.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cơ Chế Khắc Phục Tích Cực (Chuộc Lỗi):</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      {rule.remediationMethod}
                    </p>
                  </div>

                  <button
                    onClick={() => handleQuickAddViolationForRule(rule.id)}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span>Ghi Nhận Vi Phạm Lỗi Này</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: NHẬT KÝ ĐIỂM TRỪ & VI PHẠM THỰC TẾ */}
      {/* ======================================================== */}
      {activeTab === 'violations' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Sổ Theo Dõi Điểm Trừ & Rèn Luyện Lớp 12A16
              </h3>
              <p className="text-xs text-slate-500">
                Tổng cộng đã trừ {totalDeductionPoints} điểm • Có {resolvedViolationsCount} trường hợp đã hoàn thành chuộc lỗi
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsAddViolationModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Ghi Nhận Vi Phạm Mới</span>
              </button>

              <button
                onClick={() => handleDownloadCsvTemplate('violations')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Violations List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Ngày</th>
                    <th className="py-3.5 px-4">Học Sinh</th>
                    <th className="py-3.5 px-4">Lỗi Vi Phạm</th>
                    <th className="py-3.5 px-4">Mức Điểm Trừ</th>
                    <th className="py-3.5 px-4">Người Ghi Nhận</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Khắc Phục</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {violations.map((vio) => (
                    <tr key={vio.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-500">{vio.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">{vio.studentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{vio.studentCode}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-[10px] text-slate-600 mr-1.5">
                          {vio.ruleCode}
                        </span>
                        <span className="font-semibold text-slate-800">{vio.ruleTitle}</span>
                        {vio.note && (
                          <p className="text-[11px] text-slate-500 mt-0.5 italic">Ghi chú: {vio.note}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          -{vio.deductionPoints} Điểm
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{vio.recordedBy}</td>
                      <td className="py-3.5 px-4">
                        {vio.status.includes('khắc phục') ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã Chuộc Lỗi
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {vio.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!vio.status.includes('khắc phục') ? (
                          <button
                            onClick={() => onRemediateViolation(vio.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                          >
                            Chuộc Lỗi
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: CẤU HÌNH GOOGLE SHEET & TẢI FILE MẪU */}
      {/* ======================================================== */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Connection settings form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Cấu Hình Kết Nối Google Sheet Lớp 12A16
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Liên kết cơ sở dữ liệu trực tuyến Danh sách lớp học và Nội quy nhà trường của Cô Phương Linh
                </p>
              </div>

              {onResetDefaultData && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn khôi phục dữ liệu gốc chuẩn của Lớp 12A16 (42 học sinh & 12 nội quy)?')) {
                      onResetDefaultData();
                      setSyncSuccessMessage('Đã khôi phục dữ liệu gốc chuẩn Lớp 12A16 thành công!');
                      setTimeout(() => setSyncSuccessMessage(null), 3000);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors shrink-0"
                  title="Khôi phục lại 42 học sinh và 12 nội quy mặc định"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Khôi Phục Gốc</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Đường Dẫn Chính Google Sheet (Main Google Sheet URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSheetUrl}
                    onChange={(e) => {
                      setCustomSheetUrl(e.target.value);
                      const match = e.target.value.match(/\/d\/([a-zA-Z0-9-_]+)/);
                      if (match) setCustomSheetId(match[1]);
                    }}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs.../edit?usp=sharing"
                    className="flex-1 p-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {customSheetUrl && (
                    <a
                      href={customSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition-colors"
                      title="Mở Google Sheet trên trình duyệt"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Google Sheet ID:
                </label>
                <input
                  type="text"
                  value={customSheetId}
                  onChange={(e) => setCustomSheetId(e.target.value)}
                  placeholder="Ví dụ: 12A16_SHEET_2026_CO_PHUONG_LINH_DB"
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono font-medium text-slate-800"
                />
              </div>

              {/* Advanced separate sheet tab links */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <span className="font-bold text-indigo-950 block text-xs">
                  Tùy Chọn Mở Rộng: Đường Dẫn Riêng Biệt Từng Trang Tính (Nếu cần)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">
                      1. Link riêng Danh Sách Học Sinh:
                    </label>
                    <input
                      type="text"
                      value={customStudentsSheetUrl}
                      onChange={(e) => setCustomStudentsSheetUrl(e.target.value)}
                      placeholder="Để trống nếu chung file Google Sheet chính"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">
                      2. Link riêng Nội Quy Nhà Trường:
                    </label>
                    <input
                      type="text"
                      value={customRulesSheetUrl}
                      onChange={(e) => setCustomRulesSheetUrl(e.target.value)}
                      placeholder="Để trống nếu chung file Google Sheet chính"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Sheet tabs mapping */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  Tên Các Trang Tính (Tabs) Chuẩn Trong File Google Sheet:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">1. Tab Danh Sách Học Sinh:</label>
                    <input type="text" readOnly value={sheetConfig.sheetNames.students} className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-indigo-900" />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">2. Tab Nội Quy Nhà Trường:</label>
                    <input type="text" readOnly value={sheetConfig.sheetNames.rules} className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px] font-bold text-indigo-900" />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">3. Tab Điểm số lớp 10, 11:</label>
                    <input type="text" readOnly value={sheetConfig.sheetNames.grades} className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">4. Tab Điểm trừ & vi phạm:</label>
                    <input type="text" readOnly value={sheetConfig.sheetNames.violations} className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px]" />
                  </div>
                </div>
              </div>

              {/* Test connection diagnostic display */}
              {testResult && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                  testResult.accessible 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : testResult.isAuthRequired 
                      ? 'bg-amber-50 border-amber-200 text-amber-900' 
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  {testResult.accessible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold">{testResult.message}</div>
                    {testResult.isAuthRequired && (
                      <p className="font-normal text-[11px] text-amber-800 leading-relaxed">
                        👉 Hướng dẫn khắc phục: Trên Google Sheet, nhấn nút <strong>"Chia sẻ" (Share)</strong> ở góc trên bên phải ➔ Đổi quyền mục "Truy cập chung" thành <strong>"Bất kỳ ai có đường liên kết đều có thể xem" (Viewer)</strong>.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
                >
                  Lưu Cấu Hình
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Đang Kiểm Tra...' : 'Kiểm Tra Quyền Truy Cập'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-colors flex items-center gap-2 ml-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Đồng Bộ Ngay</span>
                </button>
              </div>
            </form>
          </div>

          {/* Download Template Package & Direct CSV Tools */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Bộ File Mẫu Google Sheet Chuẩn Cho Lớp 12A16
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cô Phương Linh có thể tải về các tệp CSV chuẩn hóa dưới đây để tải lên Google Drive của mình chỉ trong 30 giây:
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleDownloadCsvTemplate('students')}
                  className="w-full p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    1. Mẫu Danh Sách Học Sinh 12A16
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleDownloadCsvTemplate('rules')}
                  className="w-full p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    2. Mẫu Nội Quy & Điểm Trừ
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleDownloadCsvTemplate('grades')}
                  className="w-full p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    3. Mẫu Điểm Số Lớp 10 & 11
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleDownloadCsvTemplate('violations')}
                  className="w-full p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    4. Mẫu Nhật Ký Vi Phạm
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Live Data Export Section */}
              <div className="pt-2 border-t border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider block">
                  Xuất Dữ Liệu Thời Gian Thực (Live Export):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadCsvTemplate('students')}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    title="Xuất file CSV danh sách 42 học sinh kèm điểm Karma thực tế"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Xuất 42 HS (Live)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadCsvTemplate('violations')}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    title="Xuất sổ theo dõi vi phạm và khắc phục tích cực"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-700" />
                    <span>Xuất Sổ Kỷ Luật</span>
                  </button>
                </div>
              </div>

              {/* Direct CSV Upload Trigger Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportType('students');
                    setIsImportModalOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Nhập Trực Tiếp Tệp CSV Vào App</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-indigo-200 text-[11px] text-slate-600 space-y-1">
              <strong className="text-indigo-900 block font-bold">4 Bước Kết Nối Nhanh Với Google Sheet:</strong>
              <span>1. Tải file mẫu CSV về máy tính</span><br />
              <span>2. Tạo trang tính mới trên Google Drive và tải file CSV lên</span><br />
              <span>3. Bấm <strong>Chia sẻ (Share)</strong> ➔ Chọn <strong>"Bất kỳ ai có đường liên kết đều có thể xem"</strong></span><br />
              <span>4. Dán liên kết vào ô Cấu hình bên trái và bấm <strong>"Đồng bộ ngay"</strong>.</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CHI TIẾT HỒ SƠ HỌC SINH */}
      {/* ======================================================== */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedStudentDetail.name.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedStudentDetail.name}</h3>
                  <span className="font-mono text-xs text-indigo-600 font-bold">{selectedStudentDetail.studentCode} • Tổ {selectedStudentDetail.group}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Chức Vụ Lớp:</span>
                  <span className="font-bold text-slate-900">{selectedStudentDetail.role}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Ngày Sinh:</span>
                  <span className="font-bold text-slate-900">{selectedStudentDetail.dob} ({selectedStudentDetail.gender})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 block text-[10px] font-bold">Điểm Rèn Luyện Karma:</span>
                  <span className="text-lg font-black text-amber-950">{selectedStudentDetail.karmaPoints.toLocaleString()} EXP</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-800 block text-[10px] font-bold">Chuỗi Chuyên Cần:</span>
                  <span className="text-lg font-black text-rose-600">{selectedStudentDetail.streakDays} Ngày</span>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">Thông Tin Phụ Huynh:</span>
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ tên phụ huynh:</span>
                  <span className="font-semibold text-slate-800">{selectedStudentDetail.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-bold text-indigo-700">{selectedStudentDetail.parentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ cư trú:</span>
                  <span className="font-semibold text-slate-800 text-right">{selectedStudentDetail.address}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 space-y-1">
                <span className="font-bold text-indigo-900 block">Nhận Xét Sư Phạm Của Cô Phương Linh:</span>
                <p className="text-slate-700 italic leading-relaxed">{selectedStudentDetail.note}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BẢNG ĐIỂM 10 MÔN CHI TIẾT */}
      {/* ======================================================== */}
      {selectedGradeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 font-mono">{selectedGradeDetail.studentCode}</span>
                <h3 className="font-extrabold text-slate-900 text-lg">Bảng Điểm 10 Môn: {selectedGradeDetail.studentName}</h3>
                <p className="text-xs text-slate-500">Mục tiêu: {selectedGradeDetail.targetMajor} ({selectedGradeDetail.examCombination})</p>
              </div>

              <button
                onClick={() => setSelectedGradeDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comparison of Grade 10 and 11 subject scores */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Môn Học</th>
                    <th className="py-2.5 px-3">Lớp 10</th>
                    <th className="py-2.5 px-3">Lớp 11</th>
                    <th className="py-2.5 px-3">Tiến Bộ</th>
                    <th className="py-2.5 px-3">Đánh Giá Sư Phạm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'Toán Học', k10: selectedGradeDetail.grade10.subjects.math, k11: selectedGradeDetail.grade11.subjects.math },
                    { name: 'Ngữ Văn (Chủ Nhiệm)', k10: selectedGradeDetail.grade10.subjects.literature, k11: selectedGradeDetail.grade11.subjects.literature },
                    { name: 'Tiếng Anh', k10: selectedGradeDetail.grade10.subjects.english, k11: selectedGradeDetail.grade11.subjects.english },
                    { name: 'Vật Lý', k10: selectedGradeDetail.grade10.subjects.physics, k11: selectedGradeDetail.grade11.subjects.physics },
                    { name: 'Hóa Học', k10: selectedGradeDetail.grade10.subjects.chemistry, k11: selectedGradeDetail.grade11.subjects.chemistry },
                    { name: 'Sinh Học', k10: selectedGradeDetail.grade10.subjects.biology, k11: selectedGradeDetail.grade11.subjects.biology },
                    { name: 'Lịch Sử', k10: selectedGradeDetail.grade10.subjects.history, k11: selectedGradeDetail.grade11.subjects.history },
                    { name: 'Địa Lý', k10: selectedGradeDetail.grade10.subjects.geography, k11: selectedGradeDetail.grade11.subjects.geography },
                    { name: 'Giáo Dục KT & PL', k10: selectedGradeDetail.grade10.subjects.civics, k11: selectedGradeDetail.grade11.subjects.civics },
                    { name: 'Tin Học', k10: selectedGradeDetail.grade10.subjects.informatics, k11: selectedGradeDetail.grade11.subjects.informatics },
                  ].map((sub, i) => {
                    const diff = sub.k11 - sub.k10;
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-600">{sub.k10.toFixed(1)}</td>
                        <td className="py-2.5 px-3 font-black text-indigo-900">{sub.k11.toFixed(1)}</td>
                        <td className="py-2.5 px-3">
                          {diff > 0 ? (
                            <span className="text-emerald-600 font-bold">+{diff.toFixed(1)} ↗</span>
                          ) : diff < 0 ? (
                            <span className="text-rose-600 font-bold">{diff.toFixed(1)} ↘</span>
                          ) : (
                            <span className="text-slate-400">0.0</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-500">
                          {sub.k11 >= 9.0 ? 'Năng lực xuất sắc' : sub.k11 >= 8.0 ? 'Vững vàng' : 'Cần hỗ trợ'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[11px]">GPA Cả Năm Lớp 10:</span>
                <span className="text-base font-black text-slate-900">{selectedGradeDetail.grade10.yearGpa.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">GPA Cả Năm Lớp 11:</span>
                <span className="text-base font-black text-indigo-700">{selectedGradeDetail.grade11.yearGpa.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Dự Báo Tốt Nghiệp THPT:</span>
                <span className="text-base font-black text-emerald-600">{selectedGradeDetail.grade12PredictedGpa.toFixed(1)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedGradeDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Đóng Bảng Điểm
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: GHI NHẬN VI PHẠM MỚI */}
      {/* ======================================================== */}
      {isAddViolationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Ghi Nhận Vi Phạm & Điểm Trừ (Lớp 12A16)
              </h3>
              <button
                onClick={() => setIsAddViolationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateViolation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Học Sinh:</label>
                <select
                  value={newVioStudentId}
                  onChange={(e) => setNewVioStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.studentCode} - Tổ {st.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Hành Vi Vi Phạm (Từ Nội Quy):</label>
                <select
                  value={newVioRuleId}
                  onChange={(e) => setNewVioRuleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                >
                  {rules.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.code}] {r.title} (-{r.deductionPoints}đ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Người Ghi Nhận:</label>
                <input
                  type="text"
                  value={newVioRecordedBy}
                  onChange={(e) => setNewVioRecordedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi Chú Hoàn Cảnh / Tình Huống:</label>
                <textarea
                  rows={2}
                  value={newVioNote}
                  onChange={(e) => setNewVioNote(e.target.value)}
                  placeholder="Nhập ghi chú sư phạm, lý do hoặc biểu hiện của học sinh..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddViolationModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Ghi Nhận & Trừ Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NHẬP DỮ LIỆU CSV TRỰC TIẾP */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileUp className="w-5 h-5 text-indigo-600" />
                Nhập Dữ Liệu CSV Vào Hệ Thống (Lớp 12A16)
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setRawCsvInput('');
                  setImportStatusMessage(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Chọn Loại Dữ Liệu Nhập:</label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImportType('students')}
                    className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
                      importType === 'students'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1. Danh Sách Học Sinh
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('rules')}
                    className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
                      importType === 'rules'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2. Nội Quy Nhà Trường
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Tải Tệp CSV Từ Máy Tính:</label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) setRawCsvInput(content);
                      };
                      reader.readAsText(file, 'utf-8');
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Hoặc Dán Trực Tiếp Nội Dung CSV / Dữ Liệu Copy Từ Sheet:
                </label>
                <textarea
                  rows={6}
                  value={rawCsvInput}
                  onChange={(e) => setRawCsvInput(e.target.value)}
                  placeholder={importType === 'students' 
                    ? 'Mã Học Sinh,Họ Và Tên,Ngày Sinh,Giới Tính,Tổ,Chức Vụ,Điểm Karma,Chuỗi Chuyên Cần...\n12A16-01,"Nguyễn Minh Quân",15/03/2009,Nam,1,Lớp Trưởng,1650,24...' 
                    : 'Mã Nội Quy,Danh Mục,Hành Vi Quy Định,Mức Điểm Trừ,Mức Độ,Phương Pháp Khắc Phục...\nNQ-01,"Chuyên Cần & Giờ Giấc","Đi học muộn",10,Nhẹ,"Duy trì chuỗi chuyên cần 5 ngày"...'
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {importStatusMessage && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  {importStatusMessage}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setRawCsvInput('');
                    setImportStatusMessage(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleParseAndImportCsv}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận Nhập Dữ Liệu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
