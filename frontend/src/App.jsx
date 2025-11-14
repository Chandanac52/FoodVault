import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import PublicRecipes from './pages/PublicRecipes';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Header from './components/Header';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header />}
        <Routes>
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <PublicRecipes /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/my-recipes" 
            element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/add-recipe" 
            element={isAuthenticated ? <AddRecipe /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/edit-recipe/:id" 
            element={isAuthenticated ? <EditRecipe /> : <Navigate to="/auth" replace />} 
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;