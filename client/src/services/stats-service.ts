import { apiService } from "./api-service";
import { apiConfig } from "@/config/api-config";

/**
 * Interface pour les statistiques du tableau de bord
 */
export interface DashboardStats {
  usersCount: number;
  newsCount: number;
  contactsCount: number;
  unreadContactsCount: number;
  imagesCount: number;
}

/**
 * Service pour la gestion des statistiques
 */
class StatsService {
  /**
   * Récupère les statistiques pour le tableau de bord admin
   * @returns Statistiques du tableau de bord
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>(apiConfig.endpoints.stats.dashboard);
  }
}

export const statsService = new StatsService();