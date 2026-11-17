
import { useState } from 'react';

function Users({ users, setUsers }) {
  const [name, setName] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [role, setRole] = useState('Member');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Add or update a user
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !membershipId.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (!editingUser && (!password || !confirmPassword)) {
      alert('Please enter and confirm a password.');
      return;
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
    }

    const userData = {
      name: name.trim(),
      membership_id: membershipId.trim(),
      role
    };

    if (!editingUser) {
      userData.password = password;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        editingUser
          ? `http://localhost:5000/api/users/${editingUser.id}`
          : 'http://localhost:5000/api/users',
        {
          method: editingUser ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      if (editingUser) {
        setUsers(users.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                name: userData.name,
                membershipId: userData.membership_id,
                role
              }
            : user
        ));
      } else {
        setUsers([...users, {
          id: data.userId,
          name: userData.name,
          membershipId: userData.membership_id,
          role
        }]);
      }

      alert(data.message);

      setName('');
      setMembershipId('');
      setRole('Member');
      setPassword('');
      setConfirmPassword('');
      setEditingUser(null);

    } catch (error) {
      alert(error.message);
    }
  }

  // Edit a user
  function handleEdit(user) {
    setEditingUser(user);
    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);
    setPassword('');
    setConfirmPassword('');
  }

  // Delete a user
  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:5000/api/users/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete user.');
        }

        setUsers(users.filter(user => user.id !== id));

        alert(data.message);

      } catch (error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="main-content">
      <h1>User Management</h1>
      <p>Add, update and manage library members.</p>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>

      <h2>Registered Users</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.membershipId}</td>
              <td>{user.role}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="4">No users registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
