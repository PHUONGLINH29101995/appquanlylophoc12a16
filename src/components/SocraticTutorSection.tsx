import React, { useState } from 'react';
import { 
  Sparkles, 
  Feather, 
  BrainCircuit, 
  Send, 
  Copy, 
  Check, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  RefreshCw,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { generateSocraticLiteratureFeedbackClient } from '../services/geminiService';

const PRESET_ESSAY_TOPICS = [
  {
    id: 'nlxh-1',
    category: 'Nghị Luận Xã Hội (200 chữ)',
    title: 'Bản lĩnh giữ gìn bản sắc và tư duy độc lập của người trẻ trong kỷ nguyên AI',
    defaultDraft: 'Em muốn viết về việc AI đang phát triển quá nhanh, học sinh dễ ỷ lại vào ChatGPT để làm văn thay vì tự tư duy.',
  },
  {
    id: 'nlxh-2',
    category: 'Nghị Luận Xã Hội (200 chữ)',
    title: 'Sức mạnh của sự thấu cảm và lòng trắc ẩn trong thời đại kết nối số',
    defaultDraft: 'Em muốn nhấn mạnh sự thấu cảm giữa bạn bè cùng lớp 12A16 khi ai cũng đang căng thẳng ôn thi tốt nghiệp.',
  },
  {
    id: 'nlxh-3',
    category: 'Nghị Luận Xã Hội (200 chữ)',
    title: 'Ý nghĩa của việc dám bước ra khỏi vùng an toàn để theo đuổi đam mê nghề nghiệp',
    defaultDraft: 'Nhiều bạn chọn ngành theo kỳ vọng của gia đình mà quên đi sở thích thực sự của mình.',
  },
  {
    id: 'nlvh-1',
    category: 'Nghị Luận Văn Học 12',
    title: 'Vẻ đẹp hào hùng và bi tráng của hình tượng người lính Tây Tiến (Quang Dũng)',
    defaultDraft: 'Em muốn phân tích chất lãng mạn và sự hy sinh kiên cường của người lính trong khổ thơ Tây Tiến.',
  },
  {
    id: 'nlvh-2',
    category: 'Nghị Luận Văn Học 12',
    title: 'Khát vọng tự do và sức sống tiềm tàng của nhân vật Mị trong Vợ chồng A Phủ (Tô Hoài)',
    defaultDraft: 'Phân tích diễn biến tâm trạng của Mị trong đêm mùa xuân tại Hồng Ngài.',
  },
];

export const SocraticTutorSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>(PRESET_ESSAY_TOPICS[0].title);
  const [studentDraft, setStudentDraft] = useState<string>(PRESET_ESSAY_TOPICS[0].defaultDraft);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (preset: typeof PRESET_ESSAY_TOPICS[0]) => {
    setSelectedTopic(preset.title);
    setStudentDraft(preset.defaultDraft);
    setCustomTopic('');
    setFeedback(null);
  };

  const handleGenerateFeedback = async () => {
    const finalTopic = customTopic.trim() ? customTopic : selectedTopic;
    if (!finalTopic.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await generateSocraticLiteratureFeedbackClient({
        topic: finalTopic,
        studentDraft,
      });
      setFeedback(result);
    } catch (err: any) {
      console.error(err);
      setFeedback('Không thể kết nối Gia sư AI lúc này. Vui lòng kiểm tra API Key hoặc thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (feedback) {
      navigator.clipboard.writeText(feedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Feather className="w-3.5 h-3.5 text-rose-400" />
              <span>Phương Pháp Socrate • Chống Văn Mẫu • Nâng Cao Năng Lực Ngôn Ngữ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Gia Sư AI Socrate Môn Ngữ Văn 12 & Ôn Thi Tốt Nghiệp THPT
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Theo định hướng của Cô Phương Linh: AI không bao giờ viết văn hộ học trò, mà đồng hành như một người thầy đối thoại, gợi mở 3 câu hỏi tư duy bản chất, chuẩn hóa ma trận đoạn văn 200 chữ và trao tặng những từ khóa đắt giá giúp bài viết chạm đến trái tim người chấm.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wider text-rose-200 font-bold">Triết Lý Văn Học Lớp 12A16</div>
            <p className="text-xs text-white font-semibold">
              &ldquo;Văn học là nhân học. Bài văn điểm cao là bài văn có nhịp thở của chính cuộc sống.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preset topics and input */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-600" />
              Chủ Đề Ôn Luyện Trọng Điểm
            </h3>

            <div className="space-y-2">
              {PRESET_ESSAY_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectPreset(topic)}
                  className={`w-full p-3 rounded-2xl text-left transition-all border ${
                    selectedTopic === topic.title && !customTopic
                      ? 'bg-rose-50/80 border-rose-300 shadow-xs ring-1 ring-rose-200'
                      : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">{topic.title}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hoặc nhập chủ đề / đề bài tự chọn:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="VD: Ý nghĩa của lòng tự trọng trong xã hội hiện đại..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ý tưởng / Luận điểm nháp của em:
                </label>
                <textarea
                  value={studentDraft}
                  onChange={(e) => setStudentDraft(e.target.value)}
                  rows={3}
                  placeholder="Ghi lại những ý nghĩ đầu tiên của em về đề bài này..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden resize-none"
                />
              </div>

              <button
                onClick={handleGenerateFeedback}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gia Sư Socrate Đang Phân Tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Khai Mở Tư Duy Socrate Cho Đề Văn Này</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Socratic Feedback Display */}
        <div className="lg:col-span-2">
          {feedback ? (
            <div className="bg-white rounded-3xl border border-rose-200 shadow-xs overflow-hidden">
              <div className="bg-rose-50/80 px-6 py-4 border-b border-rose-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-rose-600" />
                  <span className="font-extrabold text-sm text-slate-900">
                    Bản Hướng Dẫn Tư Duy Sư Phạm Socrate
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã Sao Chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép Bản Hướng Dẫn</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                {feedback}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-dashed border-slate-200 text-center space-y-3 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Sẵn Sàng Mở Khóa Tư Duy Ngữ Văn</h4>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Chọn một chủ đề nghị luận xã hội hoặc tác phẩm văn học lớp 12 bên trái, sau đó bấm nút &ldquo;Khai Mở Tư Duy Socrate&rdquo; để nhận 3 câu hỏi gợi mở, ma trận kết cấu và từ vựng đặc sắc từ Gia sư Sư phạm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
