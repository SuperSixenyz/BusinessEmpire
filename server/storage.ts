import { users, type User, type InsertUser, gameSaves, type GameSave, type InsertGameSave, type GameState } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game save methods
  getGameSaves(userId: number): Promise<GameSave[]>;
  getGameSave(id: number): Promise<GameSave | undefined>;
  createGameSave(save: InsertGameSave): Promise<GameSave>;
  updateGameSave(id: number, updates: Partial<{ gameState: GameState }>): Promise<GameSave | undefined>;
  deleteGameSave(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSaves: Map<number, GameSave>;
  private userIdCounter: number;
  private saveIdCounter: number;

  constructor() {
    this.users = new Map();
    this.gameSaves = new Map();
    this.userIdCounter = 1;
    this.saveIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game save methods
  async getGameSaves(userId: number): Promise<GameSave[]> {
    return Array.from(this.gameSaves.values()).filter(
      (save) => save.userId === userId,
    );
  }
  
  async getGameSave(id: number): Promise<GameSave | undefined> {
    return this.gameSaves.get(id);
  }
  
  async createGameSave(save: InsertGameSave): Promise<GameSave> {
    const id = this.saveIdCounter++;
    const now = new Date();
    const gameSave: GameSave = { 
      ...save, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.gameSaves.set(id, gameSave);
    return gameSave;
  }
  
  async updateGameSave(id: number, updates: Partial<{ gameState: GameState }>): Promise<GameSave | undefined> {
    const save = this.gameSaves.get(id);
    if (!save) return undefined;
    
    const updatedSave: GameSave = {
      ...save,
      ...updates,
      updatedAt: new Date()
    };
    
    this.gameSaves.set(id, updatedSave);
    return updatedSave;
  }
  
  async deleteGameSave(id: number): Promise<boolean> {
    return this.gameSaves.delete(id);
  }
}

export const storage = new MemStorage();
