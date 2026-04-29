import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const CATEGORY_ICONS = {
  cpu: 'memory',
  vga: 'videogame_asset',
  mainboard: 'developer_board',
  ram: 'memory',
  psu: 'bolt',
  case: 'computer',
  cooler: 'ac_unit',
};

const categories = [
  { name: 'CPU', code: 'cpu', icon: 'memory' },
  { name: 'VGA', code: 'vga', icon: 'videogame_asset' },
  { name: 'Mainboard', code: 'mainboard', icon: 'developer_board' },
  { name: 'RAM', code: 'ram', icon: 'memory' },
  { name: 'Storage', code: 'storage', icon: 'hard_drive' },
  { name: 'PSU', code: 'psu', icon: 'bolt' },
  { name: 'Case', code: 'case', icon: 'computer' },
  { name: 'Cooler', code: 'cooler', icon: 'ac_unit' },
];

function PublicHomePage() {
  const [featuredBuilds, setFeaturedBuilds] = useState([]);
  const [loadingBuilds, setLoadingBuilds] = useState(true);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/featured-builds`)
      .then(res => setFeaturedBuilds(res.data.data || []))
      .catch(err => console.error('Lỗi tải cấu hình nổi bật:', err))
      .finally(() => setLoadingBuilds(false));
  }, []);

  const openBuildDetail = (buildId) => {
    setLoadingDetail(true);
    setSelectedBuild(null);
    axios.get(`${API_BASE}/featured-builds/${buildId}`)
      .then(res => setSelectedBuild(res.data.data))
      .catch(err => console.error('Lỗi tải chi tiết:', err))
      .finally(() => setLoadingDetail(false));
  };

  const closeBuildDetail = () => {
    setSelectedBuild(null);
  };

  const handleBuildNow = () => {
    if (!selectedBuild) return;
    // Truyền components qua navigation state để PublicBuilderPage auto-add
    navigate('/builder', { state: { presetBuild: selectedBuild } });
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 lg:px-40">
      <div className="flex flex-col max-w-[1200px] w-full gap-12">
        {/* Hero Section */}
        <div className="flex flex-col gap-8 py-6 lg:flex-row lg:items-center">
          <div className="w-full aspect-video rounded-xl bg-center bg-cover shadow-2xl overflow-hidden lg:w-1/2 order-1 lg:order-2 relative group"
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMVA7Fi-YU-VgmbcRbRMjVTIU-MZsKDkepV1eNuEqxeLvQw91TcAwdmUj-Dbhhh2SBC8Y6QmL19_CJ5svNJOfHbo90U3OYhTkwLgy-d0rnGKIMB8zbf9LE0iPksvGQ0qOQ4g2TGQ1nV3k6oVuXxSD0rxLJRw_F_-qQ-2yxsByD2w5x1edMJC0uE6C_LmoR2e896FRxsOu-D7IjFUlxKmjQp2ItdzyOmPTM3SC_67DVWSf6i1KlFPvT-T7JVEI82rnUA5GzE5shbCQV")'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101c22]/80 to-transparent opacity-60"></div>
          </div>
          <div className="flex flex-col gap-6 lg:w-1/2 order-2 lg:order-1">
            <div className="flex flex-col gap-4 text-left">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] lg:text-6xl">
                Tự tay xây dựng <span className="text-primary">máy tính của bạn</span> ngay hôm nay
              </h1>
              <p className="text-slate-300 text-base font-normal leading-relaxed lg:text-lg max-w-lg">
                Khám phá các cấu hình được chọn lọc bởi chuyên gia, so sánh giá theo thời gian thực. Dù cho gaming 4K, chỉnh video hay công việc văn phòng, chúng tôi hướng dẫn bạn từng bước.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/builder" className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 no-underline">
                <span className="mr-2 material-symbols-outlined text-[20px]">build</span>
                <span>Bắt đầu Build</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Configurations */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">Cấu Hình Phổ Biến</h2>
            <Link to="/featured-builds" className="text-primary text-sm font-semibold hover:underline no-underline flex items-center gap-1">
              Xem tất cả
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBuilds ? (
              <div className="col-span-3 text-center text-slate-400 py-10">
                <span className="material-symbols-outlined text-4xl animate-spin block mb-3">progress_activity</span>
                <p>Đang tải cấu hình nổi bật...</p>
              </div>
            ) : featuredBuilds.map((build) => (
              <div key={build.id} className="flex flex-col rounded-xl overflow-hidden bg-surface-dark shadow-md hover:shadow-xl transition-all border border-border-dark group">
                <div className="w-full aspect-[4/3] bg-cover bg-center relative" style={{backgroundImage: `url("${build.image?.startsWith('/storage/') ? 'http://127.0.0.1:8000' + build.image : build.image}")`}}>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-yellow-400">star</span>
                    {build.rating}
                  </div>
                  <div className={`absolute bottom-3 left-3 ${build.tag_color} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {build.tag}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white text-lg font-bold">{build.name}</h3>
                      <p className="text-slate-400 text-sm mt-1">{build.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{Number(build.total_min_price).toLocaleString('vi-VN')}đ</p>
                      <p className="text-xs text-slate-500">Est. Total</p>
                    </div>
                  </div>
                  <div className="h-px bg-border-dark w-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="material-symbols-outlined text-[18px]">memory</span>
                        <span>{build.component_count} linh kiện</span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {Number(build.total_min_price).toLocaleString('vi-VN')}đ - {Number(build.total_max_price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openBuildDetail(build.id)}
                    className="mt-auto w-full py-2.5 rounded-lg bg-surface-dark border border-border-dark hover:bg-primary hover:text-white text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white cursor-pointer"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Component */}
        <div className="py-10">
          <h2 className="text-white text-[24px] font-bold leading-tight mb-6">Duyệt theo Linh Kiện</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.code} to={`/components/${cat.code}`} className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-surface-dark border border-border-dark hover:border-primary transition-all no-underline">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">{cat.icon}</span>
                <span className="text-slate-200 font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Build Detail Modal */}
      {(selectedBuild || loadingDetail) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-[600px] max-h-[85vh] bg-[#1a2c35] rounded-xl border border-[#233c48] shadow-2xl flex flex-col overflow-hidden">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              </div>
            ) : selectedBuild && (
              <>
                {/* Modal Header with image */}
                <div className="relative h-48 bg-cover bg-center" style={{backgroundImage: `url("${selectedBuild.image?.startsWith('/storage/') ? 'http://127.0.0.1:8000' + selectedBuild.image : selectedBuild.image}")`}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c35] to-transparent"></div>
                  <button
                    onClick={closeBuildDetail}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${selectedBuild.tag_color} text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                        {selectedBuild.tag}
                      </span>
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-yellow-400">star</span>
                        {selectedBuild.rating}
                      </span>
                    </div>
                    <h2 className="text-white text-2xl font-bold">{selectedBuild.name}</h2>
                    <p className="text-slate-300 text-sm">{selectedBuild.subtitle}</p>
                  </div>
                </div>

                {/* Component List */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Danh sách linh kiện</h3>
                  {selectedBuild.components.map((item) => (
                    <div key={item.category_id} className="flex items-center gap-3 p-3 rounded-lg bg-[#111c22] border border-[#233c48]">
                      <div className="w-10 h-10 rounded-lg bg-[#233c48] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {CATEGORY_ICONS[item.category_code] || 'settings'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{item.category_name}</p>
                        <p className="text-white text-sm font-semibold truncate">{item.component.brand} {item.component.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white text-sm font-bold">{Number(item.component.min_price).toLocaleString('vi-VN')}đ</p>
                        <p className="text-slate-500 text-[11px]">~ {Number(item.component.max_price).toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with total + Build button */}
                <div className="border-t border-[#233c48] p-5 flex items-center justify-between bg-[#131f25]">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Tổng ước tính</p>
                    <p className="text-white text-lg font-bold">
                      {Number(selectedBuild.total_min_price).toLocaleString('vi-VN')}đ
                      <span className="text-slate-400 text-sm font-normal"> - {Number(selectedBuild.total_max_price).toLocaleString('vi-VN')}đ</span>
                    </p>
                  </div>
                  <button
                    onClick={handleBuildNow}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary/25 border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">build</span>
                    Build Ngay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default PublicHomePage;
