import { useState, useEffect, useMemo } from 'react';
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

// Các thông số dạng phân loại (enum) sẽ tự sinh dropdown lọc theo danh mục
const CATEGORICAL_SPEC_KEYS = [
  'socket',
  'ram_type',
  'type',
  'efficiency',
  'form_factor',
  'interface',
  'has_igpu',
];

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'name_desc', label: 'Tên: Z → A' },
];

const emptyFilters = {
  search: '',
  brand: '',
  priceMin: '',
  priceMax: '',
  sort: 'price_asc',
  specs: {},
};

const formatSpecValue = (key, val) => {
  if (key === 'has_igpu') return val === true || val === 'true' ? 'Có' : 'Không';
  if (typeof val === 'boolean') return val ? 'Có' : 'Không';
  return String(val);
};

const inputClass =
  'w-full h-10 px-3 rounded-lg bg-[#111c22] border border-border-dark text-white text-sm focus:border-primary outline-none transition-colors';
const labelClass =
  'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block';

function ComponentListPage() {
  const { categoryCode } = useParams();
  const [category, setCategory] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    setLoading(true);
    setFilters(emptyFilters);
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
        } else {
          setComponents([]);
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

  // Danh sách thương hiệu có trong danh mục hiện tại
  const brands = useMemo(() => {
    const set = new Set();
    components.forEach((c) => c.brand && set.add(c.brand));
    return [...set].sort();
  }, [components]);

  // Bộ lọc thông số động — tự sinh theo dữ liệu thực tế của danh mục
  const specFilters = useMemo(() => {
    const result = [];
    for (const key of CATEGORICAL_SPEC_KEYS) {
      const valuesSet = new Set();
      components.forEach((c) => {
        const specs = parseSpecs(c.specifications);
        const v = specs[key];
        if (v !== undefined && v !== null && v !== '' && !Array.isArray(v)) {
          valuesSet.add(String(v));
        }
      });
      if (valuesSet.size >= 2) {
        result.push({ key, values: [...valuesSet].sort() });
      }
    }
    return result;
  }, [components]);

  // Áp dụng toàn bộ bộ lọc + sắp xếp
  const filtered = useMemo(() => {
    let list = [...components];

    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => `${c.brand} ${c.name}`.toLowerCase().includes(q));
    }

    if (filters.brand) {
      list = list.filter((c) => c.brand === filters.brand);
    }

    const min = Number(filters.priceMin) || 0;
    const max = Number(filters.priceMax) || Infinity;
    list = list.filter((c) => {
      const price = Number(c.min_price);
      return price >= min && price <= max;
    });

    for (const [key, val] of Object.entries(filters.specs)) {
      if (val) {
        list = list.filter((c) => String(parseSpecs(c.specifications)[key]) === val);
      }
    }

    switch (filters.sort) {
      case 'price_asc':
        list.sort((a, b) => Number(a.min_price) - Number(b.min_price));
        break;
      case 'price_desc':
        list.sort((a, b) => Number(b.min_price) - Number(a.min_price));
        break;
      case 'name_asc':
        list.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
        break;
      case 'name_desc':
        list.sort((a, b) => `${b.brand} ${b.name}`.localeCompare(`${a.brand} ${a.name}`));
        break;
      default:
        break;
    }

    return list;
  }, [components, filters]);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    Object.values(filters.specs).filter(Boolean).length;

  const resetFilters = () => setFilters(emptyFilters);

  const updateSpecFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));

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
              {loading
                ? 'Đang tải...'
                : activeFilterCount > 0
                ? `${filtered.length} / ${components.length} sản phẩm`
                : `${components.length} sản phẩm có sẵn`}
            </p>
          </div>
        </div>

        {/* Filter Panel */}
        {!loading && components.length > 0 && (
          <div className="rounded-xl bg-surface-dark border border-border-dark p-4 md:p-5 flex flex-col gap-4">
            {/* Hàng 1: tìm kiếm, thương hiệu, giá, sắp xếp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className={labelClass}>Tìm kiếm</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[18px] text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    placeholder="Tên hoặc thương hiệu..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Thương hiệu</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Tất cả</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Giá từ (đ)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceMin}
                  onChange={(e) => setFilters((p) => ({ ...p, priceMin: e.target.value }))}
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Giá đến (đ)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceMax}
                  onChange={(e) => setFilters((p) => ({ ...p, priceMax: e.target.value }))}
                  placeholder="Không giới hạn"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Hàng 2: bộ lọc thông số động + sắp xếp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {specFilters.map((sf) => (
                <div key={sf.key}>
                  <label className={labelClass}>{SPEC_LABELS[sf.key] || sf.key}</label>
                  <select
                    value={filters.specs[sf.key] || ''}
                    onChange={(e) => updateSpecFilter(sf.key, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Tất cả</option>
                    {sf.values.map((v) => (
                      <option key={v} value={v}>
                        {formatSpecValue(sf.key, v)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className={labelClass}>Sắp xếp</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                  className={inputClass}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng 3: đếm kết quả + nút xóa lọc */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-border-dark">
                <span className="text-sm text-slate-400 mt-3">
                  Tìm thấy <span className="text-primary font-bold">{filtered.length}</span> kết quả
                </span>
                <button
                  onClick={resetFilters}
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                  Xóa bộ lọc ({activeFilterCount})
                </button>
              </div>
            )}
          </div>
        )}

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
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <span className="material-symbols-outlined text-5xl block mb-3">search_off</span>
            <p>Không tìm thấy linh kiện nào khớp với bộ lọc.</p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((comp) => {
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
