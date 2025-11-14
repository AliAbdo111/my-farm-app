// API Base URL
// Use environment variable if set, otherwise use the backend URL
// For Vercel deployments, the backend should be on my-farm-app-nine.vercel.app
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://my-farm-app-nine.vercel.app';

