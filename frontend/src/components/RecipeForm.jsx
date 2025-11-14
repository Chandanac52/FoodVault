import React, { useState, useEffect } from 'react';

function RecipeForm({ onSubmit, initialData = {}, isEditing = false, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'breakfast'
  });

  
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        ingredients: initialData.ingredients?.join('\n') || '',
        instructions: initialData.instructions || '',
        category: initialData.category || 'breakfast'
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const processedData = {
      ...formData,
      ingredients: formData.ingredients.split('\n')
        .filter(ing => ing.trim())
        .map(ing => ing.trim()),
      category: formData.category || 'breakfast'
    };
    
    console.log('Submitting recipe:', processedData);
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Recipe Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="e.g., Scrambled Eggs"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">
          Ingredients * (one per line)
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter each ingredient on a new line..."

          rows="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions *</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter detailed step-by-step cooking instructions..."
          rows="6"
        />
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={loading}
      >
        {loading ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Add Recipe')}
      </button>
    </form>
  );
}

export default RecipeForm;