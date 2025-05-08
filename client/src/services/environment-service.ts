import { apiConfig, BackendType } from '@/config/api-config';
import { toast } from '@/hooks/use-toast';

/**
 * Service pour gérer l'environnement de l'application
 * Permet de basculer entre les différents backends (local ou externe)
 */
class EnvironmentService {
  /**
   * Type de backend actuellement utilisé
   */
  private currentBackendType: BackendType = 
    localStorage.getItem('backendType') as BackendType || 
    import.meta.env.VITE_API_BACKEND as BackendType || 
    'LOCAL';

  /**
   * URL de l'API externe actuellement utilisée
   */
  private externalApiUrl: string = 
    localStorage.getItem('externalApiUrl') || 
    import.meta.env.VITE_EXTERNAL_API_URL || 
    'https://api.lacitadelle.example.com';

  /**
   * Constructeur
   */
  constructor() {
    // Initialiser le type de backend et l'URL de l'API externe
    this.updateBackendType(this.currentBackendType);
    this.updateExternalApiUrl(this.externalApiUrl);
  }

  /**
   * Obtenir le type de backend actuel
   */
  getBackendType(): BackendType {
    return this.currentBackendType;
  }

  /**
   * Obtenir l'URL de l'API externe
   */
  getExternalApiUrl(): string {
    return this.externalApiUrl;
  }

  /**
   * Mettre à jour le type de backend
   * @param backendType Nouveau type de backend
   */
  updateBackendType(backendType: BackendType): void {
    // Vérifier si le type de backend est valide
    if (!['LOCAL', 'EXTERNAL'].includes(backendType)) {
      console.warn(`Type de backend invalide: ${backendType}. Utilisation de 'LOCAL' par défaut.`);
      backendType = 'LOCAL';
    }

    // Mettre à jour le type de backend
    this.currentBackendType = backendType;
    localStorage.setItem('backendType', backendType);

    // Mise à jour dynamique de la configuration
    apiConfig.type = backendType;

    // Notifier l'utilisateur
    const backendName = backendType === 'LOCAL' ? 'local' : 'externe';
    toast({
      title: 'Environnement modifié',
      description: `L'application utilise maintenant l'API ${backendName}.`,
    });

    // Log pour debug
    console.info(`Environnement changé pour: ${backendType}`);
  }

  /**
   * Mettre à jour l'URL de l'API externe
   * @param url Nouvelle URL de l'API externe
   */
  updateExternalApiUrl(url: string): void {
    // Vérifier si l'URL est valide
    try {
      new URL(url);
    } catch (error) {
      console.warn(`URL d'API externe invalide: ${url}`);
      return;
    }

    // Mettre à jour l'URL de l'API externe
    this.externalApiUrl = url;
    localStorage.setItem('externalApiUrl', url);

    // Mise à jour dynamique de la configuration
    if (apiConfig.type === 'EXTERNAL') {
      apiConfig.externalApiUrl = url;
    }

    // Log pour debug
    console.info(`URL de l'API externe changée pour: ${url}`);
  }

  /**
   * Basculer vers l'API locale
   */
  switchToLocalBackend(): void {
    this.updateBackendType('LOCAL');
  }

  /**
   * Basculer vers l'API externe
   * @param url URL optionnelle de l'API externe
   */
  switchToExternalBackend(url?: string): void {
    if (url) {
      this.updateExternalApiUrl(url);
    }
    this.updateBackendType('EXTERNAL');
  }

  /**
   * Basculer d'un backend à l'autre
   */
  toggleBackend(): void {
    const newBackendType = this.currentBackendType === 'LOCAL' ? 'EXTERNAL' : 'LOCAL';
    this.updateBackendType(newBackendType);
  }
}

// Export d'une instance unique du service
export const environmentService = new EnvironmentService();
export default environmentService;