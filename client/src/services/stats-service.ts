import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';

// Définition des types pour les statistiques
export interface DashboardStats {
  usersCount: number;
  newsCount: number;
  contactsCount: number;
  unreadContactsCount: number;
}

/**
 * Service pour récupérer les statistiques et indicateurs
 */
class StatsService {
  /**
   * Récupère les statistiques pour le tableau de bord
   * @returns Statistiques du tableau de bord
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const stats = await apiService.get<DashboardStats>(
      apiConfig.endpoints.stats.dashboard
    );
    return stats;
  }

  /**
   * Récupère le nombre total d'utilisateurs
   * @returns Nombre d'utilisateurs
   */
  async getUsersCount(): Promise<number> {
    const stats = await this.getDashboardStats();
    return stats.usersCount;
  }

  /**
   * Récupère le nombre total d'actualités
   * @returns Nombre d'actualités
   */
  async getNewsCount(): Promise<number> {
    const stats = await this.getDashboardStats();
    return stats.newsCount;
  }

  /**
   * Récupère le nombre total de messages de contact
   * @returns Nombre de messages
   */
  async getContactsCount(): Promise<number> {
    const stats = await this.getDashboardStats();
    return stats.contactsCount;
  }

  /**
   * Récupère le nombre de messages non lus
   * @returns Nombre de messages non lus
   */
  async getUnreadContactsCount(): Promise<number> {
    const stats = await this.getDashboardStats();
    return stats.unreadContactsCount;
  }
}

// Export d'une instance unique du service
export const statsService = new StatsService();
export default statsService;