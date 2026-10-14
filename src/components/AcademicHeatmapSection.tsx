import React, { useState } from 'react';
import { SubjectHeatmap, KnowledgeTopic } from '../types/edtech';
import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Target, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Languages, 
  BookOpen,
  ChevronRight,
  RefreshCw,
  Award,
  Feather,
  FileCheck
} from 'lucide-react';
import { analyzePredictiveHeatmapClient } from '../services/geminiService';

interface AcademicHeatmapSectionProps {
  heatmaps: SubjectHeatmap[];
  studentName: string;
}

export const AcademicHeatmapSection: React.FC<AcademicHeatmapSectionProps> = ({
  heatmaps,
  studentName,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('literature');
  const [selectedTopic, setSelectedTopic] = useState<KnowledgeTopic | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  const currentSubject = heatmaps.find(h => h.subjectId === selectedSubjectId) || heatmaps[0];

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Atom': return <Atom className="w-5 h-5 text-sky-600" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-amber-600" />;
      case 'Languages': return <Languages className="w-5 h-5 text-emerald-600" />;
      default: return <Calculator className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleGenerateAiPlan = async () => {
    setIsGeneratingPlan(true);
    setAiAnalysis(null);

    const weakAreas = currentSubject.topics
      .filter(t => t.status === 'critical_gap' || t.status === 'progressing')
      .map(t => `${t.name} (${t.masteryScore}%)`);

    try {
      const analysisText = await analyzePredictiveHeatmapClient({
        studentName,
        targetExam: 'Kỳ thi Tốt nghiệp THPT 2027 - Tổ hợp D01 (Toán, Ngữ Văn, Tiếng Anh) & A00',
        subjects: heatmaps.map(h => ({
          name: h.subjectName,
          gpa: h.currentGpa,
          predicted: h.predictedExamScore,
        })),
        weakAreas,
      });

      setAiAnalysis(analysisText);
    } catch (err) {
      console.error(err);
      setAiAnalysis('Không thể tạo phân tích lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Pedagogical Predictive Standard */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nguyên Lý Sư Phạm: Đánh Giá Năng Lực Dự Báo • Cá Nhân Hóa Lộ Trình</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bản Đồ Năng Lực Tri Thức & Dự Phóng Điểm Thi Tốt Nghiệp THPT
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Nhà trường không đánh giá học sinh bằng một con số điểm bình quân vô hồn. Thay vào đó, hệ thống phân rã thành bản đồ nhiệt từng năng lực cốt lõi — đặc biệt là năng lực cảm thụ & tư duy phản biện của môn Ngữ văn — giúp các em thấu hiểu lỗ hổng nhận thức và bứt phá kỳ thi tốt nghiệp THPT theo tổ hợp xét tuyển.
            </p>
          </div>

          {/* Exam Forecast Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span className="font-bold uppercase tracking-wider">Tổ Hợp Xét Tuyển Mục Tiêu: D01</span>
              <span className="font-bold text-amber-300">Độ Tin Cậy 90%</span>
            </div>
            <div className="text-center py-1">
              <div className="text-3xl font-black text-white tracking-tight">
                25.7 - 27.0 <span className="text-sm font-medium text-slate-300">/ 30 Điểm</span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Ngữ Văn (8.5-9.0) • Tiếng Anh (8.8-9.2) • Toán (8.4-8.8)
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span>Đại học Sư phạm / ĐHQG: 25.5</span>
              <span className="text-emerald-400 font-bold">Vượt Ngưỡng Chuẩn (+1.2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {heatmaps.map((h) => {
          const isSelected = h.subjectId === selectedSubjectId;
          const criticalCount = h.topics.filter(t => t.status === 'critical_gap').length;
          return (
            <button
              key={h.subjectId}
              onClick={() => {
                setSelectedSubjectId(h.subjectId);
                setSelectedTopic(null);
              }}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 whitespace-nowrap ${
                isSelected
                  ? 'bg-white border-indigo-700 text-indigo-950 shadow-md ring-2 ring-indigo-600/30'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {getSubjectIcon(h.icon)}
              <span>{h.subjectName}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700">
                Điểm Thường Xuyên {h.currentGpa}
              </span>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
                  {criticalCount} Điểm Nghẽn
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Subject Heatmap Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Topics Matrix */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Ma Trận Năng Lực & Chuyên Đề Môn {currentSubject.subjectName}
              </h3>
              <p className="text-xs text-slate-500">
                Nhấp chọn từng chuyên đề để xem chẩn đoán nút thắt nhận thức và giải pháp sư phạm
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Nắm Vững (&gt;80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Đang Rèn Luyện
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Điểm Nghẽn (&lt;50%)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {currentSubject.topics.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              let bgStatus = 'border-slate-200 hover:border-slate-300 bg-white';
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (t.status === 'mastered') {
                badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              } else if (t.status === 'progressing') {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              } else if (t.status === 'critical_gap') {
                badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
              }

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/40' : bgStatus
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-semibold">{t.chapter}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                        {t.status === 'mastered' ? 'Nắm Vững Năng Lực' : t.status === 'progressing' ? 'Đang Rèn Luyện' : 'Điểm Nghẽn Cần Bồi Dưỡng'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">{t.recommendation}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-800">{t.masteryScore}% Độ thuần thục</div>
                      <div className="text-[11px] text-slate-400">Độ chính xác dự báo: {t.predictedAccuracy}%</div>
                    </div>
                    <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${
                          t.status === 'mastered' ? 'bg-emerald-500' : t.status === 'progressing' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${t.masteryScore}%` }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleGenerateAiPlan}
              disabled={isGeneratingPlan}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-700/20 transition-all disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Trợ Lý Sư Phạm Đang Phân Tích Lỗ Hổng & Thiết Lập Lộ Trình 4 Tuần...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Lập Kế Hoạch Bồi Dưỡng Năng Lực Vi Mô 4 Tuần Chuẩn Sư Phạm</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Topic Sidebar / Inspector */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Target className="w-4 h-4 text-indigo-600" />
              Chẩn Đoán Sư Phạm Chuyên Đề Đang Chọn
            </h3>

            {selectedTopic ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px] font-medium">{selectedTopic.chapter}</div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedTopic.name}</h4>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-indigo-600" /> Nhận Xét Của Giáo Viên & Trợ Lý AI:
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{selectedTopic.recommendation}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <div className="text-[11px] text-indigo-700 font-semibold">Tỷ Trọng Trong Đề Thi</div>
                    <div className="text-base font-black text-indigo-950 mt-0.5">2.0 - 5.0 Điểm</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-[11px] text-amber-800 font-semibold">Tiềm Năng Bứt Phá</div>
                    <div className="text-base font-black text-amber-950 mt-0.5">+0.75 Điểm</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="font-bold text-slate-800">Tài Liệu Bồi Dưỡng Khuyên Dùng:</div>
                  <div className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-800 line-clamp-1">Hướng dẫn kỹ thuật so sánh hai tác phẩm văn học</span>
                    <span className="text-indigo-600 font-bold shrink-0">Đọc Ngay</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-800 line-clamp-1">Bài tập rèn luyện đoạn văn 200 chữ (+50 Điểm EXP)</span>
                    <span className="text-emerald-600 font-bold shrink-0">Thực Hành</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Chọn một chuyên đề bên bảng ma trận để xem chẩn đoán sư phạm chi tiết và tài liệu học tập gợi ý.
              </div>
            )}
          </div>

          {/* Target Universities Comparison */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Ngưỡng Điểm Tuyển Sinh Đại Học Tham Chiếu
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Trường ĐH Sư Phạm TP.HCM (Sư phạm Ngữ văn)</div>
                  <div className="text-[11px] text-slate-400">Điểm chuẩn tham chiếu: 26.5 (Tổ hợp D01/C00)</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Khả thi cao
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Trường ĐH KHXH&NV - ĐHQG (Báo chí & Truyền thông)</div>
                  <div className="text-[11px] text-slate-400">Điểm chuẩn tham chiếu: 26.0</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Rất an toàn
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Pedagogical Plan Output Box */}
      {aiAnalysis && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-lg space-y-4 animate-scaleUp">
          <div className="flex items-center gap-3 border-b border-indigo-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Kế Hoạch Bồi Dưỡng Năng Lực Vi Mô 4 Tuần Cá Nhân Hóa (Chuẩn Sư Phạm)
              </h3>
              <p className="text-xs text-slate-500">
                Lộ trình rèn luyện khoa học, giàu cảm xúc, chú trọng bồi dưỡng năng lực văn học và tư duy logic
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {aiAnalysis}
          </div>
        </div>
      )}

    </div>
  );
};
