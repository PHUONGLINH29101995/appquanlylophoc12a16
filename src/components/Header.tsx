import React from 'react';
import { UserRole, ClassStudent } from '../types/edtech';
import { 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  BrainCircuit, 
  GraduationCap, 
  Users, 
  HeartHandshake, 
  Compass,
  FileText,
  BookOpen,
  Database,
  FileSpreadsheet,
  Key,
  Clock,
  Feather,
  Calendar
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  karmaPoints: number;
  streakDays: number;
  onOpenConsultant: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApiKeyModal?: () => void;
  hasApiKey?: boolean;
  students?: ClassStudent[];
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  karmaPoints,
  streakDays,
  onOpenConsultant,
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  hasApiKey,
  students = [],
  selectedStudentId,
  onSelectStudentId,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      {/* Top Banner: Ecosystem Identity & Role Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-100 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-800 bg-clip-text text-transparent">
                  LỚP 12A16 - CÔ PHƯƠNG LINH
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Database Google Sheet Trực Tuyến
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hệ Thống Quản Lý Giáo Dục Thông Minh • GVCN: Cô Phương Linh (2026 - 2027)
              </p>
            </div>
          </div>

          {/* Quick Stats: Gamification EXP & Streak */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Điểm Rèn Luyện</div>
                <div className="text-sm font-black text-amber-950">{karmaPoints.toLocaleString()} Điểm</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200/70 text-rose-900">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                <Flame className="w-4 h-4 fill-rose-500/20" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Chuỗi Chuyên Cần</div>
                <div className="text-sm font-black text-rose-950">{streakDays} Ngày Liên Tiếp</div>
              </div>
            </div>
          </div>

          {/* Role Switcher & Database / Strategy Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Exam Countdown Button */}
            <button
              onClick={() => setActiveTab('countdown')}
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                activeTab === 'countdown'
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
              title="Đồng hồ đếm ngược kỳ thi Tốt nghiệp THPT 2027"
            >
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Thi THPT 2027</span>
            </button>

            {/* Student Selector Dropdown (Góc nhìn học sinh đang chọn) */}
            {students.length > 0 && onSelectStudentId && (
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <select
                  value={selectedStudentId}
                  onChange={(e) => onSelectStudentId(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-hidden cursor-pointer max-w-[130px] truncate"
                  title="Chọn học sinh để xem dữ liệu học bạ và góc nhìn phụ huynh"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Google Sheet Database Toggle Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'database' ? 'gamification' : 'database')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === 'database'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Mở Cơ Sở Dữ Liệu Trực Tuyến Google Sheet Lớp 12A16"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping hidden sm:inline-block" />
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Database Google Sheet</span>
            </button>

            {/* Strategy Studio Button */}
            <button
              onClick={onOpenConsultant}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Mở Báo Cáo Cố Vấn Chiến Lược Sư Phạm Chuẩn 5 Phần"
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden sm:inline">Cố Vấn AI</span>
            </button>

            {/* Settings & Gemini API Key Button (AI_INSTRUCTIONS.md) */}
            <button
              onClick={onOpenApiKeyModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border bg-rose-50 hover:bg-rose-100 border-rose-300 shadow-xs group"
              title="Cấu hình Google Gemini API Key & Model AI (Nhấn để thay đổi key khi hết quota)"
            >
              <Key className="w-4 h-4 text-rose-600 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="text-rose-600 font-extrabold flex items-center gap-1.5">
                {!hasApiKey && <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />}
                {hasApiKey && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Key đã sẵn sàng" />}
                <span>Lấy API key để sử dụng app</span>
                {hasApiKey && (
                  <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold border border-emerald-300">
                    Đã lưu
                  </span>
                )}
              </span>
            </button>

            {/* Role Dropdown / Selector */}
            <div className="relative">
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => onSelectRole('student')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    currentRole === 'student'
                      ? 'bg-white text-indigo-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Góc nhìn Học sinh (Nguyễn Minh Quân - Lớp 12A16)"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Học Sinh</span>
                </button>

                <button
                  onClick={() => onSelectRole('teacher')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    currentRole === 'teacher'
                      ? 'bg-white text-indigo-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Góc nhìn Giáo viên Chủ nhiệm (Cô Phương Linh - 12A16)"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Cô Phương Linh</span>
                </button>

                <button
                  onClick={() => onSelectRole('parent')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    currentRole === 'parent'
                      ? 'bg-white text-indigo-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Góc nhìn Phụ Huynh Lớp 12A16"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Phụ Huynh</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs for Student Perspective */}
        {currentRole === 'student' && (
          <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 pt-2 pb-2.5 overflow-x-auto no-scrollbar text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('gamification')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'gamification'
                  ? 'bg-indigo-50 text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Rèn Luyện Tích Cực & Thẻ Đặc Quyền
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'heatmap'
                  ? 'bg-indigo-50 text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Bản Đồ Năng Lực & Dự Báo Điểm Thi
            </button>

            <button
              onClick={() => setActiveTab('socratic-literature')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'socratic-literature'
                  ? 'bg-rose-50 text-rose-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Feather className="w-4 h-4 text-rose-600" />
              Gia Sư Socrate Văn 12
            </button>

            <button
              onClick={() => setActiveTab('countdown')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'countdown'
                  ? 'bg-amber-50 text-amber-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Đếm Ngược THPT 2027 & Nguyện Vọng
            </button>

            <button
              onClick={() => setActiveTab('mental-health')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'mental-health'
                  ? 'bg-indigo-50 text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sổ Tay Cảm Xúc (Bảo Mật Sư Phạm)
            </button>

            <button
              onClick={() => setActiveTab('career')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'career'
                  ? 'bg-indigo-50 text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-600" />
              Định Hướng Nghề Nghiệp & Giá Trị Bản Thân
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'memory'
                  ? 'bg-indigo-50 text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-rose-500" />
              Kỷ Yếu Lưu Bút AR & Hộp Ký Ức
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Database 12A16 & Điểm Lớp 10-11, Nội Quy
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
