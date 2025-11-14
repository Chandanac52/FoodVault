import React, { useState } from 'react';

function RecipeList({ recipes, onDeleteRecipe, onEditRecipe, isPublic = false }) {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  if (!recipes || recipes.length === 0) {
    return null;
  }

  const toggleExpand = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <div className="recipe-header">
            <h3>{recipe.title}</h3>
            {!isPublic && (
              <div className="recipe-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEditRecipe(recipe)}
                  title="Edit recipe"
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteRecipe(recipe._id)}
                  title="Delete recipe"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          <div className="recipe-meta">
            <span className="recipe-category">{recipe.category || 'Uncategorized'}</span>
            <span className="ingredients-count">{recipe.ingredients?.length || 0} Ingredients</span>
          </div>

          {isPublic && (
            <div style={{
              background: '#e8f4fc',
              color: '#0c5460',
              padding: '0.5rem',
              borderRadius: '5px',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid #bee5eb'
            }}>
              Public Recipe
            </div>
          )}

          <div className="recipe-divider"></div>

          <div className="recipe-description">
            {expandedRecipe === recipe._id ? (
              <>
                <h4>Ingredients:</h4>
                <ul className="ingredients-list">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h4>Instructions:</h4>
                <p>{recipe.instructions}</p>
              </>
            ) : (
              <p>
                {recipe.instructions.length > 120 
                  ? `${recipe.instructions.substring(0, 120)}...` 
                  : recipe.instructions
                }
              </p>
            )}
          </div>

          <div className="recipe-footer">
            <button 
              className="view-recipe-btn"
              onClick={() => toggleExpand(recipe._id)}
            >
              {expandedRecipe === recipe._id ? 'Show Less' : 'View Recipe'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;