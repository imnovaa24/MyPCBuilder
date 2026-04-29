import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, btnDanger } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

function AdminUsersTab({ setActiveTab }) {
  const [users, setUsers] = useState([]);

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
  });

  const fetchUsers = () => {
    axiosPrivate.get('/users')
      .then(response => setUsers(response.data.data))
      .catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteUser = (id, email) => {
    if (window.confirm(`Xóa tài khoản "${email}"?`)) {
      axiosPrivate.delete(`/users/${id}`)
        .then(() => {
          setUsers(users.filter(u => u.id !== id));
          alert('Đã xóa tài khoản!');
        })
        .catch(err => {
          const msg = err.response?.data?.message || 'Lỗi khi xóa!';
          alert(msg);
        });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontFamily: theme.font, fontSize: '0.88rem', padding: 0 }}>Tổng quan</button>
        <span style={{ color: theme.muted }}>/</span>
        <span style={{ color: theme.text, fontWeight: 600, fontSize: '0.88rem' }}>Tài Khoản User</span>
      </div>

      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: 22 }}>person</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Quản Lý Tài Khoản User</h2>
          <span style={{ marginLeft: 'auto', color: theme.muted, fontSize: '0.85rem' }}>{users.length} tài khoản</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['ID', 'Username', 'Email', 'Vai trò', 'Ngày tạo'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
                <th style={{ padding: '12px 14px', textAlign: 'center', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: theme.muted }}>Chưa có tài khoản nào.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '14px', color: theme.muted }}>{u.id}</td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{u.username}</td>
                  <td style={{ padding: '14px', color: theme.muted }}>{u.email}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                      background: u.role === 'manager' ? 'rgba(74,222,128,0.15)' : 'rgba(56,189,248,0.15)',
                      color: u.role === 'manager' ? theme.ok : '#38bdf8',
                    }}>
                      {u.role === 'manager' ? 'Manager' : 'User'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: theme.muted, fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteUser(u.id, u.email)} style={{ ...btnDanger, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminUsersTab;
