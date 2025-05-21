import { Express } from "express";
import { storage } from "../storage";
import { insertMediaArticleSchema } from "@shared/schema";
import { z } from "zod";

export function registerMediaArticleRoutes(app: Express) {
  // Get media for an article
  app.get("/api/news/:id/media", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid article ID format" });
      }
      
      // Check if article exists
      const article = await storage.getNewsById(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Get media items for this article
      const mediaItems = await storage.getMediaByArticleId(articleId);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching media for article" });
    }
  });

  // Get media by article ID (for admin routes)
  app.get("/api/media-articles/article/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or has content permissions
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid article ID format" });
      }
      
      // Get media items for this article
      const mediaItems = await storage.getMediaByArticleId(articleId);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching media for article" });
    }
  });

  // Create media-article association (protected - admin only)
  app.post("/api/media-articles", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Validate request body
      const parseResult = insertMediaArticleSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }
      
      // Create media-article association
      const newMediaArticle = await storage.addMediaToArticle(parseResult.data);
      res.status(201).json(newMediaArticle);
    } catch (error) {
      res.status(500).json({ message: "Error creating media-article association" });
    }
  });

  // Update media-article association (protected - admin only)
  app.patch("/api/media-articles/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Validate request body (partial fields are allowed)
      const updateSchema = insertMediaArticleSchema.pick({
        caption: true,
        position: true
      }).partial();
      
      const parseResult = updateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }
      
      // Update media-article
      const updatedMediaArticle = await storage.updateMediaArticle(id, parseResult.data);
      if (!updatedMediaArticle) {
        return res.status(404).json({ message: "Media-article association not found" });
      }
      
      res.json(updatedMediaArticle);
    } catch (error) {
      res.status(500).json({ message: "Error updating media-article association" });
    }
  });

  // Delete media-article association (protected - admin only)
  app.delete("/api/media-articles/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Delete media-article association
      const success = await storage.removeMediaFromArticle(id);
      if (!success) {
        return res.status(404).json({ message: "Media-article association not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting media-article association" });
    }
  });

  // Reorder media-article positions (protected - admin only)
  app.post("/api/media-articles/reorder", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Validate request body
      const reorderSchema = z.object({
        articleId: z.number(),
        mediaPositions: z.array(z.object({
          id: z.number(),
          position: z.number()
        }))
      });
      
      const parseResult = reorderSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }
      
      // Reorder media-articles
      const updatedMediaArticles = await storage.reorderMediaArticles(parseResult.data);
      res.json(updatedMediaArticles);
    } catch (error) {
      res.status(500).json({ message: "Error reordering media-articles" });
    }
  });
}