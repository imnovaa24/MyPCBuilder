import { useState, useMemo } from 'react';

function ComponentSelectorModal({ isOpen, onClose, categoryName, components, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return components;
    const q = search.toLowerCase();
    return components.filter(c =>
      c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
    );
  }, [components, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-[900px] h-[80vh] bg-surface-darker rounded-xl border border-border-dark shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-surface-darker z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Chọn {categoryName}</h2>
            <p className="text-sm text-slate-400">Chọn linh kiện phù hợp cho cấu hình của bạn</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border-dark bg-[#101c22]/50">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">search</span>
            <input
              className="w-full bg-surface-dark border border-border-dark rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Tìm theo tên hoặc thương hiệu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
              <p>Không tìm thấy linh kiện nào</p>
            </div>
          )}
          {filtered.map(item => (
            <div key={item.id} className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="shrink-0">
                <div className="w-full sm:w-[80px] aspect-square rounded-lg bg-[#233c48] flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-3xl text-slate-400">memory</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                        {(() => {
                          const specs = typeof item.specifications === 'string' ? JSON.parse(item.specifications) : (item.specifications || {});
                          const ramType = specs.ram_type || specs.type;
                          if (!ramType || !['DDR4','DDR5','DDR3'].some(t => String(ramType).toUpperCase().includes(t))) return null;
                          return (
                            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-500/30 uppercase tracking-wide">
                              {ramType}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{item.brand}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                  <div className="text-lg font-bold text-white">
                    {Number(item.min_price).toLocaleString('vi-VN')}đ - {Number(item.max_price).toLocaleString('vi-VN')}đ
                  </div>
                  <button
                    onClick={() => onSelect(item)}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Thêm vào Build
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComponentSelectorModal;
