import React, { useState } from 'react';

export default function AddBusiness() {
  const [form, setForm] = useState({});
  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    // send as multipart/form-data
    const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/businesses', {
      method: 'POST',
      credentials: 'include',
      body: fd
    });
    const data = await res.json();
    if (data.business) alert('Submitted for admin approval');
    else alert(data.error || 'Error');
  }
  return (
    <div>
      <h2>Add Business</h2>
      <form onSubmit={submit} encType="multipart/form-data">
        <input placeholder="Name" onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Category" onChange={e=>setForm({...form, category:e.target.value})} />
        <input placeholder="City" onChange={e=>setForm({...form, city:e.target.value})} />
        <input placeholder="State" onChange={e=>setForm({...form, state:e.target.value})} />
        <input placeholder="Latitude" onChange={e=>setForm({...form, latitude:e.target.value})} />
        <input placeholder="Longitude" onChange={e=>setForm({...form, longitude:e.target.value})} />
        <textarea placeholder="Description" onChange={e=>setForm({...form, description:e.target.value})} />
        <input type="file" onChange={e=>setForm({...form, image: e.target.files[0]})} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}