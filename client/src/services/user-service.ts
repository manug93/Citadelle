import { apiService } from './api-service';
import { apiConfig } from '@/config/api-config';
import { User } from '@/types';

/**
 * Interface pour les données de création d'un utilisateur
 */
export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: string;
  canCreateNews?: boolean;
  canViewContacts?: boolean;
}

/**
 * Service pour la gestion des utilisateurs
 */
class UserService {
  /**
   * Récupère tous les utilisateurs
   * @returns Liste des utilisateurs
   */
  async getAllUsers(): Promise<User[]> {
    const users = await apiService.get<User[]>(
      apiConfig.endpoints.users.getAll
    );
    return users;
  }

  /**
   * Récupère un utilisateur par son ID
   * @param id ID de l'utilisateur
   * @returns Détails de l'utilisateur
   */
  async getUserById(id: number): Promise<User> {
    const user = await apiService.get<User>(
      apiConfig.endpoints.users.getById,
      { id }
    );
    return user;
  }

  /**
   * Crée un nouvel utilisateur
   * @param userData Données de l'utilisateur à créer
   * @returns Utilisateur créé
   */
  async createUser(userData: CreateUserInput): Promise<User> {
    const user = await apiService.post<User, CreateUserInput>(
      apiConfig.endpoints.users.create,
      userData
    );
    return user;
  }

  /**
   * Met à jour un utilisateur existant
   * @param id ID de l'utilisateur
   * @param userData Données à mettre à jour
   * @returns Utilisateur mis à jour
   */
  async updateUser(id: number, userData: Partial<CreateUserInput>): Promise<User> {
    const user = await apiService.patch<User, Partial<CreateUserInput>>(
      apiConfig.endpoints.users.update,
      userData,
      { id }
    );
    return user;
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur à supprimer
   */
  async deleteUser(id: number): Promise<void> {
    await apiService.delete<void>(
      apiConfig.endpoints.users.delete,
      { id }
    );
  }
}

// Export d'une instance unique du service
export const userService = new UserService();
export default userService;