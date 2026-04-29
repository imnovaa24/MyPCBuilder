import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';

function RegisterPage({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    axios.post('http://127.0.0.1:8000/api/register', {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    })
    .then(response => {
      const { token, user } = response.data;
      localStorage.setItem('customerToken', token);
      localStorage.setItem('customerUser', JSON.stringify(user));
      onRegisterSuccess();
      navigate('/my-builds');
    })
    .catch(err => {
      if (err.response?.data?.errors?.email) {
        setError('Email này đã được đăng ký!');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="bg-[#101c22] min-h-screen font-display text-slate-100 antialiased flex flex-col">
      <PublicNavbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1a2c35] rounded-xl border border-[#233c48] shadow-2xl p-8">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary block mb-3">person_add</span>
            <h2 className="text-2xl font-bold text-white">Đăng Ký Tài Khoản</h2>
            <p className="text-slate-400 text-sm mt-2">Tạo tài khoản để lưu lại các cấu hình PC của bạn</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email (Gmail)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="yourname@gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
                required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
          </form>

          <div className="text-center mt-6 flex flex-col gap-2">
            <p className="text-slate-400 text-sm">
              Đã có tài khoản?{' '}
              <Link to="/customer-login" className="text-primary hover:text-primary/80 no-underline font-medium">Đăng nhập</Link>
            </p>
            <Link to="/" className="text-slate-500 text-sm hover:text-slate-300 no-underline">← Quay lại trang chủ</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
