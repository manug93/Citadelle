import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertNewsSchema, insertContactSchema, insertUserSchema, insertImageSchema, renameImageSchema } from "@shared/schema";
import { z } from "zod";
import { uploadConfig, getImageDimensions, generateFilename } from "./upload-config";
import path from "path";

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
      
      // Get the updated contact and return it
      const contact = await storage.getContactById(id);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Error marking contact as read" });
    }
  });
  
  // Also support POST for marking as read (needed for client compatibility)
  app.post("/api/contacts/:id/read", async (req, res) => {
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

  // === User Management Routes ===
  
  // Get all users (protected - admin only)
  app.get("/api/users", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Get specific user (protected - admin only)
  app.get("/api/users/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or the user being requested
      if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Create user (protected - admin only)
  app.post("/api/users", async (req, res) => {
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
      const parseResult = insertUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid user data", errors: parseResult.error.errors });
      }
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(parseResult.data.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(parseResult.data.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const newUser = await storage.createUser(parseResult.data);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Update user (protected - admin or self)
  app.patch("/api/users/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if user is admin or the user being updated
      if (req.user.role !== "admin" && req.user.id !== id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // If not admin, restrict fields that can be updated
      let fieldSchema = insertUserSchema.partial();
      if (req.user.role !== "admin") {
        fieldSchema = insertUserSchema.pick({
          password: true,
          email: true
        }).partial();
      }
      
      // Validate request body
      const parseResult = fieldSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid user data", errors: parseResult.error.errors });
      }
      
      // Check if user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If email is being updated, check if it's already in use
      if (parseResult.data.email && parseResult.data.email !== existingUser.email) {
        const existingUserByEmail = await storage.getUserByEmail(parseResult.data.email);
        if (existingUserByEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(id, parseResult.data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  // Delete user (protected - admin only)
  app.delete("/api/users/:id", async (req, res) => {
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
      
      // Don't allow deleting yourself
      if (req.user.id === id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      // Delete user
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // Get stats for dashboard
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user has appropriate permissions
      if (req.user.role !== "admin" && !(req.user.canCreateNews || req.user.canViewContacts)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Get stats
      const newsCount = await storage.getNewsCount();
      const unreadContactsCount = await storage.getUnreadContactsCount();
      const totalContactsCount = await storage.getContactsCount();
      const usersCount = req.user.role === "admin" ? await storage.getUsersCount() : null;
      
      res.json({
        newsCount,
        unreadContactsCount,
        contactsCount: totalContactsCount,
        usersCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // === Image Management Routes ===
  
  // Get all images (protected - admin only)
  app.get("/api/images", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or can create news
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Error fetching images" });
    }
  });

  // Get specific image (protected - admin only)
  app.get("/api/images/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or can create news
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const image = await storage.getImageById(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: "Error fetching image" });
    }
  });

  // Upload image (protected - admin only)
  app.post("/api/images", uploadConfig.single('image'), async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or can create news
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Check file
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      // Generate unique filename
      const filename = generateFilename(req.file.originalname);
      
      // Get image dimensions
      const dimensions = await getImageDimensions(req.file.buffer);
      
      // Create URL for client
      const url = `/uploads/${filename}`;
      
      // Create image record
      const imageData = {
        filename,
        originalName: req.file.originalname,
        url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: dimensions.width,
        height: dimensions.height,
        uploadedBy: req.user.id
      };
      
      // Save image
      const savedImage = await storage.saveImage(imageData, req.file.buffer);
      
      res.status(201).json(savedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  });

  // Rename image (protected - admin only)
  app.patch("/api/images/:id/rename", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or can create news
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Validate request body
      const parseResult = renameImageSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }
      
      // Rename image
      const updatedImage = await storage.renameImage(id, parseResult.data.newName);
      if (!updatedImage) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.json(updatedImage);
    } catch (error) {
      res.status(500).json({ message: "Error renaming image" });
    }
  });

  // Delete image (protected - admin only)
  app.delete("/api/images/:id", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin or can create news
      if (req.user.role !== "admin" && !req.user.canCreateNews) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Delete image
      const success = await storage.deleteImage(id);
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting image" });
    }
  });

  // Serve static files from the uploads directory
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
