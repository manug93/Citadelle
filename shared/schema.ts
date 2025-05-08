import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  author: text("author"),
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginUserSchema>;

export type NewsItem = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type RenameImageRequest = z.infer<typeof renameImageSchema>;
