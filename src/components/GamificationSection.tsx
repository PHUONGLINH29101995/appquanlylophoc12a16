import React, { useState } from 'react';
import { KarmaPerk, StudentPerkHold } from '../types/edtech';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Gift, 
  Award, 
  Armchair, 
  Music, 
  UserCheck, 
  Coffee, 
  ClockAlert, 
  Shield,
  BookOpen
} from 'lucide-react';

interface GamificationSectionProps {
  karmaPoints: number;
  streakDays: number;
  perks: KarmaPerk[];
  onRedeemPerk: (perk: KarmaPerk) => void;
  ownedPerks: StudentPerkHold[];
  onUsePerk: (holdId: string) => void;
}

export const GamificationSection: React.FC<GamificationSectionProps> = ({
  karmaPoints,
  streakDays,
  perks,
  onRedeemPerk,
  ownedPerks,
  onUsePerk,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPerkForModal, setSelectedPerkForModal] = useState<StudentPerkHold | null>(null);

  const filteredPerks = activeCategory === 'all' 
    ? perks 
    : perks.filter(p => p.category === activeCategory);

  const handleRedeem = (perk: KarmaPerk) => {
    if (karmaPoints < perk.cost) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'],
    });

    onRedeemPerk(perk);
  };

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Armchair': return <Armchair className="w-5 h-5 text-indigo-700" />;
      case 'ClockAlert': return <ClockAlert className="w-5 h-5 text-amber-700" />;
      case 'Music': return <Music className="w-5 h-5 text-violet-700" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-emerald-700" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-rose-700" />;
      default: return <Sparkles className="w-5 h-5 text-sky-700" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Pedagogical Positive Reinforcement */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Triết Lý Sư Phạm: &ldquo;Khích Lệ Động Lực Tự Thân Thay Vì Trách Phạt&rdquo;</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hành Trình Tích Lũy Điểm Rèn Luyện & Đặc Quyền Học Đường
            </h2>
            <p className="text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
              Tại ngôi trường EduVision, mỗi ngày đến lớp đúng giờ, mỗi nghĩa cử tương trợ bạn bè và mỗi đóng góp tích cực trong tiết học đều được ghi nhận trang trọng bằng Điểm Rèn Luyện. Học sinh chủ động đổi điểm để nhận các đặc quyền sư phạm nhân văn, bồi đắp lòng tự trọng và tinh thần trách nhiệm.
            </p>
          </div>

          {/* Level Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-200 font-bold">Cấp Độ Rèn Luyện</div>
              <div className="text-xl font-black text-amber-300">Cấp 6: Tinh Thần Đồng Đội & Trách Nhiệm</div>
            </div>
            {/* Progress to Level 7 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-indigo-200">
                <span>{karmaPoints} Điểm EXP</span>
                <span>Mục tiêu Cấp 7: 2,000 Điểm</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (karmaPoints / 2000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Quests (Thử Thách Rèn Luyện Đạo Đức & Kỷ Cương) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Thử Thách Rèn Luyện Đạo Đức & Học Thuật Tuần Này
            </h3>
            <p className="text-xs text-slate-500">Hoàn thành thử thách để nhận điểm rèn luyện và danh hiệu tuyên dương</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 self-start sm:self-auto">
            Đang thực hiện: 3 thử thách
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quest 1 */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Kỷ Cương Học Đường</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">+150 Điểm</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">5 Ngày Vào Lớp Đúng Giờ Chuẩn Tác Phong</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Có mặt trước 7h00 sáng, trang phục chỉnh tề liên tục từ Thứ Hai đến Thứ Sáu.</p>
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-emerald-900 font-semibold mb-1">
                <span>Tiến độ: 5/5 ngày</span>
                <span className="text-emerald-700 font-bold">Xuất Sắc Hoàn Thành!</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* Quest 2 */}
          <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Đôi Bạn Cùng Tiến</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">+200 Điểm</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Kèm Bạn Luyện Viết Đoạn Văn Nghị Luận Xã Hội</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Hỗ trợ bạn cùng bàn rèn luyện kỹ năng chọn dẫn chứng thực tế trong đoạn văn 200 chữ môn Ngữ văn.</p>
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-indigo-900 font-semibold mb-1">
                <span>Tiến độ: 2/3 buổi</span>
                <span className="text-indigo-700 font-medium">Còn 1 buổi thảo luận</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-1.5">
                <div className="bg-indigo-700 h-1.5 rounded-full w-2/3" />
              </div>
            </div>
          </div>

          {/* Quest 3 */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Xây Dựng Văn Khóa Lớp Học</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">+100 Điểm</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chăm Sóc Tủ Sách & Cây Xanh Lớp Học</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Sắp xếp gọn gàng kệ sách văn học của tổ và tưới nước cho cây xanh bên bậu cửa sổ.</p>
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-amber-900 font-semibold mb-1">
                <span>Tiến độ: 1/2 buổi</span>
                <span className="text-amber-700 font-medium">Đang thực hiện</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Perk Store (Kho Thẻ Đặc Quyền Sư Phạm) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-700" />
              Kho Thẻ Đặc Quyền Sư Phạm (Perk Exchange)
            </h3>
            <p className="text-xs text-slate-500">
              Quy đổi Điểm Rèn Luyện tích lũy lấy các quyền lợi học đường chính đáng trong tuần
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-indigo-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setActiveCategory('classroom')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'classroom'
                  ? 'bg-white text-indigo-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nề Nếp Lớp Học
            </button>
            <button
              onClick={() => setActiveCategory('academic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'academic'
                  ? 'bg-white text-indigo-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học Thuật & Tham Vấn
            </button>
            <button
              onClick={() => setActiveCategory('wellness')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'wellness'
                  ? 'bg-white text-indigo-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gắn Kết & Đời Sống
            </button>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPerks.map((perk) => {
            const canAfford = karmaPoints >= perk.cost;
            return (
              <div 
                key={perk.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getPerkIcon(perk.icon)}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-extrabold text-xs border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{perk.cost} Điểm EXP</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                      {perk.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {perk.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Thời hạn: {perk.cooldownDays} ngày
                    </span>
                    <span>• {perk.popularityCount} bạn đã sử dụng</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleRedeem(perk)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm shadow-indigo-600/20 active:scale-98'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Gift className="w-4 h-4" />
                        <span>Đổi Thẻ Biểu Dương Ngay</span>
                      </>
                    ) : (
                      <span>Cần tích lũy thêm {perk.cost - karmaPoints} Điểm</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Owned Perks Drawer / Section */}
      <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-700" />
              Thẻ Đặc Quyền Sư Phạm Đang Sở Hữu ({ownedPerks.filter(p => p.status === 'active').length} Thẻ Sẵn Sàng Sử Dụng)
            </h3>
            <p className="text-xs text-slate-500">Xuất trình mã định danh điện tử hoặc quét mã QR để Cán sự lớp/Thầy cô xác nhận</p>
          </div>
        </div>

        {ownedPerks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Bạn chưa có thẻ đặc quyền nào. Hãy hoàn thành các thử thách tuần để tích lũy điểm rèn luyện nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedPerks.map((p) => {
              const isActive = p.status === 'active';
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-100'
                      : 'bg-slate-100/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">{p.title}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isActive ? 'Khả Dụng' : 'Đã Xác Nhận Dùng'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div>Mã định danh sư phạm: <span className="font-mono font-bold text-slate-800">{p.code}</span></div>
                    <div>Hạn sử dụng: <span className="text-slate-800">{p.expiresAt}</span></div>
                  </div>

                  {isActive && (
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPerkForModal(p)}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Xem Mã QR
                      </button>
                      <button
                        onClick={() => onUsePerk(p.id)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dùng Ngay
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Voucher Modal */}
      {selectedPerkForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{selectedPerkForModal.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Xuất trình cho Cán sự lớp hoặc Giáo viên bộ môn phê duyệt</p>
            </div>

            <div className="w-44 h-44 mx-auto p-3 bg-white border-2 border-dashed border-indigo-200 rounded-2xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 p-2 rounded-xl flex flex-col justify-between items-center text-white text-[10px] font-mono">
                <div className="flex justify-between w-full">
                  <div className="w-6 h-6 border-2 border-white rounded-xs"></div>
                  <div className="w-6 h-6 border-2 border-white rounded-xs"></div>
                </div>
                <div className="text-center font-bold tracking-widest text-amber-400">
                  {selectedPerkForModal.code}
                </div>
                <div className="flex justify-between w-full">
                  <div className="w-6 h-6 border-2 border-white rounded-xs"></div>
                  <div className="w-6 h-6 bg-white rounded-xs"></div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Mã định danh: <span className="font-mono font-bold text-slate-800">{selectedPerkForModal.code}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPerkForModal(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  onUsePerk(selectedPerkForModal.id);
                  setSelectedPerkForModal(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Xác Nhận Đã Dùng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
