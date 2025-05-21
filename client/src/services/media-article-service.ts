import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';
// Définition du type MediaItem - dupliqué de schema.ts pour éviter les erreurs d'importation
interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  originalName: string;
  caption?: string;
  position: number;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
}

/**
 * Interface pour un élément média-article
 * Utilise une clé primaire composite (articleId, mediaType, mediaId)
 */
export interface MediaArticle {
  articleId: number;
  mediaType: 'image' | 'video';
  mediaId: number;
  position: number;
  caption?: string;
  addedAt: string;
}

/**
 * Interface pour les données d'ajout d'un média à un article
 */
export interface AddMediaToArticleData {
  articleId: number;
  mediaType: 'image' | 'video';
  mediaId: number;
  position?: number;
  caption?: string;
}

/**
 * Interface pour les données de mise à jour d'un média-article
 */
export interface UpdateMediaArticleData {
  caption?: string;
  position?: number;
}

/**
 * Interface pour les données de réorganisation des médias d'un article
 */
export interface ReorderMediaData {
  articleId: number;
  mediaPositions: { mediaId: number; mediaType: 'image' | 'video'; position: number }[];
}

/**
 * Service pour la gestion des associations médias-articles
 */
class MediaArticleService {
  /**
   * Récupère tous les médias associés à un article
   * @param articleId ID de l'article
   * @returns Liste des médias complets avec leurs détails
   */
  async getMediaByArticleId(articleId: number): Promise<MediaItem[]> {
    return apiService.get<MediaItem[]>(
      apiConfig.endpoints.mediaArticles.getByArticleId, 
      { id: articleId.toString() }
    );
  }

  /**
   * Ajoute un média à un article
   * @param data Données du média à ajouter
   * @returns Détails de l'association créée
   */
  async addMediaToArticle(data: AddMediaToArticleData): Promise<MediaArticle> {
    return apiService.post<MediaArticle, AddMediaToArticleData>(
      apiConfig.endpoints.mediaArticles.create,
      data
    );
  }

  /**
   * Met à jour les détails d'un média associé à un article
   * @param articleId ID de l'article
   * @param mediaType Type de média (image ou video)
   * @param mediaId ID du média
   * @param data Données à mettre à jour
   * @returns Détails de l'association mise à jour
   */
  async updateMediaArticle(
    articleId: number, 
    mediaType: 'image' | 'video', 
    mediaId: number, 
    data: UpdateMediaArticleData
  ): Promise<MediaArticle> {
    return apiService.patch<MediaArticle, UpdateMediaArticleData>(
      apiConfig.endpoints.mediaArticles.update,
      data,
      { 
        articleId: articleId.toString(),
        mediaType,
        mediaId: mediaId.toString() 
      }
    );
  }

  /**
   * Supprime une association média-article
   * @param articleId ID de l'article
   * @param mediaType Type de média (image ou video)
   * @param mediaId ID du média
   */
  async removeMediaFromArticle(
    articleId: number, 
    mediaType: 'image' | 'video', 
    mediaId: number
  ): Promise<void> {
    return apiService.delete<void>(
      apiConfig.endpoints.mediaArticles.delete, 
      { 
        articleId: articleId.toString(),
        mediaType,
        mediaId: mediaId.toString() 
      }
    );
  }

  /**
   * Réorganise les médias d'un article
   * @param data Données de réorganisation avec clé composite
   * @returns Liste des associations mise à jour
   */
  async reorderMediaArticles(data: ReorderMediaData): Promise<MediaArticle[]> {
    return apiService.post<MediaArticle[], ReorderMediaData>(
      apiConfig.endpoints.mediaArticles.reorder,
      data
    );
  }
}

export const mediaArticleService = new MediaArticleService();