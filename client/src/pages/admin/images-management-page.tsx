import React, { useState, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageType, imageService } from '@/services/image-service';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, zhCN } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import BackendSelector from "@/components/admin/BackendSelector";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Newspaper, 
  BarChart4, 
  Users, 
  Mail, 
  LogOut, 
  Home,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Admin page layout component
const AdminLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>{title} | Admin | Groupe La Citadelle S.A.</title>
      </Helmet>

      {/* Admin Navbar */}
      <nav className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <a className="flex-shrink-0 font-bold text-xl">
                  LA CITADELLE - ADMIN
                </a>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Link href="/">
                    <a className="text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Retour au site
                    </a>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="ml-4 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('admin.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <div className="pt-5 pb-4">
            <div className="px-4 text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="font-semibold">{user?.email}</div>
              <div className="text-xs text-gray-500">{user?.role || 'Administrator'}</div>
            </div>
            <nav className="mt-8 px-2">
              <Link href="/admin/dashboard">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <BarChart4 className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Tableau de bord
                </a>
              </Link>
              <Link href="/admin/news">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Newspaper className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des actualités
                </a>
              </Link>
              <Link href="/admin/users">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Gestion des utilisateurs
                </a>
              </Link>
              <Link href="/admin/contacts">
                <a className="group flex items-center px-4 py-3 text-gray-700 hover:bg-primary/5 rounded-md">
                  <Mail className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary" />
                  Messages de contact
                </a>
              </Link>
              <Link href="/admin/images">
                <a className="group flex items-center px-4 py-3 text-white bg-primary rounded-md">
                  <ImageIcon className="mr-3 h-5 w-5 text-white" />
                  Gestion des images
                </a>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Card Component
const ImageCard = ({ 
  image, 
  onRename, 
  onDelete, 
  onCopyUrl 
}: { 
  image: ImageType; 
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
  onCopyUrl: (url: string) => void;
}) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(image.originalName);
  const { language } = useLanguage();
  
  // Format the date based on current language
  const getLocale = () => {
    switch (language) {
      case 'fr': return fr;
      case 'en': return enUS;
      case 'zh': return zhCN;
      default: return enUS;
    }
  };
  
  const formattedDate = formatDistanceToNow(new Date(image.uploadedAt), { 
    addSuffix: true,
    locale: getLocale()
  });
  
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

  const handleRename = () => {
    onRename(image.id, newName);
    setIsRenameDialogOpen(false);
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md animate-fadeIn">
      <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
        {image.mimeType.startsWith('image/svg') ? (
          <ImageIcon className="h-20 w-20 text-primary" />
        ) : (
          <img 
            src={image.url} 
            alt={image.originalName} 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="font-semibold text-lg truncate" title={image.originalName}>
          {image.originalName}
        </h3>
        <div className="text-sm text-gray-500 mt-1">
          <p>{formatFileSize(image.size)}</p>
          <p>{formattedDate}</p>
          {image.width && image.height && (
            <p>{image.width} x {image.height}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopyUrl(image.url)}
          className="flex items-center"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copier URL
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Renommer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopyUrl(image.url)}>
              <Copy className="h-4 w-4 mr-2" />
              Copier l'URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(image.id)} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer l'image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="newName">Nouveau nom</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Entrez le nouveau nom"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRenameDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRename}>Renommer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Main Page Component
const ImagesManagementPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const { language } = useLanguage();
  
  // Fetch images
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
        description: "Image téléchargée avec succès",
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
    mutationFn: ({ id, newName }: { id: number; newName: string }) => 
      imageService.renameImage(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      toast({
        title: "Succès",
        description: "Image renommée avec succès",
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
  
  const handleRename = (id: number, newName: string) => {
    renameMutation.mutate({ id, newName });
  };
  
  const handleDelete = (id: number) => {
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
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: `Impossible de copier l'URL : ${error.message}`,
          variant: "destructive",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <ImageCard 
              key={image.id}
              image={image} 
              onRename={handleRename} 
              onDelete={handleDelete} 
              onCopyUrl={handleCopyUrl}
            />
          ))}
        </div>
      )}
      
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