
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    navigate('/login');
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <h2>📚 Community Library</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/" className="sidebar-link">
          <span>🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/books" className="sidebar-link">
          <span>📖</span>
          Book Management
        </NavLink>

        <NavLink to="/transactions" className="sidebar-link">
          <span>🔄</span>
          Transactions
        </NavLink>

        <NavLink to="/users" className="sidebar-link">
          <span>👥</span>
          User Management
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>

        <p>© 2026 Community Library</p>

      </div>

    </aside>
  );
}

export default Sidebar;
