import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  Smile, 
  Award, 
  Send, 
  ShieldCheck, 
  Lightbulb,
  Clock
} from 'lucide-react';

interface ParentDashboardProps {
  studentName: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  studentName,
}) => {
  const [parentNote, setParentNote] = useState<string>('');
  const [noteSent, setNoteSent] = useState<boolean>(false);

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentNote.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setParentNote('');
      setNoteSent(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Parent Partnership Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mô Hình Đồng Hành Sư Phạm: &ldquo;Đồng Hành Thay Vì Kiểm Soát&rdquo;</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Báo Cáo Tiến Bộ & Điểm Sáng Của Con: {studentName}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Chúng tôi không gửi về cho phụ huynh những bảng điểm giật gân tạo áp lực lên bữa cơm gia đình. Thay vào đó, lớp 12A16 của Cô Phương Linh tôn vinh sự nỗ lực, thói quen tốt và gợi ý cách cha mẹ lắng nghe, tiếp thêm sức mạnh cho con trên bước đường trưởng thành.
            </p>
          </div>

          {/* Quick Wellbeing Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto">
              <Smile className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Chỉ Số Bình An Của Con</div>
            <div className="text-2xl font-black text-white">92 / 100 Điểm</div>
            <p className="text-[11px] text-slate-300">
              Tâm trạng ổn định, tinh thần hăng hái, có giấc ngủ điều độ 7h/đêm.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Growth Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                3 Điểm Sáng Nổi Bật Tuần Này Của {studentName}
              </h3>
              <p className="text-xs text-slate-500">
                Những nỗ lực đáng tự hào mà con đã đạt được cùng thầy cô và bạn bè
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Highlight 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kỷ Luật Tự Thân: Chuỗi 18 Ngày Vào Lớp Đúng Giờ
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                    +150 EXP
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Con luôn có mặt tại lớp trước 7h00 sáng, chuẩn bị bài vở chu đáo và sẵn sàng cho các tiết học đầu tiên mà không cần nhắc nhở.
                </p>
              </div>

              {/* Highlight 2 */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Tinh Thần Tương Trợ: Đôi Bạn Cùng Tiến Môn Hóa
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-[10px]">
                    Hành Động Đẹp
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Con đã chủ động dành giờ ra chơi kèm bạn Nam cùng bàn giải các bài toán Este khó, được cô giáo chủ nhiệm khen ngợi trước lớp.
                </p>
              </div>

              {/* Highlight 3 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Tiến Bộ Học Thuật: Môn Vật Lý & Tiếng Anh Tăng Trưởng
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px]">
                    Dự Phóng Đạt 8.8+
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Ma trận Heatmap ghi nhận con đã hoàn thành 94% bài tập đọc hiểu Tiếng Anh và làm chủ tốt các câu hỏi đồ thị dao động điều hòa Vật lý.
                </p>
              </div>
            </div>
          </div>

          {/* Dinner Conversation Prompts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Gợi Ý Trò Chuyện Bữa Tối Hôm Nay (Family Connection)
              </h3>
              <p className="text-xs text-slate-500">
                Các câu hỏi mở giàu tình cảm để kết nối với con thay vì hỏi dồn dập &ldquo;Được mấy điểm?&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Gợi ý 1: Hỏi về tình bạn</div>
                <p className="text-slate-600 italic">
                  &ldquo;Hôm nay con kèm bạn Nam học vui không? Bạn ấy đã hiểu bài hơn chưa hả con?&rdquo;
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Gợi ý 2: Thấu cảm nỗ lực</div>
                <p className="text-slate-600 italic">
                  &ldquo;Ba mẹ thấy con dậy sớm đi học rất đúng giờ tuần này. Con có muốn ăn món gì cuối tuần để bồi dưỡng không?&rdquo;
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Gợi ý 3: Chia sẻ cảm xúc</div>
                <p className="text-slate-600 italic">
                  &ldquo;Hôm nay ở trường có câu chuyện gì buồn cười làm con nhớ nhất không?&rdquo;
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Gợi ý 4: Khích lệ tự tin</div>
                <p className="text-slate-600 italic">
                  &ldquo;Dù kỳ thi có khó đến đâu, ba mẹ luôn tin tưởng và tự hào vì con đã cố gắng hết mình!&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Encouragement Letter to Child */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                Hộp Thư Yêu Thương Gửi Cho Con
              </h3>
              <p className="text-[11px] text-slate-500">
                Gửi một lời nhắn động viên ấm áp, con sẽ nhận được thông báo bất ngờ khi đăng nhập
              </p>
            </div>

            <form onSubmit={handleSendNote} className="space-y-3 text-xs">
              <textarea
                value={parentNote}
                onChange={(e) => setParentNote(e.target.value)}
                placeholder="Viết lời nhắn gửi con (Ví dụ: Ba mẹ chúc con có một tuần học thật vui vẻ và bình an, đừng lo lắng quá nhiều nhé...)"
                rows={4}
                required
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />

              {noteSent ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã gửi lời chúc yêu thương đến con!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Lời Động Viên</span>
                </button>
              )}
            </form>
          </div>

          {/* School Partnership Contact */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Kênh Trao Đổi Với Nhà Trường
            </span>
            <div className="space-y-2 text-slate-600 text-[11px]">
              <div>• Giáo viên chủ nhiệm: <span className="font-semibold text-slate-800">Cô Phương Linh (0918.892.616)</span></div>
              <div>• Khung giờ tham vấn định kỳ: <span className="font-semibold text-slate-800">16h30 - 17h30 Thứ Sáu</span></div>
              <div>• Đảm bảo thông tin hai chiều vì sự tiến bộ bền vững của con.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
