// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'MonApp',
  version: '1.0.0',
  
  // Configuration API
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    endpoints: {
      auth: '/auth',
      users: '/users',
      products: '/products'
    }
}
};