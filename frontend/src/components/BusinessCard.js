import React from 'react';
import { Link } from 'react-router-dom';
export default function BusinessCard({ business }) {
  return (
    <div className="card">
      <div style={{height:140, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {business.image_url ? <img src={business.image_url} alt="" style={{maxHeight:130}}/> : '📍'}
      </div>
      <h3><Link to={'/business/' + business.id}>{business.name}</Link></h3>
      <p>{business.category} • {business.city}</p>
    </div>
  );
}