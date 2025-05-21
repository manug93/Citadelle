import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { renameVideoSchema } from "@shared/schema";
import { uploadConfig, generateFilename } from "../upload-config";

export function registerVideoRoutes(app: Express) {
  // Get all videos (protected - admin only)
  app.get("/api/videos", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  // Get single video (protected - admin only)
  app.get("/api/videos/:id", async (req, res) => {
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
      
      const video = await storage.getVideoById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Error fetching video" });
    }
  });

  // Upload video (protected - admin only)
  app.post("/api/videos", uploadConfig.single('video'), async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }
      
      // Generate a unique filename
      const originalname = req.file.originalname;
      const filename = generateFilename(originalname);
      
      // Prepare the video data
      const videoData = {
        filename,
        originalName: originalname,
        url: `/uploads/videos/${filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.id
      };
      
      // Save video metadata to database
      const savedVideo = await storage.saveVideo(videoData, req.file.buffer);
      
      res.status(201).json(savedVideo);
    } catch (error) {
      res.status(500).json({ message: "Error uploading video" });
    }
  });

  // Rename video (protected - admin only)
  app.patch("/api/videos/:id/rename", async (req, res) => {
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
      
      // Validate request body
      const parseResult = renameVideoSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }
      
      // Rename video
      const updatedVideo = await storage.renameVideo(id, parseResult.data.newName);
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: "Error renaming video" });
    }
  });

  // Delete video (protected - admin only)
  app.delete("/api/videos/:id", async (req, res) => {
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
      
      // Delete video
      const success = await storage.deleteVideo(id);
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting video" });
    }
  });
}