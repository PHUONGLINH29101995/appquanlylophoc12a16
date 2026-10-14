import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Check, 
  Copy, 
  FileText, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Layers, 
  Cpu, 
  Heart, 
  CalendarCheck2,
  RefreshCw,
  Key,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  StopCircle
} from 'lucide-react';
import { 
  executePedagogicalStrategyStep, 
  generatePedagogicalStrategy,
  StrategyStepResult
} from '../services/geminiService';

interface StrategyConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal?: () => void;
}

interface StepProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  modelUsed?: string;
  error?: string;
  content?: string;
}

const PRESET_TOPICS = [
  {
    id: 'literature_mastery',
    label: 'Bồi Dưỡng Năng Lực Ngữ Văn & Tư Duy Phản Biện',
    topic: 'Xây dựng Bản đồ nhiệt phát hiện điểm nghẽn môn Ngữ văn 12: Nâng cao năng lực cảm thụ thi pháp, kỹ năng viết đoạn văn Nghị luận xã hội 200 chữ và loại bỏ lối học vẹt văn mẫu',
    target: 'Học sinh khối 12 ôn thi tốt nghiệp & Tổ chuyên môn Ngữ văn',
    context: 'Học sinh có ý thức học tập nhưng còn lúng túng khi viết bài so sánh văn học, dẫn chứng đời sống còn sáo rỗng.',
  },
  {
    id: 'gamification',
    label: 'Rèn Luyện Tích Cực & Không Gian Đặc Quyền',
    topic: 'Thiết kế mô hình Hóa trò chơi Giáo dục thay thế kỷ luật hà khắc bằng Thử thách rèn luyện nhân cách và Kho thẻ đặc quyền sư phạm',
    target: 'Học sinh THPT & Giáo viên chủ nhiệm',
    context: 'Nhà trường 1.200 học sinh mong muốn xây dựng trường học hạnh phúc, thúc đẩy kỷ luật tự giác mà không dùng hình thức khiển trách.',
  },
  {
    id: 'heatmap',
    label: 'Bản Đồ Năng Lực & Dự Phóng Điểm Thi Tốt Nghiệp',
    topic: 'Ứng dụng Bản đồ nhiệt tri thức và thuật toán AI dự phóng phổ điểm kỳ thi Tốt nghiệp THPT tổ hợp D01 (Toán, Văn, Anh) và A00',
    target: 'Học sinh cuối cấp & Hội đồng Sư phạm',
    context: 'Cá nhân hóa lộ trình ôn tập 4 tuần, giúp học sinh tập trung khắc phục chính xác điểm nghẽn nhận thức.',
  },
  {
    id: 'mental_health',
    label: 'Lá Chắn Tâm Lý Sư Phạm & Bảo Mật Học Đường',
    topic: 'Hệ thống trợ lý sư phạm nhận diện sớm căng thẳng học đường với cơ chế mã hóa bảo mật tuyệt đối Privacy by Design',
    target: 'Chuyên viên tham vấn tâm lý, Ban giám hiệu & Học sinh',
    context: 'Tạo không gian an toàn để học trò bộc bạch tâm tư tuổi mười tám mà không lo bị phán xét hay lộ điểm số.',
  },
  {
    id: 'parent_partnership',
    label: 'Đồng Hành Sư Phạm: Gia Đình & Nhà Trường',
    topic: 'Chuyển đổi giao tiếp phụ huynh theo triết lý Đồng hành thay vì kiểm soát: Báo cáo tiến bộ tuần và gợi mở trò chuyện bữa tối',
    target: 'Cha mẹ học sinh & Giáo viên chủ nhiệm',
    context: 'Giảm bớt áp lực điểm số tại gia đình, thắt chặt sợi dây thấu cảm giữa cha mẹ và con cái tuổi trưởng thành.',
  },
  {
    id: 'memory_ar',
    label: 'Kỷ Yếu Lưu Bút AR & Hộp Ký Ức Năm Năm',
    topic: 'Số hóa ký ức học đường thông qua Kỷ yếu thực tế ảo AR và Hộp thư tương lai niêm phong số, gìn giữ tình thầy trò',
    target: 'Học sinh cuối cấp 12A16 & Đoàn trường THPT',
    context: 'Bảo tồn những trang lưu bút xúc động, nuôi dưỡng lòng tự hào về mái trường thân yêu sau khi ra trường.',
  },
];

export const StrategyConsultantModal: React.FC<StrategyConsultantModalProps> = ({
  isOpen,
  onClose,
  onOpenApiKeyModal,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(PRESET_TOPICS[0].topic);
  const [selectedContext, setSelectedContext] = useState<string>(PRESET_TOPICS[0].context);
  const [selectedTarget, setSelectedTarget] = useState<string>(PRESET_TOPICS[0].target);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [sourceTag, setSourceTag] = useState<string>('gemini-3-flash-preview');

  // AI_INSTRUCTIONS.md: 3-step state management
  const [step1, setStep1] = useState<StepProgress>({ status: 'idle' });
  const [step2, setStep2] = useState<StepProgress>({ status: 'idle' });
  const [step3, setStep3] = useState<StepProgress>({ status: 'idle' });
  const [activeModelAttempt, setActiveModelAttempt] = useState<string>('');
  const [retryNotice, setRetryNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setSelectedTopic(preset.topic);
    setSelectedContext(preset.context);
    setSelectedTarget(preset.target);
    setCustomPrompt('');
    setErrorMessage(null);
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReportResult(null);
    setErrorMessage(null);
    setRetryNotice(null);

    const finalTopic = customPrompt.trim() ? customPrompt : selectedTopic;

    // Reset Steps state: Step 1 starts running, Steps 2 & 3 are waiting (idle)
    setStep1({ status: 'running' });
    setStep2({ status: 'idle' });
    setStep3({ status: 'idle' });

    // -------------------------------------------------------------
    // BƯỚC 1: Khởi Tạo & Phân Tích Sư Phạm (Executive Summary + Detailed Logic)
    // -------------------------------------------------------------
    const res1: StrategyStepResult = await executePedagogicalStrategyStep({
      step: 1,
      topic: finalTopic,
      context: selectedContext,
      targetGroup: selectedTarget,
      onModelAttempt: (model, attempt) => {
        setActiveModelAttempt(model);
        if (attempt > 0) {
          setRetryNotice(`[Step 1] Tự động thử lại với model dự phòng: ${model}`);
        }
      },
    });

    if (!res1.success) {
      // AI_INSTRUCTIONS.md: Trạng thái các cột đang chờ phải chuyển thành "Đã dừng do lỗi",
      // tuyệt đối không được hiện "Hoàn tất" hoặc checkmark xanh nếu quy trình bị gián đoạn.
      setStep1({ status: 'error', error: res1.rawError });
      setStep2({ status: 'error' });
      setStep3({ status: 'error' });
      setErrorMessage(res1.rawError || '429 RESOURCE_EXHAUSTED: Lỗi gọi API Gemini.');
      setIsLoading(false);
      return;
    }

    // Step 1 Hoàn tất thành công (Hiển thị xanh)
    setStep1({ status: 'completed', content: res1.content, modelUsed: res1.modelUsed });
    setSourceTag(res1.modelUsed);
    setRetryNotice(null);

    // -------------------------------------------------------------
    // BƯỚC 2: Kiến Trúc Công Nghệ & Bản Đồ Nhiệt (Technical Focus + Human Touch)
    // Vẫn giữ nguyên kết quả bước 1, chỉ chạy tiếp bước 2
    // -------------------------------------------------------------
    setStep2({ status: 'running' });

    const res2: StrategyStepResult = await executePedagogicalStrategyStep({
      step: 2,
      topic: finalTopic,
      context: selectedContext,
      targetGroup: selectedTarget,
      previousContent: { step1: res1.content },
      onModelAttempt: (model, attempt) => {
        setActiveModelAttempt(model);
        if (attempt > 0) {
          setRetryNotice(`[Step 2] Tự động thử lại với model dự phòng: ${model}`);
        }
      },
    });

    if (!res2.success) {
      // Step 2 failed -> Step 2 and waiting Step 3 become "Đã dừng do lỗi", Step 1 stays completed!
      setStep2({ status: 'error', error: res2.rawError });
      setStep3({ status: 'error' });
      setErrorMessage(res2.rawError || '429 RESOURCE_EXHAUSTED: Lỗi gọi API Gemini.');
      setIsLoading(false);
      return;
    }

    // Step 2 Hoàn tất thành công (Hiển thị xanh)
    setStep2({ status: 'completed', content: res2.content, modelUsed: res2.modelUsed });
    setRetryNotice(null);

    // -------------------------------------------------------------
    // BƯỚC 3: Tổng Hợp Báo Cáo Chiến Lược 5 Phần & Lộ Trình (Action Plan)
    // -------------------------------------------------------------
    setStep3({ status: 'running' });

    const res3: StrategyStepResult = await executePedagogicalStrategyStep({
      step: 3,
      topic: finalTopic,
      context: selectedContext,
      targetGroup: selectedTarget,
      previousContent: { step1: res1.content, step2: res2.content },
      onModelAttempt: (model, attempt) => {
        setActiveModelAttempt(model);
        if (attempt > 0) {
          setRetryNotice(`[Step 3] Tự động thử lại với model dự phòng: ${model}`);
        }
      },
    });

    if (!res3.success) {
      setStep3({ status: 'error', error: res3.rawError });
      setErrorMessage(res3.rawError || '429 RESOURCE_EXHAUSTED: Lỗi gọi API Gemini.');
      setIsLoading(false);
      return;
    }

    // Step 3 Hoàn tất thành công (Hiển thị xanh)
    setStep3({ status: 'completed', content: res3.content, modelUsed: res3.modelUsed });
    setRetryNotice(null);

    // Ghép toàn bộ nội dung 3 bước thành Báo Cáo Chiến Lược Chuẩn 5 Phần
    const fullReport = [
      res1.content.trim(),
      res2.content.trim(),
      res3.content.trim()
    ].join('\n\n---\n\n');

    setReportResult(fullReport);
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (reportResult) {
      navigator.clipboard.writeText(reportResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate Progress percentage based on completed steps
  const completedStepsCount = [
    step1.status === 'completed',
    step2.status === 'completed',
    step3.status === 'completed',
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / 3) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">EdTech Visionary & Strategy Consultant Studio</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Standard 5-Part Framework
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tư vấn Kiến trúc Giải pháp & Trải nghiệm Người dùng Giáo dục Thông minh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Preset Scenarios */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Chọn Bài Toán Chiến Lược Thực Tiễn (Preset Case Studies)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PRESET_TOPICS.map((p) => {
                const isSelected = selectedTopic === p.topic && !customPrompt;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`text-left p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="font-semibold">{p.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{p.topic}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div className="space-y-3 bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Hoặc Tùy Biến Bài Toán / Ý Tưởng Của Bạn:
                </label>
                <span className="text-[11px] text-slate-400">Được tối ưu theo System Instruction EdTech Architect</span>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Nhập yêu cầu tư vấn (Ví dụ: Thiết kế cơ chế giảm áp lực thi cử cho lớp 12 bằng gamification và bài tập vi mô, kết hợp tương tác phụ huynh...)"
                rows={2}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 mb-1 block">Bối cảnh trường học:</label>
                <input
                  type="text"
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 mb-1 block">Đối tượng hưởng lợi:</label>
                <input
                  type="text"
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Đang Phân Tích & Lập Bản Đồ Chiến Lược...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Xuất Bản Tư Vấn Chiến Lược Chuẩn 5 Phần</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI_INSTRUCTIONS.md: Tiến trình & 3 Cột Trạng Thái Xử Lý */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            
            {/* Header of Steps & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Tiến Trình Xử Lý Đa Bước (Step-by-Step Fallback Chain)</span>
                </div>
                <div className="flex items-center gap-2">
                  {retryNotice && (
                    <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse font-semibold">
                      {retryNotice}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    errorMessage 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : progressPercent === 100 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}>
                    {errorMessage ? 'Đã dừng do lỗi' : `${progressPercent}% Hoàn Thành`}
                  </span>
                </div>
              </div>

              {/* Progress Bar (AI_INSTRUCTIONS.md: Progress bar chỉ hiển thị trạng thái hoàn thành (xanh) khi bước đó thực sự thành công) */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    errorMessage ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 3 Cột Trạng Thái Các Bước (AI_INSTRUCTIONS.md) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Bước 1 */}
              <div className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                step1.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : step1.status === 'running'
                    ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-200'
                    : step1.status === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">Bước 1: Khởi Tạo & Sư Phạm</span>
                    {step1.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Hoàn tất</span>
                      </span>
                    )}
                    {step1.status === 'running' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Đang xử lý</span>
                      </span>
                    )}
                    {step1.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        <StopCircle className="w-3 h-3 text-rose-600" />
                        <span>Đã dừng do lỗi</span>
                      </span>
                    )}
                    {step1.status === 'idle' && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Chờ xử lý
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Tóm lược chiến lược & Cơ chế trải nghiệm người học Lớp 12A16.
                  </p>
                </div>
                {step1.modelUsed && (
                  <div className="mt-2 text-[10px] text-emerald-700 font-semibold font-mono">
                    ✓ Model: {step1.modelUsed}
                  </div>
                )}
              </div>

              {/* Bước 2 */}
              <div className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                step2.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : step2.status === 'running'
                    ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-200'
                    : step2.status === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">Bước 2: Kiến Trúc & Heatmap</span>
                    {step2.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Hoàn tất</span>
                      </span>
                    )}
                    {step2.status === 'running' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Đang xử lý</span>
                      </span>
                    )}
                    {step2.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        <StopCircle className="w-3 h-3 text-rose-600" />
                        <span>Đã dừng do lỗi</span>
                      </span>
                    )}
                    {step2.status === 'idle' && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Chờ xử lý
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Bản đồ nhiệt lỗ hổng môn Ngữ văn & Tiêu chuẩn bảo mật Privacy by Design.
                  </p>
                </div>
                {step2.modelUsed && (
                  <div className="mt-2 text-[10px] text-emerald-700 font-semibold font-mono">
                    ✓ Model: {step2.modelUsed}
                  </div>
                )}
              </div>

              {/* Bước 3 */}
              <div className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                step3.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : step3.status === 'running'
                    ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-200'
                    : step3.status === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">Bước 3: Báo Cáo 5 Phần</span>
                    {step3.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Hoàn tất</span>
                      </span>
                    )}
                    {step3.status === 'running' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Đang xử lý</span>
                      </span>
                    )}
                    {step3.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        <StopCircle className="w-3 h-3 text-rose-600" />
                        <span>Đã dừng do lỗi</span>
                      </span>
                    )}
                    {step3.status === 'idle' && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Chờ xử lý
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Lộ trình 3 giai đoạn hành động & Đúc kết sư phạm chuẩn mực.
                  </p>
                </div>
                {step3.modelUsed && (
                  <div className="mt-2 text-[10px] text-emerald-700 font-semibold font-mono">
                    ✓ Model: {step3.modelUsed}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Error Message Box (AI_INSTRUCTIONS.md: Hiện thông báo lỗi màu đỏ, hiển thị nguyên văn lỗi từ API) */}
          {errorMessage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 animate-shake">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-xs sm:text-sm text-rose-900">
                      Đã dừng do lỗi API (Tất cả model dự phòng đều thất bại)
                    </h5>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-200 text-rose-800 font-mono">
                      FAIL-STOP
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 font-semibold">
                    Nguyên văn thông báo lỗi từ hệ thống Google Gemini API:
                  </p>
                  <pre className="font-mono text-xs bg-rose-100/90 text-rose-950 p-2.5 rounded-xl border border-rose-200 overflow-x-auto whitespace-pre-wrap select-all">
                    {errorMessage}
                  </pre>
                  <p className="text-[11px] text-rose-700 leading-relaxed pt-1">
                    💡 <em>Gợi ý khắc phục:</em> Lỗi này thường do API Key của bạn đã sử dụng hết hạn mức miễn phí (Rate Limit / Quota Exceeded) hoặc key không hợp lệ. Vui lòng nhấn nút bên dưới để đổi sang API Key mới từ Google AI Studio.
                  </p>
                </div>
              </div>

              {onOpenApiKeyModal && (
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenApiKeyModal();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Key className="w-4 h-4" />
                    <span>Lấy API key để sử dụng app</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Report Display Container */}
          {reportResult ? (
            <div className="border border-indigo-100 rounded-3xl bg-white shadow-xs overflow-hidden">
              {/* Report Bar */}
              <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-800">
                    Báo Cáo Chiến Lược EdTech Visionary
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Engine: {sourceTag}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã Sao Chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Sao Chép Markdown</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Formatted Markdown Content */}
              <div className="p-6 prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4">
                <div className="whitespace-pre-wrap font-sans text-slate-700 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                  {reportResult}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100/60 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Sẵn Sàng Khởi Tạo Chiến Lược EdTech
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Chọn một kịch bản mẫu ở trên hoặc tùy chỉnh bài toán của trường bạn, sau đó bấm nút &ldquo;Xuất Bản Tư Vấn Chiến Lược&rdquo; để nhận giải pháp toàn diện theo chuẩn 5 phần: Tóm tắt - Logic vận hành - Công nghệ - Điểm chạm cảm xúc - Lộ trình hành động.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đảm bảo nguyên tắc Đạo đức AI & Bảo mật Dữ liệu học đường (Privacy by Design)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
