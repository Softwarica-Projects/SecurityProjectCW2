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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          width: '220px',
          backgroundColor: '#212529',
          padding: '20px 0',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h4 className="text-white text-center mb-4">MovieVault</h4>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="d-block px-4 py-2 mb-2"
                  style={{
                    color: location.pathname === item.path ? '#fff' : '#adb5bd',
                    background: location.pathname === item.path ? '#343a40' : 'transparent',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <Navbar variant="dark" expand="lg" style={{ backgroundColor: '#212529', flexShrink: 0 }}>
          <Container fluid>
            <Navbar.Brand>{userName || 'Admin Dashboard'}</Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link href="/" className="text-white">
                Home
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
