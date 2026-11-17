
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h1>📚 Community Library</h1>
        <p>Welcome to our Library Management System</p>

        <h2>Choose Your Login</h2>

        <div className="login-options">

          <Link to="/admin-login" className="login-option">
            <span>👨‍💼</span>
            <h3>Administrator Login</h3>
            <p>Access library management features</p>
          </Link>

          <Link to="/member-login" className="login-option">
            <span>👤</span>
            <h3>Member Login</h3>
            <p>Access your library account</p>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Login;
