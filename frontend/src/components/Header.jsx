import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    
    window.location.href = '/auth';
    
    
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          FoodVault
        </Link>
        <div className="nav-links">
          <span style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '0.9rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.4rem 0.8rem',
            borderRadius: '5px'
          }}>
            {user.name || user.email}
          </span>
          <Link to="/">All Recipes</Link>
          <Link to="/my-recipes">My Recipes</Link>
          <Link to="/add-recipe">Add Recipe</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;