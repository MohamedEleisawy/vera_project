// src/environments/environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://vera-project-production.up.railway.app/',
  appName: 'MonApp',
  version: '1.0.0',

  // Configuration API
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    endpoints: {
      auth: '/auth',
      users: '/users',
    },
  },
};
