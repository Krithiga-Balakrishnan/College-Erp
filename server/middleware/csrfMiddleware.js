import csurf from "csurf"; // Import the csurf package

// Set up CSRF protection with cookies
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // The cookie is accessible only by the web server
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'Strict', // Only send the cookie for same-site requests
  }
});

export default csrfProtection; // Export the middleware
