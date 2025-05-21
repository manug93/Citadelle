import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageType, imageService } from '@/services/image-service';
import { Video as VideoType, videoService } from '@/services/video-service';
import { MediaArticle, mediaArticleService } from '@/services/media-article-service';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { 
  Loader2, 
  Image as ImageIcon, 
  Film, 
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Define MediaItem type which can be either an image or a video
type MediaItemType = {
  id: number;
  type: 'image' | 'video';
  url: string;
  originalName: string;
  caption?: string;
  position: number;
  thumbnailUrl?: string; // Pour les vidéos
};

interface MediaGalleryProps {
  articleId?: number; // Optional for new articles
  readOnly?: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ articleId, readOnly = false }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('images');
  const [selectedMedia, setSelectedMedia] = useState<Array<MediaItemType>>([]);
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false);
  const [currentMediaItem, setCurrentMediaItem] = useState<MediaItemType | null>(null);
  const [captionText, setCaptionText] = useState('');

  // Fetch all images and videos
  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryKey: ['/api/images'],
    queryFn: () => imageService.getAllImages(),
    enabled: !readOnly,
  });

  const { data: videos, isLoading: isLoadingVideos } = useQuery({
    queryKey: ['/api/videos'],
    queryFn: () => videoService.getAllVideos(),
    enabled: !readOnly,
  });

  // Fetch media associated with this article if articleId is provided
  const { data: articleMedia, isLoading: isLoadingArticleMedia } = useQuery({
    queryKey: ['/api/media-articles', articleId],
    queryFn: () => mediaArticleService.getMediaByArticleId(articleId!),
    enabled: !!articleId,
  });

  // Initialize selectedMedia from articleMedia when it loads
  useEffect(() => {
    if (articleMedia && articleMedia.length > 0) {
      setSelectedMedia(
        articleMedia.map(item => ({
          id: item.id,
          type: item.type,
          url: item.url,
          originalName: item.originalName,
          caption: item.caption,
          position: item.position,
          thumbnailUrl: item.thumbnailUrl,
        }))
      );
    }
  }, [articleMedia]);

  // Add media to the selected list
  const addMedia = (media: ImageType | VideoType, type: 'image' | 'video') => {
    // Vérifier si ce média est déjà dans la liste sélectionnée
    const isDuplicate = selectedMedia.some(
      item => item.id === media.id && item.type === type
    );

    if (isDuplicate) {
      toast({
        title: t("errors.title"),
        description: t("media.alreadyAdded"),
        variant: "destructive",
      });
      return;
    }

    const mediaItem: MediaItemType = {
      id: media.id,
      type,
      url: media.url,
      originalName: media.originalName,
      position: selectedMedia.length,
      thumbnailUrl: type === 'video' ? (media as VideoType).thumbnailUrl : undefined,
    };

    setSelectedMedia(prev => [...prev, mediaItem]);
    setCaptionDialogOpen(true);
    setCurrentMediaItem(mediaItem);
    setCaptionText('');
  };

  // Remove media from the selected list
  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Move media up in the list
  const moveUp = (index: number) => {
    if (index === 0) return;
    
    const newList = [...selectedMedia];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    
    // Update positions
    const updatedList = newList.map((item, i) => ({
      ...item,
      position: i
    }));
    
    setSelectedMedia(updatedList);
  };

  // Move media down in the list
  const moveDown = (index: number) => {
    if (index === selectedMedia.length - 1) return;
    
    const newList = [...selectedMedia];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    
    // Update positions
    const updatedList = newList.map((item, i) => ({
      ...item,
      position: i
    }));
    
    setSelectedMedia(updatedList);
  };

  // Edit caption for a media item
  const editCaption = (media: MediaItemType) => {
    setCurrentMediaItem(media);
    setCaptionText(media.caption || '');
    setCaptionDialogOpen(true);
  };

  // Save caption
  const saveCaption = () => {
    if (!currentMediaItem) return;
    
    setSelectedMedia(prev => 
      prev.map(item => 
        (item.id === currentMediaItem.id && item.type === currentMediaItem.type) 
          ? { ...item, caption: captionText } 
          : item
      )
    );
    
    setCaptionDialogOpen(false);
  };

  // Save all media associations to the article
  const saveMediaArticles = async () => {
    if (!articleId) {
      toast({
        title: t("errors.title"),
        description: t("media.saveFirst"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Implementation would depend on your backend
      // This is a simplified version
      for (const media of selectedMedia) {
        await mediaArticleService.addMediaToArticle({
          articleId,
          mediaType: media.type,
          mediaId: media.id,
          position: media.position,
          caption: media.caption
        });
      }

      toast({
        title: t("success.title"),
        description: t("media.associationSuccess"),
      });
    } catch (error: any) {
      toast({
        title: t("errors.title"),
        description: t("media.associationError", { message: error.message }),
        variant: "destructive",
      });
    }
  };
  
  // Remove an existing media association from the article
  const removeMediaAssociation = async (mediaId: number) => {
    try {
      await mediaArticleService.removeMediaFromArticle(mediaId);
      
      // Refresh the media list
      if (articleId) {
        // Get the updated media directly from the API
        const updatedMedia = await mediaArticleService.getMediaByArticleId(articleId);
        // Set the media directly without additional mapping that might lose data
        setSelectedMedia(updatedMedia);
      }
      
      toast({
        title: t("success.title"),
        description: t("media.removeSuccess"),
      });
    } catch (error: any) {
      toast({
        title: t("errors.title"),
        description: t("media.removeError", { message: error.message }),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <Label>{t("media.gallery")}</Label>

        {/* Selected media list */}
        {selectedMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {selectedMedia.map((media, index) => (
              <Card key={`${media.type}-${media.id}-${index}`} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={media.caption || media.originalName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                      {media.thumbnailUrl ? (
                        <img 
                          src={media.thumbnailUrl} 
                          alt={media.caption || media.originalName} 
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <Film className="h-10 w-10 text-white/70" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/30 rounded-full p-2">
                          <Film className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 right-2" 
                    variant={media.type === 'image' ? 'default' : 'secondary'}
                  >
                    {media.type === 'image' ? t("media.image") : t("media.video")}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate" title={media.originalName}>
                    {media.originalName}
                  </p>
                  {media.caption && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={media.caption}>
                      {media.caption}
                    </p>
                  )}
                </CardContent>
                {!readOnly && (
                  <CardFooter className="p-3 pt-0 flex justify-between">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => moveDown(index)}
                        disabled={index === selectedMedia.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-blue-600" 
                        onClick={() => editCaption(media)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {articleId ? (
                        // Bouton pour supprimer une association média-article existante
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600" 
                          onClick={() => removeMediaAssociation(media.id)}
                          title={t("media.removeAssociation")}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      ) : (
                        // Bouton pour retirer un média de la sélection actuelle (avant sauvegarde)
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600" 
                          onClick={() => removeMedia(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6 text-center bg-gray-50">
            <p className="text-gray-500">{t("media.noMedia")}</p>
          </div>
        )}

        {!readOnly && (
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsMediaDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("media.addMedia")}
            </Button>
            {articleId && selectedMedia.length > 0 && (
              <Button 
                onClick={saveMediaArticles}
              >
                {t("media.saveAssociations")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Media Dialog */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("media.addMedia")}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">{t("media.images")}</TabsTrigger>
              <TabsTrigger value="videos">{t("media.videos")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="mt-4">
              {isLoadingImages ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !images?.length ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <ImageIcon className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-500">{t("media.noImagesAvailable")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map(image => (
                    <Card 
                      key={image.id} 
                      className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-md"
                      onClick={() => addMedia(image, 'image')}
                    >
                      <div className="aspect-video bg-gray-100">
                        <img 
                          src={image.url} 
                          alt={image.originalName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium truncate" title={image.originalName}>
                          {image.originalName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-4">
              {isLoadingVideos ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !videos?.length ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Film className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-500">{t("media.noVideosAvailable")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {videos.map(video => (
                    <Card 
                      key={video.id} 
                      className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-md"
                      onClick={() => addMedia(video, 'video')}
                    >
                      <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.originalName} 
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <Film className="h-10 w-10 text-white/70" />
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium truncate" title={video.originalName}>
                          {video.originalName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMediaDialogOpen(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Caption Dialog */}
      <Dialog open={captionDialogOpen} onOpenChange={setCaptionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("media.addCaption")}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {currentMediaItem && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">{t("media.selectedFile")}:</p>
                  <div className="flex items-center">
                    {currentMediaItem.type === 'image' ? (
                      <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Film className="h-5 w-5 mr-2 text-primary" />
                    )}
                    <span className="text-sm truncate">{currentMediaItem.originalName}</span>
                  </div>
                </div>
              )}
              
              <Label htmlFor="caption">{t("media.optionalCaption")}</Label>
              <Textarea
                id="caption"
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder={t("media.addDescriptionPlaceholder")}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaptionDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveCaption}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaGallery;