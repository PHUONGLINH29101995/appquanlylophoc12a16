import React, { useState } from 'react';
import { CareerPath } from '../types/edtech';
import { 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Award, 
  BrainCircuit, 
  CheckCircle2, 
  Target, 
  BookOpen, 
  RefreshCw,
  Layers,
  Briefcase
} from 'lucide-react';
import { generateCareerGuidanceClient } from '../services/geminiService';

interface CareerGuidanceSectionProps {
  careerPaths: CareerPath[];
  studentGpa: { subject: string; score: number }[];
}

const RIASEC_CATEGORIES = [
  { code: 'R', name: 'Realistic (Thực tế - Kỹ thuật)', score: 65, color: 'bg-emerald-500' },
  { code: 'I', name: 'Investigative (Nghiên cứu - Tư duy)', score: 92, color: 'bg-indigo-600' },
  { code: 'A', name: 'Artistic (Nghệ thuật - Sáng tạo)', score: 85, color: 'bg-violet-500' },
  { code: 'S', name: 'Social (Xã hội - Giúp đỡ con người)', score: 78, color: 'bg-sky-500' },
  { code: 'E', name: 'Enterprising (Quản lý - Khởi nghiệp)', score: 70, color: 'bg-amber-500' },
  { code: 'C', name: 'Conventional (Quy chuẩn - Chi tiết)', score: 60, color: 'bg-slate-500' },
];

export const CareerGuidanceSection: React.FC<CareerGuidanceSectionProps> = ({
  careerPaths,
  studentGpa,
}) => {
  const [activeCareerIndex, setActiveCareerIndex] = useState<number>(0);
  const [customPassion, setCustomPassion] = useState<string>('Thích ứng dụng AI và công nghệ để giải quyết vấn đề giáo dục và tạo game tương tác');
  const [aiCareerAdvice, setAiCareerAdvice] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState<boolean>(false);

  const selectedCareer = careerPaths[activeCareerIndex] || careerPaths[0];

  const handleGenerateCareerAdvice = async () => {
    setIsConsulting(true);
    setAiCareerAdvice(null);

    try {
      const advice = await generateCareerGuidanceClient({
        riasecCode: 'I - Investigative (92%) & A - Artistic (85%)',
        strongSubjects: studentGpa.map(g => `${g.subject} (${g.score})`),
        hobbies: customPassion,
        values: 'Tự do sáng tạo, Đạo đức công nghệ, Hỗ trợ sự phát triển của thế hệ trẻ',
      });

      setAiCareerAdvice(advice);
    } catch (err) {
      console.error(err);
      setAiCareerAdvice('Không thể kết nối AI lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Future Jobs & Non-cliche Orientation */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Nguyên Tắc: Tránh Rập Khuôn • Đón Đầu Nghề Nghiệp 2026-2035</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              La Bàn Hướng Nghiệp Tương Lai & Ma Trận Ikigai
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Thay vì các nghề truyền thống đơn điệu, AI tổng hợp đa chiều từ Điểm số thế mạnh + Trắc nghiệm tâm lý RIASEC + Đam mê cá nhân để mở ra các ngành nghề tương lai có triển vọng cao và phù hợp nhất với bản sắc riêng của bạn.
            </p>
          </div>

          {/* Ikigai Summary Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2">
            <div className="text-xs uppercase tracking-wider text-sky-300 font-bold">Mã Nhóm Tính Cách RIASEC</div>
            <div className="text-2xl font-black text-white">IA (Nghiên Cứu - Nghệ Thuật)</div>
            <p className="text-[11px] text-slate-300">
              Điểm mạnh: Khả năng tư duy logic phân tích kết hợp óc thẩm mỹ và nhạy cảm trải nghiệm người dùng.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIASEC Profile & Ikigai Dimensions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-indigo-600" />
            Hồ Sơ Năng Lực Đa Chiều (Multidimensional)
          </h3>

          {/* Academic Strengths */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">1. Điểm Môn Học Thế Mạnh (GPA):</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              {studentGpa.map((g) => (
                <div key={g.subject} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[11px]">{g.subject}</div>
                  <div className="font-black text-indigo-900 text-sm mt-0.5">{g.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIASEC Chart */}
          <div className="space-y-2.5 text-xs">
            <span className="font-bold text-slate-700 block">2. Thang Đo Trắc Nghiệm Tâm Lý RIASEC:</span>
            <div className="space-y-2">
              {RIASEC_CATEGORIES.map((cat) => (
                <div key={cat.code} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <span className="font-bold text-slate-900">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${cat.color} h-1.5 rounded-full`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ikigai 4-Circle Matrix Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Điểm Giao Thoa Ikigai Của Quân:
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Bạn có thế mạnh nổi trội ở tư duy hệ thống và thấu hiểu con người. Công việc lý tưởng là các vị trí sáng tạo giải pháp công nghệ nhân văn (Human-Centric Tech).
            </p>
          </div>

          {/* Custom Passion Input */}
          <div className="space-y-2 text-xs pt-1">
            <label className="font-bold text-slate-700 block">
              Điều bạn đam mê & muốn cống hiến:
            </label>
            <textarea
              value={customPassion}
              onChange={(e) => setCustomPassion(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleGenerateCareerAdvice}
              disabled={isConsulting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {isConsulting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Đang Phân Tích Lộ Trình Hướng Nghiệp...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cập Nhật Định Hướng Nghề AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Future Career Paths Recommendation */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Career Path Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {careerPaths.map((cp, idx) => {
              const isSelected = activeCareerIndex === idx;
              return (
                <button
                  key={cp.title}
                  onClick={() => setActiveCareerIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Phù hợp {cp.matchScore}%
                      </span>
                      <Briefcase className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-2">
                      {cp.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-indigo-700 font-semibold mt-2">
                    {cp.demandTrend}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Career Detailed Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Khám Phá Nghề Nghiệp 2026 - 2035
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedCareer.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Thu nhập tham khảo:</div>
                <div className="text-sm font-extrabold text-emerald-700">{selectedCareer.salaryOutlook}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mô Tả & Ý Nghĩa Xã Hội:</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedCareer.description}
              </p>
            </div>

            {/* Majors & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Ngành Đại Học Phù Hợp:
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {selectedCareer.suitableMajors.map((m) => (
                    <li key={m} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" /> Kỹ Năng Cần Rèn Luyện (Từ THPT):
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {selectedCareer.keySkills.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestone Pathway */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
              <span className="text-xs font-bold text-indigo-950 block">
                Lộ Trình Từng Bước Cho Học Sinh Lớp 12:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="font-bold text-indigo-900">Giai đoạn 1 (Lớp 12)</div>
                  <div className="text-slate-500 mt-0.5">Tập trung bổ khuyết lỗ hổng Toán/Lý/Anh, đạt &gt;25 điểm tốt nghiệp.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="font-bold text-indigo-900">Giai đoạn 2 (Đại học Năm 1-2)</div>
                  <div className="text-slate-500 mt-0.5">Học lập trình nền tảng và tham gia các dự án nghiên cứu học đường.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="font-bold text-indigo-900">Giai đoạn 3 (Năm 3-4)</div>
                  <div className="text-slate-500 mt-0.5">Thực tập tại các viện EdTech và xây dựng sản phẩm cá nhân.</div>
                </div>
              </div>
            </div>

          </div>

          {/* AI Career Advice Output Box */}
          {aiCareerAdvice && (
            <div className="bg-white rounded-3xl p-6 border border-sky-200 shadow-md space-y-3 animate-scaleUp">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Báo Cáo Định Hướng Nghề Nghiệp Cá Nhân Hóa (Gemini AI Engine)</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                {aiCareerAdvice}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
