import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api';

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    async function fetch() {
      const res = await apiFetch(`/api/businesses/${id}`);
      setBusiness(res.business);
    }
    fetch();
  }, [id]);

  if (!business) return <div>Loading...</div>;

  return (
    <div>
      <h2>{business.name}</h2>
      <p><strong>Category:</strong> {business.category}</p>
      <p><strong>Address:</strong> {business.address}, {business.city}, {business.state} {business.zip}</p>
      <p>{business.description}</p>
      <p><strong>Phone:</strong> {business.phone}</p>
      <p><a href={business.website} target="_blank" rel="noreferrer">{business.website}</a></p>

      {business.latitude && business.longitude && (
        <div style={{width: '100%', height: 400, marginTop:16}}>
          {/* Map placeholder - integrate Google Maps JS using REACT_APP_GOOGLE_MAPS_API_KEY */}
          <div style={{width:'100%', height:'100%', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
            Map placeholder (lat: {business.latitude}, lon: {business.longitude})
          </div>
        </div>
      )}
    </div>
  );
}