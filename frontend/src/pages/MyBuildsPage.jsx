import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

function MyBuildsPage({ onLogout }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const customerToken = localStorage.getItem('customerToken');

  const axiosAuth = axios.create({
    baseURL: API_BASE,
    headers: {
      'Authorization': `Bearer ${customerToken}`,
      'Accept': 'application/json',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('customerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchBuilds();
  }, []);

  const fetchBuilds = () => {
    axiosAuth.get('/saved-builds')
      .then(res => setBuilds(res.data.data || []))
      .catch(err => {
        console.error('Lỗi tải cấu hình:', err);
        if (err.response?.status === 401) {
          handleLogout();
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa cấu hình này?')) return;
    axiosAuth.delete(`/saved-builds/${id}`)
      .then(() => {
        setBuilds(prev => prev.filter(b => b.id !== id));
      })
      .catch(() => alert('Lỗi khi xóa!'));
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    onLogout();
    navigate('/');
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-white mb-1">Cấu Hình Đã Lưu</h1>
          <p className="text-[#92b7c9] text-base">
            Xin chào, <span className="text-primary font-medium">{user?.email || 'Khách hàng'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/builder"
            className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors no-underline border-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo cấu hình mới
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#233c48] hover:bg-[#2d4b5a] text-slate-300 text-sm font-semibold transition-colors border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-slate-400 py-20">
          <span className="material-symbols-outlined text-5xl animate-spin block mb-4">progress_activity</span>
          <p className="text-lg">Đang tải...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && builds.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-600 block mb-4">inventory_2</span>
          <h3 className="text-xl text-white font-bold mb-2">Chưa có cấu hình nào</h3>
          <p className="text-slate-400 mb-6">Bắt đầu xây dựng cấu hình PC đầu tiên của bạn!</p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all no-underline"
          >
            <span className="material-symbols-outlined">build</span>
            Bắt đầu Build
          </Link>
        </div>
      )}

      {/* Builds Grid */}
      {!loading && builds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {builds.map(build => {
            const components = build.components || [];
            return (
              <div key={build.id} className="bg-[#1a2c35] rounded-xl border border-[#233c48] shadow-lg overflow-hidden hover:border-primary/30 transition-all">
                {/* Card Header */}
                <div className="p-5 border-b border-[#233c48] flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-bold">{build.name}</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(build.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-lg">
                      {Number(build.total_min_price).toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-slate-500 text-xs">
                      ~ {Number(build.total_max_price).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {/* Components List */}
                <div className="p-5 flex flex-col gap-2">
                  {components.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                        <span className="text-slate-500 min-w-[80px]">{comp.category_name}</span>
                        <span>{comp.brand} {comp.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 flex gap-3">
                  <Link
                    to="/builder"
                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-[#233c48] hover:bg-[#2d4b5a] text-slate-200 text-sm font-semibold transition-colors no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Tạo bản mới
                  </Link>
                  <button
                    onClick={() => handleDelete(build.id)}
                    className="flex items-center justify-center gap-1 h-9 px-4 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors bg-transparent cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MyBuildsPage;
