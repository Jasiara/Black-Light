import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '../api';
import BusinessCard from '../components/BusinessCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Results() {
  const q = useQuery();
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      const params = {};
      if (q.get('q')) params.q = q.get('q');
      if (q.get('category')) params.category = q.get('category');
      if (q.get('city')) params.city = q.get('city');
      const qs = new URLSearchParams(params).toString();
      const res = await apiFetch(`/api/businesses?${qs}`);
      setResults(res.businesses || []);
    }
    fetchResults();
  }, [q]);

  return (
    <div>
      <h2>Search Results</h2>
      <div className="grid">
        {results.map(b => <BusinessCard key={b.id} business={b} />)}
      </div>
    </div>
  );
}