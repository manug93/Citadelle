/**
 * Configuration des points d'entrée API
 */

// Type de backend à utiliser (local ou externe)
export type BackendType = 'LOCAL' | 'EXTERNAL';

// Structure de configuration de l'API
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
      getMediaByArticleId: string; // Nouveau point d'entrée pour récupérer les médias d'un article
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
    images: {
      getAll: string;
      getById: string;
      upload: string;
      rename: string;
      delete: string;
    };
    videos: { // Nouveau endpoint pour les vidéos
      getAll: string;
      getById: string;
      upload: string;
      rename: string;
      delete: string;
    };
    mediaArticles: { // Nouveau endpoint pour la gestion des médias d'articles
      getByArticleId: string;
      create: string;
      update: string;
      delete: string;
      reorder: string;
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

// Configuration de l'API locale
const localApiConfig: ApiConfig = {
  type: 'LOCAL',
  endpoints: {
    news: {
      getAll: '/api/news',
      getById: '/api/news/:id',
      create: '/api/news',
      update: '/api/news/:id',
      delete: '/api/news/:id',
      getMediaByArticleId: '/api/news/:id/media',
    },
    contacts: {
      getAll: '/api/contacts',
      getById: '/api/contacts/:id',
      create: '/api/contacts',
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
    images: {
      getAll: '/api/images',
      getById: '/api/images/:id',
      upload: '/api/images',
      rename: '/api/images/:id/rename',
      delete: '/api/images/:id',
    },
    videos: {
      getAll: '/api/videos',
      getById: '/api/videos/:id',
      upload: '/api/videos',
      rename: '/api/videos/:id/rename',
      delete: '/api/videos/:id',
    },
    mediaArticles: {
      getByArticleId: '/api/media-articles/article/:id',
      create: '/api/media-articles',
      update: '/api/media-articles/:id',
      delete: '/api/media-articles/:id',
      reorder: '/api/media-articles/reorder',
    },
    auth: {
      login: '/api/login',
      logout: '/api/logout',
      register: '/api/register',
      currentUser: '/api/user',
    },
    stats: {
      dashboard: '/api/stats/dashboard',
    },
  },
};

// Configuration de l'API externe (exemple)
const externalApiConfig: ApiConfig = {
  type: 'EXTERNAL',
  externalApiUrl: 'https://api.lacitadelle.example.com',
  endpoints: {
    news: {
      getAll: '/v1/news',
      getById: '/v1/news/:id',
      create: '/v1/news',
      update: '/v1/news/:id',
      delete: '/v1/news/:id',
      getMediaByArticleId: '/v1/news/:id/media',
    },
    contacts: {
      getAll: '/v1/contacts',
      getById: '/v1/contacts/:id',
      create: '/v1/contacts',
      markAsRead: '/v1/contacts/:id/read',
      delete: '/v1/contacts/:id',
    },
    users: {
      getAll: '/v1/users',
      getById: '/v1/users/:id',
      create: '/v1/users',
      update: '/v1/users/:id',
      delete: '/v1/users/:id',
    },
    images: {
      getAll: '/v1/images',
      getById: '/v1/images/:id',
      upload: '/v1/images',
      rename: '/v1/images/:id/rename',
      delete: '/v1/images/:id',
    },
    videos: {
      getAll: '/v1/videos',
      getById: '/v1/videos/:id',
      upload: '/v1/videos',
      rename: '/v1/videos/:id/rename',
      delete: '/v1/videos/:id',
    },
    mediaArticles: {
      getByArticleId: '/v1/media-articles/article/:id',
      create: '/v1/media-articles',
      update: '/v1/media-articles/:id',
      delete: '/v1/media-articles/:id',
      reorder: '/v1/media-articles/reorder',
    },
    auth: {
      login: '/v1/auth/login',
      logout: '/v1/auth/logout',
      register: '/v1/auth/register',
      currentUser: '/v1/auth/me',
    },
    stats: {
      dashboard: '/v1/stats/dashboard',
    },
  },
};

// Configuration active (par défaut: locale)
export const apiConfig: ApiConfig = 
  localStorage.getItem('backendType') === 'EXTERNAL' 
    ? externalApiConfig 
    : localApiConfig;