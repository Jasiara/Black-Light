import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import BusinessDetail from './pages/BusinessDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBusiness from './pages/AddBusiness';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/"><h1>Black Light</h1></Link>
        <nav>
          <Link to="/add">Add Business</Link> | <Link to="/admin">Admin</Link> | <Link to="/login">Login</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<AddBusiness />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}