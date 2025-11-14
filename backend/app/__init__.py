from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    
    
    load_dotenv()
    
   
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.config['JWT_SECRET'] = os.getenv('JWT_SECRET')
    
    
    CORS(app, 
         resources={
             r"/api/*": {
                 "origins": "http://localhost:3000",
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
                 "supports_credentials": True
             }
         })
    
    
    mongo.init_app(app)
    
    
    from app.routes.auth import auth_bp
    from app.routes.recipes import recipes_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(recipes_bp, url_prefix='/api/recipes')
    
    return app