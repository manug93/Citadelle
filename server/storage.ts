import { 
  users, news, contacts, images, videos, mediaArticles,
  InsertUser, InsertNews, InsertContact, InsertImage, InsertVideo, InsertMediaArticle,
  User, NewsItem, Contact, Image, Video, MediaArticle, MediaItem
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

const scryptAsync = promisify(scrypt);

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersCount(): Promise<number>;
  
  // News operations
  getAllNews(): Promise<NewsItem[]>;
  getNewsById(id: number): Promise<NewsItem | undefined>;
  createNews(newsItem: InsertNews): Promise<NewsItem>;
  updateNews(id: number, newsItem: InsertNews): Promise<NewsItem | undefined>;
  deleteNews(id: number): Promise<boolean>;
  getNewsCount(): Promise<number>;
  
  // Contact operations
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContact(id: number): Promise<boolean>;
  getContactsCount(): Promise<number>;
  getUnreadContactsCount(): Promise<number>;
  
  // Image operations
  getAllImages(): Promise<Image[]>;
  getImageById(id: number): Promise<Image | undefined>;
  saveImage(image: InsertImage, fileBuffer: Buffer): Promise<Image>;
  renameImage(id: number, newName: string): Promise<Image | undefined>;
  deleteImage(id: number): Promise<boolean>;
  getImagesCount(): Promise<number>;
  
  // Video operations
  getAllVideos(): Promise<Video[]>;
  getVideoById(id: number): Promise<Video | undefined>;
  saveVideo(video: InsertVideo, fileBuffer: Buffer): Promise<Video>;
  renameVideo(id: number, newName: string): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  getVideosCount(): Promise<number>;
  
  // Media-Article operations
  getMediaByArticleId(articleId: number): Promise<MediaItem[]>;
  addMediaToArticle(data: InsertMediaArticle): Promise<MediaArticle>;
  updateMediaArticle(articleId: number, mediaType: string, mediaId: number, data: Partial<InsertMediaArticle>): Promise<MediaArticle | undefined>;
  removeMediaFromArticle(articleId: number, mediaType: string, mediaId: number): Promise<boolean>;
  reorderMediaArticles(data: { articleId: number, mediaPositions: { mediaId: number, mediaType: 'image' | 'video', position: number }[] }): Promise<MediaArticle[]>;
  
  // Session store
  sessionStore: any; // SessionStore from express-session
  
  // Initialize the database
  initializeDatabase(): Promise<void>;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Initialize the database with admin user and sample news
  async initializeDatabase(): Promise<void> {
    try {
      // Check if admin user exists
      const adminUser = await this.getUserByUsername("admin");
      
      if (!adminUser) {
        // Create admin user with credentials: admin/cit@delle2025byInchtechs
        await this.createUser({
          username: "admin",
          email: "admin@lacitadelle.com",
          password: await hashPassword("cit@delle2025byInchtechs"),
          role: "admin"
        });
        console.log("Admin user created");
      }
      
      // Check if sample news already exist
      const existingNews = await this.getAllNews();
      
      if (existingNews.length === 0) {
        // Create some initial news items
        const sampleNews = [
          {
            title: "Nouveau partenariat stratégique avec la SIC",
            content: "Le Groupe La Citadelle S.A. annonce la signature d'un accord majeur avec la Société Immobilière du Cameroun pour la construction de 5000 logements sociaux.",
            summary: "Signature d'un accord majeur pour la construction de logements sociaux",
            category: "partnership",
            imageUrl: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
            author: "La Citadelle S.A."
          },
          {
            title: "Achèvement du tronçon routier Ebolowa-Nkoemvon",
            content: "Après 18 mois de travaux, le Groupe La Citadelle S.A. livre le tronçon routier Ebolowa-Nkoemvon, améliorant significativement la mobilité dans la région Sud.",
            category: "achievement",
            imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
            author: "Équipe Technique"
          },
          {
            title: "Ouverture d'un bureau de représentation au Rwanda",
            content: "Dans le cadre de sa stratégie d'expansion régionale, le Groupe La Citadelle S.A. inaugure un bureau de représentation à Kigali pour coordonner ses activités en Afrique de l'Est.",
            category: "expansion",
            imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
            author: "Direction Générale"
          }
        ];
        
        for (const item of sampleNews) {
          await this.createNews(item);
        }
        console.log("Sample news created");
      }
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        password: users.password,
        canCreateNews: users.canCreateNews,
        canViewContacts: users.canViewContacts,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        password: users.password,
        canCreateNews: users.canCreateNews,
        canViewContacts: users.canViewContacts,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        password: users.password,
        canCreateNews: users.canCreateNews,
        canViewContacts: users.canViewContacts,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return result.length > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        password: users.password,
        canCreateNews: users.canCreateNews,
        canViewContacts: users.canViewContacts,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.username);
  }

  async getUsersCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(users);
    return Number(result[0].count);
  }
  
  // News methods
  async getAllNews(): Promise<NewsItem[]> {
    return db
      .select()
      .from(news)
      .orderBy(desc(news.date));
  }
  
  async getNewsById(id: number): Promise<NewsItem | undefined> {
    const [newsItem] = await db
      .select()
      .from(news)
      .where(eq(news.id, id));
    return newsItem;
  }
  
  async createNews(newsItem: InsertNews): Promise<NewsItem> {
    const [createdNews] = await db
      .insert(news)
      .values(newsItem)
      .returning();
    return createdNews;
  }
  
  async updateNews(id: number, newsItem: InsertNews): Promise<NewsItem | undefined> {
    const [updatedNews] = await db
      .update(news)
      .set(newsItem)
      .where(eq(news.id, id))
      .returning();
    return updatedNews;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    const result = await db
      .delete(news)
      .where(eq(news.id, id))
      .returning({ id: news.id });
    return result.length > 0;
  }

  async getNewsCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(news);
    return Number(result[0].count);
  }
  
  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return db
      .select({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        subject: contacts.subject,
        message: contacts.message,
        isRead: contacts.isRead,
        createdAt: contacts.date // Mapper date à createdAt pour le client
      })
      .from(contacts)
      .orderBy(desc(contacts.date));
  }
  
  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db
      .select({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        subject: contacts.subject,
        message: contacts.message,
        isRead: contacts.isRead,
        createdAt: contacts.date // Mapper date à createdAt pour le client
      })
      .from(contacts)
      .where(eq(contacts.id, id));
    return contact;
  }
  
  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(contactData)
      .returning({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        subject: contacts.subject,
        message: contacts.message,
        isRead: contacts.isRead,
        createdAt: contacts.date // Mapper date à createdAt pour le client
      });
    return contact;
  }
  
  async markContactAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning({ id: contacts.id });
    return result.length > 0;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    const result = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning({ id: contacts.id });
    return result.length > 0;
  }
  
  async getContactsCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(contacts);
    return Number(result[0].count);
  }
  
  async getUnreadContactsCount(): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(contacts)
      .where(eq(contacts.isRead, false));
    return Number(result[0].count);
  }
  
  // Image methods
  async getAllImages(): Promise<Image[]> {
    return db
      .select()
      .from(images)
      .orderBy(desc(images.uploadedAt));
  }
  
  async getImageById(id: number): Promise<Image | undefined> {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));
    return image;
  }
  
  async saveImage(image: InsertImage, fileBuffer: Buffer): Promise<Image> {
    try {
      // Créer le dossier uploads/images s'il n'existe pas
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'images');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      // Écrire le fichier dans le dossier uploads/images
      await fs.writeFile(path.join(uploadsDir, image.filename), fileBuffer);
      
      // Insérer les métadonnées de l'image dans la base de données
      const [savedImage] = await db
        .insert(images)
        .values(image)
        .returning();
      
      return savedImage;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }
  
  async renameImage(id: number, newName: string): Promise<Image | undefined> {
    try {
      // Récupérer l'image existante
      const existingImage = await this.getImageById(id);
      if (!existingImage) {
        return undefined;
      }
      
      // Créer un nouveau nom de fichier à partir du nouveau nom
      // Conserver l'extension de fichier d'origine
      const fileExtension = path.extname(existingImage.filename);
      const newFilename = `${Date.now()}-${newName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${fileExtension}`;
      
      // Déterminer les chemins de fichiers
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'images');
      const oldPath = path.join(uploadsDir, existingImage.filename);
      const newPath = path.join(uploadsDir, newFilename);
      
      // Renommer le fichier sur le disque
      await fs.rename(oldPath, newPath);
      
      // Mettre à jour l'URL de l'image
      const newUrl = `/uploads/images/${newFilename}`;
      
      // Mettre à jour les métadonnées dans la base de données
      const [updatedImage] = await db
        .update(images)
        .set({
          filename: newFilename,
          originalName: newName,
          url: newUrl
        })
        .where(eq(images.id, id))
        .returning();
      
      return updatedImage;
    } catch (error) {
      console.error('Error renaming image:', error);
      throw error;
    }
  }
  
  async deleteImage(id: number): Promise<boolean> {
    try {
      // Récupérer l'image
      const image = await this.getImageById(id);
      if (!image) {
        return false;
      }
      
      // Supprimer le fichier du disque
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'images', image.filename);
      await fs.unlink(filePath);
      
      // Supprimer l'entrée de la base de données
      const result = await db
        .delete(images)
        .where(eq(images.id, id))
        .returning({ id: images.id });
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
  
  async getImagesCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(images);
    return Number(result[0].count);
  }

  // === Video Operations ===

  async getAllVideos(): Promise<Video[]> {
    try {
      const allVideos = await db
        .select()
        .from(videos)
        .orderBy(desc(videos.uploadedAt));
      
      return allVideos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    try {
      const [video] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, id));
      
      return video;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  async saveVideo(video: InsertVideo, fileBuffer: Buffer): Promise<Video> {
    try {
      // Ensure directories exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      const thumbnailDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.mkdir(thumbnailDir, { recursive: true });
      
      // Save file to disk
      const filePath = path.join(uploadDir, video.filename);
      await fs.writeFile(filePath, fileBuffer);
      
      // Importer les utilitaires vidéo ici pour éviter les dépendances circulaires
      const { generateVideoThumbnail, getVideoDuration } = await import('./utils/video-utils');
      
      // Extraire le nom de fichier sans extension pour la miniature
      const fileNameWithoutExt = video.filename.split('.').slice(0, -1).join('.');
      
      // Préparer les données pour l'insertion dans la base de données
      const insertData: any = { ...video };
      
      try {
        // Générer la miniature
        const thumbnailFilename = await generateVideoThumbnail(
          filePath,
          thumbnailDir,
          fileNameWithoutExt
        );
        
        // Obtenir la durée de la vidéo
        const duration = await getVideoDuration(filePath);
        
        // Ajouter les informations de miniature et de durée
        insertData.thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
        insertData.duration = duration;
      } catch (thumbError) {
        console.error('Error generating thumbnail:', thumbError);
        // En cas d'erreur de génération de la miniature, on continue sans miniature
      }
      
      // Create video record in database
      const [newVideo] = await db
        .insert(videos)
        .values(insertData)
        .returning();
      
      return newVideo;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  }

  async renameVideo(id: number, newName: string): Promise<Video | undefined> {
    try {
      const [updatedVideo] = await db
        .update(videos)
        .set({ originalName: newName })
        .where(eq(videos.id, id))
        .returning();
      
      return updatedVideo;
    } catch (error) {
      console.error('Error renaming video:', error);
      throw error;
    }
  }

  async deleteVideo(id: number): Promise<boolean> {
    try {
      // Récupérer la vidéo
      const video = await this.getVideoById(id);
      if (!video) {
        return false;
      }
      
      // Supprimer le fichier du disque
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'videos', video.filename);
      await fs.unlink(filePath);
      
      // Supprimer l'entrée de la base de données
      const result = await db
        .delete(videos)
        .where(eq(videos.id, id))
        .returning({ id: videos.id });
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  async getVideosCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(videos);
    return Number(result[0].count);
  }

  // === Media Article Operations ===

  async getMediaByArticleId(articleId: number): Promise<MediaItem[]> {
    try {
      // Récupérer toutes les associations média-article pour cet article
      const mediaArticleLinks = await db
        .select()
        .from(mediaArticles)
        .where(eq(mediaArticles.articleId, articleId))
        .orderBy(mediaArticles.position);

      // Initialiser le tableau des médias
      const mediaItems: MediaItem[] = [];

      // Pour chaque association, récupérer les détails du média (image ou vidéo)
      for (const link of mediaArticleLinks) {
        if (link.mediaType === 'image') {
          // Récupérer l'image
          const image = await this.getImageById(link.mediaId);
          if (image) {
            // Convertir les valeurs null en undefined pour éviter les problèmes de type
            const caption = link.caption === null ? undefined : link.caption;
            const width = image.width === null ? undefined : image.width;
            const height = image.height === null ? undefined : image.height;
            
            mediaItems.push({
              mediaId: link.mediaId,
              articleId: link.articleId,
              mediaType: link.mediaType,
              type: 'image',
              url: image.url,
              originalName: image.originalName,
              caption: caption,
              position: link.position,
              size: image.size,
              width: width,
              height: height
            });
          }
        } else if (link.mediaType === 'video') {
          // Récupérer la vidéo
          const video = await this.getVideoById(link.mediaId);
          if (video) {
            // Convertir les valeurs null en undefined pour éviter les problèmes de type
            const caption = link.caption === null ? undefined : link.caption;
            const thumbnailUrl = video.thumbnailUrl === null ? undefined : video.thumbnailUrl;
            const duration = video.duration === null ? undefined : video.duration;
            
            mediaItems.push({
              mediaId: link.mediaId,
              articleId: link.articleId,
              mediaType: link.mediaType,
              type: 'video',
              url: video.url,
              originalName: video.originalName,
              caption: caption,
              position: link.position,
              thumbnailUrl: thumbnailUrl,
              duration: duration,
              size: video.size
            });
          }
        }
      }

      return mediaItems;
    } catch (error) {
      console.error('Error fetching media for article:', error);
      throw error;
    }
  }

  async addMediaToArticle(data: InsertMediaArticle): Promise<MediaArticle> {
    try {
      // Si la position n'est pas spécifiée, trouver la position la plus élevée et ajouter 1
      if (data.position === undefined) {
        const lastMediaArticle = await db
          .select()
          .from(mediaArticles)
          .where(eq(mediaArticles.articleId, data.articleId))
          .orderBy(desc(mediaArticles.position))
          .limit(1);
        
        data.position = lastMediaArticle.length > 0 ? lastMediaArticle[0].position + 1 : 0;
      }

      // Créer l'association
      const [newMediaArticle] = await db
        .insert(mediaArticles)
        .values({
          articleId: data.articleId,
          mediaType: data.mediaType,
          mediaId: data.mediaId,
          position: data.position || 0,
          caption: data.caption
          // La date sera gérée automatiquement par la base de données
        })
        .returning();
      
      return newMediaArticle;
    } catch (error) {
      console.error('Error adding media to article:', error);
      throw error;
    }
  }

  async updateMediaArticle(articleId: number, mediaType: string, mediaId: number, data: Partial<InsertMediaArticle>): Promise<MediaArticle | undefined> {
    try {
      const [updatedMediaArticle] = await db
        .update(mediaArticles)
        .set(data)
        .where(and(
          eq(mediaArticles.articleId, articleId),
          eq(mediaArticles.mediaType, mediaType as any),
          eq(mediaArticles.mediaId, mediaId)
        ))
        .returning();
      
      return updatedMediaArticle;
    } catch (error) {
      console.error('Error updating media article:', error);
      throw error;
    }
  }

  async removeMediaFromArticle(articleId: number, mediaType: string, mediaId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(mediaArticles)
        .where(and(
          eq(mediaArticles.articleId, articleId),
          eq(mediaArticles.mediaType, mediaType as any),
          eq(mediaArticles.mediaId, mediaId)
        ))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error removing media from article:', error);
      throw error;
    }
  }

  async reorderMediaArticles(data: { 
    articleId: number, 
    mediaPositions: { mediaId: number, mediaType: 'image' | 'video', position: number }[] 
  }): Promise<MediaArticle[]> {
    try {
      const updatedMediaArticles: MediaArticle[] = [];

      // Mettre à jour chaque position individuellement
      for (const item of data.mediaPositions) {
        const [updated] = await db
          .update(mediaArticles)
          .set({ position: item.position })
          .where(and(
            eq(mediaArticles.articleId, data.articleId),
            eq(mediaArticles.mediaType, item.mediaType),
            eq(mediaArticles.mediaId, item.mediaId)
          ))
          .returning();
        
        if (updated) {
          updatedMediaArticles.push(updated);
        }
      }

      // Trier les résultats par position
      return updatedMediaArticles.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Error reordering media articles:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
