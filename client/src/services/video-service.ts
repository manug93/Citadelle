import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';

/**
 * Interface pour une vidéo
 */
export interface Video {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  duration?: number;
  thumbnailUrl?: string;
  uploadedBy: number;
  uploadedAt: string;
}

/**
 * Interface pour les données de renommage d'une vidéo
 */
export interface RenameVideoData {
  newName: string;
}

/**
 * Service pour la gestion des vidéos
 */
class VideoService {
  /**
   * Récupère toutes les vidéos
   * @returns Liste des vidéos
   */
  async getAllVideos(): Promise<Video[]> {
    return apiService.get<Video[]>(apiConfig.endpoints.videos.getAll);
  }

  /**
   * Récupère une vidéo par son ID
   * @param id ID de la vidéo
   * @returns Détails de la vidéo
   */
  async getVideoById(id: number): Promise<Video> {
    return apiService.get<Video>(apiConfig.endpoints.videos.getById, { id: id.toString() });
  }

  /**
   * Télécharge une nouvelle vidéo
   * @param file Fichier vidéo à télécharger
   * @returns Détails de la vidéo créée
   */
  async uploadVideo(file: File): Promise<Video> {
    const formData = new FormData();
    formData.append('video', file);
    
    return apiService.postFormData<Video>(apiConfig.endpoints.videos.upload, formData);
  }

  /**
   * Renomme une vidéo
   * @param id ID de la vidéo
   * @param newName Nouveau nom
   * @returns Détails de la vidéo mise à jour
   */
  async renameVideo(id: number, newName: string): Promise<Video> {
    return apiService.patch<Video, RenameVideoData>(
      apiConfig.endpoints.videos.rename,
      { newName },
      { id: id.toString() }
    );
  }

  /**
   * Supprime une vidéo
   * @param id ID de la vidéo à supprimer
   */
  async deleteVideo(id: number): Promise<void> {
    return apiService.delete<void>(apiConfig.endpoints.videos.delete, { id: id.toString() });
  }
}

export const videoService = new VideoService();