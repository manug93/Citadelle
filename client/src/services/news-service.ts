import { apiService } from './api-service';
import { NewsItem, CreateNewsInput } from '@/types';
import { apiConfig } from '@/config/api-config';

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
    const news = await apiService.get<NewsItem[]>(
      apiConfig.endpoints.news.getAll,
      undefined,
      queryParams
    );
    return news;
  }

  /**
   * Récupère une actualité par son ID
   * @param id ID de l'actualité
   * @returns Détails de l'actualité
   */
  async getNewsById(id: number): Promise<NewsItem> {
    const news = await apiService.get<NewsItem>(
      apiConfig.endpoints.news.getById,
      { id }
    );
    return news;
  }

  /**
   * Crée une nouvelle actualité
   * @param newsData Données de l'actualité à créer
   * @returns Actualité créée
   */
  async createNews(newsData: CreateNewsInput): Promise<NewsItem> {
    const news = await apiService.post<NewsItem, CreateNewsInput>(
      apiConfig.endpoints.news.create,
      newsData
    );
    return news;
  }

  /**
   * Met à jour une actualité existante
   * @param id ID de l'actualité
   * @param newsData Données modifiées de l'actualité
   * @returns Actualité mise à jour
   */
  async updateNews(id: number, newsData: Partial<CreateNewsInput>): Promise<NewsItem> {
    const news = await apiService.patch<NewsItem, Partial<CreateNewsInput>>(
      apiConfig.endpoints.news.update,
      newsData,
      { id }
    );
    return news;
  }

  /**
   * Supprime une actualité
   * @param id ID de l'actualité à supprimer
   * @returns true si suppression réussie
   */
  async deleteNews(id: number): Promise<void> {
    await apiService.delete<void>(
      apiConfig.endpoints.news.delete,
      { id }
    );
  }
}

// Export d'une instance unique du service
export const newsService = new NewsService();
export default newsService;