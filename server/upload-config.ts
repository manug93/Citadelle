import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

// Vérifier que le dossier uploads existe
const createUploadsFolder = async () => {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
};

// Créer le dossier au démarrage
createUploadsFolder();

// Filtrer les fichiers par type MIME (images et vidéos)
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Vérifier si la route contient "videos" pour déterminer le type de fichier à accepter
  const isVideoUpload = req.path.includes('/videos');
  
  if (isVideoUpload) {
    // Accepter seulement les vidéos
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les vidéos sont autorisées'));
    }
  } else {
    // Accepter seulement les images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
};

// Configuration du stockage des fichiers temporaires
const storage = multer.memoryStorage();

// Configuration de l'upload
export const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  },
});

// Extraire les dimensions d'une image
export const getImageDimensions = async (buffer: Buffer) => {
  try {
    const { width, height } = await sharp(buffer).metadata();
    return { width, height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: undefined, height: undefined };
  }
};

// Générer un nom de fichier unique
export const generateFilename = (originalname: string) => {
  const timestamp = Date.now();
  const cleanName = path.parse(originalname).name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const extension = path.extname(originalname).toLowerCase();
  return `${timestamp}-${cleanName}${extension}`;
};