import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    axios.post('http://127.0.0.1:8000/api/login', {
      email: email,
      password: password
    })
    .then(response => {
      const { token, role, user } = response.data;
      if (role !== 'admin' && role !== 'manager') {
        setError('Tài khoản này không có quyền quản trị!');
        return;
      }
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminRole', role);
      localStorage.setItem('adminUser', JSON.stringify(user));
      onLoginSuccess(true);
      navigate('/admin');
    })
    .catch(() => {
      setError('Sai email hoặc mật khẩu!');
    });
  };

  return (
    <div className="bg-[#101c22] min-h-screen font-display text-slate-100 antialiased flex flex-col">
      <PublicNavbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1a2c35] rounded-xl border border-[#233c48] shadow-2xl p-8">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary block mb-3">admin_panel_settings</span>
            <h2 className="text-2xl font-bold text-white">Đăng Nhập Quản Trị</h2>
            <p className="text-slate-400 text-sm mt-2">Nhập thông tin để truy cập trang quản lý</p>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2">
              Đăng Nhập
            </button>
          </form>
          <div className="text-center mt-6">
            <Link to="/" className="text-primary text-sm hover:text-primary/80 no-underline">← Quay lại trang chủ</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
