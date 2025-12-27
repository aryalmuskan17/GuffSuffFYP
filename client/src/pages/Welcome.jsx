import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Welcome = () => {
  const { user, logout } = useContext(UserContext);

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Welcome, {user.username}!</h1>
      <p style={{ fontSize: '1.2em', color: '#555' }}>
        Your current role is: <strong>{user.role}</strong>
      </p>

      <button 
        onClick={logout} 
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Welcome;