import React, { useState } from 'react';
import { ARYearbookItem, TimeCapsuleMessage } from '../types/edtech';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Camera, 
  Mail, 
  Lock, 
  Unlock, 
  Heart, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Send, 
  X, 
  Scan, 
  Users,
  Compass
} from 'lucide-react';

interface MemorySpaceSectionProps {
  yearbook: ARYearbookItem[];
  capsules: TimeCapsuleMessage[];
  onAddCapsule: (capsule: TimeCapsuleMessage) => void;
  onLikeYearbook: (itemId: string) => void;
}

export const MemorySpaceSection: React.FC<MemorySpaceSectionProps> = ({
  yearbook,
  capsules,
  onAddCapsule,
  onLikeYearbook,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ar_yearbook' | 'time_capsule'>('ar_yearbook');
  const [selectedArStudent, setSelectedArStudent] = useState<ARYearbookItem | null>(null);
  const [isArScanning, setIsArScanning] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Time Capsule form state
  const [capsuleTitle, setCapsuleTitle] = useState<string>('');
  const [capsuleContent, setCapsuleContent] = useState<string>('');
  const [recipientType, setRecipientType] = useState<'self' | 'class'>('self');
  const [unlockYears, setUnlockYears] = useState<number>(3);
  const [isSealedSuccess, setIsSealedSuccess] = useState<boolean>(false);

  const handleOpenArView = (item: ARYearbookItem) => {
    setSelectedArStudent(item);
    setIsArScanning(true);
    setIsPlayingAudio(false);

    // Simulate AR target detection after 1.2s
    setTimeout(() => {
      setIsArScanning(false);
    }, 1200);
  };

  const handleSealCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleTitle.trim() || !capsuleContent.trim()) return;

    const unlockYearNum = 2026 + unlockYears;
    const unlockDateStr = `30/06/${unlockYearNum} (Sau ${unlockYears} năm)`;

    const newCapsule: TimeCapsuleMessage = {
      id: `cap-${Date.now()}`,
      senderName: 'Nguyễn Minh Quân',
      recipientType,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      unlockDate: unlockDateStr,
      title: capsuleTitle,
      content: capsuleContent,
      isSealed: true,
      avatar: recipientType === 'self' ? '👨‍🎓' : '🏫',
    };

    onAddCapsule(newCapsule);
    setIsSealedSuccess(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#6366f1', '#10b981'],
    });

    setTimeout(() => {
      setCapsuleTitle('');
      setCapsuleContent('');
      setIsSealedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Emotional UX Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              <span>Nguyên Tắc: Emotional UX • Công Nghệ Giữ Trọn Cảm Xúc Chân Thực</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Không Gian Kỷ Niệm 12A16 & Hộp Thư Tương Lai
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Trường học không chỉ có điểm số mà còn là nơi lưu giữ những năm tháng thanh xuân rực rỡ nhất bên Cô Phương Linh. Trải nghiệm quét ảnh kỷ yếu kích hoạt video AR sống động và niêm phong những bức thư gửi cho chính mình sau 3 - 5 năm ngày ra trường.
            </p>
          </div>

          {/* SubTab Toggle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-col gap-2">
            <button
              onClick={() => setActiveSubTab('ar_yearbook')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeSubTab === 'ar_yearbook'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Kỷ Yếu Tương Tác AR 3D</span>
            </button>
            <button
              onClick={() => setActiveSubTab('time_capsule')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeSubTab === 'time_capsule'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-600" />
              <span>Hộp Thư Tương Lai (Niêm Phong)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: AR YEARBOOK */}
      {activeSubTab === 'ar_yearbook' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Scan className="w-5 h-5 text-indigo-600" />
                Bộ Sưu Tập Kỷ Yếu AR Tập Thể 12A16
              </h3>
              <p className="text-xs text-slate-500">
                Nhấp vào bất kỳ bạn học nào để kích hoạt công nghệ AR quét ảnh, nghe giọng nói và xem video kỷ niệm
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chế độ AR Tương Tác Sẵn Sàng</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {yearbook.map((yb) => (
              <div
                key={yb.id}
                onClick={() => handleOpenArView(yb)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container with AR Overlay Badge */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={yb.photoUrl}
                      alt={yb.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* AR Scan Indicator */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                      <Scan className="w-3 h-3 text-sky-400" /> Quét AR
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="font-extrabold text-sm">{yb.studentName}</div>
                      <div className="text-[11px] text-indigo-200 font-medium">{yb.role}</div>
                    </div>
                  </div>

                  {/* Quote & Ambition */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
                      {yb.quote}
                    </p>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      Ước mơ 2030: <span className="text-slate-700 font-medium">{yb.ambition2030}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeYearbook(yb.id);
                    }}
                    className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                    <span>{yb.likes} thả tim</span>
                  </button>
                  <span className="text-indigo-600 font-bold flex items-center gap-1 text-[11px]">
                    <Play className="w-3 h-3 fill-indigo-600" /> Xem AR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: TIME CAPSULE */}
      {activeSubTab === 'time_capsule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Write New Capsule Form */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500" />
                Niêm Phong Bức Thư Tương Lai
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gửi lời nhắn cho chính bạn hoặc tập thể lớp sau nhiều năm
              </p>
            </div>

            <form onSubmit={handleSealCapsule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Người nhận:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType('self')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      recipientType === 'self'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Gửi Chính Mình
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('class')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      recipientType === 'class'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Gửi Tập Thể 12A16
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mốc thời gian mở khóa:</label>
                <select
                  value={unlockYears}
                  onChange={(e) => setUnlockYears(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                >
                  <option value={1}>Sau 1 Năm (Mùa Hè 2027 - Kết thúc năm nhất đại học)</option>
                  <option value={3}>Sau 3 Năm (Mùa Hè 2029 - Năm 3 đại học)</option>
                  <option value={5}>Sau 5 Năm (Mùa Hè 2031 - Tốt nghiệp đại học & đi làm)</option>
                  <option value={10}>Sau 10 Năm (Mùa Hè 2036 - Đại hội họp lớp 10 năm)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tiêu đề bức thư:</label>
                <input
                  type="text"
                  value={capsuleTitle}
                  onChange={(e) => setCapsuleTitle(e.target.value)}
                  placeholder="Gửi tôi của mùa hè năm..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nội dung tâm sự:</label>
                <textarea
                  value={capsuleContent}
                  onChange={(e) => setCapsuleContent(e.target.value)}
                  placeholder="Viết những suy nghĩ, lời nhắn nhủ, kỳ vọng hoặc những kỷ niệm không muốn quên..."
                  rows={4}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              {isSealedSuccess ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã Niêm Phong Bằng Sáp Đỏ Số!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Đóng Dấu Sáp Đỏ & Niêm Phong</span>
                </button>
              )}
            </form>
          </div>

          {/* List of Sealed Capsules */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Các Hộp Ký Ức Đang Được Niêm Phong Kỹ Thuật Số
              </h3>
              <p className="text-xs text-slate-500">
                Các bức thư được khóa bảo mật và chỉ mở tự động vào đúng ngày quy định
              </p>
            </div>

            <div className="space-y-4">
              {capsules.map((cap) => (
                <div
                  key={cap.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 relative overflow-hidden"
                >
                  {/* Red Wax Seal Visual Stamp */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-rose-700 text-white shadow-md flex items-center justify-center border-2 border-rose-500 ring-2 ring-rose-200/50">
                    <Lock className="w-5 h-5 text-amber-200" />
                  </div>

                  <div className="space-y-1 pr-14">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-xl">{cap.avatar}</span>
                      <span className="font-bold text-slate-800">{cap.senderName}</span>
                      <span className="text-slate-400">• Ngày gửi: {cap.createdDate}</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">
                      {cap.title}
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{cap.content}&rdquo;
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Ngày mở khóa: {cap.unlockDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Trạng thái: <span className="text-rose-600 font-bold">Niêm phong an toàn</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* AR SCAN MODAL (Interactive Augmented Reality Simulation) */}
      {selectedArStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-indigo-500/40 overflow-hidden shadow-2xl text-white flex flex-col">
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Scan className="w-4 h-4 animate-spin" />
                <span>Không Gian Thực Tế Ảo AR: {selectedArStudent.studentName}</span>
              </div>
              <button
                onClick={() => setSelectedArStudent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AR Viewport */}
            <div className="relative aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedArStudent.videoMessageUrl}
                alt="AR Video Frame"
                className="w-full h-full object-cover opacity-85"
              />

              {/* AR HUD Reticle & Scanning Animation */}
              {isArScanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                  <div className="w-40 h-40 border-2 border-dashed border-sky-400 rounded-2xl animate-pulse flex items-center justify-center">
                    <Scan className="w-12 h-12 text-sky-300 animate-spin" />
                  </div>
                  <p className="text-xs text-sky-300 font-mono mt-4 tracking-widest uppercase">
                    [ Đang Nhận Diện Điểm Ảnh Kỷ Yếu... ]
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-black/40">
                  {/* Top AR Metadata */}
                  <div className="flex justify-between items-center text-xs font-mono text-sky-300">
                    <span className="bg-sky-950/70 px-3 py-1 rounded-full border border-sky-400/40">
                      AR_HOLOGRAM_V3: ACTIVATED
                    </span>
                    <span className="text-amber-400 font-bold">LỚP 12A16 - CÔ PHƯƠNG LINH</span>
                  </div>

                  {/* AR Floating Dialogue Box */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/50 space-y-2 pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-white">
                        {selectedArStudent.studentName} ({selectedArStudent.role})
                      </div>
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlayingAudio ? 'Tạm Dừng Lời Nhắn' : 'Nghe Giọng Nói'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-indigo-100 italic">
                      &ldquo;{selectedArStudent.audioNoteText}&rdquo;
                    </p>

                    <div className="text-[11px] text-sky-300 border-t border-white/10 pt-1.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>Khát vọng 2030: {selectedArStudent.ambition2030}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Lưu bút số được bảo tồn vĩnh viễn trên đám mây kỷ niệm EduVision
              </span>
              <button
                onClick={() => setSelectedArStudent(null)}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100"
              >
                Đóng Trải Nghiệm AR
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
