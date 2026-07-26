import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PublicNavbar() {
  const isAdmin = !!localStorage.getItem('adminToken');
  const adminRole = localStorage.getItem('adminRole');
  const isCustomer = !!localStorage.getItem('customerToken');
  const isLoggedIn = isAdmin || isCustomer;
  const navigate = useNavigate();

  // Lấy tên user hiện tại
  const getUserName = () => {
    if (isAdmin) {
      try {
        const u = JSON.parse(localStorage.getItem('adminUser'));
        return u?.username || 'Admin';
      } catch { return 'Admin'; }
    }
    if (isCustomer) {
      try {
        const u = JSON.parse(localStorage.getItem('customerUser'));
        return u?.username || 'User';
      } catch { return 'User'; }
    }
    return '';
  };
  const displayName = getUserName();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', email: '', date_of_birth: '', phone: '', address: '' });
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const menuRef = useRef(null);

  // Click outside to close menu
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminUser');
    }
    if (isCustomer) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
    }
    setShowUserMenu(false);
    navigate('/');
    window.location.reload();
  };

  const getAuthToken = () => localStorage.getItem('adminToken') || localStorage.getItem('customerToken');

  const openProfileModal = () => {
    setShowUserMenu(false);
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    setShowProfileModal(true);

    const token = getAuthToken();
    axios.get('http://127.0.0.1:8000/api/me', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
      .then(res => {
        const u = res.data.user;
        setProfileForm({
          username: u.username || '',
          email: u.email || '',
          date_of_birth: u.date_of_birth || '',
          phone: u.phone || '',
          address: u.address || '',
        });
        setProfileAvatarPreview(u.avatar ? `http://127.0.0.1:8000${u.avatar}` : '');
      })
      .catch(() => setProfileError('Không thể tải thông tin!'))
      .finally(() => setProfileLoading(false));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const token = getAuthToken();
    axios.put('http://127.0.0.1:8000/api/profile', profileForm, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
      .then(res => {
        setProfileSuccess('Cập nhật thông tin thành công!');
        const updatedUser = res.data.user;
        if (isAdmin) localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        if (isCustomer) localStorage.setItem('customerUser', JSON.stringify(updatedUser));
        setTimeout(() => setProfileSuccess(''), 2000);
      })
      .catch(err => setProfileError(err.response?.data?.message || 'Có lỗi xảy ra!'))
      .finally(() => setProfileLoading(false));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setProfileError('Chỉ chấp nhận file PNG hoặc JPEG!');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > 2000 || img.height > 2000) {
        setProfileError('Ảnh tối đa 2000x2000 pixel!');
        return;
      }
      setProfileAvatar(file);
      setProfileAvatarPreview(URL.createObjectURL(file));
      setProfileError('');

      // Upload immediately
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const token = getAuthToken();
      axios.post('http://127.0.0.1:8000/api/profile/avatar', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
      })
        .then(res => {
          setProfileAvatarPreview(`http://127.0.0.1:8000${res.data.avatar_url}`);
          const updatedUser = res.data.user;
          if (isAdmin) localStorage.setItem('adminUser', JSON.stringify(updatedUser));
          if (isCustomer) localStorage.setItem('customerUser', JSON.stringify(updatedUser));
          setProfileSuccess('Cập nhật avatar thành công!');
          setTimeout(() => setProfileSuccess(''), 2000);
        })
        .catch(err => setProfileError(err.response?.data?.message || 'Lỗi upload avatar!'))
        .finally(() => setAvatarLoading(false));
    };
    img.src = URL.createObjectURL(file);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      setPwError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setPwLoading(true);
    const token = getAuthToken();
    axios.post('http://127.0.0.1:8000/api/change-password', pwForm, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
      .then(() => {
        setPwSuccess('Đổi mật khẩu thành công!');
        setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        setTimeout(() => { setShowPasswordModal(false); setPwSuccess(''); }, 1500);
      })
      .catch(err => {
        setPwError(err.response?.data?.message || 'Có lỗi xảy ra!');
      })
      .finally(() => setPwLoading(false));
  };

  return (
    <>
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark/80 backdrop-blur-md px-4 py-3 lg:px-10">
      <div className="flex items-center gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-3 text-white no-underline">
          <div className="size-6 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PC Builder Pro</h2>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" end className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Trang chủ</NavLink>
          {!isCustomer && (
            <>
              <NavLink to="/builder" className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Xây dựng cấu hình</NavLink>
              <NavLink to="/recommend-build" className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Xây dựng theo yêu cầu</NavLink>
            </>
          )}
          {isCustomer && (
            <>
              <NavLink to="/builder" className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Xây dựng cấu hình</NavLink>
              <NavLink to="/recommend-build" className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Xây dựng theo yêu cầu</NavLink>
              <NavLink to="/my-builds" className={({isActive}) => `text-sm font-medium leading-normal transition-colors no-underline ${isActive ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>Cấu hình của tôi</NavLink>
            </>
          )}
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-3 lg:gap-4">
        <Link to="/builder" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] no-underline">
          <span className="material-symbols-outlined text-[18px] mr-2">build</span>
          <span className="truncate">Start Building</span>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="flex items-center justify-center rounded-lg h-10 px-4 bg-surface-dark border border-border-dark text-white text-sm font-bold hover:bg-surface-dark/80 transition-colors no-underline">
            <span className="material-symbols-outlined text-[18px] mr-2">admin_panel_settings</span>
            Quản lý
          </Link>
        )}
        {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-surface-dark border border-border-dark text-white text-sm font-bold hover:bg-surface-dark/80 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">account_circle</span>
              <span className="hidden sm:inline">{displayName}</span>
              <span className="material-symbols-outlined text-[16px] ml-1">{showUserMenu ? 'expand_less' : 'expand_more'}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-52 rounded-xl border border-border-dark bg-[#1a2c35] shadow-2xl overflow-hidden z-50">
                <button
                  onClick={openProfileModal}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-[#233c48] transition-colors cursor-pointer bg-transparent border-none text-left font-medium"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  Thông tin cá nhân
                </button>
                <div className="border-t border-border-dark"></div>
                <button
                  onClick={() => { setShowUserMenu(false); setShowPasswordModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-[#233c48] transition-colors cursor-pointer bg-transparent border-none text-left font-medium"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                  Đổi mật khẩu
                </button>
                <div className="border-t border-border-dark"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#233c48] transition-colors cursor-pointer bg-transparent border-none text-left font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/register" className="flex items-center justify-center rounded-lg h-10 px-4 bg-surface-dark border border-border-dark text-white text-sm font-bold hover:bg-surface-dark/80 transition-colors no-underline">
            <span className="material-symbols-outlined text-[18px] mr-2">person_add</span>
            <span className="hidden sm:inline">Đăng ký</span>
          </Link>
        )}
      </div>
    </header>

    {/* Modal đổi mật khẩu */}
    {showPasswordModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}>
        <div className="w-full max-w-md bg-[#1a2c35] rounded-2xl border border-[#233c48] shadow-2xl p-8" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">lock</span>
              <h2 className="text-xl font-bold text-white">Đổi Mật Khẩu</h2>
            </div>
            <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {pwError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {pwSuccess}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu hiện tại</label>
              <input
                type="password" value={pwForm.current_password}
                onChange={e => setPwForm({...pwForm, current_password: e.target.value})} required
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Mật khẩu mới</label>
              <input
                type="password" value={pwForm.new_password}
                onChange={e => setPwForm({...pwForm, new_password: e.target.value})} required minLength={6}
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Nhập mật khẩu mới (≥6 ký tự)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Xác nhận mật khẩu mới</label>
              <input
                type="password" value={pwForm.new_password_confirmation}
                onChange={e => setPwForm({...pwForm, new_password_confirmation: e.target.value})} required minLength={6}
                className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <button type="submit" disabled={pwLoading} className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2 disabled:opacity-50">
              {pwLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
            </button>
          </form>
        </div>
      </div>
    )}
    {/* Modal thông tin cá nhân */}
    {showProfileModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}>
        <div className="w-full max-w-lg bg-[#1a2c35] rounded-2xl border border-[#233c48] shadow-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">person</span>
              <h2 className="text-xl font-bold text-white">Thông Tin Cá Nhân</h2>
            </div>
            <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {profileError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {profileSuccess}
            </div>
          )}
          {profileLoading && !profileForm.username ? (
            <div className="text-center text-slate-400 py-8">Đang tải...</div>
          ) : (
            <>
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-3 bg-[#233c48] flex items-center justify-center">
                  {profileAvatarPreview ? (
                    <img src={profileAvatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-500">account_circle</span>
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#233c48] border border-[#233c48] hover:border-primary text-sm text-slate-300 cursor-pointer transition-all">
                  <span className="material-symbols-outlined text-[18px] text-primary">upload</span>
                  {avatarLoading ? 'Đang tải...' : 'Đổi ảnh đại diện'}
                  <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatarChange} className="hidden" disabled={avatarLoading} />
                </label>
                <p className="text-xs text-slate-500 mt-1">PNG/JPEG, tối đa 2000x2000px</p>
              </div>
              {/* Form */}
              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Tên người dùng</label>
                  <input
                    type="text" value={profileForm.username}
                    onChange={e => setProfileForm({...profileForm, username: e.target.value})} required
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập tên"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
                  <input
                    type="email" value={profileForm.email}
                    onChange={e => setProfileForm({...profileForm, email: e.target.value})} required
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Ngày sinh</label>
                  <input
                    type="date" value={profileForm.date_of_birth}
                    onChange={e => setProfileForm({...profileForm, date_of_birth: e.target.value})}
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Số điện thoại</label>
                  <input
                    type="text" value={profileForm.phone}
                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Địa chỉ</label>
                  <input
                    type="text" value={profileForm.address}
                    onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                    className="w-full bg-[#233c48] border border-[#233c48] rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                <button type="submit" disabled={profileLoading} className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-lg shadow-primary/20 border-none cursor-pointer mt-2 disabled:opacity-50">
                  {profileLoading ? 'Đang lưu...' : 'Lưu Thông Tin'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
}

export default PublicNavbar;
