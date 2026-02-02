import React, { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './home.css';

function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        navigate('/dashboard');
      } else {
        alert('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
      setUsername('');
      setPassword('');
    }, 500);
  };

  return (
    <div className="home-container">
      {/* Login Section */}
      <section className="login-section">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-header">
            <FaLock className="login-icon" />
            <h1>Admin Login</h1>
            <p className="login-subtitle">Access the Landslide Detection & Monitoring System</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
                disabled={isLoading}
              />
            </div>
            
            <motion.button
              type="submit"
              className="login-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
          
          <div className="login-footer">
          
          </div>
        </motion.div>
        
        {/* Background decorative element */}
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
        >
          <FaLock className="mountain-icon" style={{ fontSize: '10rem', color: 'rgba(255,255,255,0.1)' }} />
          <div className="alert-pulse"></div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;