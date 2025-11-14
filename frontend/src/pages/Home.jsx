import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import RecipeList from '../components/RecipeList';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      console.log('Fetching my recipes for user:', currentUser.email);
      const response = await recipesAPI.getMyRecipes();
      console.log('My recipes fetched:', response.data);
      setRecipes(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching my recipes:', err);
      setError('Failed to fetch your recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipesAPI.delete(recipeId);
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
      } catch (err) {
        setError('Failed to delete recipe');
      }
    }
  };

  const handleEditRecipe = (recipe) => {
    console.log('Editing recipe:', recipe);
    navigate(`/edit-recipe/${recipe._id}`);
  };

  
  const backgroundStyle = {
    minHeight: 'calc(100vh - 80px)',
    background: `
      linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.90)),
      url('https://static.vecteezy.com/system/resources/previews/033/692/644/non_2x/chef-preparing-food-in-the-kitchen-at-the-restaurant-professional-chef-cooking-gourmet-chef-cooking-in-a-commercial-kitchen-ai-generated-free-photo.jpg') 
      center/cover
    `,
    backgroundAttachment: 'fixed',
    position: 'relative'
  };

  // Hero section style
  const heroStyle = {
    textAlign: 'center',
    padding: '2rem 0 3rem 0',
    marginBottom: '2rem'
  };

  const heroTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  };

  const heroSubtitleStyle = {
    fontSize: '1.2rem',
    color: '#f97415',
    fontWeight: '500',
    marginBottom: '1rem'
  };

  // User welcome style
  const userWelcomeStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem',
    border: '2px solid #f97415',
    textAlign: 'center'
  };

  if (loading) {
    return (
      <div style={backgroundStyle}>
        <div className="home-container">
          <div className="loading">Loading your recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="home-container">
        {/* Hero Section */}
        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>My Recipe Collection</h1>
          <p style={heroSubtitleStyle}>Your Personal Recipes</p>
        </div>

        {/* User Welcome Section */}
        <div style={userWelcomeStyle}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#2c3e50',
            fontSize: '1.4rem'
          }}>
            Welcome, {currentUser.name || 'Chef'}!
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: '1rem'
          }}>
            Manage your personal recipes here. Only you can edit or delete these recipes.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '1.8rem' }}>
            My Recipes
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" className="add-recipe-btn" style={{ background: '#3498db' }}>
              All Recipes
            </Link>
            <Link to="/add-recipe" className="add-recipe-btn">
              Add Recipe
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={fetchMyRecipes} 
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Retry
            </button>
          </div>
        )}

        {recipes.length === 0 && !error ? (
          <div className="empty-state">
            <h3>No recipes in your collection yet!</h3>
            <p>Start building your personal recipe collection by adding your first recipe.</p>
            <p style={{ color: '#f97415', fontWeight: '500', margin: '0.5rem 0' }}>
              You can edit and delete your recipes here
            </p>
            <Link to="/add-recipe" className="add-recipe-btn" style={{ marginTop: '1rem' }}>
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '1rem', 
              color: '#666',
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.8)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              You have <strong>{recipes.length}</strong> recipe{recipes.length !== 1 ? 's' : ''} in your collection
              <br />
              <small style={{ color: '#27ae60', fontWeight: '500' }}>
                You can edit and delete your recipes here
              </small>
            </div>
            <RecipeList 
              recipes={recipes} 
              onDeleteRecipe={handleDeleteRecipe}
              onEditRecipe={handleEditRecipe}
              isPublic={false}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;