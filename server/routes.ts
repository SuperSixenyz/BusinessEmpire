import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { gameStateSchema, insertGameSaveSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Get all game saves for a user
  router.get("/saves", async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    try {
      const saves = await storage.getGameSaves(parseInt(userId));
      res.json(saves);
    } catch (error) {
      console.error("Error fetching game saves:", error);
      res.status(500).json({ message: "Failed to fetch game saves" });
    }
  });
  
  // Get a specific game save
  router.get("/saves/:id", async (req, res) => {
    const saveId = parseInt(req.params.id);
    if (isNaN(saveId)) {
      return res.status(400).json({ message: "Invalid save ID" });
    }
    
    try {
      const save = await storage.getGameSave(saveId);
      if (!save) {
        return res.status(404).json({ message: "Game save not found" });
      }
      res.json(save);
    } catch (error) {
      console.error("Error fetching game save:", error);
      res.status(500).json({ message: "Failed to fetch game save" });
    }
  });
  
  // Create a new game save
  router.post("/saves", async (req, res) => {
    try {
      const saveData = insertGameSaveSchema.parse(req.body);
      const newSave = await storage.createGameSave(saveData);
      res.status(201).json(newSave);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game save data", errors: error.errors });
      }
      console.error("Error creating game save:", error);
      res.status(500).json({ message: "Failed to create game save" });
    }
  });
  
  // Update an existing game save
  router.put("/saves/:id", async (req, res) => {
    const saveId = parseInt(req.params.id);
    if (isNaN(saveId)) {
      return res.status(400).json({ message: "Invalid save ID" });
    }
    
    try {
      const gameState = gameStateSchema.parse(req.body.gameState);
      const updated = await storage.updateGameSave(saveId, { gameState });
      if (!updated) {
        return res.status(404).json({ message: "Game save not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game state data", errors: error.errors });
      }
      console.error("Error updating game save:", error);
      res.status(500).json({ message: "Failed to update game save" });
    }
  });
  
  // Delete a game save
  router.delete("/saves/:id", async (req, res) => {
    const saveId = parseInt(req.params.id);
    if (isNaN(saveId)) {
      return res.status(400).json({ message: "Invalid save ID" });
    }
    
    try {
      const deleted = await storage.deleteGameSave(saveId);
      if (!deleted) {
        return res.status(404).json({ message: "Game save not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting game save:", error);
      res.status(500).json({ message: "Failed to delete game save" });
    }
  });
  
  // Register a new user
  router.post("/users", async (req, res) => {
    try {
      const userData = { username: req.body.username, password: req.body.password };
      const user = await storage.getUserByUsername(userData.username);
      if (user) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Authenticate a user
  router.post("/users/auth", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  // Register all routes with /api prefix
  app.use("/api", router);
  
  return app;
}
