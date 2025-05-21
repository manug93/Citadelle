import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Play, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  originalName: string;
  caption?: string;
  thumbnailUrl?: string;
}

interface MediaViewerProps {
  media: MediaItem[];
  className?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ media, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  if (!media || media.length === 0) {
    return null;
  }

  const currentMedia = media[currentIndex];
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };
  
  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-2xl font-bold text-primary">{t('media.gallery')}</h3>
      
      {/* Grid gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <div 
            key={item.id} 
            className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => openFullscreen(index)}
          >
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt={item.caption || item.originalName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.caption || item.originalName} 
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-10 w-10 text-white opacity-90" />
                </div>
              </div>
            )}
            
            {/* Caption overlay */}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div ref={containerRef} className="relative flex items-center justify-center h-[80vh]">
            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost" 
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            
            {/* Close button */}
            <DialogClose className="absolute right-4 top-4 text-white bg-black/40 rounded-full p-1 hover:bg-black/60 z-10">
              <X className="h-6 w-6" />
            </DialogClose>
            
            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-14 top-4 text-white bg-black/40 rounded-full p-1 hover:bg-black/60 z-10"
              onClick={toggleFullscreen}
              title={isFullscreen ? t('media.exitFullscreen') : t('media.fullscreen')}
            >
              {isFullscreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </Button>

            {/* Current media */}
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                {currentMedia?.type === 'image' ? (
                  <img 
                    src={currentMedia.url} 
                    alt={currentMedia.caption || currentMedia.originalName} 
                    className="max-h-full max-w-full object-contain"
                    style={{ maxHeight: 'calc(100% - 16px)', maxWidth: 'calc(100% - 16px)' }}
                  />
                ) : (
                  <video 
                    src={currentMedia?.url} 
                    controls 
                    className="max-h-full max-w-full"
                    style={{ maxHeight: 'calc(100% - 16px)', maxWidth: 'calc(100% - 16px)' }}
                  >
                    Your browser does not support the video element.
                  </video>
                )}
              </div>
              
              {/* Caption */}
              {currentMedia?.caption && (
                <div className="p-4 bg-black/80 text-white text-center">
                  {currentMedia.caption}
                </div>
              )}
              
              {/* Thumbnails */}
              <div className={`p-2 flex items-center space-x-2 overflow-x-auto bg-black/80 ${isFullscreen ? 'pb-4' : ''}`}>
                {media.map((item, index) => (
                  <div 
                    key={`thumb-${item.id}`}
                    className={`w-16 h-10 flex-shrink-0 cursor-pointer border-2 ${index === currentIndex ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                        {item.thumbnailUrl ? (
                          <img 
                            src={item.thumbnailUrl} 
                            alt="" 
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : null}
                        <Play className="absolute h-4 w-4 text-white opacity-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaViewer;