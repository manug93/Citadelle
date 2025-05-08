import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';
import { NewsItem, CreateNewsInput } from '@/types';

/**
 * Service pour la gestion des actualités
 * Utilise l'API configurée (locale ou externe)
 */
class NewsService {
  /**
   * Récupère toutes les actualités
   * @param limit Limite le nombre d'actualités retournées
   * @returns Liste d'actualités
   */
  async getAllNews(limit?: number): Promise<NewsItem[]> {
    const queryParams = limit ? { limit } : undefined;
    return apiService.get<NewsItem[]>(apiConfig.endpoints.news.getAll, undefined, queryParams);
  }
  
  /**
   * Récupère une actualité par son ID
   * @param id ID de l'actualité
   * @returns Détails de l'actualité
   */
  async getNewsById(id: number): Promise<NewsItem> {
    return apiService.get<NewsItem>(apiConfig.endpoints.news.getById, { id });
  }
  
  /**
   * Crée une nouvelle actualité
   * @param newsData Données de l'actualité à créer
   * @returns Actualité créée
   */
  async createNews(newsData: CreateNewsInput): Promise<NewsItem> {
    return apiService.post<NewsItem, CreateNewsInput>(apiConfig.endpoints.news.create, newsData);
  }
  
  /**
   * Met à jour une actualité existante
   * @param id ID de l'actualité
   * @param newsData Données modifiées de l'actualité
   * @returns Actualité mise à jour
   */
  async updateNews(id: number, newsData: Partial<CreateNewsInput>): Promise<NewsItem> {
    return apiService.patch<NewsItem, Partial<CreateNewsInput>>(
      apiConfig.endpoints.news.update, 
      newsData, 
      { id }
    );
  }
  
  /**
   * Supprime une actualité
   * @param id ID de l'actualité à supprimer
   * @returns true si suppression réussie
   */
  async deleteNews(id: number): Promise<void> {
    return apiService.delete<void>(apiConfig.endpoints.news.delete, { id });
  }
}

// Export d'une instance unique du service
export const newsService = new NewsService();
export default newsService;