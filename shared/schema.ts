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
  "FRANCHISE",
  "SOCIAL_MEDIA",
  "CRYPTO_MINING",
  "DROPSHIPPING",
  "MOBILE_GAME",
  "CONTENT_CREATION",
  "CONSULTING",
  "DAY_TRADING",
  "AFFILIATE_MARKETING"
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

export const resourceTypeSchema = z.enum([
  "STAFF",
  "SUPPLIER",
  "EQUIPMENT",
  "LOCATION",
  "MARKETING",
  "TECHNOLOGY",
  "TRAINING",
  "LICENSE",
  "LOGISTICS",
  "RESEARCH"
]);

export const resourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: resourceTypeSchema,
  description: z.string(),
  cost: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(5),
  revenueBonus: z.number().default(0),
  efficiencyBonus: z.number().default(0),
  qualityBonus: z.number().default(0),
  unlocked: z.boolean().default(false),
  acquired: z.boolean().default(false),
  prerequisiteUpgradeIds: z.array(z.string()).default([]),
  icon: z.string().optional()
});

export const upgradeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  revenueMultiplier: z.number(),
  costReduction: z.number().default(0),
  unlocked: z.boolean().default(true),
  purchased: z.boolean().default(false),
  prerequisiteUpgradeIds: z.array(z.string()).default([]),
  requiredResources: z.array(resourceTypeSchema).default([]),
  icon: z.string().optional()
});

export const businessStrategySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  revenueMultiplier: z.number(),
  costMultiplier: z.number(),
  riskLevel: z.number().min(1).max(10),
  unlocked: z.boolean().default(true),
  active: z.boolean().default(false)
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
  resources: z.array(resourceSchema).default([]),
  upgrades: z.array(upgradeSchema).default([]),
  strategies: z.array(businessStrategySchema).default([]),
  purchasePrice: z.number(),
  upgradePrice: z.number(),
  unlocked: z.boolean().default(false),
  owned: z.boolean().default(false),
  description: z.string(),
  icon: z.string(),
  autoSell: z.boolean().default(false),
  boostActive: z.boolean().default(false),
  specialAbility: z.string().optional(),
  quickMoneyOption: z.boolean().default(false),
  expansionLevel: z.number().default(1),
  expansionCost: z.number().default(0),
  maxExpansions: z.number().default(5),
  managementLevel: z.number().refine(val => val >= 1 && val <= 5, {
    message: "Management level must be between 1 and 5"
  }).default(1),
  productQuality: z.number().min(1).max(10).default(5),
  customerSatisfaction: z.number().min(1).max(100).default(70),
  operationalEfficiency: z.number().min(1).max(100).default(50),
  marketingLevel: z.number().min(0).max(10).default(1),
  researchPoints: z.number().default(0),
  locationTier: z.number().min(1).max(5).default(1)
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

export const cryptoAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  price: z.number(),
  volatility: z.number().min(1).max(10),
  trend: z.number(),
  history: z.array(z.number()),
  owned: z.number().default(0),
  purchasePrice: z.number().optional(),
  marketCap: z.number(),
  tradingVolume: z.number()
});

export const realEstateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "LAND"]),
  location: z.string(),
  purchasePrice: z.number(),
  currentValue: z.number(),
  rentalIncome: z.number(),
  maintenanceCost: z.number(),
  appreciationRate: z.number(),
  owned: z.boolean().default(false),
  mortgageRate: z.number().optional(),
  mortgageAmount: z.number().optional(),
  mortgageTermMonths: z.number().optional(),
  rentalStatus: z.enum(["VACANT", "OCCUPIED", "UNDER_RENOVATION"]).default("VACANT")
});

export const stockBrokerSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.number().min(1).max(5),
  fee: z.number(),
  insiderTipChance: z.number().min(0).max(100),
  unlocked: z.boolean().default(false),
  hired: z.boolean().default(false)
});

export const passiveIncomeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["DIVIDEND", "INTEREST", "ROYALTY", "AFFILIATE", "SUBSCRIPTION", "RENTAL", "AD_REVENUE"]),
  description: z.string(),
  income: z.number(),
  initialCost: z.number(),
  active: z.boolean().default(false),
  cooldownTurns: z.number().default(0),
  maxLevel: z.number().default(5),
  currentLevel: z.number().default(1),
  upgradeMultiplier: z.number().default(1.5),
  upgradeCost: z.number()
});

export const gameStateSchema = z.object({
  player: z.object({
    name: z.string().optional(),
    cash: z.number(),
    netWorth: z.number(),
    businessesSold: z.number().default(0),
    upgradesPurchased: z.number().default(0),
    stocksTraded: z.number().default(0),
    skills: z.object({
      management: z.number().min(1).max(10).default(1),
      negotiation: z.number().min(1).max(10).default(1),
      marketing: z.number().min(1).max(10).default(1),
      finance: z.number().min(1).max(10).default(1),
      technology: z.number().min(1).max(10).default(1),
      research: z.number().min(1).max(10).default(1)
    }).default({
      management: 1,
      negotiation: 1,
      marketing: 1,
      finance: 1,
      technology: 1,
      research: 1
    }),
    skillPoints: z.number().default(0),
    experience: z.number().default(0),
    level: z.number().default(1)
  }),
  turn: z.number(),
  businesses: z.array(businessSchema),
  stocks: z.array(stockSchema),
  cryptoAssets: z.array(cryptoAssetSchema).default([]),
  realEstateProperties: z.array(realEstateSchema).default([]),
  passiveIncomes: z.array(passiveIncomeSchema).default([]),
  stockBrokers: z.array(stockBrokerSchema).default([]),
  assets: z.array(assetSchema),
  events: z.array(economicEventSchema),
  activeEvents: z.array(economicEventSchema),
  marketTrend: z.number(),
  economicHealth: z.number().min(0).max(100),
  unlockProgress: z.number(),
  stockMarketFee: z.number().default(0.01), // 1% transaction fee
  stockMarketOpen: z.boolean().default(true), // Can close due to events
  dayTradingUnlocked: z.boolean().default(false),
  foreignCurrencyUnlocked: z.boolean().default(false),
  realEstateUnlocked: z.boolean().default(false)
});

// Types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
export type GameSave = typeof gameSaves.$inferSelect;

export type BusinessType = z.infer<typeof businessTypeSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type Upgrade = z.infer<typeof upgradeSchema>;
export type BusinessStrategy = z.infer<typeof businessStrategySchema>;
export type Business = z.infer<typeof businessSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type CryptoAsset = z.infer<typeof cryptoAssetSchema>;
export type RealEstate = z.infer<typeof realEstateSchema>;
export type StockBroker = z.infer<typeof stockBrokerSchema>;
export type PassiveIncome = z.infer<typeof passiveIncomeSchema>;
export type EconomicEvent = z.infer<typeof economicEventSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
