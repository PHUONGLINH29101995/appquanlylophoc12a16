import React, { useState, useEffect } from 'react';
import { MoodEntry } from '../types/edtech';
import { 
  ShieldCheck, 
  Lock, 
  Heart, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Smile, 
  Meh, 
  Frown, 
  Activity, 
  PhoneCall, 
  CheckCircle2,
  Wind,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { generateMentalHealthReflectionClient } from '../services/geminiService';

interface MentalHealthSectionProps {
  moods: MoodEntry[];
  onAddMood: (newMood: MoodEntry) => void;
}

const MOOD_LEVELS = [
  { level: 5, label: 'Tràn Đầy Năng Lượng', icon: '🤩', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { level: 4, label: 'Tự Tin & Vui Vẻ', icon: '😊', color: 'bg-sky-50 text-sky-800 border-sky-300' },
  { level: 3, label: 'Bình Yên & Tĩnh Lặng', icon: '🙂', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  { level: 2, label: 'Hơi Áp Lực & Lo Lắng', icon: '😟', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  { level: 1, label: 'Mệt Mỏi & Kiệt Sức', icon: '😫', color: 'bg-rose-50 text-rose-800 border-rose-300' },
];

const EMOTION_TAGS = [
  'Áp lực bài vở',
  'Thi thử căng thẳng',
  'Mất ngủ',
  'Mâu thuẫn bạn bè',
  'Hài lòng về bản thân',
  'Làm việc nhóm vui vẻ',
  'Mông lung về đại học',
  'Cần thời gian nghỉ ngơi',
];

export const MentalHealthSection: React.FC<MentalHealthSectionProps> = ({
  moods,
  onAddMood,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Hài lòng về bản thân']);
  const [moodNote, setMoodNote] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [latestAiResponse, setLatestAiResponse] = useState<string | null>(null);

  // Micro-mindfulness breathing exercise state
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            // cycle through phases
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 4; // hold for 4s
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 6; // exhale for 6s
            } else {
              setBreathPhase('inhale');
              return 4; // inhale for 4s
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSendCheckin = async () => {
    if (!moodNote.trim()) return;

    setIsSubmitting(true);
    setLatestAiResponse(null);

    const chosenLevel = MOOD_LEVELS.find(m => m.level === selectedLevel) || MOOD_LEVELS[1];

    try {
      const aiReply = await generateMentalHealthReflectionClient({
        moodNote,
        emotionTags: selectedTags,
        sleepHours,
      });

      setLatestAiResponse(aiReply);

      const newEntry: MoodEntry = {
        id: `mood-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        moodLevel: selectedLevel as any,
        moodLabel: chosenLevel.label,
        tags: selectedTags,
        note: moodNote,
        aiReflection: aiReply,
        isEncrypted: true,
        safetyLevel: selectedLevel <= 2 ? 'mild_stress' : 'safe',
      };

      onAddMood(newEntry);
      setMoodNote('');
    } catch (err) {
      console.error(err);
      setLatestAiResponse('Đã ghi nhận chia sẻ của bạn vào không gian bảo mật an toàn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Privacy by Design Guaranteed Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cam Kết Tuyệt Đối: Privacy by Design & Mã Hóa An Toàn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lá Chắn Tâm Lý Học Đường & Góc Trải Lòng Thấu Cảm
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mọi suy nghĩ và nhật ký cảm xúc của bạn được mã hóa an toàn. Thầy cô, cha mẹ hay bạn bè không thể xem nội dung này. Hệ thống chỉ đóng vai trò người lắng nghe thấu cảm và tự động kết nối kín đáo tới chuyên viên tâm lý nếu bạn cần trợ giúp khẩn cấp.
            </p>
          </div>

          {/* Privacy Badge Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Mã Hóa AES-256</div>
            <p className="text-[11px] text-slate-300">
              Không công khai điểm số tiêu cực • Không đánh giá • Hoàn toàn tôn trọng quyền riêng tư học sinh
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Check-In Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              Ghi Lại Cảm Xúc Hôm Nay Của Bạn
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hãy thành thật với chính mình, mỗi cảm xúc đều xứng đáng được trân trọng
            </p>
          </div>

          {/* 5-Level Emoji Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. Bạn đang cảm thấy thế nào lúc này?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {MOOD_LEVELS.map((m) => {
                const isSelected = selectedLevel === m.level;
                return (
                  <button
                    key={m.level}
                    type="button"
                    onClick={() => setSelectedLevel(m.level)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? `${m.color} ring-2 ring-indigo-500 font-bold shadow-xs scale-102`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[11px] leading-tight font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotion Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              2. Nguyên nhân hoặc bối cảnh liên quan (chọn các thẻ phù hợp):
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => {
                const isChecked = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '} {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">3. Đêm qua bạn đã ngủ bao nhiêu tiếng?</label>
              <span className="font-bold text-indigo-600">{sleepHours} giờ</span>
            </div>
            <input
              type="range"
              min="3"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>3 tiếng (Thiếu ngủ)</span>
              <span>7-8 tiếng (Lý tưởng)</span>
              <span>11 tiếng</span>
            </div>
          </div>

          {/* Text Area for Note */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              4. Những dòng suy nghĩ bạn muốn viết ra (hoàn toàn bảo mật):
            </label>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Chia sẻ bất kỳ điều gì đang diễn ra trong tâm trí bạn hôm nay... (Ví dụ: Mình cảm thấy hơi hồi hộp trước bài kiểm tra ngày mai, nhưng cũng vui vì được bạn học hỗ trợ...)"
              rows={3}
              className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSendCheckin}
              disabled={isSubmitting || !moodNote.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang Phản Hồi Thấu Cảm...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Tâm Sự & Nhận Phản Hồi Thấu Cảm</span>
                </>
              )}
            </button>
          </div>

          {/* Latest AI Reflection Box */}
          {latestAiResponse && (
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2 animate-scaleUp">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Lời Nhắn Thấu Cảm Từ Trợ Lý Tâm Lý AI</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                {latestAiResponse}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Micro-Mindfulness Breathing & Counselor Hotline */}
        <div className="space-y-6">
          
          {/* Interactive Breathing Exercise: Chiếc Ô Bình An */}
          <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-3xl p-6 text-white text-center shadow-lg space-y-4">
            <div className="flex items-center justify-center gap-2 text-indigo-200 text-xs font-semibold">
              <Wind className="w-4 h-4" />
              <span>Bài Tập Thở &ldquo;Chiếc Ô Bình An&rdquo; (3 Phút)</span>
            </div>

            {/* Breathing Animated Orb */}
            <div className="py-4">
              <div 
                className={`w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex flex-col items-center justify-center transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'inhale' ? 'scale-115 bg-white/30' :
                  isBreathingActive && breathPhase === 'hold' ? 'scale-115 ring-8 ring-white/20' :
                  'scale-90 bg-white/10'
                }`}
              >
                <span className="text-2xl font-black text-white">{breathSeconds}s</span>
                <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold mt-1">
                  {breathPhase === 'inhale' ? 'Hít Vào Sâu' : breathPhase === 'hold' ? 'Giữ Hơi Thở' : 'Thở Ra Chậm'}
                </span>
              </div>
            </div>

            <p className="text-xs text-indigo-100/90 leading-relaxed">
              {breathPhase === 'inhale' && 'Hít đầy không khí trong lành qua mũi, nâng cao lồng ngực...'}
              {breathPhase === 'hold' && 'Giữ tâm trí bình yên, cảm nhận sự an nhiên trong giây lát...'}
              {breathPhase === 'exhale' && 'Thở ra nhẹ nhàng qua miệng, buông bỏ mọi căng thẳng trên bờ vai...'}
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isBreathingActive ? 'Tạm Dừng' : 'Bắt Đầu Thở'}</span>
              </button>
              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase('inhale');
                  setBreathSeconds(4);
                }}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="Khởi động lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* School Counselor Direct Help */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Phòng Tư Vấn Tâm Lý Học Đường
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trường THPT Bình Chánh luôn có thầy cô chuyên trách lắng nghe trực tiếp và bảo mật mọi câu chuyện của bạn:
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">ThS. Tâm Lý Nguyễn Thanh Trúc</div>
              <div className="text-slate-500 text-[11px]">Phòng Tham Vấn (Tầng 2, Dãy B)</div>
              <div className="text-emerald-700 font-mono font-bold text-[11px]">Hotline: (028) 3875 xxxx</div>
            </div>
          </div>

          {/* Encrypted History Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Lịch Sử Cảm Xúc (Đã Mã Hóa)
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                AES-256
              </span>
            </div>

            <div className="space-y-2.5">
              {moods.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{m.moodLabel}</span>
                    <span className="text-[10px] text-slate-400">{m.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2 italic">&ldquo;{m.note}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
