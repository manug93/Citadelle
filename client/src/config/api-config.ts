/**
 * Configuration pour l'API backend
 * 
 * Ce fichier permet de configurer la connexion aux différents backends :
 * - LOCAL: Utilise l'API locale
 * - EXTERNAL: Utilise l'API externe définie par EXTERNAL_API_URL
 */

// Type de backend
export type BackendType = 'LOCAL' | 'EXTERNAL';

// Configuration des backends
export interface ApiConfig {
  // Type de backend à utiliser
  type: BackendType;
  
  // URL de l'API externe (utilisée uniquement si type = 'EXTERNAL')
  externalApiUrl?: string;
  
  // Points d'entrée API par fonctionnalité
  endpoints: {
    news: {
      getAll: string;
      getById: string;
      create: string;
      update: string;
      delete: string;
    };
    contacts: {
      getAll: string;
      getById: string;
      create: string;
      markAsRead: string;
      delete: string;
    };
    users: {
      getAll: string;
      getById: string;
      create: string;
      update: string;
      delete: string;
    };
    auth: {
      login: string;
      logout: string;
      register: string;
      currentUser: string;
    };
    stats: {
      dashboard: string;
    };
  };
}

// Configuration pour l'API locale
const localApiConfig: ApiConfig = {
  type: 'LOCAL',
  endpoints: {
    news: {
      getAll: '/api/news',
      getById: '/api/news/:id',
      create: '/api/news',
      update: '/api/news/:id',
      delete: '/api/news/:id',
    },
    contacts: {
      getAll: '/api/contacts',
      getById: '/api/contacts/:id',
      create: '/api/contact',
      markAsRead: '/api/contacts/:id/read',
      delete: '/api/contacts/:id',
    },
    users: {
      getAll: '/api/users',
      getById: '/api/users/:id',
      create: '/api/users',
      update: '/api/users/:id',
      delete: '/api/users/:id',
    },
    auth: {
      login: '/api/login',
      logout: '/api/logout',
      register: '/api/register',
      currentUser: '/api/user',
    },
    stats: {
      dashboard: '/api/stats',
    },
  },
};

// Configuration pour l'API externe
const externalApiConfig: ApiConfig = {
  type: 'EXTERNAL',
  externalApiUrl: import.meta.env.VITE_EXTERNAL_API_URL || 'https://api.lacitadelle.example.com',
  endpoints: {
    news: {
      getAll: '/news',
      getById: '/news/:id',
      create: '/news',
      update: '/news/:id',
      delete: '/news/:id',
    },
    contacts: {
      getAll: '/contacts',
      getById: '/contacts/:id',
      create: '/contact',
      markAsRead: '/contacts/:id/read',
      delete: '/contacts/:id',
    },
    users: {
      getAll: '/users',
      getById: '/users/:id',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id',
    },
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      currentUser: '/auth/user',
    },
    stats: {
      dashboard: '/stats/dashboard',
    },
  },
};

// Configuration utilisée par l'application
// Par défaut, on utilise l'API locale
// Pour utiliser l'API externe, définissez VITE_API_BACKEND=EXTERNAL
export const apiConfig: ApiConfig = 
  import.meta.env.VITE_API_BACKEND === 'EXTERNAL' 
    ? externalApiConfig 
    : localApiConfig;

export default apiConfig;