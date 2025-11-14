from flask import Blueprint, request, jsonify
from app.models.recipe import Recipe
from app.utils.auth import token_required
from app import mongo

recipes_bp = Blueprint('recipes', __name__)


@recipes_bp.route('/public', methods=['GET', 'OPTIONS'])
def get_public_recipes():
    try:
        print("Fetching all public recipes")
        recipes = mongo.db.recipes.find().sort("created_at", -1)
        recipe_list = []
        for recipe in recipes:
            recipe['_id'] = str(recipe['_id'])
            
            if 'user_id' in recipe:
                del recipe['user_id']
            recipe_list.append(recipe)
        print(f"Found {len(recipe_list)} public recipes")
        return jsonify(recipe_list), 200
    except Exception as e:
        print(f"Error fetching public recipes: {str(e)}")
        return jsonify({"error": "Failed to fetch recipes"}), 500


@recipes_bp.route('/my-recipes', methods=['GET', 'OPTIONS'])
@token_required
def get_my_recipes(current_user):
    try:
        print(f"Fetching recipes for user: {current_user['user_id']}")
        recipes = Recipe.get_user_recipes(current_user['user_id'])
        print(f"Found {len(recipes)} recipes for user {current_user['user_id']}")
        return jsonify(recipes), 200
    except Exception as e:
        print(f"Error fetching user recipes: {str(e)}")
        return jsonify({"error": "Failed to fetch recipes"}), 500


@recipes_bp.route('/', methods=['POST', 'OPTIONS'])
@token_required
def create_recipe(current_user):
    try:
        data = request.get_json()
        print(f"Creating recipe for user: {current_user['user_id']}")
        
        if request.method == 'OPTIONS':
            return '', 200
            
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        
        required_fields = ['title', 'ingredients', 'instructions']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        
        ingredients = data['ingredients']
        if isinstance(ingredients, str):
            ingredients = [ing.strip() for ing in ingredients.split('\n') if ing.strip()]
        
        
        if not ingredients:
            return jsonify({"error": "Ingredients cannot be empty"}), 400
        
        recipe_id = Recipe.create_recipe(
            data['title'],
            ingredients,
            data['instructions'],
            current_user['user_id'],
            data.get('category', 'breakfast')
        )
        
        print(f"Recipe created successfully with ID: {recipe_id} for user: {current_user['user_id']}")
        return jsonify({
            "message": "Recipe created successfully", 
            "recipe_id": recipe_id
        }), 201
    
    except Exception as e:
        print(f"Error creating recipe: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to create recipe: {str(e)}"}), 500


@recipes_bp.route('/<recipe_id>', methods=['GET', 'OPTIONS'])
@token_required
def get_recipe(current_user, recipe_id):
    try:
        if request.method == 'OPTIONS':
            return '', 200
            
        recipe = Recipe.get_recipe_by_id(recipe_id, current_user['user_id'])
        
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404
        
        return jsonify(recipe), 200
    except Exception as e:
        print(f"Error fetching recipe: {str(e)}")
        return jsonify({"error": "Failed to fetch recipe"}), 500


@recipes_bp.route('/<recipe_id>', methods=['PUT', 'OPTIONS'])
@token_required
def update_recipe(current_user, recipe_id):
    try:
        if request.method == 'OPTIONS':
            return '', 0
            
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'ingredients' in data:
            update_data['ingredients'] = data['ingredients']
        if 'instructions' in data:
            update_data['instructions'] = data['instructions']
        if 'category' in data:
            update_data['category'] = data['category']
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        success = Recipe.update_recipe(recipe_id, current_user['user_id'], update_data)
        
        if not success:
            return jsonify({"error": "Recipe not found or update failed"}), 404
        
        return jsonify({"message": "Recipe updated successfully"}), 200
    except Exception as e:
        print(f"Error updating recipe: {str(e)}")
        return jsonify({"error": "Failed to update recipe"}), 500


@recipes_bp.route('/<recipe_id>', methods=['DELETE', 'OPTIONS'])
@token_required
def delete_recipe(current_user, recipe_id):
    try:
        if request.method == 'OPTIONS':
            return '', 200
            
        success = Recipe.delete_recipe(recipe_id, current_user['user_id'])
        
        if not success:
            return jsonify({"error": "Recipe not found"}), 404
        
        return jsonify({"message": "Recipe deleted successfully"}), 200
    except Exception as e:
        print(f" Error deleting recipe: {str(e)}")
        return jsonify({"error": "Failed to delete recipe"}), 500