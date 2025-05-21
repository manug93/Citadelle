import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum pour les types de média
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // Taille en octets
  width: integer("width"),
  height: integer("height"),
  uploadedBy: integer("uploaded_by").notNull(), // ID de l'utilisateur qui a téléchargé l'image
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Table pour les vidéos
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // Taille en octets
  duration: integer("duration"), // Durée en secondes
  thumbnailUrl: text("thumbnail_url"), // URL de la miniature
  uploadedBy: integer("uploaded_by").notNull(), // ID de l'utilisateur qui a téléchargé la vidéo
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  canCreateNews: boolean("can_create_news").default(false).notNull(),
  canViewContacts: boolean("can_view_contacts").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(), // Image principale/de couverture
  date: timestamp("date").defaultNow().notNull(),
  author: text("author"),
});

// Table pour associer des médias (images ou vidéos) aux articles
export const mediaArticles = pgTable("media_articles", {
  articleId: integer("article_id").notNull().references(() => news.id, { onDelete: 'cascade' }),
  mediaType: mediaTypeEnum("media_type").notNull(), // Type de média (image ou vidéo)
  mediaId: integer("media_id").notNull(), // ID de l'image ou de la vidéo
  position: integer("position").default(0).notNull(), // Position dans la galerie
  caption: text("caption"), // Légende optionnelle
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: { primaryKey: { columns: [table.articleId, table.mediaType, table.mediaId] } },
    // Check constraint to ensure that mediaId refers to a valid image or video depending on mediaType
    imageForeignKey: {
      foreignKey: {
        columns: [table.mediaId],
        foreignColumns: [images.id],
        name: "fk_media_article_image",
        match: "SIMPLE",
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      constraint: { name: "check_image_id", expression: `(media_type = 'image')` }
    },
    videoForeignKey: {
      foreignKey: {
        columns: [table.mediaId],
        foreignColumns: [videos.id],
        name: "fk_media_article_video",
        match: "SIMPLE",
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      constraint: { name: "check_video_id", expression: `(media_type = 'video')` }
    }
  };
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  canCreateNews: true,
  canViewContacts: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

// News schemas
export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  date: true,
});

// Contact schema
export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  date: true,
  isRead: true,
});

// Image schema
export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  uploadedAt: true,
});

export const renameImageSchema = z.object({
  newName: z.string().min(1, "Le nouveau nom est requis"),
});

// Video schema
export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadedAt: true,
  thumbnailUrl: true,
});

export const renameVideoSchema = z.object({
  newName: z.string().min(1, "Le nouveau nom est requis"),
});

// Media Article schema
export const insertMediaArticleSchema = createInsertSchema(mediaArticles).omit({
  id: true,
  addedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginUserSchema>;

export type NewsItem = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

// Type interne pour les opérations Drizzle
export type ContactDB = typeof contacts.$inferSelect;
// Type exposé pour l'API et le client
export interface Contact {
  id: number;
  name: string;
  email: string; 
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date; // Au lieu de date pour correspondre au client
}
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type RenameImageRequest = z.infer<typeof renameImageSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type RenameVideoRequest = z.infer<typeof renameVideoSchema>;

export type MediaArticle = typeof mediaArticles.$inferSelect;
export type InsertMediaArticle = z.infer<typeof insertMediaArticleSchema>;

// Type pour représenter un média (image ou vidéo) avec les informations complètes
export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  originalName: string;
  caption?: string;
  position: number;
  thumbnailUrl?: string; // Pour les vidéos
  width?: number; // Pour les images
  height?: number; // Pour les images
  duration?: number; // Pour les vidéos
  size: number;
}

// Type pour représenter un article avec ses médias
export interface NewsItemWithMedia extends NewsItem {
  media: MediaItem[];
}
