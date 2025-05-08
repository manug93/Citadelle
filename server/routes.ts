import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertNewsSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // News routes
  // Get all news items
  app.get("/api/news", async (req, res) => {
    try {
      let allNews = await storage.getAllNews();
      
      // Handle limit parameter
      const limitSchema = z.object({
        limit: z.coerce.number().optional()
      });
      
      const queryResult = limitSchema.safeParse(req.query);
      if (queryResult.success && queryResult.data.limit) {
        allNews = allNews.slice(0, queryResult.data.limit);
      }
      
      res.json(allNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  // Get single news item
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const newsItem = await storage.getNewsById(id);
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news item" });
    }
  });

  // Create news item (protected - admin only)
  app.post("/api/news", async (req, res) => {
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
      const parseResult = insertNewsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid news data", errors: parseResult.error.errors });
      }
      
      // Create news item
      const newNews = await storage.createNews(parseResult.data);
      res.status(201).json(newNews);
    } catch (error) {
      res.status(500).json({ message: "Error creating news item" });
    }
  });

  // Update news item (protected - admin only)
  app.patch("/api/news/:id", async (req, res) => {
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
      
      // Check if news exists
      const existingNews = await storage.getNewsById(id);
      if (!existingNews) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      // Validate request body
      const parseResult = insertNewsSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid news data", errors: parseResult.error.errors });
      }
      
      // Update news item
      const updatedNews = await storage.updateNews(id, {...existingNews, ...parseResult.data});
      res.json(updatedNews);
    } catch (error) {
      res.status(500).json({ message: "Error updating news item" });
    }
  });

  // Delete news item (protected - admin only)
  app.delete("/api/news/:id", async (req, res) => {
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
      
      // Check if news exists and delete
      const success = await storage.deleteNews(id);
      if (!success) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting news item" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const parseResult = insertContactSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid contact form data", errors: parseResult.error.errors });
      }
      
      // Create contact entry
      const newContact = await storage.createContact(parseResult.data);
      res.status(201).json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  // Get all contacts (protected - admin only)
  app.get("/api/contacts", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });

  // Mark contact as read (protected - admin only)
  app.patch("/api/contacts/:id/read", async (req, res) => {
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
      
      // Mark as read
      const success = await storage.markContactAsRead(id);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error updating contact status" });
    }
  });

  // Delete contact (protected - admin only)
  app.delete("/api/contacts/:id", async (req, res) => {
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
      
      // Delete contact
      const success = await storage.deleteContact(id);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
