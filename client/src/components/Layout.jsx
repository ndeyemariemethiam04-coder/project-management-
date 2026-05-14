import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Timer, LogOut, User, Menu } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Pomodoro', path: '/pomodoro', icon: <Timer size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '80px' : '260px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>FlowState</h2>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 12px',
                color: location.pathname === item.path ? 'var(--text-main)' : 'var(--text-muted)',
                background: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderRadius: 'var(--radius)',
                textDecoration: 'none',
                marginBottom: '4px',
                fontWeight: location.pathname === item.path ? '600' : '400',
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '20px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              color: '#ef4444',
              background: 'transparent',
              marginTop: '8px'
            }}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        <Outlet />
      </main>
    </div>
  );
}
