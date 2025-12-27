import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { label: 'Dashboard', path: '/admin/' },
  { label: 'Movies', path: '/admin/movies' },
  { label: 'Genres', path: '/admin/genres' },
  { label: 'User', path: '/admin/user-list' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-slate-900 text-slate-200 flex flex-col p-4">
        <div className="mb-6">
          <Link to="/admin/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-400 text-white font-bold">MV</span>
            <span className="text-lg font-semibold">MovieVault</span>
          </Link>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded-md font-medium ${location.pathname === item.path ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-4">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md bg-transparent border border-slate-700 text-slate-200">Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-visible">
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
          <div>
            <h4 className="text-lg font-semibold">{userName || 'Admin'}</h4>
          </div>
          <div className="flex items-center gap-4">
            <input className="px-3 py-2 rounded-md border" placeholder="Search..." />
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-indigo-600 text-white flex items-center justify-center font-semibold">{(userName || 'A').charAt(0)}</div>
          </div>
        </header>

        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
