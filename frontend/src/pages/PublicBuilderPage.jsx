import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ComponentSelectorModal from '../components/ComponentSelectorModal';

const API_BASE = 'http://127.0.0.1:8000/api';

const CATEGORY_ICONS = {
  'CPU': 'memory',
  'GPU': 'videogame_asset',
  'Motherboard': 'developer_board',
  'RAM': 'memory',
  'SSD': 'speed',
  'HDD': 'hard_drive',
  'PSU': 'bolt',
  'Case': 'computer',
  'Cooler': 'ac_unit',
};

function getIconForCategory(name) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'settings';
}

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

function PublicBuilderPage() {
  const [categories, setCategories] = useState([]);
  const [allComponents, setAllComponents] = useState([]);
  const [build, setBuild] = useState({}); // { categoryId: componentItem }
  const [quantities, setQuantities] = useState({}); // { categoryId: number }
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Spec detail popup state
  const [specDetailId, setSpecDetailId] = useState(null);

  // Save build state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Compatibility health check state
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Tách Storage thành 2 dòng: SSD và HDD
  const displayCategories = useMemo(() => {
    const result = [];
    for (const cat of categories) {
      if (cat.code === 'storage') {
        result.push({
          ...cat,
          id: `${cat.id}_ssd`,
          _realCategoryId: cat.id,
          _storageType: 'SSD',
          name: 'SSD',
        });
        result.push({
          ...cat,
          id: `${cat.id}_hdd`,
          _realCategoryId: cat.id,
          _storageType: 'HDD',
          name: 'HDD',
        });
      } else {
        result.push(cat);
      }
    }
    return result;
  }, [categories]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/categories`),
      axios.get(`${API_BASE}/components`),
    ]).then(([catRes, compRes]) => {
      const cats = catRes.data.data || [];
      const comps = compRes.data.data || [];
      setCategories(cats);
      setAllComponents(comps);

      // Nếu có preset build từ trang chủ, tự động thêm vào
      const preset = location.state?.presetBuild;
      if (preset && preset.components) {
        const presetBuild = {};
        preset.components.forEach(item => {
          const comp = comps.find(c => c.id === item.component.id);
          if (comp) {
            const cat = cats.find(c => c.id === item.category_id);
            if (cat?.code === 'storage') {
              const specs = typeof comp.specifications === 'string' ? JSON.parse(comp.specifications) : comp.specifications;
              const storageType = specs?.type?.toUpperCase() === 'HDD' ? 'hdd' : 'ssd';
              presetBuild[`${item.category_id}_${storageType}`] = comp;
            } else {
              presetBuild[item.category_id] = comp;
            }
          }
        });
        setBuild(presetBuild);
        // Clear navigation state để không load lại khi refresh
        window.history.replaceState({}, document.title);
      }
    }).catch(err => {
      console.error('Lỗi tải dữ liệu:', err);
    }).finally(() => setLoading(false));
  }, [location.state]);

  // Gọi API kiểm tra tương thích mỗi khi build thay đổi
  useEffect(() => {
    const selectedCount = Object.keys(build).length;
    if (selectedCount < 2) {
      setHealthAlerts([]);
      return;
    }

    // Map categoryId -> category code để gửi lên API
    const componentsPayload = {};
    for (const [catId, item] of Object.entries(build)) {
      const virtualCat = displayCategories.find(c => String(c.id) === String(catId));
      const realCatId = virtualCat?._realCategoryId || catId;
      const cat = categories.find(c => c.id === Number(realCatId));
      if (cat && item) {
        if (virtualCat?._storageType) {
          componentsPayload[virtualCat._storageType.toLowerCase()] = item.id;
        } else {
          componentsPayload[cat.code] = item.id;
        }
      }
    }

    setCheckingHealth(true);
    axios.post(`${API_BASE}/compatibility/check`, { components: componentsPayload })
      .then(res => {
        setHealthAlerts(res.data.alerts || []);
      })
      .catch(err => {
        console.error('Lỗi kiểm tra tương thích:', err);
        setHealthAlerts([]);
      })
      .finally(() => setCheckingHealth(false));
  }, [build, categories, displayCategories]);

  const openModal = (category) => {
    setActiveCategory(category);
    setModalOpen(true);
  };

  const handleSelect = (item) => {
    setBuild(prev => ({ ...prev, [activeCategory.id]: item }));
    setModalOpen(false);
  };

  const removeFromBuild = (categoryId) => {
    setBuild(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
    setQuantities(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  // Max quantities: RAM=4, SSD/HDD=2
  const getMaxQuantity = (cat) => {
    if (cat.code === 'ram') return 4;
    if (cat._storageType) return 2;
    return 0;
  };

  const getQuantity = (catId) => quantities[catId] || 1;

  const handleSaveBuild = () => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/register');
      return;
    }

    const buildName = prompt('Đặt tên cho cấu hình này:', `Build ngày ${new Date().toLocaleDateString('vi-VN')}`);
    if (!buildName) return;

    setSaving(true);
    setSaveSuccess('');

    const componentsToSave = Object.entries(build).map(([catId, item]) => {
      const virtualCat = displayCategories.find(c => String(c.id) === String(catId));
      const qty = getQuantity(catId);
      return {
        category_id: item.category_id,
        category_name: virtualCat?.name || '',
        component_id: item.id,
        brand: item.brand,
        name: item.name,
        min_price: item.min_price,
        max_price: item.max_price,
        quantity: qty,
      };
    });

    axios.post(`${API_BASE}/saved-builds`, {
      name: buildName,
      components: componentsToSave,
      total_min_price: totalMin,
      total_max_price: totalMax,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    })
    .then(() => {
      setSaveSuccess('Đã lưu cấu hình thành công!');
      setTimeout(() => setSaveSuccess(''), 4000);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        navigate('/customer-login');
      } else {
        alert('Lỗi khi lưu cấu hình!');
      }
    })
    .finally(() => setSaving(false));
  };

  const componentsForCategory = activeCategory
    ? allComponents.filter(c => {
        const realCatId = activeCategory._realCategoryId || activeCategory.id;
        if (c.category_id !== Number(realCatId)) return false;
        if (activeCategory._storageType) {
          const specs = typeof c.specifications === 'string' ? JSON.parse(c.specifications) : c.specifications;
          return specs?.type === activeCategory._storageType;
        }
        return true;
      })
    : [];

  // Kiểm tra category nào đang có lỗi tương thích
  const getCategoryAlerts = (catCode) => {
    return healthAlerts.filter(a => {
      const detail = (a.detail || '').toLowerCase();
      const code = (a.rule_code || '').toLowerCase();
      return detail.includes(catCode) || code.includes(catCode);
    });
  };

  const totalMin = Object.entries(build).reduce((s, [catId, item]) => s + Number(item.min_price) * getQuantity(catId), 0);
  const totalMax = Object.entries(build).reduce((s, [catId, item]) => s + Number(item.max_price) * getQuantity(catId), 0);
  const selectedCount = Object.keys(build).length;

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="text-center text-slate-400">
          <span className="material-symbols-outlined text-5xl animate-spin block mb-4">progress_activity</span>
          <p className="text-lg">Đang tải dữ liệu linh kiện...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-white mb-2">Xây Dựng Cấu Hình PC</h1>
        <p className="text-[#92b7c9] text-base md:text-lg">Chọn từng linh kiện để tạo bộ máy tính hoàn chỉnh của bạn.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Column: Component Slots */}
        <div className="w-full xl:flex-1 flex flex-col gap-4">
          {displayCategories.map(cat => {
            const selected = build[cat.id];
            const icon = getIconForCategory(cat.name);
            const catAlerts = getCategoryAlerts(cat.code);
            const hasError = catAlerts.some(a => a.type === 'error');
            const hasWarning = !hasError && catAlerts.some(a => a.type === 'warning');

            if (selected) {
              const specs = typeof selected.specifications === 'string' ? JSON.parse(selected.specifications) : (selected.specifications || {});
              const isSpecOpen = specDetailId === cat.id;
              return (
                <div key={cat.id} className="flex flex-col">
                  <div className={`group flex flex-col sm:flex-row items-center gap-4 bg-surface-dark p-4 rounded-xl border transition-all shadow-sm relative overflow-hidden ${
                    hasError ? 'border-red-500/50 hover:border-red-500' :
                    hasWarning ? 'border-yellow-500/50 hover:border-yellow-500' :
                    'border-border-dark hover:border-primary/50'
                  }`}>
                  {hasError && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                  {hasWarning && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}
                  <div
                    className="flex items-center gap-4 w-full sm:w-auto cursor-pointer"
                    onClick={() => setSpecDetailId(isSpecOpen ? null : cat.id)}
                  >
                    <div className="bg-[#233c48] flex items-center justify-center rounded-lg size-16 shrink-0">
                      <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{cat.name}</span>
                        {hasError && (
                          <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-wide border border-red-500/20">Lỗi</span>
                        )}
                        {hasWarning && (
                          <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wide border border-yellow-500/20">Cảnh báo</span>
                        )}
                        <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${isSpecOpen ? 'rotate-180' : ''}`}>expand_more</span>
                      </div>
                      <p className="text-white text-lg font-bold leading-tight line-clamp-1">{selected.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-400 text-sm">{selected.brand}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <p className="text-[#92b7c9] text-sm font-medium">
                          {Number(selected.min_price).toLocaleString('vi-VN')}đ - {Number(selected.max_price).toLocaleString('vi-VN')}đ
                          {getQuantity(cat.id) > 1 && (
                            <span className="text-primary ml-1">×{getQuantity(cat.id)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    {getMaxQuantity(cat) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-xs font-semibold">SL:</span>
                        <select
                          value={getQuantity(cat.id)}
                          onChange={e => setQuantities(prev => ({ ...prev, [cat.id]: parseInt(e.target.value) }))}
                          onClick={e => e.stopPropagation()}
                          className="h-9 w-20 pl-3 pr-1 rounded-lg border border-border-dark bg-[#111c22] text-white text-sm font-semibold cursor-pointer focus:border-primary outline-none"
                        >
                          {Array.from({ length: getMaxQuantity(cat) }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      onClick={() => openModal(cat)}
                      className="flex-1 sm:flex-none h-9 px-4 rounded-lg border border-border-dark text-slate-200 text-sm font-semibold hover:border-primary hover:text-primary transition-colors bg-transparent cursor-pointer"
                    >Đổi</button>
                    <button
                      onClick={() => removeFromBuild(cat.id)}
                      className="flex-1 sm:flex-none h-9 px-4 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors bg-transparent cursor-pointer"
                    >Xóa</button>
                  </div>
                  </div>
                  {isSpecOpen && Object.keys(specs).length > 0 && (
                    <div className="bg-[#111c22] border border-t-0 border-border-dark rounded-b-xl px-5 py-4 -mt-1 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-base">info</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Thông số kỹ thuật</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                        {Object.entries(specs).map(([key, value]) => {
                          if (value === '' || value === null || value === undefined) return null;
                          const label = SPEC_LABELS[key] || key;
                          let displayValue = value;
                          if (typeof value === 'boolean') displayValue = value ? 'Có' : 'Không';
                          if (key === 'has_igpu') displayValue = (value === true || value === 'true') ? 'Có' : 'Không';
                          if (Array.isArray(value)) displayValue = value.join(', ');
                          return (
                            <div key={key} className="flex flex-col py-1">
                              <span className="text-slate-500 text-xs">{label}</span>
                              <span className="text-white text-sm font-medium">{String(displayValue)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Empty slot
            return (
              <div
                key={cat.id}
                onClick={() => openModal(cat)}
                className="group flex flex-col sm:flex-row items-center gap-4 bg-[#111c22] p-4 rounded-xl border-2 border-dashed border-border-dark hover:border-primary/50 hover:bg-surface-dark transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-[#1c2e36] flex items-center justify-center rounded-lg size-16 shrink-0 text-slate-500">
                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{cat.name}</span>
                    <p className="text-slate-400 text-lg font-medium">Chọn {cat.name}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="h-9 px-4 rounded-lg bg-primary/10 text-primary text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-colors inline-flex items-center">Thêm</span>
                  </div>
                </div>
              </div>
            );
          })}

          {displayCategories.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              <span className="material-symbols-outlined text-5xl mb-4 block">category</span>
              <p>Chưa có danh mục linh kiện nào. Vui lòng thêm danh mục trong trang quản trị.</p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="w-full xl:w-[400px] shrink-0 xl:sticky xl:top-24 flex flex-col gap-6">
          {/* Build Summary */}
          <div className="bg-surface-dark rounded-xl border border-border-dark shadow-lg overflow-hidden">
            <div className="p-5 border-b border-border-dark flex justify-between items-center bg-gradient-to-r from-surface-dark to-[#131f25]">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">health_metrics</span>
                Tổng Quan Build
              </h3>
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                {selectedCount}/{displayCategories.length}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {displayCategories.map(cat => {
                const item = build[cat.id];
                return (
                  <div key={cat.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{cat.name}</span>
                    {item ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {item.brand}{getQuantity(cat.id) > 1 ? ` ×${getQuantity(cat.id)}` : ''}
                      </span>
                    ) : (
                      <span className="text-slate-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
                        Chưa chọn
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Build Health Check */}
          <div className="bg-surface-dark rounded-xl border border-border-dark shadow-lg overflow-hidden">
            <div className="p-5 border-b border-border-dark flex justify-between items-center bg-gradient-to-r from-surface-dark to-[#131f25]">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">health_metrics</span>
                Kiểm Tra Tương Thích
              </h3>
              {checkingHealth ? (
                <span className="material-symbols-outlined text-primary text-sm animate-spin">progress_activity</span>
              ) : healthAlerts.length > 0 ? (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {healthAlerts.length} VẤN ĐỀ
                </span>
              ) : selectedCount >= 2 ? (
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                  ỔN ĐỊNH
                </span>
              ) : null}
            </div>
            <div className="p-5 flex flex-col gap-3">
              {selectedCount < 2 ? (
                <div className="flex items-center gap-3 p-3 text-slate-500">
                  <span className="material-symbols-outlined">info</span>
                  <span className="text-sm">Chọn ít nhất 2 linh kiện để kiểm tra tương thích.</span>
                </div>
              ) : healthAlerts.length === 0 && !checkingHealth ? (
                <div className="flex items-center gap-3 p-3 text-emerald-400">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span className="text-sm font-medium">Tất cả linh kiện đều tương thích với nhau!</span>
                </div>
              ) : (
                healthAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 p-3 rounded-r-lg ${
                      alert.type === 'error'
                        ? 'bg-red-900/10 border-red-500'
                        : 'bg-yellow-900/10 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`material-symbols-outlined mt-0.5 ${
                        alert.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {alert.type === 'error' ? 'error' : 'warning'}
                      </span>
                      <div>
                        <h4 className={`text-sm font-bold ${
                          alert.type === 'error' ? 'text-red-400' : 'text-yellow-500'
                        }`}>
                          {alert.rule_code?.replace('RULE_', '').replace(/_/g, ' ')}
                        </h4>
                        <p className={`text-sm mt-1 leading-relaxed ${
                          alert.type === 'error' ? 'text-red-300' : 'text-yellow-400/90'
                        }`}>
                          {alert.message}
                        </p>
                        {alert.detail && (
                          <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Budget Estimation */}
          <div className="bg-surface-dark rounded-xl border border-border-dark shadow-lg overflow-hidden">
            <div className="p-5 border-b border-border-dark">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Ước Tính Chi Phí
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-[#92b7c9] text-sm font-medium">Tổng ước tính</span>
                {selectedCount > 0 ? (
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-3xl font-black text-white tracking-tight">{totalMin.toLocaleString('vi-VN')}đ</span>
                    <span className="text-xl font-bold text-white">-</span>
                    <span className="text-3xl font-black text-white tracking-tight">{totalMax.toLocaleString('vi-VN')}đ</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-slate-500">Chưa có linh kiện</span>
                )}
                <span className="text-xs text-slate-500 mt-1">*Giá ước tính từ nhiều nguồn bán lẻ</span>
              </div>
              <div className="space-y-3">
                {saveSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    {saveSuccess}
                  </div>
                )}
                <button
                  onClick={handleSaveBuild}
                  disabled={selectedCount === 0 || saving}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold h-12 rounded-lg transition-all shadow-lg shadow-primary/20 border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined">{saving ? 'progress_activity' : 'save'}</span>
                  {saving ? 'Đang lưu...' : (localStorage.getItem('customerToken') ? 'Lưu Cấu Hình' : 'Đăng ký để Lưu')}
                </button>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-5 border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-white font-bold text-lg mb-2">Cần Hỗ Trợ?</h4>
              <p className="text-slate-300 text-sm mb-4">Đội ngũ chuyên gia có thể giúp bạn tối ưu cấu hình.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selector Modal */}
      <ComponentSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categoryName={activeCategory?.name || ''}
        components={componentsForCategory}
        onSelect={handleSelect}
      />
    </main>
  );
}

export default PublicBuilderPage;
