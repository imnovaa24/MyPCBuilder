import { useState } from 'react';
import PageHero from '../components/PageHero';
import componentsData from '../mock/components.json';
import { useCompatibilityCheck } from '../hooks/useCompatibilityCheck';
import { getCpuSeries, getMainTier, isTierOk } from '../utils/validationRules';

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
  // ── Hook quản lý validation & health check ──────────────────────────────
  const { build, setBuild, validationMessage, healthAlerts, addComponent, removeComponent } = useCompatibilityCheck({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    cooler: null,
    psu: null,
    case: null,
  });

  // ── State cho modal selection ──────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const totalPrice = Object.values(build).reduce((sum, item) => (item ? sum + item.price : sum), 0);

  // ── Mở modal chọn linh kiện & lọc dữ liệu ────────────────────────────────
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

  // ── Xử lý thêm linh kiện với validation từ hook ──────────────────────────
  const handleSelectItem = (item) => {
    // Sử dụng hook addComponent để kiểm tra và thêm component
    const result = addComponent(item, activeCategory);

    if (result === 'warning') {
      // Nếu là warning, hỏi user xác nhận
      const userConfirm = window.confirm(
        `${validationMessage.message}\n\nBạn có chắc chắn muốn thêm linh kiện này không?`
      );
      if (userConfirm) {
        // Cộng component dù có warning
        const newBuild = { ...build, [activeCategory]: item };
        setBuild(newBuild);
        setIsModalOpen(false);
      }
    } else if (result === true) {
      // Thêm thành công
      setIsModalOpen(false);
    }
    // Nếu result = false thì validation.message đã được set, component sẽ hiển thị message
  };

  // ── Xử lý xóa linh kiện với confirmation ──────────────────────────────────
  const handleRemoveComponent = (slotKey, componentName) => {
    const userConfirm = window.confirm(
      `Bạn có chắc chắn muốn loại bỏ ${componentName}?`
    );
    if (userConfirm) {
      removeComponent(slotKey);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
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
                      onClick={() => handleRemoveComponent(slot.key, `${item.brand} ${item.name}`)}
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
              {validationMessage && validationMessage.message && (
                <div className={`alert ${validationMessage.severity === 'error' ? 'alert--danger' : 'alert--warn'}`} style={{ marginBottom: '1rem' }}>
                  {validationMessage.message}
                </div>
              )}
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
