import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  Sparkles, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Bookmark,
  Building,
  Star
} from 'lucide-react';

interface DreamUniversity {
  id: string;
  major: string;
  university: string;
  combination: string;
  targetScore: number;
  priority: number;
}

const DEFAULT_ASPIRATIONS: DreamUniversity[] = [
  {
    id: 'asp-1',
    major: 'Khoa Học Máy Tính & AI',
    university: 'Đại Học Bách Khoa TP.HCM',
    combination: 'A00 / A01',
    targetScore: 27.5,
    priority: 1,
  },
  {
    id: 'asp-2',
    major: 'Truyền Thông Đa Phương Tiện & Báo Chí',
    university: 'Đại Học Khoa Học Xã Hội & Nhân Văn (ĐHQG)',
    combination: 'D01 (Toán, Văn, Anh)',
    targetScore: 26.8,
    priority: 2,
  },
  {
    id: 'asp-3',
    major: 'Kinh Tế Đối Ngoại & Logistics',
    university: 'Đại Học Ngoại Thương (Cơ sở 2)',
    combination: 'D01 / A01',
    targetScore: 27.2,
    priority: 3,
  },
];

export const ExamCountdownSection: React.FC = () => {
  // Target date: June 25, 2027 (Kỳ thi Tốt nghiệp THPT 2027)
  const targetDate = new Date('2027-06-25T07:30:00');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const [aspirations, setAspirations] = useState<DreamUniversity[]>(() => {
    try {
      const saved = localStorage.getItem('12a16_aspirations');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_ASPIRATIONS;
  });

  const [newMajor, setNewMajor] = useState<string>('');
  const [newUni, setNewUni] = useState<string>('');
  const [newCombo, setNewCombo] = useState<string>('D01');
  const [newTarget, setNewTarget] = useState<number>(26.5);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddAspiration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMajor.trim() || !newUni.trim()) return;

    const newAsp: DreamUniversity = {
      id: `asp-${Date.now()}`,
      major: newMajor.trim(),
      university: newUni.trim(),
      combination: newCombo,
      targetScore: newTarget,
      priority: aspirations.length + 1,
    };

    const updated = [...aspirations, newAsp];
    setAspirations(updated);
    localStorage.setItem('12a16_aspirations', JSON.stringify(updated));

    setNewMajor('');
    setNewUni('');
    setIsAdding(false);
  };

  const handleRemoveAspiration = (id: string) => {
    const updated = aspirations.filter(a => a.id !== id).map((a, idx) => ({ ...a, priority: idx + 1 }));
    setAspirations(updated);
    localStorage.setItem('12a16_aspirations', JSON.stringify(updated));
  };

  const milestones = [
    { title: 'Khởi động ôn luyện Lớp 12 & Khảo sát ban đầu', date: 'Tháng 10/2026', done: true },
    { title: 'Thi Học Kỳ I & Đánh giá phân hóa kiến thức', date: 'Tháng 12/2026', done: true },
    { title: 'Đăng ký dự thi Đánh Giá Năng Lực (ĐGNL) ĐHQG', date: 'Tháng 02/2027', done: false },
    { title: 'Thi thử Tốt nghiệp THPT toàn trường đợt 1', date: 'Tháng 04/2027', done: false },
    { title: 'Kỳ thi Tốt Nghiệp THPT Quốc Gia Chính Thức 2027', date: '25 - 27/06/2027', done: false },
    { title: 'Công bố điểm thi & Chốt Nguyện vọng Đại học', date: 'Tháng 07/2027', done: false },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Countdown */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>La Bàn Thời Gian • Niên Khóa 2026 - 2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Đồng Hồ Đếm Ngược Kỳ Thi Tốt Nghiệp THPT 2027
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mỗi ngày trôi qua tại lớp 12A16 là một bước tiến gần hơn đến cánh cửa trường Đại học hằng mơ ước. Hãy cùng Cô Phương Linh quản lý thời gian hiệu quả và kiên định với mục tiêu đã chọn.
            </p>
          </div>

          {/* Big Countdown Number Box */}
          <div className="bg-gradient-to-tr from-amber-500 to-rose-500 rounded-3xl p-6 text-center text-white shadow-lg space-y-1">
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-100 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 animate-spin" />
              Còn Chính Xác
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">{daysRemaining}</div>
            <div className="text-xs font-bold text-amber-100">Ngày Tới Ngày Thi Chính Thức</div>
            <p className="text-[10px] text-white/80 pt-1">Dự kiến: 25/06/2027 • Bộ GD&ĐT</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Milestones */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Các Mốc Quan Trọng Năm Cuối Cấp
            </h3>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              6 Giai Đoạn
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  m.done 
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : idx === 2
                    ? 'bg-amber-50/60 border-amber-300 text-amber-950 ring-1 ring-amber-200'
                    : 'bg-slate-50/50 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  m.done ? 'bg-emerald-600 text-white' : idx === 2 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {m.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <div className="text-xs">
                  <div className="font-bold">{m.title}</div>
                  <div className="text-[11px] opacity-75 mt-0.5">{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: University Dream Aspirations Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Hồ Sơ Nguyện Vọng Đại Học Của Em
                </h3>
                <p className="text-xs text-slate-500">
                  Lưu trữ và theo dõi các mục tiêu xét tuyển theo tổ hợp D01, A00, A01, C00...
                </p>
              </div>

              <button
                onClick={() => setIsAdding(!isAdding)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200"
              >
                {isAdding ? 'Hủy' : '+ Thêm Nguyện Vọng'}
              </button>
            </div>

            {/* Add new aspiration form */}
            {isAdding && (
              <form onSubmit={handleAddAspiration} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fadeIn">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngành Học Mơ Ước:</label>
                  <input
                    type="text"
                    value={newMajor}
                    onChange={(e) => setNewMajor(e.target.value)}
                    placeholder="VD: Sư phạm Ngữ Văn, Truyền Thông, CNTT..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trường Đại Học Mục Tiêu:</label>
                  <input
                    type="text"
                    value={newUni}
                    onChange={(e) => setNewUni(e.target.value)}
                    placeholder="VD: ĐH Sư Phạm TP.HCM, ĐH Kinh Tế..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổ Hợp Xét Tuyển:</label>
                  <select
                    value={newCombo}
                    onChange={(e) => setNewCombo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="D01 (Toán, Văn, Anh)">D01 (Toán, Văn, Anh)</option>
                    <option value="A00 (Toán, Lý, Hóa)">A00 (Toán, Lý, Hóa)</option>
                    <option value="A01 (Toán, Lý, Anh)">A01 (Toán, Lý, Anh)</option>
                    <option value="C00 (Văn, Sử, Địa)">C00 (Văn, Sử, Địa)</option>
                    <option value="B00 (Toán, Hóa, Sinh)">B00 (Toán, Hóa, Sinh)</option>
                    <option value="ĐGNL ĐHQG">Đánh Giá Năng Lực ĐHQG</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Điểm Chuẩn Mục Tiêu (Thang 30):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="30"
                    value={newTarget}
                    onChange={(e) => setNewTarget(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-xs"
                  >
                    Lưu Vào Danh Sách Nguyện Vọng
                  </button>
                </div>
              </form>
            )}

            {/* Aspirations List */}
            <div className="space-y-3">
              {aspirations.map((asp) => (
                <div
                  key={asp.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      NV{asp.priority}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{asp.major}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <Building className="w-3.5 h-3.5" /> {asp.university}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                          Tổ hợp: {asp.combination}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Mục Tiêu</div>
                      <div className="text-base font-black text-indigo-950">{asp.targetScore} Điểm</div>
                    </div>
                    <button
                      onClick={() => handleRemoveAspiration(asp.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50"
                      title="Xóa nguyện vọng này"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {aspirations.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                Chưa có nguyện vọng nào. Hãy bấm &ldquo;+ Thêm Nguyện Vọng&rdquo; để thiết lập mục tiêu Đại học của em!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
