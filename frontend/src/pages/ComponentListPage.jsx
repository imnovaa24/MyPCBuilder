import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const CATEGORY_ICONS = {
  cpu: 'memory',
  vga: 'videogame_asset',
  mainboard: 'developer_board',
  ram: 'memory',
  storage: 'hard_drive',
  psu: 'bolt',
  case: 'computer',
  cooler: 'ac_unit',
};

const SPEC_LABELS = {
  socket: 'Socket',
  cores: 'Số nhân',
  threads: 'Số luồng',
  tdp: 'TDP (W)',
  has_igpu: 'iGPU',
  form_factor: 'Form Factor',
  ram_type: 'Chuẩn RAM',
  ram_slots: 'Số khe RAM',
  type: 'Loại',
  capacity: 'Dung lượng (GB)',
  bus_speed: 'Bus (MHz)',
  kit: 'Số thanh (kit)',
  vram: 'VRAM',
  length_mm: 'Chiều dài (mm)',
  recommended_psu: 'PSU đề xuất (W)',
  wattage: 'Công suất (W)',
  efficiency: 'Hiệu suất',
  supported_form_factors: 'Hỗ trợ Mainboard',
  max_vga_length_mm: 'VGA dài tối đa (mm)',
  max_cooler_height_mm: 'Tản nhiệt cao tối đa (mm)',
  supported_sockets: 'Socket hỗ trợ',
  height_mm: 'Chiều cao (mm)',
  radiator_size_mm: 'Radiator (mm)',
  tdp_rating: 'TDP giải nhiệt (W)',
  capacity_gb: 'Dung lượng (GB)',
  read_speed: 'Tốc độ đọc (MB/s)',
  write_speed: 'Tốc độ ghi (MB/s)',
  interface: 'Giao tiếp',
};

function ComponentListPage() {
  const { categoryCode } = useParams();
  const [category, setCategory] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE}/categories`),
      axios.get(`${API_BASE}/components`),
    ])
      .then(([catRes, compRes]) => {
        const cats = catRes.data.data || [];
        const comps = compRes.data.data || [];
        const matchedCat = cats.find((c) => c.code === categoryCode);
        setCategory(matchedCat || null);
        if (matchedCat) {
          setComponents(comps.filter((c) => c.category_id === matchedCat.id));
        }
      })
      .catch((err) => console.error('Lỗi tải dữ liệu:', err))
      .finally(() => setLoading(false));
  }, [categoryCode]);

  const parseSpecs = (specs) => {
    if (!specs) return {};
    return typeof specs === 'string' ? JSON.parse(specs) : specs;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 lg:px-40">
      <div className="flex flex-col max-w-[1200px] w-full gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors no-underline text-slate-400">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-200">{category?.name || categoryCode}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary">
              {CATEGORY_ICONS[categoryCode] || 'settings'}
            </span>
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">{category?.name || categoryCode}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {components.length} sản phẩm có sẵn
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-slate-400 py-20">
            <span className="material-symbols-outlined text-5xl animate-spin block mb-3">progress_activity</span>
            <p>Đang tải danh sách linh kiện...</p>
          </div>
        ) : components.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <span className="material-symbols-outlined text-5xl block mb-3">inventory_2</span>
            <p>Chưa có linh kiện nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {components.map((comp) => {
              const specs = parseSpecs(comp.specifications);
              const isExpanded = expandedId === comp.id;
              const imageUrl = comp.image_url?.startsWith('/storage/')
                ? `http://127.0.0.1:8000${comp.image_url}`
                : comp.image_url;

              return (
                <div
                  key={comp.id}
                  className="rounded-xl bg-surface-dark border border-border-dark overflow-hidden hover:border-primary/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-5">
                    {/* Image */}
                    {imageUrl && (
                      <div className="w-full sm:w-32 h-32 rounded-lg bg-[#111c22] overflow-hidden shrink-0">
                        <img
                          src={imageUrl}
                          alt={comp.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                            {comp.brand}
                          </p>
                          <h3 className="text-white text-lg font-bold">{comp.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-white font-bold text-lg">
                            {Number(comp.min_price).toLocaleString('vi-VN')}đ
                          </p>
                          {comp.max_price > comp.min_price && (
                            <p className="text-slate-500 text-xs">
                              ~ {Number(comp.max_price).toLocaleString('vi-VN')}đ
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quick specs preview */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Object.entries(specs).slice(0, 4).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-2.5 py-1 rounded-md bg-[#111c22] text-xs text-slate-300 border border-border-dark"
                          >
                            {SPEC_LABELS[key] || key}: <span className="text-white font-medium">{String(val)}</span>
                          </span>
                        ))}
                        {Object.keys(specs).length > 4 && (
                          <button
                            onClick={() => toggleExpand(comp.id)}
                            className="px-2.5 py-1 rounded-md bg-[#111c22] text-xs text-primary border border-border-dark cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            {isExpanded ? 'Thu gọn' : `+${Object.keys(specs).length - 4} thông số`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded specs */}
                  {isExpanded && (
                    <div className="border-t border-border-dark px-5 py-4 bg-[#0d171c]">
                      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                        Thông số kỹ thuật
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(specs).map(([key, val]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-slate-500 text-xs">{SPEC_LABELS[key] || key}</span>
                            <span className="text-white text-sm font-medium">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default ComponentListPage;
