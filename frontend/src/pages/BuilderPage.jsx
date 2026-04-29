import { useState } from 'react';
import PageHero from '../components/PageHero';
import componentsData from '../mock/components.json';

const slots = [
  { key: 'cpu', name: 'CPU', fullName: 'Processor', icon: 'CPU' },
  { key: 'mainboard', name: 'Motherboard', fullName: 'Bo mạch chủ', icon: 'MB' },
  { key: 'ram', name: 'Memory', fullName: 'RAM', icon: 'RAM' },
  { key: 'vga', name: 'GPU', fullName: 'Card màn hình', icon: 'GPU' },
  { key: 'case', name: 'Case', fullName: 'Vỏ máy', icon: 'CASE' },
  { key: 'psu', name: 'Power Supply', fullName: 'Nguồn máy tính', icon: 'PSU' },
  { key: 'cooler', name: 'Cooler', fullName: 'Tản nhiệt', icon: 'COOL' },
];

function BuilderPage() {
  const [build, setBuild] = useState({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    cooler: null,
    psu: null,
    case: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const totalPrice = Object.values(build).reduce((sum, item) => (item ? sum + item.price : sum), 0);

  // ── Helpers phân tích linh kiện ────────────────────────────────────────────
  const getCpuSeries = (cpu) => {
    if (!cpu) return null;
    const fullName = `${cpu.brand} ${cpu.name}`.toLowerCase();
    if (/core i9|i9[-\s]/i.test(fullName)) return 'i9';
    if (/core i7|i7[-\s]/i.test(fullName)) return 'i7';
    if (/core i5|i5[-\s]/i.test(fullName)) return 'i5';
    if (/core i3|i3[-\s]/i.test(fullName)) return 'i3';
    if (/ryzen 9/i.test(fullName)) return 'ryzen9';
    if (/ryzen 7/i.test(fullName)) return 'ryzen7';
    if (/ryzen 5/i.test(fullName)) return 'ryzen5';
    if (/ryzen 3/i.test(fullName)) return 'ryzen3';
    return null;
  };

  const getMainTier = (main) => {
    if (!main) return null;
    const name = main.name.toUpperCase();
    if (/\bZ\d{3}/.test(name)) return 'Z';
    if (/\bB\d{3}/.test(name)) return 'B';
    if (/\bH\d{3}/.test(name)) return 'H';
    if (/\bX\d{3}/.test(name)) return 'X';
    if (/\bA\d{3}/.test(name)) return 'A';
    return null;
  };

  const TIER_ALLOWED = {
    i3:     ['H', 'B'],
    i5:     ['H', 'B', 'Z'],
    i7:     ['B', 'Z'],
    i9:     ['Z'],
    ryzen3: ['A'],
    ryzen5: ['A', 'B', 'X'],
    ryzen7: ['B', 'X'],
    ryzen9: ['X'],
  };

  const isTierOk = (cpuSeries, tier) => {
    if (!cpuSeries || !tier) return true;
    return TIER_ALLOWED[cpuSeries]?.includes(tier) ?? true;
  };

  // Các socket Intel / AMD để phát hiện thương hiệu
  const INTEL_SOCKETS = ['lga1851', 'lga1700', 'lga1200', 'lga1151', 'lga1150'];
  const AMD_SOCKETS   = ['am5', 'am4', 'am3+', 'am3'];

  const openSelectionModal = async (categoryCode) => {
    setActiveCategory(categoryCode);
    setIsModalOpen(true);
    setListItems([]);
    setIsLoading(true);
    setLoadError('');

    try {
      const filteredItems = componentsData.filter((item) => {
        if (item.category_code !== categoryCode) {
          return false;
        }

        // CPU: nếu đã chọn mainboard → lọc theo socket
        if (categoryCode === 'cpu' && build.mainboard) {
          return item.specifications.socket === build.mainboard.specifications.socket;
        }

        // Mainboard: nếu đã chọn CPU → lọc theo socket VÀ tier chipset phù hợp
        if (categoryCode === 'mainboard' && build.cpu) {
          if (item.specifications.socket !== build.cpu.specifications.socket) return false;
          const cpuSeries = getCpuSeries(build.cpu);
          const tier = getMainTier(item);
          return isTierOk(cpuSeries, tier);
        }

        // RAM: nếu đã chọn mainboard → lọc theo loại RAM
        if (categoryCode === 'ram' && build.mainboard) {
          return item.specifications.ram_type === build.mainboard.specifications.ram_type;
        }

        return true;
      });

      setListItems(filteredItems);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoadError('Không tải được danh sách linh kiện demo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    const newBuild = { ...build, [activeCategory]: item };

    if (activeCategory === 'cpu' && build.mainboard) {
      if (item.specifications.socket !== build.mainboard.specifications.socket) {
        newBuild.mainboard = null;
        newBuild.ram = null;
        window.alert('Da go bo bo mach chu va RAM cu vi khong khop socket CPU moi.');
      }
    }

    setBuild(newBuild);
    setIsModalOpen(false);
  };

  // ── Kiểm tra tính tương thích ─────────────────────────────────────────────
  const healthAlerts = [];
  let _aid = 0;
  const addError = (text) => healthAlerts.push({ id: ++_aid, type: 'error',   text });
  const addWarn  = (text) => healthAlerts.push({ id: ++_aid, type: 'warning', text });

  // 1. CPU ↔ Mainboard: socket & brand
  if (build.cpu && build.mainboard) {
    const cpuSocket = build.cpu.specifications.socket;
    const mbSocket  = build.mainboard.specifications.socket;
    if (cpuSocket !== mbSocket) {
      addError(`Socket CPU (${cpuSocket}) không khớp với Mainboard (${mbSocket}).`);
    }
    const cpuIsIntel = INTEL_SOCKETS.includes(cpuSocket.toLowerCase());
    const cpuIsAmd   = AMD_SOCKETS.includes(cpuSocket.toLowerCase());
    const mbIsIntel  = INTEL_SOCKETS.includes(mbSocket.toLowerCase());
    const mbIsAmd    = AMD_SOCKETS.includes(mbSocket.toLowerCase());
    if (cpuIsIntel && mbIsAmd) addError('CPU Intel không tương thích với Mainboard AMD.');
    if (cpuIsAmd && mbIsIntel) addError('CPU AMD không tương thích với Mainboard Intel.');

    // Tier chipset
    const cpuSeries = getCpuSeries(build.cpu);
    const mbTier    = getMainTier(build.mainboard);
    if (cpuSeries && mbTier && !isTierOk(cpuSeries, mbTier)) {
      const tierLabel = {
        i3: 'H hoặc B', i7: 'B hoặc Z', i9: 'Z',
        ryzen3: 'A', ryzen7: 'B hoặc X', ryzen9: 'X',
      };
      const rec = tierLabel[cpuSeries];
      if (rec) {
        addWarn(`CPU ${build.cpu.name} nên ghép Mainboard dòng ${rec}. Mainboard dòng ${mbTier} không phù hợp.`);
      }
    }
  }

  // 2. Mainboard ↔ RAM: loại RAM
  if (build.mainboard && build.ram) {
    const mbRam  = build.mainboard.specifications.ram_type;
    const ramType = build.ram.specifications.ram_type;
    if (mbRam !== ramType) {
      addError(`Mainboard chỉ hỗ trợ ${mbRam}, RAM đã chọn là ${ramType} — không tương thích.`);
    }
  }

  // 3. Tản nhiệt ↔ CPU socket
  if (build.cooler && build.cpu) {
    const socketSupport = build.cooler.specifications.socket_support || [];
    if (!socketSupport.includes(build.cpu.specifications.socket)) {
      addError(`Tản nhiệt ${build.cooler.name} không hỗ trợ socket ${build.cpu.specifications.socket}.`);
    }
  }

  // 4. CPU tầm thấp + VGA cao cấp → bottleneck
  if (build.cpu && build.vga) {
    const cpuSeries = getCpuSeries(build.cpu);
    const isLowCpu  = ['i3', 'ryzen3'].includes(cpuSeries);
    const gpuFullName = `${build.vga.brand} ${build.vga.name}`;
    const isHighEndGpu = /rtx\s*(40[89]\d|4090|50[0-9]{2})|rx\s*(7[89][0-9]{2}|79\d{2})/i.test(gpuFullName);
    if (isLowCpu && isHighEndGpu) {
      addWarn(`CPU ${build.cpu.name} có thể gây nghẽn cổ chai (bottleneck) khi ghép với VGA ${build.vga.name} cao cấp.`);
    }
  }

  // 5. PSU ↔ Tổng công suất hệ thống
  if (build.psu) {
    const totalTdp = 100 + (build.cpu?.specifications.tdp || 0) + (build.vga?.specifications.tdp || 0);
    if (build.psu.specifications.wattage < totalTdp) {
      addError(`Công suất nguồn (${build.psu.specifications.wattage}W) không đảm bảo yêu cầu. Tổng tải ước tính: ${totalTdp}W.`);
    } else if (build.psu.specifications.wattage < totalTdp + 150) {
      addWarn(`Công suất nguồn (${build.psu.specifications.wattage}W) khá sát tải. Khuyến nghị tối thiểu ${totalTdp + 150}W để an toàn.`);
    }
  }

  // 6. Mainboard form factor ↔ Case
  if (build.mainboard && build.case) {
    const mbForm   = build.mainboard.specifications.form_factor;
    const caseForm = build.case.specifications.form_factor;
    const ORDER    = ['ATX', 'mATX', 'ITX'];
    const mbIdx    = ORDER.indexOf(mbForm);
    const caseIdx  = ORDER.indexOf(caseForm);
    if (mbIdx !== -1 && caseIdx !== -1 && caseIdx > mbIdx) {
      addError(`Kích thước Bo mạch chủ (${mbForm}) không lắp vừa Vỏ máy tính (${caseForm}).`);
    }
  }

  // 7. VGA chiều dài ↔ Case
  if (build.vga && build.case) {
    const vgaLen = build.vga.specifications.length;
    const maxLen = build.case.specifications.max_gpu_length;
    if (vgaLen && maxLen && vgaLen > maxLen) {
      addError(`Card màn hình quá dài (${vgaLen}mm) so với khoảng trống tối đa của Vỏ Case (${maxLen}mm).`);
    }
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="PC Builder Compatibility Tool"
        title="Builder tách riêng thành route độc lập"
        description="Giữ nguyên luồng chọn linh kiện và health check, nhưng không còn phải nhét mọi màn tham chiếu vào một file duy nhất."
      />

      <div className="builder-layout">
        <section className="panel">
          <div className="section-heading">
            <h2>Component slots</h2>
            <span className="section-note">Dữ liệu demo đang được đọc trực tiếp từ JSON trong frontend</span>
          </div>

          <div className="builder-slots">
            {slots.map((slot) => {
              const item = build[slot.key];

              return item ? (
                <article className="builder-slot builder-slot--filled" key={slot.key}>
                  <div className="builder-slot__icon">{slot.icon}</div>
                  <div className="builder-slot__content">
                    <span className="pill">{slot.name}</span>
                    <h3>{item.brand} {item.name}</h3>
                    <p>{item.price.toLocaleString()} VNĐ</p>
                  </div>
                  <div className="builder-slot__actions">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => setBuild({ ...build, [slot.key]: null })}
                    >
                      Gỡ
                    </button>
                    <button
                      type="button"
                      className="button button--primary"
                      onClick={() => openSelectionModal(slot.key)}
                    >
                      Đổi
                    </button>
                  </div>
                </article>
              ) : (
                <button
                  type="button"
                  className="builder-slot builder-slot--empty"
                  key={slot.key}
                  onClick={() => openSelectionModal(slot.key)}
                >
                  <div className="builder-slot__icon">{slot.icon}</div>
                  <div className="builder-slot__content">
                    <span className="pill pill--muted">{slot.name}</span>
                    <h3>Chọn {slot.fullName}</h3>
                    <p>Nhấn để mở danh sách linh kiện tương ứng.</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-stack">
          <section className="panel">
            <div className="section-heading">
              <h2>Trạng thái cấu hình</h2>
              <span className={`status-badge ${healthAlerts.length ? 'status-badge--danger' : 'status-badge--ok'}`}>
                {healthAlerts.length ? `${healthAlerts.length} cảnh báo` : 'Ổn định'}
              </span>
            </div>

            <div className="stack-list">
              {healthAlerts.length === 0 ? (
                <div className="alert alert--ok">Chưa phát hiện xung đột nghiêm trọng trong cấu hình hiện tại.</div>
              ) : (
                healthAlerts.map((alert) => (
                  <div
                    className={alert.type === 'error' ? 'alert alert--danger' : 'alert alert--warn'}
                    key={alert.id}
                  >
                    {alert.text}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel panel--accent">
            <div className="section-heading">
              <h2>Dự toán chi phí</h2>
            </div>
            <div className="budget-box">
              <strong>{totalPrice.toLocaleString()} VNĐ</strong>
              <p>Giá chỉ mang tính tham khảo theo dữ liệu đang có trong hệ thống.</p>
            </div>
          </section>
        </aside>
      </div>

      {isModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-card__header">
              <div>
                <p className="page-hero__eyebrow">Smart Component Selector</p>
                <h2>Chọn {activeCategory}</h2>
              </div>
              <button type="button" className="button button--ghost" onClick={() => setIsModalOpen(false)}>
                Đóng
              </button>
            </div>

            <div className="modal-card__body">
              {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
              {!isLoading && loadError ? <p className="empty-state">{loadError}</p> : null}
              {!isLoading && !loadError && listItems.length === 0 ? (
                <p className="empty-state">Không có linh kiện phù hợp trong danh mục này.</p>
              ) : null}

              {listItems.map((item) => (
                <article className="info-card info-card--compact" key={item.id}>
                  <div className="info-card__split">
                    <div>
                      <h3>{item.brand} {item.name}</h3>
                      <p>
                        Socket: {item.specifications.socket || '-'} | RAM: {item.specifications.ram_type || '-'} |
                        TDP: {item.specifications.tdp || '-'}W
                      </p>
                    </div>
                    <strong>{item.price.toLocaleString()} VNĐ</strong>
                  </div>
                  <button type="button" className="button button--primary" onClick={() => handleSelectItem(item)}>
                    Chọn linh kiện này
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BuilderPage;
