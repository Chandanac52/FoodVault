import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import RecipeForm from '../components/RecipeForm';

function AddRecipe() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (recipeData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Creating recipe:', recipeData);
      const response = await recipesAPI.create(recipeData);
      console.log('Recipe created:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError(err.response?.data?.error || 'Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div>
        {error && <div className="error-message">{error}</div>}
        <RecipeForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

export default AddRecipe;