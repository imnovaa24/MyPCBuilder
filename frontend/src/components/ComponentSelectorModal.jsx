import { useState, useMemo, useEffect } from 'react';

const FILTER_CONFIG = {
  cpu: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'socket', label: 'Socket', type: 'select', specKey: 'socket' },
    { key: 'cores', label: 'Số nhân', type: 'range', specKey: 'cores', suffix: ' nhân' },
    { key: 'has_igpu', label: 'iGPU', type: 'boolean', specKey: 'has_igpu' },
  ],
  mainboard: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'socket', label: 'Socket', type: 'select', specKey: 'socket' },
    { key: 'form_factor', label: 'Form Factor', type: 'select', specKey: 'form_factor' },
    { key: 'ram_type', label: 'Chuẩn RAM', type: 'select', specKey: 'ram_type' },
  ],
  ram: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'type', label: 'Loại', type: 'select', specKey: 'type' },
    { key: 'capacity', label: 'Dung lượng', type: 'select', specKey: 'capacity', suffix: 'GB' },
    { key: 'bus_speed', label: 'Bus', type: 'select', specKey: 'bus_speed', suffix: 'MHz' },
  ],
  vga: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'vram', label: 'VRAM', type: 'select', specKey: 'vram' },
    { key: 'tdp', label: 'TDP', type: 'range', specKey: 'tdp', suffix: 'W' },
  ],
  psu: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'wattage', label: 'Công suất', type: 'select', specKey: 'wattage', suffix: 'W' },
    { key: 'efficiency', label: 'Hiệu suất', type: 'select', specKey: 'efficiency' },
  ],
  case: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'supported_form_factors', label: 'Hỗ trợ Mainboard', type: 'multiSelect', specKey: 'supported_form_factors' },
    { key: 'max_vga_length_mm', label: 'VGA tối đa', type: 'range', specKey: 'max_vga_length_mm', suffix: 'mm' },
  ],
  cooler: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'cooler_type', label: 'Loại', type: 'select', specKey: 'type' },
    { key: 'tdp_rating', label: 'TDP giải nhiệt', type: 'range', specKey: 'tdp_rating', suffix: 'W' },
  ],
  ssd: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'capacity_gb', label: 'Dung lượng', type: 'select', specKey: 'capacity_gb', suffix: 'GB' },
    { key: 'interface', label: 'Giao tiếp', type: 'select', specKey: 'interface' },
  ],
  hdd: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'capacity_gb', label: 'Dung lượng', type: 'select', specKey: 'capacity_gb', suffix: 'GB' },
  ],
  storage: [
    { key: 'brand', label: 'Hãng', type: 'select' },
    { key: 'type', label: 'Loại', type: 'select', specKey: 'type' },
    { key: 'capacity_gb', label: 'Dung lượng', type: 'select', specKey: 'capacity_gb', suffix: 'GB' },
    { key: 'interface', label: 'Giao tiếp', type: 'select', specKey: 'interface' },
  ],
};

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'name_desc', label: 'Tên: Z → A' },
];

const PRICE_RANGES = [
  { value: '', label: 'Tất cả mức giá' },
  { value: '0-2000000', label: 'Dưới 2 triệu' },
  { value: '2000000-5000000', label: '2 - 5 triệu' },
  { value: '5000000-10000000', label: '5 - 10 triệu' },
  { value: '10000000-20000000', label: '10 - 20 triệu' },
  { value: '20000000-50000000', label: '20 - 50 triệu' },
  { value: '50000000-999999999', label: 'Trên 50 triệu' },
];

function getSpec(item, key) {
  const specs = typeof item.specifications === 'string' 
    ? JSON.parse(item.specifications) 
    : (item.specifications || {});
  return specs[key];
}

function applyFilterToComponents(items, field, filterValue) {
  if (filterValue === undefined || filterValue === '' || filterValue === null) return items;
  
  if (field.type === 'select') {
    return items.filter(item => {
      let val;
      if (field.key === 'brand') {
        val = item.brand;
      } else {
        val = getSpec(item, field.specKey || field.key);
      }
      return String(val) === String(filterValue);
    });
  } else if (field.type === 'multiSelect') {
    return items.filter(item => {
      const val = getSpec(item, field.specKey || field.key);
      if (Array.isArray(val)) {
        return val.includes(filterValue);
      }
      return String(val) === String(filterValue);
    });
  } else if (field.type === 'boolean') {
    return items.filter(item => {
      const val = getSpec(item, field.specKey || field.key);
      const boolVal = val === true || val === 'true' || val === 1;
      return filterValue === 'yes' ? boolVal : !boolVal;
    });
  } else if (field.type === 'range' && typeof filterValue === 'object') {
    const { min, max } = filterValue;
    return items.filter(item => {
      const val = Number(getSpec(item, field.specKey || field.key));
      if (isNaN(val)) return true;
      const minOk = min === undefined || val >= min;
      const maxOk = max === undefined || val <= max;
      return minOk && maxOk;
    });
  }
  return items;
}

function ComponentSelectorModal({ isOpen, onClose, categoryName, categoryCode, components, onSelect }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('price_asc');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilters({});
      setSortBy('price_asc');
      setPriceRange('');
    }
  }, [isOpen, categoryCode]);

  const effectiveCode = useMemo(() => {
    if (categoryCode) return categoryCode.toLowerCase();
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('cpu') || name.includes('vi xử lý')) return 'cpu';
    if (name.includes('mainboard') || name.includes('bo mạch')) return 'mainboard';
    if (name.includes('ram') || name.includes('bộ nhớ')) return 'ram';
    if (name.includes('vga') || name.includes('card') || name.includes('gpu')) return 'vga';
    if (name.includes('psu') || name.includes('nguồn')) return 'psu';
    if (name.includes('case') || name.includes('thùng máy')) return 'case';
    if (name.includes('cooler') || name.includes('tản nhiệt')) return 'cooler';
    if (name === 'ssd') return 'ssd';
    if (name === 'hdd') return 'hdd';
    if (name.includes('storage') || name.includes('ổ cứng')) return 'storage';
    return 'default';
  }, [categoryName, categoryCode]);

  const filterFields = useMemo(() => {
    return FILTER_CONFIG[effectiveCode] || [{ key: 'brand', label: 'Hãng', type: 'select' }];
  }, [effectiveCode]);

  const filterOptions = useMemo(() => {
    const options = {};
    
    filterFields.forEach(targetField => {
      let availableComponents = [...components];
      
      filterFields.forEach(otherField => {
        if (otherField.key === targetField.key) return;
        const filterValue = filters[otherField.key];
        availableComponents = applyFilterToComponents(availableComponents, otherField, filterValue);
      });
      
      if (search.trim()) {
        const q = search.toLowerCase();
        availableComponents = availableComponents.filter(c =>
          c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
        );
      }
      
      if (priceRange) {
        const [minP, maxP] = priceRange.split('-').map(Number);
        availableComponents = availableComponents.filter(c => {
          const price = Number(c.min_price);
          return price >= minP && price <= maxP;
        });
      }

      if (targetField.type === 'select' || targetField.type === 'multiSelect') {
        const values = new Set();
        availableComponents.forEach(item => {
          let val;
          if (targetField.key === 'brand') {
            val = item.brand;
          } else {
            val = getSpec(item, targetField.specKey || targetField.key);
          }
          if (targetField.type === 'multiSelect' && Array.isArray(val)) {
            val.forEach(v => values.add(v));
          } else if (val !== undefined && val !== null && val !== '') {
            values.add(val);
          }
        });
        options[targetField.key] = Array.from(values).sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') return a - b;
          return String(a).localeCompare(String(b));
        });
      } else if (targetField.type === 'range') {
        let min = Infinity, max = -Infinity;
        availableComponents.forEach(item => {
          const val = Number(getSpec(item, targetField.specKey || targetField.key));
          if (!isNaN(val)) {
            min = Math.min(min, val);
            max = Math.max(max, val);
          }
        });
        options[targetField.key] = { min: min === Infinity ? 0 : min, max: max === -Infinity ? 100 : max };
      }
    });
    
    return options;
  }, [components, filterFields, filters, search, priceRange]);

  const filtered = useMemo(() => {
    let result = [...components];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
      );
    }

    if (priceRange) {
      const [minP, maxP] = priceRange.split('-').map(Number);
      result = result.filter(c => {
        const price = Number(c.min_price);
        return price >= minP && price <= maxP;
      });
    }

    filterFields.forEach(field => {
      const filterValue = filters[field.key];
      result = applyFilterToComponents(result, field, filterValue);
    });

    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.min_price) - Number(b.min_price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.min_price) - Number(a.min_price));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [components, search, filters, filterFields, sortBy, priceRange]);

  useEffect(() => {
    const newFilters = { ...filters };
    let hasChanges = false;
    
    filterFields.forEach(field => {
      const currentValue = filters[field.key];
      if (currentValue === undefined || currentValue === '' || currentValue === null) return;
      
      const availableOptions = filterOptions[field.key];
      
      if (field.type === 'select' || field.type === 'multiSelect') {
        if (Array.isArray(availableOptions) && !availableOptions.includes(currentValue)) {
          newFilters[field.key] = '';
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setFilters(newFilters);
    }
  }, [filterOptions, filterFields]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setPriceRange('');
    setSortBy('price_asc');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length 
    + (search ? 1 : 0) 
    + (priceRange ? 1 : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-[1100px] h-[90vh] bg-surface-darker rounded-xl border border-border-dark shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-surface-darker z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Chọn {categoryName}</h2>
            <p className="text-sm text-slate-400">
              Tìm thấy <span className="text-primary font-semibold">{filtered.length}</span> linh kiện
              {activeFilterCount > 0 && (
                <span className="text-slate-500"> ({activeFilterCount} bộ lọc đang áp dụng)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border cursor-pointer ${
                showFilters 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'bg-transparent border-border-dark text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button 
              onClick={onClose} 
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="px-6 py-3 border-b border-border-dark bg-[#101c22]/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">search</span>
            <input
              className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Tìm theo tên hoặc thương hiệu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border-dark bg-surface-dark text-white text-sm cursor-pointer focus:border-primary outline-none min-w-[140px]"
            >
              {PRICE_RANGES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border-dark bg-surface-dark text-white text-sm cursor-pointer focus:border-primary outline-none min-w-[140px]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-border-dark bg-[#0d171c]">
            <div className="flex flex-wrap gap-3 items-end">
              {filterFields.map(field => (
                <div key={field.key} className="flex flex-col gap-1.5 min-w-[140px]">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{field.label}</label>
                  {field.type === 'select' || field.type === 'multiSelect' ? (
                    <select
                      value={filters[field.key] || ''}
                      onChange={e => updateFilter(field.key, e.target.value)}
                      className="h-9 px-3 rounded-lg border border-border-dark bg-surface-dark text-white text-sm cursor-pointer focus:border-primary outline-none"
                    >
                      <option value="">Tất cả</option>
                      {(filterOptions[field.key] || []).map(val => (
                        <option key={val} value={val}>
                          {field.suffix ? `${val}${field.suffix}` : val}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <select
                      value={filters[field.key] || ''}
                      onChange={e => updateFilter(field.key, e.target.value)}
                      className="h-9 px-3 rounded-lg border border-border-dark bg-surface-dark text-white text-sm cursor-pointer focus:border-primary outline-none"
                    >
                      <option value="">Tất cả</option>
                      <option value="yes">Có</option>
                      <option value="no">Không</option>
                    </select>
                  ) : field.type === 'range' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filters[field.key]?.min ?? ''}
                        onChange={e => updateFilter(field.key, {
                          ...filters[field.key],
                          min: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="h-9 w-20 px-2 rounded-lg border border-border-dark bg-surface-dark text-white text-sm focus:border-primary outline-none"
                      />
                      <span className="text-slate-500">-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filters[field.key]?.max ?? ''}
                        onChange={e => updateFilter(field.key, {
                          ...filters[field.key],
                          max: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="h-9 w-20 px-2 rounded-lg border border-border-dark bg-surface-dark text-white text-sm focus:border-primary outline-none"
                      />
                      {field.suffix && <span className="text-xs text-slate-500">{field.suffix}</span>}
                    </div>
                  ) : null}
                </div>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="h-9 px-4 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors cursor-pointer bg-transparent flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">clear_all</span>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
              <p className="mb-4">Không tìm thấy linh kiện nào phù hợp</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline text-sm cursor-pointer bg-transparent border-none"
                >
                  Xóa tất cả bộ lọc để xem toàn bộ linh kiện
                </button>
              )}
            </div>
          )}
          {filtered.map(item => {
            const specs = typeof item.specifications === 'string' 
              ? JSON.parse(item.specifications) 
              : (item.specifications || {});
            const ramType = specs.ram_type || specs.type;
            const quickSpecs = [];
            
            if (effectiveCode === 'cpu') {
              if (specs.cores) quickSpecs.push(`${specs.cores} nhân`);
              if (specs.threads) quickSpecs.push(`${specs.threads} luồng`);
              if (specs.socket) quickSpecs.push(specs.socket);
            } else if (effectiveCode === 'mainboard') {
              if (specs.socket) quickSpecs.push(specs.socket);
              if (specs.form_factor) quickSpecs.push(specs.form_factor);
              if (specs.ram_type) quickSpecs.push(specs.ram_type);
            } else if (effectiveCode === 'ram') {
              if (specs.capacity) quickSpecs.push(`${specs.capacity}GB`);
              if (specs.bus_speed) quickSpecs.push(`${specs.bus_speed}MHz`);
            } else if (effectiveCode === 'vga') {
              if (specs.vram) quickSpecs.push(specs.vram);
              if (specs.tdp) quickSpecs.push(`TDP ${specs.tdp}W`);
            } else if (effectiveCode === 'psu') {
              if (specs.wattage) quickSpecs.push(`${specs.wattage}W`);
              if (specs.efficiency) quickSpecs.push(specs.efficiency);
            } else if (effectiveCode === 'case') {
              if (specs.supported_form_factors) {
                const ff = Array.isArray(specs.supported_form_factors) 
                  ? specs.supported_form_factors.join(', ') 
                  : specs.supported_form_factors;
                quickSpecs.push(ff);
              }
            } else if (effectiveCode === 'cooler') {
              if (specs.type) quickSpecs.push(specs.type);
              if (specs.tdp_rating) quickSpecs.push(`TDP ${specs.tdp_rating}W`);
            } else if (effectiveCode === 'ssd' || effectiveCode === 'hdd' || effectiveCode === 'storage') {
              if (specs.capacity_gb) quickSpecs.push(`${specs.capacity_gb}GB`);
              if (specs.interface) quickSpecs.push(specs.interface);
              if (specs.type && effectiveCode === 'storage') quickSpecs.push(specs.type);
            }

            return (
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
                          {ramType && ['DDR4','DDR5','DDR3'].some(t => String(ramType).toUpperCase().includes(t)) && (
                            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-500/30 uppercase tracking-wide">
                              {ramType}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">{item.brand}</p>
                        {quickSpecs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {quickSpecs.map((spec, idx) => (
                              <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ComponentSelectorModal;
