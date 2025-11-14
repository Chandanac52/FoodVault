from flask import Blueprint, request, jsonify
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    try:
        if request.method == 'OPTIONS':
            return '', 200
            
        data = request.get_json()
        
        if not data or not all(key in data for key in ['name', 'email', 'password']):
            return jsonify({"error": "All fields are required"}), 400
        
        user_id, error = User.create_user(
            data['name'],
            data['email'],
            data['password']
        )
        
        if error:
            return jsonify({"error": error}), 400
        
        return jsonify({"message": "User created successfully", "user_id": user_id}), 201
    
    except Exception as e:
        print(f" Signup error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/signin', methods=['POST', 'OPTIONS'])
def signin():
    try:
        if request.method == 'OPTIONS':
            return '', 200
            
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({"error": "Email and password are required"}), 400
        
        print(f" Signin attempt for email: {data['email']}")
        result, error = User.authenticate_user(data['email'], data['password'])
        
        if error:
            print(f" Authentication failed: {error}")
            return jsonify({"error": error}), 401
        
        print(f" User authenticated: {data['email']}")
        return jsonify(result), 200
    
    except Exception as e:
        print(f" Signin error: {str(e)}")
        return jsonify({"error": str(e)}), 500