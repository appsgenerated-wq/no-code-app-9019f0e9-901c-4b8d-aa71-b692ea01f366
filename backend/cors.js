// CORS configuration for Manifest backend
const cors = require('cors');

// Get CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : 
  ['https://*.stackblitz.io', 'https://*.vercel.app', 'https://*.webcontainer.io', 'https://*.local.webcontainer.io'];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any of our allowed patterns
    const isAllowed = corsOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard domains - escape dots and convert * to .*
        const pattern = allowedOrigin.replace(/./g, '\.').replace(/*/g, '.*');
        const regex = new RegExp('^' + pattern + '$');
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-App-ID']
};

module.exports = cors(corsOptions);