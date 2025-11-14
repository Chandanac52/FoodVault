import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import RecipeForm from '../components/RecipeForm';

function EditRecipe() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      console.log('Fetching recipe for editing:', id);
      const response = await recipesAPI.getById(id);
      setRecipe(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Failed to load recipe. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (recipeData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Updating recipe:', id, recipeData);
      await recipesAPI.update(id, recipeData);
      console.log('Recipe updated successfully');
      navigate('/');
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(err.response?.data?.error || 'Failed to update recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="auth-container">
        <div className="loading">Loading recipe...</div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="auth-container">
        <div className="error-message">
          {error}
          <button 
            onClick={() => navigate('/')}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div>
        {error && <div className="error-message">{error}</div>}
        <RecipeForm 
          onSubmit={handleSubmit} 
          initialData={recipe}
          isEditing={true}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default EditRecipe;