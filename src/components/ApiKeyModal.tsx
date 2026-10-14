import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { FALLBACK_MODELS } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (key: string, model: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      const savedModel = localStorage.getItem('gemini_model') || 'gemini-3-flash-preview';
      setApiKey(savedKey);
      setSelectedModel(savedModel);
      setInputError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      setInputError('Vui lòng nhập API Key để sử dụng app. Bạn có thể lấy key miễn phí tại https://aistudio.google.com/api-keys');
      return;
    }

    setInputError(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', cleanKey);
      localStorage.setItem('gemini_model', selectedModel);
    }

    if (onSave) {
      onSave(cleanKey, selectedModel);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    if (confirm('Bạn có chắc chắn muốn xóa API Key khỏi trình duyệt này?')) {
      setApiKey('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gemini_api_key');
      }
      if (onSave) onSave('', selectedModel);
    }
  };

  const modelCards = [
    {
      id: 'gemini-3-flash-preview',
      name: 'Gemini 3 Flash Preview',
      tag: 'Khuyến Nghị Mặc Định',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      speed: 'Siêu Nhanh',
      desc: 'Tối ưu tốc độ phản hồi, tư duy logic sư phạm xuất sắc và tiết kiệm hạn mức API.',
      icon: Zap,
    },
    {
      id: 'gemini-3-pro-preview',
      name: 'Gemini 3 Pro Preview',
      tag: 'Tư Duy Chuyên Sâu',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      speed: 'Phức Tạp & Toàn Diện',
      desc: 'Dành cho phân tích học thuật đa chiều, tư vấn lộ trình và bài tập Ngữ văn nâng cao.',
      icon: Cpu,
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      tag: 'Dự Phòng Bền Bỉ',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
      speed: 'Tức Thì',
      desc: 'Hoạt động ổn định với thời gian chờ thấp, sẵn sàng thay thế khi các model khác quá tải.',
      icon: Layers,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Thiết Lập Model & Gemini API Key
              </h3>
              <p className="text-xs text-slate-500">
                Lớp 12A16 - Cô Phương Linh • Hệ thống Trí Tuệ Nhân Tạo Sư Phạm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          {/* Mandatory Key Notice when no key is configured */}
          {(!apiKey || inputError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1 animate-fadeIn">
              <div className="font-bold flex items-center gap-1.5 text-xs text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Yêu Cầu Bắt Buộc Nhập API Key:</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Để sử dụng các tính năng Trí tuệ Nhân tạo (Cố vấn Sư phạm 5 phần, Gia sư Socrate Văn 12, Soạn tin nhắn Zalo...), bạn cần cung cấp Google Gemini API Key.
              </p>
              {inputError && (
                <p className="text-[11px] font-bold text-rose-900 pt-1 border-t border-rose-200">
                  ⚠️ {inputError}
                </p>
              )}
            </div>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Google Gemini API Key:</span>
                <span className="text-rose-600 font-extrabold">*</span>
              </label>

              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 hover:underline text-[11px]"
              >
                <span>Lấy API Key Miễn Phí Tại Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Dán mã API Key của bạn (bắt đầu bằng AIzaSy...)"
                className="w-full p-3 pr-10 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title={showKey ? 'Ẩn Key' : 'Hiện Key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              🔒 <strong>Bảo mật:</strong> API Key được lưu trực tiếp trong bộ nhớ trình duyệt (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">localStorage</code>) của bạn và chỉ gửi trực tiếp đến Google API, không lưu trên máy chủ trung gian.
            </p>
          </div>

          {/* Model Selection Cards */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">
              Chọn Model AI Mặc Định:
            </label>

            <div className="space-y-2.5">
              {modelCards.map((card) => {
                const IconComponent = card.icon;
                const isSelected = selectedModel === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedModel(card.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {card.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.tagColor}`}>
                          {card.tag}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="shrink-0 mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto Fallback & Retry Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cơ Chế Tự Động Thử Lại & Dự Phòng (Auto-Retry Chain):</span>
            </div>
            <p className="leading-relaxed">
              Nếu model được chọn gặp sự cố quá tải quota (lỗi <code className="font-mono text-rose-600">429 RESOURCE_EXHAUSTED</code>), hệ thống sẽ <strong>tự động chuyển ngay</strong> sang model tiếp theo trong danh sách mà không làm gián đoạn bài học của cô trò.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 transition-colors"
                title="Xóa API Key đã lưu"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Key</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Đã Lưu!</span>
                  </>
                ) : (
                  <span>Lưu Cấu Hình</span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
