import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import RecipeList from '../components/RecipeList';

function PublicRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  const fetchPublicRecipes = async () => {
    try {
      console.log('Fetching public recipes...');
      const response = await recipesAPI.getPublic();
      console.log('Public recipes fetched:', response.data);
      setRecipes(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching public recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div style={backgroundStyle}>
        <div className="home-container">
          <div className="loading">Loading recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="home-container">
        {/* Hero Section */}
        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>All Recipes</h1>
          <p style={heroSubtitleStyle}>Discover recipes from FoodVault community</p>
          <p style={{ 
            color: '#666', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6',
            fontSize: '1.1rem'
          }}>
            Browse through delicious recipes shared by our community. 
            Get inspired and try something new today!
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '1.8rem' }}>
            All Recipes
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/my-recipes" className="add-recipe-btn" style={{ background: '#3498db' }}>
              My Recipes
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
              onClick={fetchPublicRecipes} 
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Retry
            </button>
          </div>
        )}

        {recipes.length === 0 && !error ? (
          <div className="empty-state">
            <h3>No recipes shared yet!</h3>
            <p>Be the first to share a recipe with the community.</p>
            <Link to="/add-recipe" className="add-recipe-btn" style={{ marginTop: '1rem' }}>
              Share Your First Recipe
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
              Viewing <strong>{recipes.length}</strong> recipe{recipes.length !== 1 ? 's' : ''} from the community
              <br />
              <small style={{ color: '#f97415', fontWeight: '500' }}>
                You can view these recipes but only edit your own in "My Recipes"
              </small>
            </div>
            <RecipeList 
              recipes={recipes} 
              onDeleteRecipe={null}
              onEditRecipe={null}
              isPublic={true}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default PublicRecipes;