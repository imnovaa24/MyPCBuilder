import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, inputStyle, btnPrimary, btnGhost, btnDanger } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

// Định nghĩa cấu trúc config cho từng loại rule
const CONFIG_SCHEMA = {
  RULE_SOCKET_MATCH: {
    label: 'Kiểm tra socket CPU khớp Mainboard',
    fields: [
      { key: 'type', label: 'Loại so sánh', type: 'select', options: ['exact_match'], default: 'exact_match', hint: 'So khớp chính xác socket' },
    ],
  },
  RULE_RAM_TYPE_MATCH: {
    label: 'Kiểm tra chuẩn RAM tương thích',
    fields: [
      { key: 'type', label: 'Loại so sánh', type: 'select', options: ['array_contains'], default: 'array_contains', hint: 'Kiểm tra RAM type có trong danh sách hỗ trợ của mainboard' },
    ],
  },
  RULE_PSU_WATTAGE: {
    label: 'Kiểm tra công suất PSU đủ cho cấu hình',
    fields: [
      { key: 'buffer', label: 'Buffer công suất (W)', type: 'number', default: 100, hint: 'Công suất dự phòng thêm (khuyến nghị 100W)' },
    ],
  },
  RULE_VGA_CLEARANCE: {
    label: 'Kiểm tra GPU vừa vào Case',
    fields: [
      { key: 'type', label: 'Loại kiểm tra', type: 'select', options: ['length_check'], default: 'length_check', hint: 'Kiểm tra chiều dài GPU' },
      { key: 'operator', label: 'Toán tử so sánh', type: 'select', options: ['<=', '<'], default: '<=', hint: 'Chiều dài GPU phải nhỏ hơn hoặc bằng khoảng trống case' },
    ],
  },
  RULE_COOLER_CLEARANCE: {
    label: 'Kiểm tra Cooler vừa vào Case',
    fields: [
      { key: 'type', label: 'Loại kiểm tra', type: 'select', options: ['height_check'], default: 'height_check', hint: 'Kiểm tra chiều cao Cooler' },
      { key: 'operator', label: 'Toán tử so sánh', type: 'select', options: ['<=', '<'], default: '<=', hint: 'Chiều cao Cooler phải nhỏ hơn hoặc bằng khoảng trống case' },
    ],
  },
  RULE_MB_FORM_FACTOR: {
    label: 'Kiểm tra form factor tương thích',
    fields: [
      { key: 'type', label: 'Loại so sánh', type: 'select', options: ['array_contains'], default: 'array_contains', hint: 'Kiểm tra mainboard form factor có trong danh sách hỗ trợ của case' },
    ],
  },
  RULE_BOTTLENECK_WARNING: {
    label: 'Cảnh báo chênh lệch hiệu năng CPU/GPU',
    fields: [
      { key: 'max_tier_difference', label: 'Chênh lệch tier tối đa', type: 'number', default: 1, hint: 'Nếu CPU và GPU chênh > số tier này sẽ cảnh báo (1 = cân bằng, 2 = cho phép chênh vừa)' },
    ],
  },
};

const SEVERITY_OPTIONS = [
  { value: 'error', label: 'Lỗi cứng', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: 'error' },
  { value: 'warning', label: 'Cảnh báo', color: '#f6c760', bg: 'rgba(246,199,96,0.12)', icon: 'warning' },
];

const emptyForm = {
  rule_code: '',
  description: '',
  error_message: '',
  is_active: true,
  severity: 'error',
};

function AdminCompatibilityTab({ setActiveTab }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [configFields, setConfigFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rawConfig, setRawConfig] = useState('');

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      Accept: 'application/json',
    },
  });

  const fetchRules = () => {
    setLoading(true);
    axiosPrivate.get('/compatibility-rules')
      .then(res => setRules(res.data.data || []))
      .catch(() => alert('Lỗi tải danh sách luật!'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRules(); }, []);

  // Lấy default config fields cho một rule_code
  const getDefaultConfigFields = (ruleCode) => {
    const schema = CONFIG_SCHEMA[ruleCode];
    if (!schema) return {};
    const defaults = {};
    schema.fields.forEach(f => { defaults[f.key] = f.default; });
    return defaults;
  };

  // Parse config object thành configFields state
  const parseConfigToFields = (ruleCode, configObj) => {
    const schema = CONFIG_SCHEMA[ruleCode];
    if (!schema || !configObj) return getDefaultConfigFields(ruleCode);
    const fields = {};
    schema.fields.forEach(f => {
      fields[f.key] = configObj[f.key] !== undefined ? configObj[f.key] : f.default;
    });
    return fields;
  };

  // Build JSON string từ configFields
  const buildConfigJson = () => {
    if (showAdvanced && rawConfig.trim()) {
      return rawConfig;
    }
    const schema = CONFIG_SCHEMA[form.rule_code];
    if (!schema || Object.keys(configFields).length === 0) return '';
    return JSON.stringify(configFields);
  };

  const openCreate = () => {
    setEditingRule(null);
    setForm(emptyForm);
    setConfigFields({});
    setShowAdvanced(false);
    setRawConfig('');
    setShowForm(true);
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    setForm({
      rule_code: rule.rule_code,
      description: rule.description,
      error_message: rule.error_message,
      is_active: rule.is_active,
      severity: rule.severity || 'error',
    });
    setConfigFields(parseConfigToFields(rule.rule_code, rule.config));
    setRawConfig(rule.config ? JSON.stringify(rule.config, null, 2) : '');
    setShowAdvanced(false);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingRule(null); };

  // Khi đổi rule_code, reset config fields về default
  const handleRuleCodeChange = (newCode) => {
    setForm(p => ({ ...p, rule_code: newCode }));
    setConfigFields(getDefaultConfigFields(newCode));
    setRawConfig('');
  };

  const handleSave = () => {
    if (!form.rule_code.trim() || !form.description.trim() || !form.error_message.trim()) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    
    let configJson = buildConfigJson();
    if (showAdvanced && configJson) {
      try { JSON.parse(configJson); } catch {
        alert('Config JSON không hợp lệ!');
        return;
      }
    }

    setSaving(true);
    const payload = { ...form, config: configJson || null };

    const req = editingRule
      ? axiosPrivate.put(`/compatibility-rules/${editingRule.id}`, payload)
      : axiosPrivate.post('/compatibility-rules', payload);

    req
      .then(() => {
        alert(editingRule ? 'Cập nhật luật thành công!' : 'Thêm luật mới thành công!');
        closeForm();
        fetchRules();
      })
      .catch(err => alert(err.response?.data?.message || 'Lỗi lưu luật! Xem Console (F12).'))
      .finally(() => setSaving(false));
  };

  const handleToggle = (rule) => {
    axiosPrivate.patch(`/compatibility-rules/${rule.id}/toggle`)
      .then(res => {
        setRules(prev => prev.map(r => r.id === rule.id ? res.data.data : r));
      })
      .catch(() => alert('Lỗi khi bật/tắt luật!'));
  };

  const handleDelete = (rule) => {
    if (!window.confirm(`Xóa luật "${rule.rule_code}"?\nHành động này không thể hoàn tác.`)) return;
    axiosPrivate.delete(`/compatibility-rules/${rule.id}`)
      .then(() => { fetchRules(); })
      .catch(() => alert('Lỗi khi xóa luật!'));
  };

  const labelStyle = {
    fontWeight: 600, display: 'block', marginBottom: 6,
    color: theme.muted, fontSize: '0.82rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const hintStyle = {
    fontSize: '0.78rem', color: theme.muted, marginTop: 4, fontStyle: 'italic',
  };

  // Render dynamic config fields
  const renderConfigFields = () => {
    const schema = CONFIG_SCHEMA[form.rule_code];
    if (!schema) {
      return (
        <div style={{ padding: '16px 20px', background: 'rgba(146,183,201,0.06)', borderRadius: 12, border: `1px dashed ${theme.border}` }}>
          <p style={{ margin: 0, color: theme.muted, fontSize: '0.88rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6 }}>info</span>
            {form.rule_code 
              ? `Rule "${form.rule_code}" chưa có schema định nghĩa sẵn. Sử dụng chế độ nâng cao để nhập JSON thủ công.`
              : 'Chọn Rule Code để hiển thị các tuỳ chọn cấu hình.'
            }
          </p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '12px 16px', background: 'rgba(19,164,236,0.08)', borderRadius: 12, borderLeft: `3px solid ${theme.primary}` }}>
          <p style={{ margin: 0, color: theme.text, fontSize: '0.88rem', fontWeight: 500 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6, color: theme.primary }}>lightbulb</span>
            {schema.label}
          </p>
        </div>

        {schema.fields.map(field => (
          <div key={field.key} style={{
            padding: '14px 18px', background: 'rgba(146,183,201,0.04)', borderRadius: 14, border: `1px solid ${theme.border}`,
          }}>
            <label style={{ ...labelStyle, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: theme.primary }}>tune</span>
              {field.label}
            </label>

            {field.type === 'number' && (
              <input
                type="number"
                value={configFields[field.key] ?? field.default}
                onChange={e => setConfigFields(p => ({ ...p, [field.key]: parseInt(e.target.value) || 0 }))}
                style={{ ...inputStyle, width: 140, fontWeight: 600, fontSize: '1rem' }}
              />
            )}

            {field.type === 'select' && (
              <select
                value={configFields[field.key] ?? field.default}
                onChange={e => setConfigFields(p => ({ ...p, [field.key]: e.target.value }))}
                style={{ ...inputStyle, minWidth: 180 }}
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.hint && <p style={hintStyle}>{field.hint}</p>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontFamily: theme.font, fontSize: '0.88rem', padding: 0 }}>
          Tổng quan
        </button>
        <span style={{ color: theme.muted }}>/</span>
        <span style={{ color: theme.text, fontWeight: 600, fontSize: '0.88rem' }}>Luật Tương Thích</span>
      </div>

      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ color: theme.ok, fontSize: 22 }}>rule</span>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Quản Lý Luật Tương Thích</h2>
            <span style={{ background: 'rgba(19,164,236,0.12)', color: theme.primary, borderRadius: '999px', padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
              {rules.filter(r => r.is_active).length}/{rules.length} đang bật
            </span>
          </div>
          <button onClick={openCreate} style={{ ...btnPrimary, padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Thêm Luật Mới
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', marginBottom: showForm ? 24 : 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: theme.muted }}>Đang tải...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  {['ID', 'Rule Code', 'Mô tả', 'Thông báo lỗi', 'Mức độ', 'Trạng thái', 'Thao tác'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: i === 6 ? 'center' : 'left', color: theme.muted, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} style={{
                    borderBottom: `1px solid ${theme.border}`,
                    background: editingRule?.id === rule.id ? 'rgba(19,164,236,0.06)' : 'transparent',
                    opacity: rule.is_active ? 1 : 0.55,
                    transition: 'opacity 0.2s',
                  }}>
                    <td style={{ padding: '14px', color: theme.muted, fontSize: '0.85rem' }}>{rule.id}</td>
                    <td style={{ padding: '14px' }}>
                      <code style={{ background: 'rgba(19,164,236,0.1)', color: theme.primary, padding: '3px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                        {rule.rule_code}
                      </code>
                    </td>
                    <td style={{ padding: '14px', fontSize: '0.88rem', maxWidth: 240 }}>{rule.description}</td>
                    <td style={{ padding: '14px', fontSize: '0.85rem', color: theme.warn, maxWidth: 220 }}>{rule.error_message}</td>
                    <td style={{ padding: '14px' }}>
                      {(() => {
                        const sev = SEVERITY_OPTIONS.find(s => s.value === (rule.severity || 'error'));
                        return (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 12px', borderRadius: '999px',
                            background: sev.bg, color: sev.color,
                            fontSize: '0.8rem', fontWeight: 700,
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{sev.icon}</span>
                            {sev.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => handleToggle(rule)}
                        title={rule.is_active ? 'Nhấn để tắt' : 'Nhấn để bật'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '5px 14px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                          fontFamily: theme.font, fontSize: '0.8rem', fontWeight: 700, transition: '0.18s',
                          background: rule.is_active ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248,113,113,0.12)',
                          color: rule.is_active ? theme.ok : theme.danger,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          {rule.is_active ? 'toggle_on' : 'toggle_off'}
                        </span>
                        {rule.is_active ? 'Đang bật' : 'Đã tắt'}
                      </button>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        <button onClick={() => openEdit(rule)} style={{ ...btnPrimary, padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(rule)} style={{ ...btnDanger, padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Form thêm / sửa */}
        {showForm && (
          <div style={{
            border: `1px solid ${theme.borderStrong}`, borderRadius: 20, padding: 24,
            background: 'linear-gradient(180deg, rgba(27,47,57,0.9), rgba(14,24,30,0.9))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: editingRule ? theme.primary : theme.ok, fontSize: 22 }}>
                  {editingRule ? 'edit_note' : 'add_circle'}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  {editingRule ? `Chỉnh sửa: ` : 'Thêm luật mới'}
                  {editingRule && <span style={{ color: theme.primary }}>{editingRule.rule_code}</span>}
                </h3>
              </div>
              <button onClick={closeForm} style={{ ...btnGhost, padding: '6px 14px', fontSize: '0.82rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>close</span>
                Đóng
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Rule Code */}
              <div>
                <label style={labelStyle}>Rule Code *</label>
                {editingRule ? (
                  <input
                    type="text" value={form.rule_code} readOnly
                    style={{ ...inputStyle, width: '100%', fontFamily: 'monospace', opacity: 0.7, cursor: 'not-allowed' }}
                  />
                ) : (
                  <select
                    value={form.rule_code}
                    onChange={e => handleRuleCodeChange(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  >
                    <option value="">-- Chọn loại luật --</option>
                    {Object.entries(CONFIG_SCHEMA).map(([code, schema]) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                    <option value="CUSTOM">+ Tạo luật tuỳ chỉnh...</option>
                  </select>
                )}
                {form.rule_code === 'CUSTOM' && !editingRule && (
                  <input
                    type="text"
                    placeholder="Nhập RULE_CODE_MỚI"
                    onChange={e => setForm(p => ({ ...p, rule_code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') }))}
                    style={{ ...inputStyle, width: '100%', marginTop: 8, fontFamily: 'monospace' }}
                  />
                )}
              </div>

              {/* Trạng thái */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={labelStyle}>Trạng thái</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontFamily: theme.font, fontSize: '0.9rem', fontWeight: 700,
                    background: form.is_active ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.1)',
                    color: form.is_active ? theme.ok : theme.danger,
                    transition: '0.18s', alignSelf: 'flex-start',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {form.is_active ? 'toggle_on' : 'toggle_off'}
                  </span>
                  {form.is_active ? 'Đang bật' : 'Đã tắt'}
                </button>
              </div>
            </div>

            {/* Mô tả */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Mô tả *</label>
              <input
                type="text" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                style={{ ...inputStyle, width: '100%' }}
                placeholder="VD: Kiểm tra socket CPU khớp Mainboard"
              />
            </div>

            {/* Thông báo lỗi */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Thông báo lỗi *</label>
              <input
                type="text" value={form.error_message}
                onChange={e => setForm(p => ({ ...p, error_message: e.target.value }))}
                style={{ ...inputStyle, width: '100%' }}
                placeholder="VD: Socket CPU và Mainboard không khớp!"
              />
            </div>

            {/* Mức độ */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Mức độ báo lỗi *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {SEVERITY_OPTIONS.map(sev => (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, severity: sev.value }))}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                      fontFamily: theme.font, fontSize: '0.9rem', fontWeight: 700,
                      transition: '0.18s',
                      border: form.severity === sev.value ? `2px solid ${sev.color}` : `2px solid transparent`,
                      background: form.severity === sev.value ? sev.bg : 'rgba(146,183,201,0.06)',
                      color: form.severity === sev.value ? sev.color : theme.muted,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{sev.icon}</span>
                    {sev.label}
                    {sev.value === 'error' && <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>— ngăn chặn build</span>}
                    {sev.value === 'warning' && <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>— chỉ cảnh báo</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Fields động */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ ...labelStyle, margin: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>settings</span>
                  Cấu hình tham số
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!showAdvanced) {
                      setRawConfig(buildConfigJson() ? JSON.stringify(JSON.parse(buildConfigJson()), null, 2) : '');
                    }
                    setShowAdvanced(!showAdvanced);
                  }}
                  style={{ ...btnGhost, padding: '4px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {showAdvanced ? 'view_module' : 'code'}
                  </span>
                  {showAdvanced ? 'Chế độ đơn giản' : 'Chế độ nâng cao (JSON)'}
                </button>
              </div>

              {showAdvanced ? (
                <div>
                  <textarea
                    value={rawConfig}
                    onChange={e => setRawConfig(e.target.value)}
                    rows={5}
                    style={{ ...inputStyle, width: '100%', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                    placeholder={'{\n  "key": "value"\n}'}
                  />
                  <p style={hintStyle}>Nhập JSON thủ công cho các trường hợp đặc biệt.</p>
                </div>
              ) : (
                renderConfigFields()
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, padding: '12px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {editingRule ? 'save' : 'add'}
                </span>
                {saving ? 'Đang lưu...' : (editingRule ? 'Lưu Thay Đổi' : 'Thêm Luật')}
              </button>
              <button onClick={closeForm} style={{ ...btnGhost, padding: '12px 28px' }}>Hủy</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminCompatibilityTab;
