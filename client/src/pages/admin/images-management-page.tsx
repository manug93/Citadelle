import React, { useState, useCallback } from 'react';
import { Container, Typography, Grid, Box, Button, TextField, Card, CardMedia, CardContent, CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Menu, ListItemIcon, ListItemText, Snackbar, Alert, CircularProgress, Tooltip } from '@mui/material';
import { AddPhotoAlternate, FolderCopy, Delete, Edit, ContentCopy, MoreVert, Image } from '@mui/icons-material';
import PageHeader from '@/components/admin/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageType, imageService } from '@/services/image-service';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, zhCN } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const MotionCard = motion(Card);

const ImageItem = ({ image, onRename, onDelete, onCopyUrl }: { 
  image: ImageType; 
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
  onCopyUrl: (url: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(image.originalName);
  const { language } = useLanguage();
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleOpenRenameDialog = () => {
    setNewName(image.originalName);
    setIsRenameDialogOpen(true);
    handleCloseMenu();
  };
  
  const handleRename = () => {
    onRename(image.id, newName);
    setIsRenameDialogOpen(false);
  };
  
  const handleCopyUrl = () => {
    onCopyUrl(image.url);
    handleCloseMenu();
  };
  
  const handleDelete = () => {
    onDelete(image.id);
    handleCloseMenu();
  };
  
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
  
  const imageTypeIcon = () => {
    if (image.mimeType.startsWith('image/svg')) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px', bgcolor: 'rgba(0,0,0,0.04)' }}>
        <Image sx={{ fontSize: 60, color: 'primary.main' }} />
      </Box>;
    } else {
      return <CardMedia
        component="img"
        height="140"
        image={image.url}
        alt={image.originalName}
        sx={{ objectFit: 'cover' }}
      />;
    }
  };

  return (
    <MotionCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {imageTypeIcon()}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="subtitle1" component="div" noWrap title={image.originalName}>
          {image.originalName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatFileSize(image.size)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formattedDate}
        </Typography>
        {image.width && image.height && (
          <Typography variant="body2" color="text.secondary">
            {image.width} x {image.height}
          </Typography>
        )}
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          startIcon={<ContentCopy />}
          onClick={handleCopyUrl}
        >
          Copier URL
        </Button>
        <IconButton onClick={handleOpenMenu}>
          <MoreVert />
        </IconButton>
      </CardActions>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenRenameDialog}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Renommer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyUrl}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copier l'URL</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Supprimer" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onClose={() => setIsRenameDialogOpen(false)}>
        <DialogTitle>Renommer l'image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nouveau nom"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRenameDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleRename} color="primary">Renommer</Button>
        </DialogActions>
      </Dialog>
    </MotionCard>
  );
};

export default function ImagesManagementPage() {
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const queryClient = useQueryClient();
  
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
      setSnackbar({
        open: true,
        message: 'Image téléchargée avec succès',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Erreur lors du téléchargement : ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: ({ id, newName }: { id: number; newName: string }) => 
      imageService.renameImage(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      setSnackbar({
        open: true,
        message: 'Image renommée avec succès',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Erreur lors du renommage : ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => imageService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      setSnackbar({
        open: true,
        message: 'Image supprimée avec succès',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Erreur lors de la suppression : ${error.message}`,
        severity: 'error'
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
  
  const handleConfirmDelete = () => {
    if (selectedImageId !== null) {
      deleteMutation.mutate(selectedImageId);
      setConfirmDeleteDialogOpen(false);
      setSelectedImageId(null);
    }
  };
  
  const handleDelete = (id: number) => {
    setSelectedImageId(id);
    setConfirmDeleteDialogOpen(true);
  };
  
  const handleCopyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'URL copiée dans le presse-papiers',
          severity: 'success'
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: `Impossible de copier l'URL : ${error.message}`,
          severity: 'error'
        });
      });
  }, []);
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader 
        title="Gestion des Images" 
        description="Téléchargez, organisez et gérez les images de votre site web." 
        icon={<FolderCopy />}
      />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="div">
              {isLoading ? 'Chargement...' : `${images?.length || 0} image(s)`}
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<AddPhotoAlternate />}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Téléchargement...
                </>
              ) : (
                'Ajouter une image'
              )}
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileUpload} />
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : !images?.length ? (
        <Box sx={{ textAlign: 'center', p: 5 }}>
          <Typography variant="body1" color="text.secondary">
            Aucune image trouvée. Commencez par télécharger votre première image !
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <ImageItem 
                image={image} 
                onRename={handleRename} 
                onDelete={handleDelete} 
                onCopyUrl={handleCopyUrl}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error">
            {deleteMutation.isPending ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}