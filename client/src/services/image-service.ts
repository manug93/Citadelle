import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';

/**
 * Interface pour une image
 */
export interface Image {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedBy: number;
  uploadedAt: string;
}

/**
 * Interface pour les données de renommage d'une image
 */
export interface RenameImageData {
  newName: string;
}

/**
 * Service pour la gestion des images
 */
class ImageService {
  /**
   * Récupère toutes les images
   * @returns Liste des images
   */
  async getAllImages(): Promise<Image[]> {
    return apiService.get<Image[]>(apiConfig.endpoints.images.getAll);
  }

  /**
   * Récupère une image par son ID
   * @param id ID de l'image
   * @returns Détails de l'image
   */
  async getImageById(id: number): Promise<Image> {
    return apiService.get<Image>(apiConfig.endpoints.images.getById, { id: id.toString() });
  }

  /**
   * Télécharge une nouvelle image
   * @param file Fichier image à télécharger
   * @returns Image créée
   */
  async uploadImage(file: File): Promise<Image> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiService.postFormData<Image>(apiConfig.endpoints.images.upload, formData);
  }

  /**
   * Renomme une image
   * @param id ID de l'image
   * @param newName Nouveau nom de l'image
   * @returns Image mise à jour
   */
  async renameImage(id: number, newName: string): Promise<Image> {
    return apiService.patch<Image, RenameImageData>(
      apiConfig.endpoints.images.rename, 
      { newName }, 
      { id: id.toString() }
    );
  }

  /**
   * Supprime une image
   * @param id ID de l'image à supprimer
   */
  async deleteImage(id: number): Promise<void> {
    return apiService.delete<void>(apiConfig.endpoints.images.delete, { id: id.toString() });
  }
}

export const imageService = new ImageService();