
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !password) {
      alert('Please enter your username and password.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            membershipId: username.trim(),
            password,
            role: 'Admin'
          })
        }
      );

      const responseText = await response.text();

let data;

try {
  data = JSON.parse(responseText);
} catch (error) {
  console.error('Backend response:', responseText);
  throw new Error('The backend returned HTML instead of JSON. Please check the browser console.');
}

      if (!response.ok) {
        throw new Error(data.message || 'Invalid administrator details.');
      }

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      alert(`Welcome, Administrator ${data.user.name}!`);

      navigate('/');

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>👨‍💼 Administrator Login</h1>
        <p>Sign in to manage the Community Library.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Login as Administrator</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
