// Authentication service for future backend integration
// Currently uses demo credentials, easily swappable for real API

const authService = {
  // Demo credentials for testing (remove in production)
  demoCredentials: {
    admin: { username: "admin", password: "admin123", role: "admin" },
    superadmin: { username: "superadmin", password: "super123", role: "superadmin" }
  },

  // This will be replaced with real API calls
  async authenticate(username, password) {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/login', { ... });
    
    // Demo authentication logic (TESTING ONLY)
    for (const [key, account] of Object.entries(this.demoCredentials)) {
      if (username.toLowerCase() === account.username && password === account.password) {
        return {
          success: true,
          user: {
            username: account.username,
            role: account.role,
            // In real app, this would be a JWT token
            token: `demo-token-${account.role}-${Date.now()}`
          }
        };
      }
    }

    return {
      success: false,
      error: "Invalid credentials"
    };
  },

  // Future: JWT token validation
  async validateToken(token) {
    // TODO: Validate JWT token with backend
    return token && token.startsWith('demo-token');
  },

  // Future: Token refresh
  async refreshToken(token) {
    // TODO: Refresh JWT token
    return token;
  }
};

export default authService;