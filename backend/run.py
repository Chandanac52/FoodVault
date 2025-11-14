from app import create_app, mongo

app = create_app()

@app.before_request
def handle_options():
    from flask import request
    if request.method == 'OPTIONS':
        return '', 200

@app.route('/')
def home():
    return "FoodVault Backend is running!"

if __name__ == '__main__':
    with app.app_context():
        try:
            
            mongo.db.command('ping')
            print("MongoDB connected successfully!")
            print(f"Database: {mongo.db.name}")
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
    
    print(" Starting FoodVault Backend Server...")
    print(" Server running on http://localhost:5000")
    print(" Debug mode: ON")
    app.run(debug=True, port=5000, host='0.0.0.0')