from flask_pymongo import PyMongo
from app import mongo
from bson.objectid import ObjectId
import datetime

class Recipe:
    @staticmethod
    def create_recipe(title, ingredients, instructions, user_id, category="main-course"):
        recipe = {
            "title": title,
            "ingredients": ingredients,
            "instructions": instructions,
            "category": category,
            "user_id": user_id,
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        }
        
        result = mongo.db.recipes.insert_one(recipe)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_recipes(user_id):
        recipes = mongo.db.recipes.find({"user_id": user_id}).sort("created_at", -1)
        recipe_list = []
        for recipe in recipes:
            recipe['_id'] = str(recipe['_id'])
            recipe_list.append(recipe)
        return recipe_list
    
    @staticmethod
    def get_recipe_by_id(recipe_id, user_id):
        try:
            recipe = mongo.db.recipes.find_one({"_id": ObjectId(recipe_id), "user_id": user_id})
            if recipe:
                recipe['_id'] = str(recipe['_id'])
            return recipe
        except:
            return None
    
    @staticmethod
    def update_recipe(recipe_id, user_id, update_data):
        update_data['updated_at'] = datetime.datetime.utcnow()
        try:
            result = mongo.db.recipes.update_one(
                {"_id": ObjectId(recipe_id), "user_id": user_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except:
            return False
    
    @staticmethod
    def delete_recipe(recipe_id, user_id):
        try:
            result = mongo.db.recipes.delete_one({"_id": ObjectId(recipe_id), "user_id": user_id})
            return result.deleted_count > 0
        except:
            return False