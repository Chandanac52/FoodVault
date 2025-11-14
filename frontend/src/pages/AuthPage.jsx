import React, { useState } from 'react';
import { authAPI } from '../services/api';

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isSignUp) {
        console.log('Creating account...', formData);
        response = await authAPI.signup(formData);
        console.log('Account created:', response.data);
        
        
        console.log('Auto-signing in after account creation...');
        const signinResponse = await authAPI.signin({
          email: formData.email,
          password: formData.password
        });
        
        if (signinResponse.data.token) {
          localStorage.setItem('token', signinResponse.data.token);
          localStorage.setItem('user', JSON.stringify(signinResponse.data.user));
          console.log('Auto-signin successful, redirecting to home...');
          window.location.href = '/';
        }
        
      } else {
        console.log('Signing in...', { email: formData.email });
        response = await authAPI.signin({
          email: formData.email,
          password: formData.password
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('Signin successful, redirecting to home...');
          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    background: '#f8f9fa'
  };

  
  const formStyle = {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px'
  };

  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0'
  };

  
  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#f97415',
    margin: '0 0 0.5rem 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  };

  // Subtitle style
  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#666',
    margin: '0 0 1rem 0',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* FoodVault Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>FoodVault</h1>
          <p style={subtitleStyle}>
            {isSignUp ? 'Create Your Personal Recipe Collection' : 'Access Your Recipe Collection'}
          </p>
          <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
            {isSignUp 
              ? 'Join FoodVault to save and manage your personal recipes' 
              : 'Sign in to access your personal recipe collection'
            }
          </p>
        </div>
        
        {error && (
          <div className="error-message" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}
        
        {isSignUp && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your password"
            minLength="6"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        <div className="toggle-auth">
          <button 
            type="button"
            onClick={switchTab}
            disabled={loading}
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Privacy note */}
        <div style={{
          background: '#e8f4fc',
          border: '1px solid #bee5eb',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#0c5460',
          fontSize: '0.9rem'
        }}>
          <strong>Your recipes are private</strong> - Only you can see and manage your personal recipe collection
        </div>
      </form>
    </div>
  );
}

export default AuthPage;