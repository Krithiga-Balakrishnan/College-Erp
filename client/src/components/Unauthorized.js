// src/components/Unauthorized.js

import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>403 Forbidden</h1>
      <p style={styles.message}>You do not have permission to access this page.</p>
      <Link to="/" style={styles.link}>Go to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    textAlign: 'center',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  link: {
    fontSize: '1rem',
    color: '#0056b3',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Unauthorized;
