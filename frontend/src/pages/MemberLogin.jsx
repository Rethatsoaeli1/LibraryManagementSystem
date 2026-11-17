
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MemberLogin() {
  const navigate = useNavigate();

  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!membershipId.trim() || !password) {
      alert('Please enter your Membership ID and password.');
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
            membershipId: membershipId.trim(),
            password,
            role: 'Member'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid Membership ID or password.');
      }

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      alert(`Welcome back, ${data.user.name}!`);

      navigate('/');

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>👤 Member Login</h1>
        <p>Welcome back to Community Library.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Membership ID"
            value={membershipId}
            onChange={e => setMembershipId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Login as Member</button>
        </form>
      </div>
    </div>
  );
}

export default MemberLogin;
