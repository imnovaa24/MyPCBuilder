// Shared theme constants and style helpers for Admin panel
export const theme = {
  bg: '#101c22',
  bgGrad: 'radial-gradient(circle at top, rgba(19,164,236,0.18), transparent 28%), linear-gradient(180deg, #08131a 0%, #101c22 48%, #091219 100%)',
  panel: 'rgba(20, 35, 43, 0.88)',
  panelSolid: '#14232b',
  surface: '#1a2c35',
  border: 'rgba(146, 183, 201, 0.16)',
  borderStrong: 'rgba(19, 164, 236, 0.28)',
  primary: '#13a4ec',
  primaryStrong: '#0d8cc8',
  text: '#eef6fb',
  muted: '#92b7c9',
  danger: '#f87171',
  ok: '#4ade80',
  warn: '#f6c760',
  font: "'Space Grotesk', sans-serif",
  inputBg: '#233c48',
  shadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
};

export const inputStyle = {
  padding: '10px 14px',
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  borderRadius: '12px',
  color: theme.text,
  fontFamily: theme.font,
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export const btnPrimary = {
  padding: '10px 20px',
  background: `linear-gradient(135deg, ${theme.primary}, #79d9ff)`,
  color: '#04121a',
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: 700,
  fontFamily: theme.font,
  fontSize: '0.9rem',
  transition: '0.18s ease',
};

export const btnGhost = {
  padding: '10px 20px',
  background: 'rgba(146, 183, 201, 0.08)',
  color: theme.text,
  border: `1px solid ${theme.border}`,
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontFamily: theme.font,
  fontSize: '0.9rem',
  transition: '0.18s ease',
};

export const btnDanger = {
  ...btnGhost,
  color: theme.danger,
  borderColor: 'rgba(248, 113, 113, 0.2)',
  background: 'rgba(248, 113, 113, 0.08)',
};

export function createAxiosPrivate() {
  const axios = require('axios').default;
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Accept': 'application/json',
    },
  });
}
