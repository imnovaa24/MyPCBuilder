import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, inputStyle, btnPrimary, btnGhost, btnDanger } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

const TAG_OPTIONS = [
  { value: 'Gaming', color: 'bg-red-500' },
  { value: 'Performance', color: 'bg-blue-500' },
  { value: 'Workstation', color: 'bg-purple-500' },
  { value: 'Budget', color: 'bg-green-500' },
  { value: 'Streaming', color: 'bg-orange-500' },
  { value: 'Office', color: 'bg-cyan-500' },
];

function AdminFeaturedTab({ setActiveTab }) {
  const [featuredBuilds, setFeaturedBuilds] = useState([]);
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);

  // Create state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createTag, setCreateTag] = useState('Gaming');
  const [createTagColor, setCreateTagColor] = useState('bg-red-500');
  const [createSubtitle, setCreateSubtitle] = useState('');
  const [createRating, setCreateRating] = useState('4.5');
  const [createImage, setCreateImage] = useState(null);
  const [createImagePreview, setCreateImagePreview] = useState('');
  const [createComponentIds, setCreateComponentIds] = useState({});
  const [createQuantities, setCreateQuantities] = useState({});
  const [savingCreate, setSavingCreate] = useState(false);

  // Edit state
  const [editingBuild, setEditingBuild] = useState(null);
  const [editComponentIds, setEditComponentIds] = useState({});
  const [editName, setEditName] = useState('');
  const [savingBuild, setSavingBuild] = useState(false);
  const [editBuildQuantities, setEditBuildQuantities] = useState({});
  const [editBuildImage, setEditBuildImage] = useState(null);
  const [editBuildImagePreview, setEditBuildImagePreview] = useState('');

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
  });

  const fetchFeaturedBuilds = () => {
    axios.get(`${API_BASE}/featured-builds`)
      .then(response => setFeaturedBuilds(response.data.data))
      .catch(error => console.error("Lỗi tải cấu hình phổ biến:", error));
  };

  useEffect(() => {
    fetchFeaturedBuilds();
    axios.get(`${API_BASE}/components`).then(res => setComponents(res.data.data || []));
    axios.get(`${API_BASE}/categories`).then(res => setCategories(res.data.data || []));
  }, []);

  const handleEditBuild = (buildId) => {
    axios.get(`${API_BASE}/featured-builds/${buildId}`)
      .then(response => {
        const build = response.data.data;
        setEditingBuild(build);
        setEditName(build.name);
        const map = {};
        build.components.forEach(c => {
          const cat = categories.find(ct => ct.id === c.category_id);
          if (cat?.code === 'storage' && c.component) {
            const specs = typeof c.component.specifications === 'string' ? JSON.parse(c.component.specifications) : c.component.specifications;
            const storageType = specs?.type?.toUpperCase() === 'HDD' ? 'hdd' : 'ssd';
            map[`${c.category_id}_${storageType}`] = c.component.id;
          } else {
            map[c.category_id] = c.component.id;
          }
        });
        setEditComponentIds(map);
        const qtyMap = {};
        if (build.component_quantities) {
          Object.entries(build.component_quantities).forEach(([key, qty]) => { qtyMap[key] = qty; });
        }
        setEditBuildQuantities(qtyMap);
        setEditBuildImage(null);
        const img = build.image || '';
        setEditBuildImagePreview(img.startsWith('/storage/') ? `http://127.0.0.1:8000${img}` : img);
      })
      .catch(error => console.error("Lỗi tải chi tiết:", error));
  };

  const handleSaveBuild = () => {
    if (!editingBuild) return;
    setSavingBuild(true);
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('name', editName);
    fd.append('component_ids', JSON.stringify(editComponentIds));
    fd.append('component_quantities', JSON.stringify(editBuildQuantities));
    if (editBuildImage) fd.append('image', editBuildImage);

    axiosPrivate.post(`/featured-builds/${editingBuild.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert('Cập nhật cấu hình thành công!');
        setEditingBuild(null);
        fetchFeaturedBuilds();
      })
      .catch(error => {
        console.error("Lỗi cập nhật:", error.response);
        alert('Lỗi khi cập nhật! Xem Console (F12).');
      })
      .finally(() => setSavingBuild(false));
  };

  const handleCreateBuild = () => {
    if (!createName.trim() || !createTag.trim()) {
      alert('Vui lòng nhập tên cấu hình và tag!');
      return;
    }
    setSavingCreate(true);
    const fd = new FormData();
    fd.append('name', createName);
    fd.append('tag', createTag);
    fd.append('tag_color', createTagColor);
    fd.append('subtitle', createSubtitle);
    fd.append('rating', createRating);
    fd.append('component_ids', JSON.stringify(createComponentIds));
    fd.append('component_quantities', JSON.stringify(createQuantities));
    if (createImage) fd.append('image', createImage);

    axiosPrivate.post('/featured-builds', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        alert('Tạo cấu hình thành công!');
        setShowCreateForm(false);
        setCreateName('');
        setCreateTag('Gaming');
        setCreateTagColor('bg-red-500');
        setCreateSubtitle('');
        setCreateRating('4.5');
        setCreateImage(null);
        setCreateImagePreview('');
        setCreateComponentIds({});
        setCreateQuantities({});
        fetchFeaturedBuilds();
      })
      .catch(error => {
        console.error("Lỗi tạo cấu hình:", error.response);
        alert(error.response?.data?.message || 'Lỗi khi tạo! Xem Console (F12).');
      })
      .finally(() => setSavingCreate(false));
  };

  const handleDeleteBuild = (id, name) => {
    if (window.confirm(`Xóa cấu hình "${name}"? Hành động này không thể hoàn tác.`)) {
      axiosPrivate.delete(`/featured-builds/${id}`)
        .then(() => {
          alert('Đã xóa cấu hình!');
          if (editingBuild?.id === id) setEditingBuild(null);
          fetchFeaturedBuilds();
        })
        .catch(() => alert('Lỗi khi xóa!'));
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontFamily: theme.font, fontSize: '0.88rem', padding: 0 }}>Tổng quan</button>
        <span style={{ color: theme.muted }}>/</span>
        <span style={{ color: theme.text, fontWeight: 600, fontSize: '0.88rem' }}>Cấu Hình Phổ Biến</span>
      </div>

      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ color: theme.warn, fontSize: 22 }}>star</span>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Quản Lý Cấu Hình Phổ Biến</h2>
          </div>
          <button onClick={() => { setShowCreateForm(!showCreateForm); setEditingBuild(null); }} style={{ ...btnPrimary, padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showCreateForm ? 'close' : 'add'}</span>
            {showCreateForm ? 'Đóng' : 'Thêm Mới'}
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: (editingBuild || showCreateForm) ? 20 : 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['ID', 'Tên Cấu Hình', 'Tag', 'Linh Kiện', 'Tổng Giá'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
                <th style={{ padding: '12px 14px', textAlign: 'center', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {featuredBuilds.map(fb => (
                <tr key={fb.id} style={{
                  borderBottom: `1px solid ${theme.border}`,
                  background: editingBuild?.id === fb.id ? 'rgba(19,164,236,0.08)' : 'transparent',
                }}>
                  <td style={{ padding: '14px', color: theme.muted }}>{fb.id}</td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{fb.name}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ backgroundColor: fb.tag_color || '#6c757d', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>{fb.tag}</span>
                  </td>
                  <td style={{ padding: '14px', color: theme.muted }}>{fb.component_count} linh kiện
                    {fb.mainboard_name && (
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: theme.text, background: 'rgba(19,164,236,0.1)', border: `1px solid rgba(19,164,236,0.25)`, borderRadius: 6, padding: '1px 7px', fontWeight: 600 }}>
                          {fb.mainboard_name}
                        </span>
                        {fb.ram_type && (
                          <span style={{ fontSize: '0.75rem', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 6, padding: '1px 7px', fontWeight: 700, textTransform: 'uppercase' }}>
                            {fb.ram_type}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ color: theme.ok }}>{Number(fb.total_min_price).toLocaleString()}đ</span>
                    <span style={{ color: theme.muted, margin: '0 4px' }}>–</span>
                    <span style={{ color: theme.warn }}>{Number(fb.total_max_price).toLocaleString()}đ</span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      <button onClick={() => { handleEditBuild(fb.id); setShowCreateForm(false); }} style={{ ...btnPrimary, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        Sửa
                      </button>
                      <button onClick={() => handleDeleteBuild(fb.id, fb.name)} style={{ ...btnDanger, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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

        {/* Form tạo mới */}
        {showCreateForm && (
          <div style={{
            border: `1px solid ${theme.borderStrong}`, borderRadius: 20, padding: 24, marginBottom: editingBuild ? 20 : 0,
            background: 'linear-gradient(180deg, rgba(27,47,57,0.9), rgba(14,24,30,0.9))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: theme.ok, fontSize: 22 }}>add_circle</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Thêm Cấu Hình Mới</h3>
              </div>
              <button onClick={() => setShowCreateForm(false)} style={{ ...btnGhost, padding: '6px 14px', fontSize: '0.82rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>close</span>
                Đóng
              </button>
            </div>

            {/* Tên + Tag + Subtitle + Rating */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tên cấu hình *</label>
                <input type="text" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="VD: Starter Gaming Build" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subtitle</label>
                <input type="text" value={createSubtitle} onChange={e => setCreateSubtitle(e.target.value)} placeholder="VD: Cấu hình gaming tầm trung" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tag *</label>
                <select value={createTag} onChange={e => { setCreateTag(e.target.value); const opt = TAG_OPTIONS.find(o => o.value === e.target.value); if (opt) setCreateTagColor(opt.color); }} style={{ ...inputStyle, width: '100%' }}>
                  {TAG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rating (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" value={createRating} onChange={e => setCreateRating(e.target.value)} style={{ ...inputStyle, width: 120 }} />
              </div>
            </div>

            {/* Ảnh */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ảnh cấu hình</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {createImagePreview && (
                  <img src={createImagePreview} alt="Preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 12, border: `1px solid ${theme.border}` }} />
                )}
                <div>
                  <input type="file" accept="image/png, image/jpeg, image/webp"
                    onChange={e => { const file = e.target.files[0]; if (file) { setCreateImage(file); setCreateImagePreview(URL.createObjectURL(file)); } }}
                    style={{ fontSize: '0.85rem', color: theme.text }} />
                  <p style={{ margin: '6px 0 0', color: theme.muted, fontSize: '0.78rem' }}>PNG, JPEG, WebP — tối đa 2000×2000px</p>
                </div>
              </div>
            </div>

            {/* Chọn linh kiện */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 10, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Chọn linh kiện</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categories.flatMap(cat => {
                  if (cat.code === 'storage') {
                    return [
                      { ...cat, _virtualId: `${cat.id}_ssd`, _storageType: 'SSD', _label: 'SSD' },
                      { ...cat, _virtualId: `${cat.id}_hdd`, _storageType: 'HDD', _label: 'HDD' },
                    ];
                  }
                  return [{ ...cat, _virtualId: String(cat.id), _label: cat.name }];
                }).map(cat => {
                  const currentCompId = createComponentIds[cat._virtualId];
                  const compsInCategory = components.filter(c => {
                    if (Number(c.category_id) !== Number(cat.id)) return false;
                    if (cat._storageType) {
                      const specs = typeof c.specifications === 'string' ? JSON.parse(c.specifications) : c.specifications;
                      return specs?.type === cat._storageType;
                    }
                    return true;
                  });
                  return (
                    <div key={cat._virtualId} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                      borderRadius: 16, background: 'rgba(146, 183, 201, 0.05)', border: `1px solid ${theme.border}`,
                    }}>
                      <span style={{
                        minWidth: 110, display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(19,164,236,0.12)', color: theme.primary,
                        padding: '5px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                      }}>{cat._label}</span>
                      <select
                        value={currentCompId || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setCreateComponentIds(prev => {
                            const next = { ...prev };
                            if (val) { next[cat._virtualId] = parseInt(val); } else { delete next[cat._virtualId]; }
                            return next;
                          });
                          if (!e.target.value) {
                            setCreateQuantities(prev => { const n = { ...prev }; delete n[cat._virtualId]; return n; });
                          }
                        }}
                        style={{ ...inputStyle, flex: 1, maxWidth: 600 }}
                      >
                        <option value="">-- Không chọn --</option>
                        {compsInCategory.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.brand} {comp.name} ({Number(comp.min_price).toLocaleString()}đ – {Number(comp.max_price).toLocaleString()}đ)
                          </option>
                        ))}
                      </select>
                      {(cat.code === 'ram' || cat._storageType) && currentCompId && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                          <span style={{ color: theme.muted, fontSize: '0.8rem', fontWeight: 600 }}>SL:</span>
                          <select
                            value={createQuantities[cat._virtualId] || 1}
                            onChange={e => setCreateQuantities(prev => ({ ...prev, [cat._virtualId]: parseInt(e.target.value) }))}
                            style={{ ...inputStyle, width: 60, textAlign: 'center' }}
                          >
                            {Array.from({ length: cat.code === 'ram' ? 4 : 2 }, (_, i) => i + 1).map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleCreateBuild} disabled={savingCreate} style={{ ...btnPrimary, padding: '12px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                {savingCreate ? 'Đang tạo...' : 'Tạo Cấu Hình'}
              </button>
              <button onClick={() => setShowCreateForm(false)} style={{ ...btnGhost, padding: '12px 28px' }}>Hủy</button>
            </div>
          </div>
        )}

        {/* Form chỉnh sửa */}
        {editingBuild && (
          <div style={{
            border: `1px solid ${theme.borderStrong}`, borderRadius: 20, padding: 24,
            background: 'linear-gradient(180deg, rgba(27,47,57,0.9), rgba(14,24,30,0.9))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 22 }}>edit_note</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Đang sửa: <span style={{ color: theme.primary }}>{editingBuild.name}</span></h3>
              </div>
              <button onClick={() => setEditingBuild(null)} style={{ ...btnGhost, padding: '6px 14px', fontSize: '0.82rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>close</span>
                Đóng
              </button>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tên cấu hình</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, width: '100%', maxWidth: 420 }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: theme.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ảnh cấu hình</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {editBuildImagePreview && (
                  <img src={editBuildImagePreview} alt="Preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 12, border: `1px solid ${theme.border}` }} />
                )}
                <div>
                  <input type="file" accept="image/png, image/jpeg, image/webp"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) { setEditBuildImage(file); setEditBuildImagePreview(URL.createObjectURL(file)); }
                    }}
                    style={{ fontSize: '0.85rem', color: theme.text }} />
                  <p style={{ margin: '6px 0 0', color: theme.muted, fontSize: '0.78rem' }}>PNG, JPEG, WebP — tối đa 2000×2000px</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.flatMap(cat => {
                if (cat.code === 'storage') {
                  return [
                    { ...cat, _virtualId: `${cat.id}_ssd`, _storageType: 'SSD', _label: 'SSD' },
                    { ...cat, _virtualId: `${cat.id}_hdd`, _storageType: 'HDD', _label: 'HDD' },
                  ];
                }
                return [{ ...cat, _virtualId: String(cat.id), _label: cat.name }];
              }).map(cat => {
                const currentCompId = editComponentIds[cat._virtualId];
                const compsInCategory = components.filter(c => {
                  if (Number(c.category_id) !== Number(cat.id)) return false;
                  if (cat._storageType) {
                    const specs = typeof c.specifications === 'string' ? JSON.parse(c.specifications) : c.specifications;
                    return specs?.type === cat._storageType;
                  }
                  return true;
                });
                return (
                  <div key={cat._virtualId} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                    borderRadius: 16, background: 'rgba(146, 183, 201, 0.05)', border: `1px solid ${theme.border}`,
                  }}>
                    <span style={{
                      minWidth: 110, display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(19,164,236,0.12)', color: theme.primary,
                      padding: '5px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                    }}>{cat._label}</span>
                    <select
                      value={currentCompId || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setEditComponentIds(prev => {
                          const next = { ...prev };
                          if (val) { next[cat._virtualId] = parseInt(val); } else { delete next[cat._virtualId]; }
                          return next;
                        });
                        if (!e.target.value) {
                          setEditBuildQuantities(prev => { const n = { ...prev }; delete n[cat._virtualId]; return n; });
                        }
                      }}
                      style={{ ...inputStyle, flex: 1, maxWidth: 600 }}
                    >
                      <option value="">-- Không chọn --</option>
                      {compsInCategory.map(comp => (
                        <option key={comp.id} value={comp.id}>
                          {comp.brand} {comp.name} ({Number(comp.min_price).toLocaleString()}đ – {Number(comp.max_price).toLocaleString()}đ)
                        </option>
                      ))}
                    </select>
                    {(cat.code === 'ram' || cat._storageType) && currentCompId && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                        <span style={{ color: theme.muted, fontSize: '0.8rem', fontWeight: 600 }}>SL:</span>
                        <select
                          value={editBuildQuantities[cat._virtualId] || 1}
                          onChange={e => setEditBuildQuantities(prev => ({ ...prev, [cat._virtualId]: parseInt(e.target.value) }))}
                          style={{ ...inputStyle, width: 60, textAlign: 'center' }}
                        >
                          {Array.from({ length: cat.code === 'ram' ? 4 : 2 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={handleSaveBuild} disabled={savingBuild} style={{ ...btnPrimary, padding: '12px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                {savingBuild ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
              <button onClick={() => setEditingBuild(null)} style={{ ...btnGhost, padding: '12px 28px' }}>Hủy</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminFeaturedTab;
