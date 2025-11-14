import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function fetchPending() {
      const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/pending', {
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': '' },
        credentials: 'include'
      });
      const data = await res.json();
      setPending(data.pending || []);
    }
    fetchPending();
  }, []);

  async function approve(id) {
    const secret = prompt('Enter admin secret (for demo)');
    const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/approve/' + id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
      credentials: 'include'
    });
    const data = await res.json();
    if (data.ok) {
      alert('Approved');
      setPending(p => p.filter(x => x.id !== id));
    } else alert(data.error || 'Error');
  }

  return (
    <div>
      <h2>Admin - Pending Businesses</h2>
      {pending.length === 0 && <p>No pending submissions or you need to provide admin secret.</p>}
      <ul>
        {pending.map(b => (
          <li key={b.id}>
            <strong>{b.name}</strong> - {b.city}
            <button onClick={() => approve(b.id)} style={{marginLeft:8}}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}