import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';

function CustomerLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(null); // null | 'enter-username' | 'enter-new-pw'
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotEmailHint, setForgotEmailHint] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    axios.post('http://127.0.0.1:8000/api/login', {
      email: email,
      password: password,
    })
    .then(response => {
      const { token, user, role } = response.data;
      // Nếu là admin/manager → chuyển sang trang quản trị
      if (role === 'admin' || role === 'manager') {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminRole', role);
        localStorage.setItem('adminUser', JSON.stringify(user));
        window.location.href = '/admin';
        return;
      }
      localStorage.setItem('customerToken', token);
      localStorage.setItem('customerUser', JSON.stringify(user));
      onLoginSuccess();
      navigate('/my-builds');
    })
    .catch(() => {
      setError('Sai email hoặc mật khẩu!');
    })
    .finally(() => setLoading(false));
  };

  const handleForgotSubmitUsername = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    axios.post('http://127.0.0.1:8000/api/forgot-password', { username: forgotUsername })
      .then(res => {
        setForgotEmailHint(res.data.email_hint || '');
        setForgotSuccess('Mật khẩu tạm đã được gửi đến email của bạn!');
        setForgotMode('enter-new-pw');
      })
      .catch(err => setForgotError(err.response?.data?.message || 'Có lỗi xảy ra!'))
      .finally(() => setForgotLoading(false));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (newPassword !== newPasswordConfirm) {
      setForgotError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setForgotLoading(true);
    axios.post('http://127.0.0.1:8000/api/reset-password', {
      username: forgotUsername,
      temp_password: tempPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirm,
    })
      .then(() => {
        setForgotSuccess('Đặt lại mật khẩu thành công! Đang chuyển về đăng nhập...');
        setTimeout(() => {
          setForgotMode(null);
          setForgotUsername('');
          setTempPassword('');
          setNewPassword('');
          setNewPasswordConfirm('');
          setForgotError('');
          setForgotSuccess('');
        }, 2000);
      })
      .catch(err => setForgotError(err.response?.data?.message || 'Có lỗi xảy ra!'))
      .finally(() => setForgotLoading(false));
  };

  const closeForgot = () => {
    setForgotMode(null);
    setForgotUsername('');
    setTempPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setForgotError('');
    setForgotSuccess('');
    setForgotEmailHint('');
  };

  return (
    <div className="bg-[#101c22] min-h-screen font-display text-slate-100 antialiased flex flex-col">
      <PublicNavbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1a2c35] rounded-xl border border-[#233c48] shadow-2xl p-8">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary block mb-3">account_circle</span>
            <h2 className="text-2xl font-bold text-white">Đăng Nhập</h2>
            <p className="text-slate-400 text-sm mt-2">Đăng nhập để xem và quản lý cấu hình đã lưu</p>
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
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="text-center mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setForgotMode('enter-username')}
              className="text-primary hover:text-primary/80 text-sm font-medium bg-transparent border-none cursor-pointer"
            >
              Quên mật khẩu?
            </button>
            <p className="text-slate-400 text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 no-underline font-medium">Đăng ký ngay</Link>
            </p>
            <Link to="/" className="text-slate-500 text-sm hover:text-slate-300 no-underline">← Quay lại trang chủ</Link>
          </div>
        </div>
      </main>

      {/* Modal quên mật khẩu */}
      {forgotMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeForgot}>
          <div className="w-full max-w-md bg-[#1a2c35] rounded-2xl border border-[#233c48] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-primary">lock_reset</span>
                <h2 className="text-xl font-bold text-white">Quên Mật Khẩu</h2>
              </div>
              <button onClick={closeForgot} className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {forgotError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {forgotSuccess}
              </div>
            )}

            {forgotMode === 'enter-username' && (
              <form onSubmit={handleForgotSubmitUsername} className="flex flex-col gap-4">
                <p className="text-slate-400 text-sm">Nhập tên tài khoản hoặc email để nhận mật khẩu tạm qua email.</p>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Tên tài khoản / Email</label>
                  <input
                    type="text" value={forgotUsername}
                    onChange={e => setForgotUsername(e.target.value)} required
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập tên tài khoản hoặc email"
                  />
                </div>
                <button type="submit" disabled={forgotLoading}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2 disabled:opacity-50">
                  {forgotLoading ? 'Đang gửi...' : 'Gửi mật khẩu tạm'}
                </button>
              </form>
            )}

            {forgotMode === 'enter-new-pw' && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                {forgotEmailHint && (
                  <p className="text-slate-400 text-sm">Mật khẩu tạm đã được gửi đến <span className="text-primary font-medium">{forgotEmailHint}</span>. Nhập mật khẩu từ email và đặt mật khẩu mới.</p>
                )}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu tạm (từ email)</label>
                  <input
                    type="text" value={tempPassword}
                    onChange={e => setTempPassword(e.target.value)} required
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập mật khẩu tạm từ email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu mới</label>
                  <input
                    type="password" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} required minLength={6}
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập mật khẩu mới (≥6 ký tự)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Xác nhận mật khẩu mới</label>
                  <input
                    type="password" value={newPasswordConfirm}
                    onChange={e => setNewPasswordConfirm(e.target.value)} required minLength={6}
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <button type="submit" disabled={forgotLoading}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2 disabled:opacity-50">
                  {forgotLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerLoginPage;
