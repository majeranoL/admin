// Development logger utility
// This helps you easily remove logs when going to production

const logger = {
  // Only log in development
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🐛 DEBUG:', message, data);
    }
  },
  
  info: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️ INFO:', message, data);
    }
  },
  
  error: (message, error = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ ERROR:', message, error);
    }
    // In production, you'd send this to an error tracking service
  },
  
  // Always log warnings (even in production)
  warn: (message, data = null) => {
    console.warn('⚠️ WARNING:', message, data);
  }
};

export default logger;