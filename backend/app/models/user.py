from flask_pymongo import PyMongo
from app import mongo
import bcrypt
import jwt
import datetime
import os

class User:
    @staticmethod
    def create_user(name, email, password):
        try:
            if mongo.db.users.find_one({"email": email}):
                return None, "User already exists"
            
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            user = {
                "name": name,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.datetime.utcnow()
            }
            
            result = mongo.db.users.insert_one(user)
            print(f" User created: {email}")
            return str(result.inserted_id), None
        
        except Exception as e:
            print(f" Error creating user: {e}")
            return None, str(e)
    
    @staticmethod
    def authenticate_user(email, password):
        try:
            user = mongo.db.users.find_one({"email": email})
            if not user:
                return None, "User not found"
            
            if bcrypt.checkpw(password.encode('utf-8'), user['password']):
                token = jwt.encode({
                    'user_id': str(user['_id']),
                    'email': user['email'],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }, os.getenv('JWT_SECRET'), algorithm='HS256')
                
                return {
                    'token': token,
                    'user': {
                        'id': str(user['_id']),
                        'name': user['name'],
                        'email': user['email']
                    }
                }, None
            
            return None, "Invalid credentials"
        except Exception as e:
            print(f" Authentication error: {e}")
            return None, str(e)