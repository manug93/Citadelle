import React, { useState, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageType, imageService } from '@/services/image-service';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, zhCN } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import BackendSelector from "@/components/admin/BackendSelector";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2,
  Pencil,
  Trash2,
  Copy,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const ImagesManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [imageToRename, setImageToRename] = useState<ImageType | null>(null);
  const [newImageName, setNewImageName] = useState("");

  // Format file size
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case 'fr': return fr;
      case 'en': return enUS;
      case 'zh': return zhCN;
      default: return enUS;
    }
  };

  // Query images
  const { data: images, isLoading } = useQuery({
    queryKey: ['/api/images'],
    queryFn: () => imageService.getAllImages(),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => imageService.uploadImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      toast({
        title: "Succès",
        description: "L'image a été téléchargée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors du téléchargement : ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: ({ id, newName }: { id: number, newName: string }) => imageService.renameImage(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      toast({
        title: "Succès",
        description: "L'image a été renommée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors du renommage : ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => imageService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression : ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files[0]);
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleRenameClick = (image: ImageType) => {
    setImageToRename(image);
    setNewImageName(image.originalName);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (imageToRename && newImageName.trim()) {
      renameMutation.mutate({ id: imageToRename.id, newName: newImageName.trim() });
      setRenameDialogOpen(false);
      setImageToRename(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedImageId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedImageId !== null) {
      deleteMutation.mutate(selectedImageId);
      setConfirmDeleteDialogOpen(false);
      setSelectedImageId(null);
    }
  };

  const handleCopyUrl = useCallback((url: string) => {
    // Construire l'URL complète (avec le protocole et le nom d'hôte)
    const fullUrl = `${window.location.origin}${url}`;
    
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast({
          title: "Succès",
          description: "URL complète copiée dans le presse-papiers",
        });
      });
  }, [toast]);

  return (
    <AdminLayout
      title={t('admin.images.title')}
      currentPage="images"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Images
        </h1>
        <p className="mt-2 text-gray-600">
          Téléchargez, organisez et gérez les images de votre site web.
        </p>
        <div className="mt-4">
          <BackendSelector />
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <p className="text-gray-600 order-2 sm:order-1">
          {isLoading 
            ? 'Chargement des images...' 
            : `${images?.length || 0} image(s)`}
        </p>
        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2">
          <label className="flex items-center cursor-pointer justify-center w-full">
            <Upload className="mr-2 h-4 w-4" />
            {uploadMutation.isPending ? 'Téléchargement...' : 'Ajouter une image'}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
              disabled={uploadMutation.isPending}
            />
          </label>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !images?.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune image</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par télécharger votre première image.
          </p>
          <div className="mt-6">
            <Button className="bg-primary hover:bg-primary/90 mx-auto">
              <label className="flex items-center cursor-pointer justify-center w-full">
                <Upload className="mr-2 h-4 w-4" />
                Ajouter une image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {images.map((image) => (
            <div key={image.id} className="w-full bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg flex items-center justify-center">
                {image.mimeType.startsWith('image/svg') ? (
                  <ImageIcon className="h-14 w-14 text-gray-400" />
                ) : (
                  <img 
                    src={image.url} 
                    alt={image.originalName} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-medium text-sm sm:text-base truncate" title={image.originalName}>
                  {image.originalName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 mt-1 text-xs text-gray-500">
                  {image.width && image.height && (
                    <span className="inline-flex items-center">{image.width} × {image.height}</span>
                  )}
                  <span>
                    {formatFileSize(image.size)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(image.url)}
                    className="h-8 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1.5" />
                    Copier URL
                  </Button>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRenameClick(image)}
                      className="h-8 w-8 p-0 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm" 
                      onClick={() => handleDeleteClick(image.id)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer l'image</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newName">Nouveau nom</Label>
                <Input
                  id="newName"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  placeholder="Entrez le nouveau nom"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleRenameConfirm} 
              className="bg-primary hover:bg-primary/90"
              disabled={renameMutation.isPending || !newImageName.trim()}
            >
              {renameMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renommage...
                </>
              ) : (
                'Renommer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <AlertDialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 sm:mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ImagesManagementPage;