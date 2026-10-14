import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  FileText, 
  Send,
  Layers,
  HeartHandshake,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { ClassStudent, StudentGradeRecord } from '../types/edtech';
import { 
  generateParentZaloMessageClient, 
  generateHomeroomLessonPlan5512Client 
} from '../services/geminiService';

interface SmartHomeroomToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: ClassStudent[];
  grades?: StudentGradeRecord[];
}

export const SmartHomeroomToolsModal: React.FC<SmartHomeroomToolsModalProps> = ({
  isOpen,
  onClose,
  students,
  grades = [],
}) => {
  const [activeTab, setActiveTab] = useState<'zalo' | 'lesson5512' | 'segmentation'>('zalo');

  // Zalo Messenger State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [customTeacherNote, setCustomTeacherNote] = useState<string>('Con tích cực đóng góp xây dựng bài học môn Ngữ văn.');
  const [generatedZaloMsg, setGeneratedZaloMsg] = useState<string | null>(null);
  const [isGeneratingZalo, setIsGeneratingZalo] = useState<boolean>(false);
  const [copiedZalo, setCopiedZalo] = useState<boolean>(false);

  // Lesson Plan 5512 State
  const [weekNumber, setWeekNumber] = useState<number>(8);
  const [themeTitle, setThemeTitle] = useState<string>('Quản lý thời gian & Giữ vững tâm lý trước kỳ thi Tốt nghiệp THPT 2027');
  const [lessonPlanText, setLessonPlanText] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // 1. Generate Parent Zalo Message
  const handleGenerateZalo = async () => {
    if (!currentStudent) return;
    setIsGeneratingZalo(true);
    setGeneratedZaloMsg(null);

    try {
      const msg = await generateParentZaloMessageClient({
        studentName: currentStudent.name,
        parentName: currentStudent.parentName,
        gender: currentStudent.gender,
        streakDays: currentStudent.streakDays,
        karmaPoints: currentStudent.karmaPoints,
        highlights: [
          `Hoàn thành tốt nhiệm vụ học tập nhóm tại Tổ ${currentStudent.group}`,
          `Tác phong kỷ luật tốt, đạt chuỗi chuyên cần ${currentStudent.streakDays} ngày`,
        ],
        teacherNote: customTeacherNote,
      });

      setGeneratedZaloMsg(msg);
    } catch (err: any) {
      console.error(err);
      setGeneratedZaloMsg('Đã xảy ra lỗi khi tạo tin nhắn Zalo. Vui lòng thử lại.');
    } finally {
      setIsGeneratingZalo(false);
    }
  };

  // 2. Generate Lesson Plan 5512
  const handleGenerateLessonPlan = async () => {
    setIsGeneratingPlan(true);
    setLessonPlanText(null);

    try {
      const plan = await generateHomeroomLessonPlan5512Client({
        weekNumber,
        themeTitle,
        keyIssues: ['Phương pháp tự học', 'Đôi bạn cùng tiến', 'Ổn định tâm lý tuổi 18'],
      });

      setLessonPlanText(plan);
    } catch (err: any) {
      console.error(err);
      setLessonPlanText('Đã xảy ra lỗi khi lập kế hoạch sinh hoạt lớp.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // 3. Segment students into 3 strategic groups
  const topStudents = students.filter(s => s.karmaPoints >= 1500 || s.role.includes('Trưởng') || s.role.includes('Thư'));
  const supportStudents = students.filter(s => s.conduct !== 'Tốt' || s.karmaPoints < 1250);
  const coreStudents = students.filter(s => !topStudents.includes(s) && !supportStudents.includes(s));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Hộp Công Cụ Sư Phạm Dành Riêng Cho Cô Phương Linh
              </h2>
              <p className="text-xs text-indigo-200">
                Lớp 12A16 • Trợ lý Zalo phụ huynh, Kế hoạch chủ nhiệm CV 5512 & Phân hóa học sinh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('zalo')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'zalo'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Trợ Lý Nhắn Zalo Phụ Huynh</span>
          </button>

          <button
            onClick={() => setActiveTab('lesson5512')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'lesson5512'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Kế Hoạch Sinh Hoạt Lớp (CV 5512)</span>
          </button>

          <button
            onClick={() => setActiveTab('segmentation')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'segmentation'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Ma Trận Phân Hóa Năng Lực 42 HS</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: ZALO PARENT MESSENGER */}
          {activeTab === 'zalo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chọn học sinh gửi tin nhắn:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.studentCode} - {s.name} ({s.parentName})
                      </option>
                    ))}
                  </select>
                </div>

                {currentStudent && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1.5">
                    <div className="font-bold text-indigo-950 flex items-center justify-between">
                      <span>{currentStudent.name}</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                        Tổ {currentStudent.group} • {currentStudent.role}
                      </span>
                    </div>
                    <div className="text-slate-600">Phụ huynh: {currentStudent.parentName}</div>
                    <div className="text-slate-600">SĐT: {currentStudent.parentPhone}</div>
                    <div className="text-slate-600">Chuỗi chuyên cần: <strong>{currentStudent.streakDays} ngày</strong></div>
                    <div className="text-slate-600">Điểm Karma: <strong>{currentStudent.karmaPoints} EXP</strong></div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ghi chú riêng của Cô Phương Linh:
                  </label>
                  <textarea
                    value={customTeacherNote}
                    onChange={(e) => setCustomTeacherNote(e.target.value)}
                    rows={3}
                    placeholder="VD: Tuần này con rất tích cực, tiến bộ rõ rệt ở bài kiểm tra Ngữ văn..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerateZalo}
                  disabled={isGeneratingZalo}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isGeneratingZalo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Soạn Tin Nhắn Thấu Cảm...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Tạo Tin Nhắn Zalo Báo Cáo Tuần</span>
                    </>
                  )}
                </button>
              </div>

              <div className="lg:col-span-2">
                {generatedZaloMsg ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">
                          Bản Nháp Tin Nhắn Zalo Chuẩn Bị Gửi
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedZaloMsg);
                          setCopiedZalo(true);
                          setTimeout(() => setCopiedZalo(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 shadow-xs transition-colors"
                      >
                        {copiedZalo ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã Sao Chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao Chép Vào Zalo</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                      {generatedZaloMsg}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 text-slate-500 text-xs flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">Chưa Có Tin Nhắn Nào Được Tạo</span>
                    <p className="max-w-md">
                      Chọn một học sinh bên trái và bấm &ldquo;Tạo Tin Nhắn Zalo Báo Cáo Tuần&rdquo; để AI tự động tổng hợp chỉ số chuyên cần và điểm rèn luyện Karma thành một bức thư ngắn gửi cha mẹ.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LESSON PLAN 5512 */}
          {activeTab === 'lesson5512' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tuần Sinh Hoạt:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chủ Đề Chuyên Đề:
                  </label>
                  <textarea
                    value={themeTitle}
                    onChange={(e) => setThemeTitle(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-indigo-900 block">Cấu Trúc Chuẩn CV 5512:</span>
                  <span>• HĐ 1: Khởi động gắn kết (5p)</span><br />
                  <span>• HĐ 2: Sơ kết tuần & Trao thưởng Karma (15p)</span><br />
                  <span>• HĐ 3: Thảo luận chuyên đề (20p)</span><br />
                  <span>• HĐ 4: Thông điệp cô chủ nhiệm (5p)</span>
                </div>

                <button
                  onClick={handleGenerateLessonPlan}
                  disabled={isGeneratingPlan}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isGeneratingPlan ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Soạn Giáo Án 5512...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Xuất Bản Kế Hoạch 45 Phút</span>
                    </>
                  )}
                </button>
              </div>

              <div className="lg:col-span-2">
                {lessonPlanText ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-xs text-slate-900">
                          Kế Hoạch Tiết Sinh Hoạt Lớp 12A16 (Công Văn 5512)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(lessonPlanText);
                          setCopiedPlan(true);
                          setTimeout(() => setCopiedPlan(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 shadow-xs transition-colors"
                      >
                        {copiedPlan ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã Sao Chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao Chép Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans max-h-[450px] overflow-y-auto">
                      {lessonPlanText}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 text-slate-500 text-xs flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">Chưa Có Giáo Án Nào</span>
                    <p className="max-w-md">
                      Bấm &ldquo;Xuất Bản Kế Hoạch 45 Phút&rdquo; để tự động tạo giáo án sinh hoạt lớp theo chuẩn Công văn 5512/BGDĐT.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIFFERENTIATED LEARNING MATRIX */}
          {activeTab === 'segmentation' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm">Ma Trận Dạy Học & Chăm Sóc Phân Hóa Lớp 12A16 (42 Học Sinh)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Tự động phân nhóm chiến lược nhằm giúp Cô Phương Linh phân bổ thời gian và tài liệu ôn thi phù hợp nhất.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Top Đầu: {topStudents.length} HS
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    Tăng Tốc: {coreStudents.length} HS
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                    Cần Trợ Giúp: {supportStudents.length} HS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Group 1 */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                    <span className="font-extrabold text-xs text-emerald-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Chiến Lược Top Đầu ({topStudents.length})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Mục tiêu $\ge$ 26đ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Cần bài tập vận dụng cao, bồi dưỡng tư duy phản biện Ngữ văn và định hướng trường Top.
                  </p>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {topStudents.map(s => (
                      <div key={s.id} className="p-2 rounded-xl bg-emerald-50/40 text-xs flex justify-between items-center">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">{s.karmaPoints} EXP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group 2 */}
                <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <span className="font-extrabold text-xs text-indigo-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Tăng Tốc Toàn Diện ({coreStudents.length})
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Mục tiêu 22 - 25đ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Nắm chắc kiến thức cốt lõi, luyện kỹ năng bấm giờ và ổn định tâm lý phòng thi.
                  </p>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {coreStudents.map(s => (
                      <div key={s.id} className="p-2 rounded-xl bg-indigo-50/40 text-xs flex justify-between items-center">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] text-indigo-700 font-bold">{s.karmaPoints} EXP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group 3 */}
                <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <span className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-rose-600" />
                      Đồng Hành & Chăm Sóc ({supportStudents.length})
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                      Chống Liệt & An Toàn
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Cần ghép đôi "Đôi Bạn Cùng Tiến", nhắc nhở nề nếp và động viên tinh thần thường xuyên.
                  </p>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {supportStudents.map(s => (
                      <div key={s.id} className="p-2 rounded-xl bg-rose-50/40 text-xs flex justify-between items-center">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] text-rose-700 font-bold">{s.karmaPoints} EXP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Chuẩn mực Sư phạm • Kỷ luật Phục hồi • Đồng hành Gia đình & Nhà trường</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 transition-colors"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
