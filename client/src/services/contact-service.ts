import { apiService } from "./api-service";
import { apiConfig } from "@/config/api-config";
import { ContactFormData } from "@/types";

/**
 * Interface pour un message de contact
 */
export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Service pour la gestion des contacts
 */
class ContactService {
  /**
   * Récupère tous les messages de contact
   * @returns Liste des messages de contact
   */
  async getAllContacts(): Promise<Contact[]> {
    return apiService.get<Contact[]>(apiConfig.endpoints.contacts.getAll);
  }

  /**
   * Récupère un message de contact par son ID
   * @param id ID du message
   * @returns Détails du message
   */
  async getContactById(id: number): Promise<Contact> {
    return apiService.get<Contact>(apiConfig.endpoints.contacts.getById, { id: id.toString() });
  }

  /**
   * Envoie un nouveau message de contact
   * @param contactData Données du message à envoyer
   * @returns Message créé
   */
  async createContact(contactData: ContactFormData): Promise<Contact> {
    return apiService.post<Contact, ContactFormData>(apiConfig.endpoints.contacts.create, contactData);
  }

  /**
   * Marque un message comme lu
   * @param id ID du message
   * @returns Message mis à jour
   */
  async markContactAsRead(id: number): Promise<Contact> {
    return apiService.post<Contact>(apiConfig.endpoints.contacts.markAsRead, null, { id: id.toString() });
  }

  /**
   * Supprime un message de contact
   * @param id ID du message à supprimer
   */
  async deleteContact(id: number): Promise<void> {
    return apiService.delete<void>(apiConfig.endpoints.contacts.delete, { id: id.toString() });
  }
}

export const contactService = new ContactService();