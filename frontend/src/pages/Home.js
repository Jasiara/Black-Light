import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import BusinessCard from '../components/BusinessCard';

export default function Home() {
  const [categories] = useState(['All', 'Food', 'Beauty', 'Retail', 'Services', 'Books']);
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      const res = await apiFetch('/api/businesses/featured');
      setFeatured(res.featured || []);
    }
    fetchFeatured();
  }, []);

  function onSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    if (location) params.append('city', location);
    navigate(`/results?${params.toString()}`);
  }

  return (
    <div>
      <form onSubmit={onSearch} style={{display:'flex', gap:8}}>
        <input placeholder="Search businesses or keywords" value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="City (e.g., Durham)" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <h2 style={{marginTop:20}}>Featured Black-Owned Businesses</h2>
      <div className="grid">
        {featured.map(b => <BusinessCard key={b.id} business={b} />)}
      </div>
    </div>
  );
}