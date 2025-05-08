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
    // Remplacer les paramètres dans l'URL
    let url = endpoint;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }

    // Si on utilise l'API externe, préfixer avec l'URL de l'API externe
    if (apiConfig.type === 'EXTERNAL' && apiConfig.externalApiUrl) {
      // S'assurer que l'URL externe n'a pas de slash final et que le endpoint a un slash initial
      const baseUrl = apiConfig.externalApiUrl.endsWith('/')
        ? apiConfig.externalApiUrl.slice(0, -1)
        : apiConfig.externalApiUrl;

      const cleanEndpoint = url.startsWith('/')
        ? url
        : `/${url}`;

      return `${baseUrl}${cleanEndpoint}`;
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
    queryParams?: Record<string, string | number>
  ): Promise<T> {
    // Construire l'URL
    let url = this.buildUrl(endpoint, params);

    // Ajouter les paramètres de requête
    if (queryParams) {
      const query = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        query.append(key, String(value));
      });
      url += `?${query.toString()}`;
    }

    // Effectuer la requête
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    });

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    // Renvoyer le résultat
    return await response.json();
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
    // Construire l'URL
    const url = this.buildUrl(endpoint, params);

    // Préparer les options de la requête
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    };
    
    // Ajouter le body seulement si data n'est pas null
    if (data !== null && data !== undefined) {
      options.body = JSON.stringify(data);
    }
    
    // Effectuer la requête
    const response = await fetch(url, options);

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    // Renvoyer le résultat
    return await response.json();
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
    // Construire l'URL
    const url = this.buildUrl(endpoint, params);

    // Préparer les options de la requête
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    };
    
    // Ajouter le body seulement si data n'est pas null
    if (data !== null && data !== undefined) {
      options.body = JSON.stringify(data);
    }
    
    // Effectuer la requête
    const response = await fetch(url, options);

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    // Renvoyer le résultat
    return await response.json();
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
    // Construire l'URL
    const url = this.buildUrl(endpoint, params);

    // Préparer les options de la requête
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies pour l'authentification
    };
    
    // Effectuer la requête
    const response = await fetch(url, options);

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    // Renvoyer le résultat
    return await response.json();
  }

  /**
   * Effectue une requête POST avec FormData (pour le téléchargement de fichiers)
   * @param endpoint Point de terminaison relatif
   * @param formData Données du formulaire à envoyer
   * @param params Paramètres à remplacer dans l'URL (ex: :id)
   * @returns Résultat de la requête
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    params?: Record<string, string | number>
  ): Promise<T> {
    // Construire l'URL
    const url = this.buildUrl(endpoint, params);

    // Préparer les options de la requête (PAS d'en-tête 'Content-Type' avec FormData)
    const options: RequestInit = {
      method: 'POST',
      body: formData,
      credentials: 'include', // Inclure les cookies pour l'authentification
    };
    
    // Effectuer la requête
    const response = await fetch(url, options);

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }

    // Renvoyer le résultat
    return await response.json();
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();
export default apiService;