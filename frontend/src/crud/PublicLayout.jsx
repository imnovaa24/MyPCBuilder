import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

function PublicLayout({ children }) {
  return (
    <div className="bg-[#101c22] min-h-screen font-display text-slate-100 antialiased overflow-x-hidden flex flex-col">
      <PublicNavbar />
      {children}
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
