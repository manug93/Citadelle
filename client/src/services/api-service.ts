import { apiConfig } from '@/config/api-config';

/**
 * Service générique pour communiquer avec l'API
 * Gère automatiquement la sélection du backend (local ou externe)
 */
class ApiService {
  /**
   * Construit un chemin d'API complet en fonction de la configuration
   * @param endpoint Point de terminaison relatif
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @returns URL complète
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    let url = endpoint;
    
    // Remplacer les paramètres dans l'URL
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }
    
    // Ajouter le préfixe de l'API externe si nécessaire
    if (apiConfig.type === 'EXTERNAL' && apiConfig.externalApiUrl) {
      return `${apiConfig.externalApiUrl}${url}`;
    }
    
    return url;
  }
  
  /**
   * Effectue une requête GET
   * @param endpoint Point de terminaison relatif
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @param queryParams Paramètres de requête à ajouter à l'URL
   * @returns Résultat de la requête
   */
  async get<T>(
    endpoint: string, 
    params?: Record<string, string | number>,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    let url = this.buildUrl(endpoint, params);
    
    // Ajouter les paramètres de requête
    if (queryParams) {
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    
    return response.json();
  }
  
  /**
   * Effectue une requête POST
   * @param endpoint Point de terminaison relatif
   * @param data Données à envoyer
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @returns Résultat de la requête
   */
  async post<T, D = any>(
    endpoint: string, 
    data: D, 
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Inclure les cookies pour l'authentification
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    
    return response.json();
  }
  
  /**
   * Effectue une requête PATCH
   * @param endpoint Point de terminaison relatif
   * @param data Données à envoyer
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @returns Résultat de la requête
   */
  async patch<T, D = any>(
    endpoint: string, 
    data: D, 
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Inclure les cookies pour l'authentification
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    
    return response.json();
  }
  
  /**
   * Effectue une requête DELETE
   * @param endpoint Point de terminaison relatif
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @returns Résultat de la requête
   */
  async delete<T>(
    endpoint: string, 
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    });
    
    if (!response.ok) {
      // Si c'est un 204 No Content, on retourne undefined
      if (response.status === 204) {
        return undefined as unknown as T;
      }
      
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    
    // Si c'est un 204 No Content, on retourne undefined
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    
    return response.json();
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();
export default apiService;