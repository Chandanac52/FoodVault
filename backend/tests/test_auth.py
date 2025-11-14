import pytest
import json
from app import create_app
from app import mongo

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/test_foodvault'
    
    with app.test_client() as client:
        with app.app_context():
            mongo.db.users.delete_many({})
        yield client

def test_signup_success(client):
    response = client.post('/api/auth/signup', 
                         json={'name': 'Test User', 
                              'email': 'test@example.com', 
                              'password': 'password123'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'user_id' in data

def test_signup_missing_fields(client):
    response = client.post('/api/auth/signup', 
                         json={'name': 'Test User'})
    assert response.status_code == 400

def test_signin_success(client):
   
    client.post('/api/auth/signup', 
               json={'name': 'Test User', 
                    'email': 'test@example.com', 
                    'password': 'password123'})
    
   
    response = client.post('/api/auth/signin', 
                         json={'email': 'test@example.com', 
                              'password': 'password123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data