import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { log } from '../vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ffmpegPath = path.resolve(__dirname, './bin/ffmpeg');
const ffprobePath = path.resolve(__dirname, './bin/ffprobe');
const execAsync = promisify(exec);

/**
 * Génère une miniature pour une vidéo
 * @param videoPath Chemin complet vers le fichier vidéo
 * @param outputDir Répertoire de sortie pour la miniature
 * @param filename Nom du fichier vidéo (sans extension)
 * @param time Position temporelle pour l'extraction (format: 00:00:05)
 * @returns Chemin de la miniature générée
 */
export async function generateVideoThumbnail(
  videoPath: string,
  outputDir: string,
  filename: string,
  time: string = '00:00:03'
): Promise<string> {
  try {
    // Créer le répertoire de sortie s'il n'existe pas
    try {
      await fs.access(outputDir);
    } catch (err) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Nom de fichier pour la miniature
    const thumbnailFilename = `${filename}_thumbnail.jpg`;
    const thumbnailPath = path.join(outputDir, thumbnailFilename);

    // Commande FFmpeg pour extraire un frame à la position spécifiée
    const command = `"${ffmpegPath}" -i "${videoPath}" -ss ${time} -vframes 1 -vf "scale=480:-1" -q:v 2 -threads 1 "${thumbnailPath}" -y`;

    log(`Exécution de la commande FFmpeg: ${command}`, 'video-utils');
    await execAsync(command);

    log(`Miniature générée avec succès: ${thumbnailPath}`, 'video-utils');
    return thumbnailFilename;
  } catch (error) {
    log(`Erreur lors de la génération de la miniature: ${error}`, 'video-utils');
    throw new Error(`Impossible de générer la miniature: ${error}`);
  }
}

/**
 * Extrait la durée d'une vidéo en secondes
 * @param videoPath Chemin vers le fichier vidéo
 * @returns Durée en secondes (nombre entier)
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  try {
    // Commande FFmpeg pour obtenir la durée de la vidéo
    const command = `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
    log("Exécution de la commande FFprobe: " + command, 'video-utils');
    const { stdout } = await execAsync(command);
    const duration = parseFloat(stdout.trim());
    
    // Arrondir à l'entier le plus proche
    return Math.round(duration);
  } catch (error) {
    log(`Erreur lors de l'extraction de la durée de la vidéo: ${error}`, 'video-utils');
    return 0; // Valeur par défaut en cas d'erreur
  }
}