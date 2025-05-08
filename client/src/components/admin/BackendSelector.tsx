import { useState, useEffect } from 'react';
import { environmentService } from '@/services/environment-service';
import { BackendType } from '@/config/api-config';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, Server, Database, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Composant de sélection du backend pour l'administration
 * Permet de choisir entre l'API locale et l'API externe
 */
const BackendSelector = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // État pour le type de backend actuellement sélectionné
  const [backendType, setBackendType] = useState<BackendType>(
    environmentService.getBackendType()
  );
  
  // État pour l'URL de l'API externe
  const [externalApiUrl, setExternalApiUrl] = useState(
    environmentService.getExternalApiUrl()
  );
  
  // État pour suivre si l'URL a été modifiée
  const [urlChanged, setUrlChanged] = useState(false);
  
  // Mettre à jour le type de backend
  const handleBackendTypeChange = (value: BackendType) => {
    setBackendType(value);
    
    if (value === 'LOCAL') {
      // Basculer vers l'API locale
      environmentService.switchToLocalBackend();
    } else {
      // Basculer vers l'API externe
      environmentService.switchToExternalBackend(externalApiUrl);
    }
    
    // Invalider toutes les requêtes pour forcer le rechargement des données
    queryClient.invalidateQueries();
  };
  
  // Mettre à jour l'URL de l'API externe
  const handleSaveExternalUrl = () => {
    try {
      // Vérifier si l'URL est valide
      new URL(externalApiUrl);
      
      // Mettre à jour l'URL
      environmentService.updateExternalApiUrl(externalApiUrl);
      
      // Si le backend est externe, recharger les données
      if (backendType === 'EXTERNAL') {
        queryClient.invalidateQueries();
      }
      
      // Réinitialiser l'état de modification
      setUrlChanged(false);
      
      // Notifier l'utilisateur
      toast({
        title: 'URL mise à jour',
        description: 'L\'URL de l\'API externe a été mise à jour avec succès.',
      });
    } catch (error) {
      // Notifier l'utilisateur en cas d'erreur
      toast({
        title: 'URL invalide',
        description: 'Veuillez saisir une URL valide pour l\'API externe.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Database className="mr-2 h-5 w-5 text-primary" />
        Configuration du backend
      </h3>
      
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Type de backend
          </label>
          <Select value={backendType} onValueChange={handleBackendTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un backend" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOCAL">
                <div className="flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  API Locale
                </div>
              </SelectItem>
              <SelectItem value="EXTERNAL">
                <div className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4" />
                  API Externe
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {backendType === 'EXTERNAL' && (
          <div>
            <label className="text-sm font-medium mb-1 block">
              URL de l'API externe
            </label>
            <div className="flex gap-2">
              <Input
                value={externalApiUrl}
                onChange={(e) => {
                  setExternalApiUrl(e.target.value);
                  setUrlChanged(true);
                }}
                placeholder="https://api.exemple.com"
              />
              {urlChanged && (
                <Button
                  size="sm"
                  onClick={handleSaveExternalUrl}
                  className="whitespace-nowrap"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Assurez-vous que l'URL est correcte et que l'API est accessible.
            </p>
          </div>
        )}
      </div>
      
      {/* Status du backend */}
      <div className="mt-4 flex items-center text-sm">
        <div className={`w-2 h-2 rounded-full mr-2 ${backendType === 'LOCAL' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
        <span>{backendType === 'LOCAL' ? 'API Locale' : 'API Externe'}</span>
        <span className="ml-1 text-gray-500">
          {backendType === 'LOCAL' 
            ? '(données stockées en local)' 
            : `(${externalApiUrl})`}
        </span>
      </div>
    </div>
  );
};

export default BackendSelector;