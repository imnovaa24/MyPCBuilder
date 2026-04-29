import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, inputStyle, btnPrimary, btnGhost, btnDanger } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

const brandOptions = {
  cpu: ['Intel', 'AMD'],
  mainboard: ['ASUS', 'GIGABYTE', 'MSI', 'ASRock', 'Biostar', 'EVGA', 'NZXT', 'Colorful'],
  ram: ['Corsair', 'Kingston', 'G.Skill', 'Crucial', 'ADATA', 'TeamGroup', 'Patriot', 'PNY', 'Lexar', 'GeIL'],
  vga: ['ASUS', 'GIGABYTE', 'MSI', 'Zotac', 'Galax', 'Palit', 'Inno3D', 'Sapphire', 'PowerColor', 'EVGA'],
  psu: ['Corsair', 'Seasonic', 'Cooler Master', 'Thermaltake', 'FSP', 'SilverStone', 'Be quiet!', 'EVGA', 'Antec', 'XPG'],
  'case': ['NZXT', 'Corsair', 'Cooler Master', 'Lian Li', 'Phanteks', 'Fractal Design', 'Deepcool', 'Thermaltake', 'Xigmatek', 'Montech'],
  storage: ['Samsung', 'Western Digital (WD)', 'Seagate', 'Kingston', 'Crucial', 'ADATA', 'Kioxia', 'Lexar', 'PNY', 'Transcend'],
  cooler: ['Noctua', 'Deepcool', 'Cooler Master', 'Thermalright', 'Corsair', 'NZXT', 'Be quiet!', 'Arctic', 'ID-Cooling', 'Scythe'],
};

const specsConfig = {
  1: [
    { key: 'socket', label: 'Socket (chuẩn cắm)', type: 'text', placeholder: 'VD: LGA1700, AM5' },
    { key: 'cores', label: 'Số nhân', type: 'number', placeholder: 'VD: 6' },
    { key: 'threads', label: 'Số luồng', type: 'number', placeholder: 'VD: 12' },
    { key: 'tdp', label: 'TDP (W)', type: 'number', placeholder: 'VD: 65' },
    { key: 'has_igpu', label: 'Có iGPU?', type: 'select', options: [{ value: 'true', label: 'Có' }, { value: 'false', label: 'Không' }] },
  ],
  2: [
    { key: 'socket', label: 'Socket CPU', type: 'text', placeholder: 'VD: LGA1700, AM5' },
    { key: 'form_factor', label: 'Form Factor', type: 'select', options: [{ value: 'ATX', label: 'ATX' }, { value: 'Micro-ATX', label: 'Micro-ATX' }, { value: 'Mini-ITX', label: 'Mini-ITX' }] },
    { key: 'ram_type', label: 'Chuẩn RAM', type: 'select', options: [{ value: 'DDR4', label: 'DDR4' }, { value: 'DDR5', label: 'DDR5' }] },
    { key: 'ram_slots', label: 'Số khe RAM', type: 'number', placeholder: 'VD: 2, 4' },
  ],
  3: [
    { key: 'type', label: 'Chuẩn RAM', type: 'select', options: [{ value: 'DDR4', label: 'DDR4' }, { value: 'DDR5', label: 'DDR5' }] },
    { key: 'capacity', label: 'Dung lượng (GB)', type: 'number', placeholder: 'VD: 8, 16, 32' },
    { key: 'bus_speed', label: 'Bus (MHz)', type: 'number', placeholder: 'VD: 3200, 5600' },
    { key: 'kit', label: 'Số thanh (kit)', type: 'number', placeholder: 'VD: 1, 2' },
  ],
  4: [
    { key: 'vram', label: 'VRAM', type: 'text', placeholder: 'VD: 8GB, 12GB' },
    { key: 'length_mm', label: 'Chiều dài (mm)', type: 'number', placeholder: 'VD: 282' },
    { key: 'tdp', label: 'TDP (W)', type: 'number', placeholder: 'VD: 200' },
    { key: 'recommended_psu', label: 'PSU đề xuất (W)', type: 'number', placeholder: 'VD: 600' },
  ],
  5: [
    { key: 'wattage', label: 'Công suất (W)', type: 'number', placeholder: 'VD: 650, 750' },
    { key: 'efficiency', label: 'Hiệu suất', type: 'select', options: [
      { value: '80 Plus', label: '80 Plus' }, { value: '80 Plus Bronze', label: '80 Plus Bronze' },
      { value: '80 Plus Silver', label: '80 Plus Silver' }, { value: '80 Plus Gold', label: '80 Plus Gold' },
      { value: '80 Plus Platinum', label: '80 Plus Platinum' }, { value: '80 Plus Titanium', label: '80 Plus Titanium' },
    ]},
    { key: 'form_factor', label: 'Form Factor', type: 'select', options: [{ value: 'ATX', label: 'ATX' }, { value: 'SFX', label: 'SFX' }] },
  ],
  6: [
    { key: 'supported_form_factors', label: 'Hỗ trợ Mainboard', type: 'multicheck', options: [
      { value: 'ATX', label: 'ATX' }, { value: 'Micro-ATX', label: 'Micro-ATX' }, { value: 'Mini-ITX', label: 'Mini-ITX' },
    ]},
    { key: 'max_vga_length_mm', label: 'VGA dài tối đa (mm)', type: 'number', placeholder: 'VD: 320' },
    { key: 'max_cooler_height_mm', label: 'Tản nhiệt cao tối đa (mm)', type: 'number', placeholder: 'VD: 160' },
  ],
  7: [
    { key: 'type', label: 'Loại tản nhiệt', type: 'select', options: [
      { value: 'Air Cooler', label: 'Air Cooler' }, { value: 'AIO Liquid', label: 'AIO Liquid' },
    ]},
    { key: 'supported_sockets', label: 'Socket hỗ trợ', type: 'multicheck', options: [
      { value: 'LGA1700', label: 'LGA1700' }, { value: 'LGA1200', label: 'LGA1200' },
      { value: 'AM4', label: 'AM4' }, { value: 'AM5', label: 'AM5' },
    ]},
    { key: 'height_mm', label: 'Chiều cao (mm)', type: 'number', placeholder: 'VD: 155' },
    { key: 'radiator_size_mm', label: 'Kích thước Radiator (mm)', type: 'number', placeholder: 'VD: 240, 360' },
    { key: 'tdp_rating', label: 'TDP giải nhiệt (W)', type: 'number', placeholder: 'VD: 150, 250' },
  ],
  8: [
    { key: 'type', label: 'Loại ổ', type: 'select', options: [
      { value: 'SSD', label: 'SSD' }, { value: 'HDD', label: 'HDD' },
    ]},
    { key: 'form_factor', label: 'Kích thước', type: 'select', hideWhen: { field: 'type', value: 'HDD' }, options: [
      { value: 'M.2', label: 'M.2' }, { value: '2.5 inch', label: '2.5 inch' }, { value: '3.5 inch', label: '3.5 inch' },
    ]},
    { key: 'interface', label: 'Giao tiếp', type: 'select', hideWhen: { field: 'type', value: 'HDD' }, options: [
      { value: 'PCIe 4.0 x4', label: 'PCIe 4.0 x4' }, { value: 'PCIe 3.0 x4', label: 'PCIe 3.0 x4' },
      { value: 'PCIe 5.0 x4', label: 'PCIe 5.0 x4' }, { value: 'SATA III', label: 'SATA III' },
    ]},
    { key: 'capacity_gb', label: 'Dung lượng (GB)', type: 'number', placeholder: 'VD: 500, 1000, 2000' },
    { key: 'read_speed', label: 'Tốc độ đọc (MB/s)', type: 'number', placeholder: 'VD: 3500, 7000' },
    { key: 'write_speed', label: 'Tốc độ ghi (MB/s)', type: 'number', placeholder: 'VD: 3000, 5000' },
  ],
};

function SpecFields({ config, specForm, setSpecForm }) {
  if (!config) return null;
  return (
    <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(19,164,236,0.06)', border: `1px solid ${theme.borderStrong}`, borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 18 }}>tune</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: theme.primary }}>Thông số kỹ thuật</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {config.filter(field => {
          if (field.hideWhen && specForm[field.hideWhen.field] === field.hideWhen.value) return false;
          return true;
        }).map(field => (
          <div key={field.key}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: theme.muted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {field.label}
            </label>
            {field.type === 'text' && (
              <input type="text" placeholder={field.placeholder} value={specForm[field.key] || ''}
                onChange={e => setSpecForm({ ...specForm, [field.key]: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            )}
            {field.type === 'number' && (
              <input type="number" placeholder={field.placeholder} value={specForm[field.key] || ''}
                onChange={e => setSpecForm({ ...specForm, [field.key]: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            )}
            {field.type === 'select' && (
              <select value={specForm[field.key] || (field.options[0]?.value || '')}
                onChange={e => setSpecForm({ ...specForm, [field.key]: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}>
                {field.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            )}
            {field.type === 'multicheck' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {field.options.map(opt => {
                  const checked = (specForm[field.key] || []).includes(opt.value);
                  return (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 10, cursor: 'pointer',
                      background: checked ? 'rgba(19,164,236,0.18)' : theme.inputBg,
                      border: `1px solid ${checked ? theme.primary : theme.border}`,
                      color: checked ? theme.primary : theme.muted,
                      fontSize: '0.85rem', fontWeight: 600, transition: '0.15s',
                    }}>
                      <input type="checkbox" checked={checked}
                        onChange={() => {
                          const arr = specForm[field.key] || [];
                          setSpecForm({
                            ...specForm,
                            [field.key]: checked ? arr.filter(v => v !== opt.value) : [...arr, opt.value],
                          });
                        }}
                        style={{ display: 'none' }} />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUpload({ image, imagePreview, onSelect, onClear, label }) {
  return (
    <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(19,164,236,0.06)', border: `1px solid ${theme.borderStrong}`, borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 18 }}>image</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: theme.primary }}>Ảnh sản phẩm</span>
        <span style={{ fontSize: '0.75rem', color: theme.muted }}>(PNG/JPEG, tối đa 2000x2000)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {imagePreview && (
          <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: `1px solid ${theme.border}`, flexShrink: 0 }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          borderRadius: 12, cursor: 'pointer', background: theme.inputBg,
          border: `1px solid ${theme.border}`, color: theme.muted,
          fontSize: '0.85rem', fontWeight: 600, transition: '0.15s',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: theme.primary }}>upload</span>
          {image ? 'Đổi ảnh' : (label || 'Chọn ảnh')}
          <input type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            if (!['image/png', 'image/jpeg'].includes(file.type)) { alert('Chỉ chấp nhận PNG hoặc JPEG!'); return; }
            const img = new Image();
            img.onload = () => {
              if (img.width > 2000 || img.height > 2000) { alert('Ảnh tối đa 2000x2000 pixel!'); return; }
              onSelect(file, URL.createObjectURL(file));
            };
            img.src = URL.createObjectURL(file);
          }} />
        </label>
        {image && (
          <button type="button" onClick={onClear} style={{ background: 'none', border: 'none', color: theme.danger, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>close</span> Xóa
          </button>
        )}
      </div>
    </div>
  );
}

function AdminComponentsTab({ setActiveTab }) {
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ category_id: '', brand: '', name: '', min_price: '', max_price: '' });
  const [specForm, setSpecForm] = useState({});
  const [componentImage, setComponentImage] = useState(null);
  const [componentImagePreview, setComponentImagePreview] = useState('');

  const [editingComponent, setEditingComponent] = useState(null);
  const [editFormData, setEditFormData] = useState({ category_id: '', brand: '', name: '', min_price: '', max_price: '' });
  const [editSpecForm, setEditSpecForm] = useState({});
  const [editComponentImage, setEditComponentImage] = useState(null);
  const [editComponentImagePreview, setEditComponentImagePreview] = useState('');
  const [savingComponent, setSavingComponent] = useState(false);

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
  });

  const fetchComponents = () => {
    axios.get(`${API_BASE}/components`)
      .then(response => setComponents(response.data.data))
      .catch(error => console.error("Lỗi tải linh kiện:", error));
  };

  const fetchCategories = () => {
    axios.get(`${API_BASE}/categories`)
      .then(response => {
        setCategories(response.data.data);
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: response.data.data[0].id }));
        }
      })
      .catch(error => console.error("Lỗi tải danh mục:", error));
  };

  useEffect(() => {
    fetchComponents();
    fetchCategories();
  }, []);

  const buildSpecifications = (catId, form) => {
    const fields = specsConfig[catId] || [];
    const specifications = {};
    fields.forEach(f => {
      if (f.hideWhen && form[f.hideWhen.field] === f.hideWhen.value) return;
      const val = form[f.key];
      if (f.type === 'number' && val !== undefined && val !== '') {
        specifications[f.key] = Number(val);
      } else if (f.type === 'select' && f.key === 'has_igpu') {
        specifications[f.key] = val === 'true';
      } else if (f.type === 'multicheck') {
        specifications[f.key] = val || [];
      } else {
        specifications[f.key] = val || '';
      }
    });
    return specifications;
  };

  const buildFormData = (catId, data, specifications, imageFile) => {
    const fd = new FormData();
    fd.append('category_id', catId);
    fd.append('brand', data.brand);
    fd.append('name', data.name);
    fd.append('min_price', parseInt(data.min_price));
    fd.append('max_price', parseInt(data.max_price));
    Object.entries(specifications).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((item, i) => fd.append(`specifications[${k}][${i}]`, item));
      } else {
        fd.append(`specifications[${k}]`, v);
      }
    });
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const catId = parseInt(formData.category_id);
    const specifications = buildSpecifications(catId, specForm);
    const fd = buildFormData(catId, formData, specifications, componentImage);

    axiosPrivate.post('/components', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert("Thêm linh kiện thành công!");
        fetchComponents();
        setFormData({ ...formData, brand: '', name: '', min_price: '', max_price: '' });
        setSpecForm({});
        setComponentImage(null);
        setComponentImagePreview('');
      })
      .catch(error => {
        console.error("Chi tiết lỗi:", error.response);
        alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm!");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa linh kiện này không?")) {
      axiosPrivate.delete(`/components/${id}`)
        .then(() => {
          setComponents(components.filter(item => item.id !== id));
          alert("Đã đưa vào thùng rác!");
        })
        .catch(() => alert("Lỗi khi xóa!"));
    }
  };

  const handleEditComponent = (item) => {
    setEditingComponent(item);
    setEditFormData({ category_id: item.category_id, brand: item.brand, name: item.name, min_price: item.min_price, max_price: item.max_price });
    const specs = typeof item.specifications === 'string' ? JSON.parse(item.specifications) : (item.specifications || {});
    setEditSpecForm(specs);
    setEditComponentImage(null);
    setEditComponentImagePreview(item.image_url ? `http://127.0.0.1:8000${item.image_url}` : '');
  };

  const handleUpdateComponent = (e) => {
    e.preventDefault();
    if (!editingComponent) return;
    setSavingComponent(true);
    const catId = parseInt(editFormData.category_id);
    const specifications = buildSpecifications(catId, editSpecForm);
    const fd = buildFormData(catId, editFormData, specifications, editComponentImage);
    fd.append('_method', 'PUT');

    axiosPrivate.post(`/components/${editingComponent.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert('Cập nhật linh kiện thành công!');
        fetchComponents();
        setEditingComponent(null);
        setEditComponentImage(null);
        setEditComponentImagePreview('');
      })
      .catch(error => {
        console.error('Chi tiết lỗi:', error.response);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
      })
      .finally(() => setSavingComponent(false));
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : `ID: ${id}`;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontFamily: theme.font, fontSize: '0.88rem', padding: 0 }}>Tổng quan</button>
        <span style={{ color: theme.muted }}>/</span>
        <span style={{ color: theme.text, fontWeight: 600, fontSize: '0.88rem' }}>Linh Kiện</span>
      </div>

      {/* Form thêm mới */}
      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 22 }}>add_circle</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Thêm Linh Kiện Mới</h2>
        </div>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={formData.category_id} onChange={e => { setFormData({ ...formData, category_id: e.target.value }); setSpecForm({}); }} style={{ ...inputStyle, width: 160 }}>
              {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
            {(() => {
              const catCode = categories.find(c => c.id === parseInt(formData.category_id))?.code;
              const brands = brandOptions[catCode];
              return brands ? (
                <select value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 140 }}>
                  <option value="">-- Chọn hãng --</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Thương hiệu" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
              );
            })()}
            <input type="text" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
            <input type="number" placeholder="Giá thấp" value={formData.min_price} onChange={e => setFormData({ ...formData, min_price: e.target.value })} required style={{ ...inputStyle, width: 130 }} />
            <input type="number" placeholder="Giá cao" value={formData.max_price} onChange={e => setFormData({ ...formData, max_price: e.target.value })} required style={{ ...inputStyle, width: 130 }} />
          </div>

          <SpecFields config={specsConfig[parseInt(formData.category_id)]} specForm={specForm} setSpecForm={setSpecForm} />

          <ImageUpload
            image={componentImage} imagePreview={componentImagePreview}
            onSelect={(file, preview) => { setComponentImage(file); setComponentImagePreview(preview); }}
            onClear={() => { setComponentImage(null); setComponentImagePreview(''); }}
          />

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
              Lưu Linh Kiện
            </button>
          </div>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 22 }}>inventory_2</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Danh Sách Linh Kiện</h2>
          <span style={{ marginLeft: 'auto', color: theme.muted, fontSize: '0.85rem' }}>{components.length} sản phẩm</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['Loại', 'Hãng', 'Tên Sản Phẩm', 'Mức Giá'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
                <th style={{ padding: '12px 14px', textAlign: 'center', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {components.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '14px' }}>
                    <span style={{ background: 'rgba(19,164,236,0.12)', color: theme.primary, padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {getCategoryName(item.category_id)}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{item.brand}</td>
                  <td style={{ padding: '14px', color: theme.muted }}>{item.name}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ color: theme.ok }}>{Number(item.min_price).toLocaleString()}đ</span>
                    <span style={{ color: theme.muted, margin: '0 4px' }}>–</span>
                    <span style={{ color: theme.warn }}>{Number(item.max_price).toLocaleString()}đ</span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => handleEditComponent(item)} style={{ ...btnPrimary, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ ...btnDanger, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal sửa linh kiện */}
      {editingComponent && (
        <div onClick={() => setEditingComponent(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: theme.panelSolid, borderRadius: 24,
            border: `1px solid ${theme.borderStrong}`, boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', padding: 28,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 22 }}>edit_note</span>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Sửa Linh Kiện: <span style={{ color: theme.primary }}>{editingComponent.name}</span></h2>
              </div>
              <button onClick={() => setEditingComponent(null)} style={{
                background: 'none', border: 'none', color: theme.muted, cursor: 'pointer',
                width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateComponent}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={editFormData.category_id} onChange={e => { setEditFormData({ ...editFormData, category_id: e.target.value }); setEditSpecForm({}); }} style={{ ...inputStyle, width: '100%' }}>
                  {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
                {(() => {
                  const catCode = categories.find(c => c.id === parseInt(editFormData.category_id))?.code;
                  const brands = brandOptions[catCode];
                  return brands ? (
                    <select value={editFormData.brand} onChange={e => setEditFormData({ ...editFormData, brand: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 140 }}>
                      <option value="">-- Chọn hãng --</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  ) : (
                    <input type="text" placeholder="Thương hiệu" value={editFormData.brand} onChange={e => setEditFormData({ ...editFormData, brand: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
                  );
                })()}
                <input type="text" placeholder="Tên sản phẩm" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} required style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
                <input type="number" placeholder="Giá thấp" value={editFormData.min_price} onChange={e => setEditFormData({ ...editFormData, min_price: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 120 }} />
                <input type="number" placeholder="Giá cao" value={editFormData.max_price} onChange={e => setEditFormData({ ...editFormData, max_price: e.target.value })} required style={{ ...inputStyle, flex: 1, minWidth: 120 }} />
              </div>

              <SpecFields config={specsConfig[parseInt(editFormData.category_id)]} specForm={editSpecForm} setSpecForm={setEditSpecForm} />

              <ImageUpload
                image={editComponentImage} imagePreview={editComponentImagePreview}
                onSelect={(file, preview) => { setEditComponentImage(file); setEditComponentImagePreview(preview); }}
                onClear={() => { setEditComponentImage(null); setEditComponentImagePreview(editingComponent.image_url ? `http://127.0.0.1:8000${editingComponent.image_url}` : ''); }}
                label="Chọn ảnh mới"
              />

              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingComponent(null)} style={{ ...btnGhost, padding: '10px 24px' }}>Hủy</button>
                <button type="submit" disabled={savingComponent} style={{ ...btnPrimary, padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                  {savingComponent ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminComponentsTab;
