// Centralized API route paths
export const API_ROUTES = {
  LOGIN: '/auth/login',
  AUTH: {
    REFRESH: (userId: string) => `/auth/refresh/${userId}`,
  },
  TRACE: '/app/trace',
  APP_CONFIG: '/app/get-configurations',
  APP_GET_CACHE_URLS: '/app/get-url-caches',
};
