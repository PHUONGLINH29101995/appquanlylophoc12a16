import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Search,
  BookOpen,
  MessageCircle,
  Plus
} from 'lucide-react';

import { ClassStudent, KarmaTransaction } from '../types/edtech';
import { INITIAL_CLASS_STUDENTS } from '../mockData/classDatabaseData';

interface TeacherDashboardProps {
  onGrantKarmaPoints: (studentId: string, points: number, reason: string) => void;
  onOpenDatabase?: () => void;
  onOpenHomeroomTools?: () => void;
  students?: ClassStudent[];
  karmaHistory?: KarmaTransaction[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onGrantKarmaPoints,
  onOpenDatabase,
  onOpenHomeroomTools,
  students = INITIAL_CLASS_STUDENTS,
  karmaHistory = [],
}) => {
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent>(students[0]);
  const [grantAmount, setGrantAmount] = useState<number>(100);
  const [grantReason, setGrantReason] = useState<string>('Tương trợ bạn học giải bài tập khó');
  const [grantSuccess, setGrantSuccess] = useState<boolean>(false);

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    onGrantKarmaPoints(selectedStudent.id, grantAmount, grantReason);
    setGrantSuccess(true);
    setTimeout(() => setGrantSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Teacher Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Giáo Viên Chủ Nhiệm: Cô Phương Linh</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                🟢 Google Sheet Kết Nối Trực Tuyến
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bảng Điều Khiển Sư Phạm & Radar Can Thiệp Sớm Lớp 12A16
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Theo dõi nhịp đập học tập và sức khỏe tinh thần của 42 học sinh theo triết lý &ldquo;Phòng ngừa & Khích lệ&rdquo;. Hệ thống liên tục đồng bộ từ Google Sheet: điểm số Lớp 10-11, nội quy nhà trường và quản lý điểm trừ vi phạm gắn với cơ chế chuộc lỗi bằng Karma EXP.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {onOpenDatabase && (
                <button
                  onClick={onOpenDatabase}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Cơ Sở Dữ Liệu Google Sheet (42 HS)</span>
                </button>
              )}
              {onOpenHomeroomTools && (
                <button
                  onClick={onOpenHomeroomTools}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Hộp Công Cụ Sư Phạm (Zalo, CV 5512, Phân Hóa)</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-xs text-indigo-200">Sĩ số lớp 12A16</div>
              <div className="text-2xl font-black text-white mt-1">{students.length} / {students.length}</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">98.8% chuyên cần</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-xs text-indigo-200">Kỷ luật trừng phạt</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">0 Ca</div>
              <div className="text-[10px] text-indigo-200 mt-1">100% Khắc Phục Tích Cực</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Class Heatmap & Early Warning Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class-wide Knowledge Gap Aggregation */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Lỗ Hổng Kiến Thức Tập Thể (Class Knowledge Bottlenecks)
              </h3>
              <p className="text-xs text-slate-500">
                Thống kê các dạng bài trên 50% học sinh trong lớp đang gặp khó khăn
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              3 Chuyên đề cần bổ khuyết
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Gap 1 */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-900 text-sm">Toán 12: Hình học Oxyz (Khoảng cách & Góc)</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-bold text-[10px]">68% Lớp Chưa Vững</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Nút thắt: Học sinh lúng túng khi viết phương trình mặt phẳng đi qua 1 điểm và vuông góc với 2 mặt phẳng khác.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-indigo-900 font-medium text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Gợi ý cho Giáo viên: Dành 25 phút tiết sinh hoạt đầu tuần luyện phương pháp tọa độ hóa nhanh.</span>
              </div>
            </div>

            {/* Gap 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900 text-sm">Hóa 12: Este nâng cao (Phương pháp quy đổi)</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-bold text-[10px]">54% Lớp Chưa Vững</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Nút thắt: Khó khăn trong việc đặt ẩn số mol H2O và CO2 trong phản ứng đốt cháy hỗn hợp nhiều este đa chức.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-indigo-900 font-medium text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Gợi ý cho Giáo viên: Chia tổ học tập theo mô hình &ldquo;Đôi bạn cùng tiến&rdquo; để học sinh khá kèm học sinh yếu.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Early Warning Radar (Privacy by Design) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Radar Can Thiệp Sớm (Early Warning)
            </h3>
            <p className="text-[11px] text-slate-500">
              Nhận diện tín hiệu sa sút để hỗ trợ kịp thời, không bêu tên
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex justify-between items-center font-bold text-amber-900">
                <span>Học sinh: Phạm Đức Duy (12A16-05)</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Nguy cơ mệt mỏi</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Chuỗi ngủ trung bình giảm xuống 5.2 giờ/đêm. Không nộp 2 bài tập vi mô.
              </p>
              <div className="text-amber-800 font-medium text-[11px] pt-1">
                ➜ Khuyến nghị: Cô Phương Linh gặp gỡ trò chuyện nhẹ nhàng cuối giờ, hỗ trợ điều hòa thời gian biểu.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5">
              <div className="flex justify-between items-center font-bold text-indigo-900">
                <span>Học sinh: Lê Hoàng Nam (12A16-03)</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">Khó khăn môn Hóa</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Điểm kiểm tra định kỳ giảm nhẹ. Em có tinh thần rất tốt nhưng đang thiếu phương pháp học.
              </p>
              <div className="text-indigo-800 font-medium text-[11px] pt-1">
                ➜ Khuyến nghị: Phân công Minh Quân kèm Nam theo chương trình Đôi Bạn Cùng Tiến (+200 EXP).
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grant Karma / Award Positive Behavior Tool */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Khen Thưởng Điểm Rèn Luyện Karma (Positive Reinforcement Console)
          </h3>
          <p className="text-xs text-slate-500">
            Khen thưởng nỗ lực vượt bậc, tinh thần trách nhiệm và lòng nhân ái trong lớp
          </p>
        </div>

        <form onSubmit={handleGrant} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Chọn Học Sinh:</label>
            <select
              value={selectedStudent.id}
              onChange={(e) => {
                const s = students.find(st => st.id === e.target.value);
                if (s) setSelectedStudent(s);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentCode} - {s.karmaPoints} EXP)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Điểm Thưởng EXP:</label>
            <select
              value={grantAmount}
              onChange={(e) => setGrantAmount(parseInt(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
            >
              <option value={50}>+50 EXP (Đúng giờ, trực nhật sạch)</option>
              <option value={100}>+100 EXP (Tương trợ bạn học, đóng góp ý tưởng)</option>
              <option value={200}>+200 EXP (Đột phá học tập, việc tốt cộng đồng)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Lý Do Khen Thưởng:</label>
            <input
              type="text"
              value={grantReason}
              onChange={(e) => setGrantReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trao Thưởng EXP</span>
            </button>
          </div>
        </form>

        {grantSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã trao thưởng thành công cho {selectedStudent.name}! Thông báo tích cực đã được gửi tới học sinh.</span>
          </div>
        )}
      </div>

      {/* Karma Audit Log: Sổ Lưu Vết Khen Thưởng & Rèn Luyện */}
      {karmaHistory && karmaHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Sổ Nhật Ký Khen Thưởng & Rèn Luyện Karma Gần Đây ({karmaHistory.length} Ghi Nhận)
            </h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Lưu vết thời gian thực
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {karmaHistory.slice(0, 10).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    item.amount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{item.studentName}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({item.studentCode})</span>
                    <p className="text-slate-500 text-[11px]">{item.reason}</p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>{item.timestamp}</div>
                  <div className="text-indigo-600 font-medium">{item.grantedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
