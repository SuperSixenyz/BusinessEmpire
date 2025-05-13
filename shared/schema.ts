import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Game save schema
export const gameSaves = pgTable("game_saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  saveName: text("save_name").notNull(),
  gameState: jsonb("game_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGameSaveSchema = createInsertSchema(gameSaves).pick({
  userId: true,
  saveName: true,
  gameState: true,
});

// Game state types
export const businessTypeSchema = z.enum([
  "LEMONADE_STAND",
  "FREELANCE_GIG",
  "ONLINE_SHOP",
  "FOOD_TRUCK",
  "RETAIL_STORE",
  "TECH_STARTUP",
  "REAL_ESTATE",
  "FRANCHISE"
]);

export const stockSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  price: z.number(),
  volatility: z.number(),
  trend: z.number(),
  history: z.array(z.number()),
  owned: z.number().default(0),
  purchasePrice: z.number().optional(),
});

export const businessSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: businessTypeSchema,
  level: z.number(),
  revenue: z.number(),
  cost: z.number(),
  cash: z.number(),
  employees: z.number().default(0),
  upgrades: z.array(z.string()).default([]),
  purchasePrice: z.number(),
  upgradePrice: z.number(),
  unlocked: z.boolean().default(false),
  owned: z.boolean().default(false),
  description: z.string(),
  icon: z.string(),
});

export const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["PROPERTY", "VEHICLE", "LUXURY", "COLLECTIBLE"]),
  cost: z.number(),
  value: z.number(),
  appreciation: z.number(),
  owned: z.boolean().default(false),
  description: z.string(),
  icon: z.string(),
});

export const economicEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
  affectedBusinessTypes: z.array(businessTypeSchema).optional(),
  affectedStocks: z.array(z.string()).optional(),
  multiplier: z.number(),
  duration: z.number(),
  applied: z.boolean().default(false),
  turnsLeft: z.number().optional(),
});

export const gameStateSchema = z.object({
  player: z.object({
    name: z.string().optional(),
    cash: z.number(),
    netWorth: z.number(),
    businessesSold: z.number().default(0),
    upgradesPurchased: z.number().default(0),
    stocksTraded: z.number().default(0),
  }),
  turn: z.number(),
  businesses: z.array(businessSchema),
  stocks: z.array(stockSchema),
  assets: z.array(assetSchema),
  events: z.array(economicEventSchema),
  activeEvents: z.array(economicEventSchema),
  marketTrend: z.number(),
  economicHealth: z.number().min(0).max(100),
  unlockProgress: z.number(),
});

// Types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
export type GameSave = typeof gameSaves.$inferSelect;

export type BusinessType = z.infer<typeof businessTypeSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type EconomicEvent = z.infer<typeof economicEventSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
