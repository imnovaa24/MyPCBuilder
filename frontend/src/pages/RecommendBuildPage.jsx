import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendation, recommendationToPresetBuild } from '../hooks/useRecommendation';

const USE_CASES = [
  { value: 'learning', label: 'Học tập', icon: 'school', desc: 'Word, Zoom, tài liệu cơ bản' },
  { value: 'office', label: 'Văn phòng', icon: 'work', desc: 'Excel, email, đa nhiệm nhẹ' },
  { value: 'development', label: 'Lập trình', icon: 'code', desc: 'IDE, Docker, compile code' },
  { value: 'gaming', label: 'Chơi game', icon: 'sports_esports', desc: 'Game AAA, FPS cao' },
  { value: 'graphics', label: 'Đồ họa / Render', icon: 'palette', desc: 'Photoshop, Premiere, Blender' },
];

const BUDGET_PRESETS = [
  { label: '10 triệu', value: 10000000 },
  { label: '15 triệu', value: 15000000 },
  { label: '20 triệu', value: 20000000 },
  { label: '30 triệu', value: 30000000 },
  { label: '50 triệu', value: 50000000 },
];

const SLOT_LABELS = {
  cpu: 'CPU',
  mainboard: 'Mainboard',
  ram: 'RAM',
  vga: 'VGA',
  storage: 'Storage',
  psu: 'PSU',
  case: 'Case',
  cooler: 'Cooler',
};

const SLOT_ICONS = {
  cpu: 'memory',
  mainboard: 'developer_board',
  ram: 'memory',
  vga: 'videogame_asset',
  storage: 'hard_drive',
  psu: 'bolt',
  case: 'computer',
  cooler: 'ac_unit',
};

const SOURCE_LABELS = {
  gemini: 'Google Gemini AI',
  anthropic: 'Claude AI',
  llm: 'AI',
  rule_based: 'Rule-based engine',
};

function RecommendBuildPage() {
  const navigate = useNavigate();
  const { recommendation, loading, error, getRecommendation, reset } = useRecommendation();

  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(20000000);
  const [useCase, setUseCase] = useState('gaming');
  const [constraints, setConstraints] = useState({
    preferred_cpu_brand: '',
    preferred_vga_brand: '',
    min_vram: '',
    preferred_ram_type: '',
    preferred_platform: '',
    notes: '',
  });

  const handleConstraintChange = (field, value) => {
    setConstraints(prev => ({ ...prev, [field]: value }));
  };

  const buildConstraintsPayload = () => {
    const payload = {};
    if (constraints.preferred_cpu_brand.trim()) payload.preferred_cpu_brand = constraints.preferred_cpu_brand.trim();
    if (constraints.preferred_vga_brand.trim()) payload.preferred_vga_brand = constraints.preferred_vga_brand.trim();
    if (constraints.min_vram) payload.min_vram = Number(constraints.min_vram);
    if (constraints.preferred_ram_type) payload.preferred_ram_type = constraints.preferred_ram_type;
    if (constraints.preferred_platform) payload.preferred_platform = constraints.preferred_platform;
    if (constraints.notes.trim()) payload.notes = constraints.notes.trim();
    return payload;
  };

  const handleSubmit = async () => {
    try {
      await getRecommendation({
        budget,
        use_case: useCase,
        constraints: buildConstraintsPayload(),
      });
      setStep(4);
    } catch {
      // error handled in hook
    }
  };

  const handleApplyToBuilder = () => {
    if (!recommendation) return;
    navigate('/builder', {
      state: { presetBuild: recommendationToPresetBuild(recommendation) },
    });
  };

  const handleStartOver = () => {
    reset();
    setStep(1);
  };

  const selectedUseCase = USE_CASES.find(u => u.value === useCase);

  return (
    <main className="flex-grow w-full max-w-[960px] mx-auto p-6 md:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-white mb-2">
          Xây dựng theo yêu cầu
        </h1>
        <p className="text-[#92b7c9] text-base md:text-lg">
          Chọn ngân sách, mục đích và yêu cầu — hệ thống sẽ đề xuất bộ PC từ kho linh kiện backend.
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center size-8 rounded-full text-sm font-bold shrink-0 ${
                step >= n ? 'bg-primary text-white' : 'bg-[#233c48] text-slate-400'
              }`}>
                {n}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step >= n ? 'text-white' : 'text-slate-500'}`}>
                {n === 1 ? 'Ngân sách' : n === 2 ? 'Mục đích' : 'Yêu cầu'}
              </span>
              {n < 3 && <div className={`h-0.5 flex-1 ${step > n ? 'bg-primary' : 'bg-[#233c48]'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Budget */}
      {step === 1 && (
        <section className="bg-surface-dark rounded-xl border border-border-dark p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Bước 1: Ngân sách</h2>
            <p className="text-slate-400 text-sm">Nhập tổng chi phí tối đa bạn muốn chi cho bộ PC.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {BUDGET_PRESETS.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setBudget(p.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
                  budget === p.value
                    ? 'bg-primary border-primary text-white'
                    : 'bg-[#111c22] border-border-dark text-slate-300 hover:border-primary/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hoặc nhập số tiền (VNĐ)</label>
            <input
              type="number"
              min={1000000}
              step={500000}
              value={budget}
              onChange={e => setBudget(Number(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-lg border border-border-dark bg-[#111c22] text-white text-lg font-bold focus:border-primary outline-none"
            />
            <p className="text-primary text-sm font-semibold mt-2">
              {budget.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={budget < 1000000}
              onClick={() => setStep(2)}
              className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Tiếp theo
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Purpose */}
      {step === 2 && (
        <section className="bg-surface-dark rounded-xl border border-border-dark p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Bước 2: Mục đích sử dụng</h2>
            <p className="text-slate-400 text-sm">Chọn mục đích chính để hệ thống ưu tiên linh kiện phù hợp.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {USE_CASES.map(item => (
              <button
                key={item.value}
                type="button"
                onClick={() => setUseCase(item.value)}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  useCase === item.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border-dark bg-[#111c22] hover:border-primary/40'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${useCase === item.value ? 'text-primary' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-white font-bold">{item.label}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="h-11 px-6 rounded-lg border border-border-dark text-slate-300 font-semibold text-sm hover:border-primary/50 cursor-pointer bg-transparent">
              Quay lại
            </button>
            <button type="button" onClick={() => setStep(3)} className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm cursor-pointer">
              Tiếp theo
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Constraints */}
      {step === 3 && (
        <section className="bg-surface-dark rounded-xl border border-border-dark p-6 md:p-8 flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Bước 3: Yêu cầu đặc biệt</h2>
            <p className="text-slate-400 text-sm">Tùy chọn — bỏ trống nếu không có yêu cầu cụ thể.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Thương hiệu CPU ưu tiên</label>
              <input
                type="text"
                placeholder="VD: Intel, AMD"
                value={constraints.preferred_cpu_brand}
                onChange={e => handleConstraintChange('preferred_cpu_brand', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Thương hiệu VGA ưu tiên</label>
              <input
                type="text"
                placeholder="VD: NVIDIA, ASUS"
                value={constraints.preferred_vga_brand}
                onChange={e => handleConstraintChange('preferred_vga_brand', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">VRAM tối thiểu (GB)</label>
              <input
                type="number"
                min={0}
                placeholder="VD: 8"
                value={constraints.min_vram}
                onChange={e => handleConstraintChange('min_vram', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Chuẩn RAM</label>
              <select
                value={constraints.preferred_ram_type}
                onChange={e => handleConstraintChange('preferred_ram_type', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none cursor-pointer"
              >
                <option value="">Không yêu cầu</option>
                <option value="DDR4">DDR4</option>
                <option value="DDR5">DDR5</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nền tảng CPU</label>
              <select
                value={constraints.preferred_platform}
                onChange={e => handleConstraintChange('preferred_platform', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none cursor-pointer"
              >
                <option value="">Không yêu cầu</option>
                <option value="intel">Intel</option>
                <option value="amd">AMD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Ghi chú thêm</label>
            <textarea
              rows={3}
              placeholder="VD: Cần case nhỏ, ưu tiên tản nhiệt tốt..."
              value={constraints.notes}
              onChange={e => handleConstraintChange('notes', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm focus:border-primary outline-none resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-border-dark bg-[#111c22] px-4 py-3 text-sm text-slate-400">
            <span className="text-white font-semibold">Tóm tắt: </span>
            Ngân sách {budget.toLocaleString('vi-VN')}đ · Mục đích: {selectedUseCase?.label}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="h-11 px-6 rounded-lg border border-border-dark text-slate-300 font-semibold text-sm hover:border-primary/50 cursor-pointer bg-transparent">
              Quay lại
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  Nhận gợi ý cấu hình
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Step 4: Results */}
      {step === 4 && recommendation && (
        <div className="flex flex-col gap-6">
          <section className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
            <div className="p-5 border-b border-border-dark flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-surface-dark to-[#131f25]">
              <div>
                <h2 className="text-xl font-bold text-white">Cấu hình đề xuất</h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  {selectedUseCase?.label} · {SOURCE_LABELS[recommendation.source] || recommendation.source}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                recommendation.compatibility_check?.passed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {recommendation.compatibility_check?.passed ? 'Tương thích' : 'Có cảnh báo'}
              </span>
            </div>

            {recommendation.reasoning && (
              <div className="px-5 py-4 border-b border-border-dark bg-[#111c22]/50">
                <p className="text-sm text-slate-300 leading-relaxed">{recommendation.reasoning}</p>
              </div>
            )}

            <div className="p-5 flex flex-col gap-3">
              {Object.entries(recommendation.components || {}).map(([slot, comp]) => (
                <div key={slot} className="flex items-center gap-4 p-3 rounded-lg bg-[#111c22] border border-border-dark">
                  <div className="bg-[#233c48] flex items-center justify-center rounded-lg size-12 shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {SLOT_ICONS[slot] || 'settings'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary uppercase">{SLOT_LABELS[slot] || slot}</p>
                    <p className="text-white font-semibold truncate">{comp.brand} {comp.name}</p>
                    <p className="text-slate-400 text-sm">
                      {Number(comp.min_price).toLocaleString('vi-VN')}đ – {Number(comp.max_price).toLocaleString('vi-VN')}đ
                      {comp.score != null && (
                        <span className="text-primary ml-2">· Score {Math.round(comp.score)}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-border-dark flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-slate-400 text-sm">Tổng chi phí ước tính</p>
                <p className="text-white text-xl font-black">
                  {Number(recommendation.total_min_price).toLocaleString('vi-VN')}đ
                  <span className="text-slate-500 text-base font-normal"> – </span>
                  {Number(recommendation.total_max_price).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          </section>

          {recommendation.compatibility_check?.alerts?.length > 0 && (
            <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex flex-col gap-2">
              <p className="text-yellow-400 text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                Cảnh báo tương thích
              </p>
              {recommendation.compatibility_check.alerts.map((alert, i) => (
                <p key={i} className="text-slate-300 text-sm pl-7">
                  {alert.message}{alert.detail ? ` — ${alert.detail}` : ''}
                </p>
              ))}
            </section>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleApplyToBuilder}
              className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">build</span>
              Áp dụng vào Builder
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              className="h-11 px-6 rounded-lg border border-border-dark text-slate-300 font-semibold text-sm hover:border-primary/50 cursor-pointer bg-transparent"
            >
              Tạo lại
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default RecommendBuildPage;
