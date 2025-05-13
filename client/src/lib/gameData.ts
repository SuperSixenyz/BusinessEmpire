import { nanoid } from "nanoid";
import { 
  GameState,
  Business,
  Stock,
  Asset,
  EconomicEvent,
  BusinessType
} from "@shared/schema";

/**
 * Generates the initial game state for a new game
 */
export function generateInitialGameState(playerName?: string): GameState {
  return {
    player: {
      name: playerName,
      cash: 1000,
      netWorth: 1000,
      businessesSold: 0,
      upgradesPurchased: 0,
      stocksTraded: 0
    },
    turn: 1,
    businesses: generateBusinesses(),
    stocks: generateStocks(),
    assets: generateAssets(),
    events: generateEvents(),
    activeEvents: [],
    marketTrend: 0.05, // Slightly positive at start
    economicHealth: 70, // Good but not perfect
    unlockProgress: 0
  };
}

/**
 * Generates a list of businesses with increasing complexity and cost
 */
function generateBusinesses(): Business[] {
  const businesses: Business[] = [
    {
      id: nanoid(),
      name: "Lemonade Stand",
      type: "LEMONADE_STAND",
      level: 1,
      revenue: 100,
      cost: 50,
      cash: 0,
      employees: 0,
      upgrades: [],
      purchasePrice: 500,
      upgradePrice: 200,
      unlocked: true,
      owned: false,
      description: "A simple roadside lemonade stand. Low investment, modest returns.",
      icon: "lemonade"
    },
    {
      id: nanoid(),
      name: "Freelance Gig",
      type: "FREELANCE_GIG",
      level: 1,
      revenue: 150,
      cost: 75,
      cash: 0,
      employees: 0,
      upgrades: [],
      purchasePrice: 800,
      upgradePrice: 300,
      unlocked: true,
      owned: false,
      description: "Offer your skills as a freelancer. Low overhead with decent income.",
      icon: "freelance"
    },
    {
      id: nanoid(),
      name: "Online Shop",
      type: "ONLINE_SHOP",
      level: 1,
      revenue: 200,
      cost: 100,
      cash: 0,
      employees: 1,
      upgrades: [],
      purchasePrice: 1500,
      upgradePrice: 500,
      unlocked: false,
      owned: false,
      description: "Sell products online with global reach. Good growth potential.",
      icon: "shop"
    },
    {
      id: nanoid(),
      name: "Food Truck",
      type: "FOOD_TRUCK",
      level: 1,
      revenue: 300,
      cost: 150,
      cash: 0,
      employees: 2,
      upgrades: [],
      purchasePrice: 5000,
      upgradePrice: 1000,
      unlocked: false,
      owned: false,
      description: "Mobile food business serving tasty treats. Popular in urban areas.",
      icon: "foodtruck"
    },
    {
      id: nanoid(),
      name: "Retail Store",
      type: "RETAIL_STORE",
      level: 1,
      revenue: 500,
      cost: 250,
      cash: 0,
      employees: 5,
      upgrades: [],
      purchasePrice: 15000,
      upgradePrice: 3000,
      unlocked: false,
      owned: false,
      description: "Physical store selling products. Established business model.",
      icon: "retail"
    },
    {
      id: nanoid(),
      name: "Tech Startup",
      type: "TECH_STARTUP",
      level: 1,
      revenue: 1000,
      cost: 600,
      cash: 0,
      employees: 10,
      upgrades: [],
      purchasePrice: 50000,
      upgradePrice: 10000,
      unlocked: false,
      owned: false,
      description: "Innovative tech company with high risk and high reward potential.",
      icon: "tech"
    },
    {
      id: nanoid(),
      name: "Real Estate Agency",
      type: "REAL_ESTATE",
      level: 1,
      revenue: 2000,
      cost: 1000,
      cash: 0,
      employees: 15,
      upgrades: [],
      purchasePrice: 100000,
      upgradePrice: 20000,
      unlocked: false,
      owned: false,
      description: "Buy, sell, and rent properties. Stable income with growth potential.",
      icon: "realestate"
    },
    {
      id: nanoid(),
      name: "Restaurant Chain",
      type: "FRANCHISE",
      level: 1,
      revenue: 5000,
      cost: 2500,
      cash: 0,
      employees: 50,
      upgrades: [],
      purchasePrice: 250000,
      upgradePrice: 50000,
      unlocked: false,
      owned: false,
      description: "Expand your restaurant brand across multiple locations. High overhead but substantial returns.",
      icon: "franchise"
    }
  ];
  
  return businesses;
}

/**
 * Generates a list of stocks for the market
 */
function generateStocks(): Stock[] {
  // Generate random initial prices
  const getRandomPrice = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
  
  // Generate random history (past prices) for each stock
  const generateHistory = (currentPrice: number, volatility: number, points: number = 10) => {
    const history: number[] = [];
    let price = currentPrice * 0.8; // Start a bit lower
    
    for (let i = 0; i < points; i++) {
      // Random change based on volatility
      const change = (Math.random() - 0.5) * volatility * price;
      price += change;
      
      // Ensure price doesn't go below 1
      if (price < 1) price = 1 + Math.random() * 0.5;
      
      history.push(Math.round(price * 100) / 100);
    }
    
    return history;
  };
  
  const stocks: Stock[] = [
    {
      id: nanoid(),
      name: "Tech Innovations",
      symbol: "TCHN",
      price: getRandomPrice(10, 30),
      volatility: 3,
      trend: 0.5,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Global Retail",
      symbol: "GRTL",
      price: getRandomPrice(40, 60),
      volatility: 1.5,
      trend: 0.2,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Energy Solutions",
      symbol: "ENGY",
      price: getRandomPrice(20, 50),
      volatility: 2,
      trend: 0.3,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Banking Global",
      symbol: "BNKG",
      price: getRandomPrice(80, 120),
      volatility: 1.8,
      trend: 0.1,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Healthcare Plus",
      symbol: "HLTH",
      price: getRandomPrice(60, 90),
      volatility: 1.2,
      trend: 0.4,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Auto Manufacturers",
      symbol: "AUTO",
      price: getRandomPrice(30, 70),
      volatility: 2.2,
      trend: -0.1,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Real Estate Trust",
      symbol: "REIT",
      price: getRandomPrice(50, 80),
      volatility: 1,
      trend: 0.2,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Consumer Goods",
      symbol: "CNSG",
      price: getRandomPrice(25, 45),
      volatility: 1.3,
      trend: 0.3,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Social Media Co.",
      symbol: "SOCL",
      price: getRandomPrice(70, 110),
      volatility: 2.8,
      trend: 0.6,
      history: [],
      owned: 0
    },
    {
      id: nanoid(),
      name: "Aerospace Defense",
      symbol: "AERO",
      price: getRandomPrice(90, 150),
      volatility: 1.7,
      trend: 0.2,
      history: [],
      owned: 0
    }
  ];
  
  // Generate history for each stock
  stocks.forEach(stock => {
    stock.history = generateHistory(stock.price, stock.volatility);
  });
  
  return stocks;
}

/**
 * Generates a list of assets that can be purchased
 */
function generateAssets(): Asset[] {
  const assets: Asset[] = [
    // Property assets
    {
      id: nanoid(),
      name: "Small Apartment",
      type: "PROPERTY",
      cost: 100000,
      value: 100000,
      appreciation: 0.02, // 2% per turn
      owned: false,
      description: "A modest apartment in the city.",
      icon: "apartment"
    },
    {
      id: nanoid(),
      name: "Suburban House",
      type: "PROPERTY",
      cost: 250000,
      value: 250000,
      appreciation: 0.025, // 2.5% per turn
      owned: false,
      description: "A comfortable family home in the suburbs.",
      icon: "house"
    },
    {
      id: nanoid(),
      name: "Luxury Mansion",
      type: "PROPERTY",
      cost: 1000000,
      value: 1000000,
      appreciation: 0.03, // 3% per turn
      owned: false,
      description: "An impressive mansion with all amenities.",
      icon: "mansion"
    },
    
    // Vehicle assets
    {
      id: nanoid(),
      name: "Luxury Sedan",
      type: "VEHICLE",
      cost: 50000,
      value: 50000,
      appreciation: -0.05, // -5% per turn (depreciation)
      owned: false,
      description: "A high-end luxury sedan.",
      icon: "car"
    },
    {
      id: nanoid(),
      name: "Sports Car",
      type: "VEHICLE",
      cost: 200000,
      value: 200000,
      appreciation: -0.03, // -3% per turn (slower depreciation)
      owned: false,
      description: "A high-performance sports car.",
      icon: "sportscar"
    },
    {
      id: nanoid(),
      name: "Yacht",
      type: "VEHICLE",
      cost: 500000,
      value: 500000,
      appreciation: -0.02, // -2% per turn
      owned: false,
      description: "A luxury yacht for ocean adventures.",
      icon: "yacht"
    },
    
    // Luxury items
    {
      id: nanoid(),
      name: "Luxury Watch",
      type: "LUXURY",
      cost: 20000,
      value: 20000,
      appreciation: 0.01, // 1% per turn
      owned: false,
      description: "A high-end luxury timepiece.",
      icon: "watch"
    },
    {
      id: nanoid(),
      name: "Fine Jewelry",
      type: "LUXURY",
      cost: 75000,
      value: 75000,
      appreciation: 0.015, // 1.5% per turn
      owned: false,
      description: "Exquisite jewelry with precious gems.",
      icon: "jewellery"
    },
    
    // Collectibles
    {
      id: nanoid(),
      name: "Fine Art",
      type: "COLLECTIBLE",
      cost: 150000,
      value: 150000,
      appreciation: 0.035, // 3.5% per turn
      owned: false,
      description: "A valuable piece of fine art.",
      icon: "art"
    },
    {
      id: nanoid(),
      name: "Rare Coin Collection",
      type: "COLLECTIBLE",
      cost: 80000,
      value: 80000,
      appreciation: 0.025, // 2.5% per turn
      owned: false,
      description: "A collection of rare and valuable coins.",
      icon: "coin"
    }
  ];
  
  return assets;
}

/**
 * Generates economic events that can occur during the game
 */
function generateEvents(): EconomicEvent[] {
  const events: EconomicEvent[] = [
    // Positive events
    {
      id: nanoid(),
      title: "Economic Boom",
      description: "The economy is experiencing unprecedented growth, boosting all businesses.",
      type: "POSITIVE",
      multiplier: 1.2, // 20% boost
      duration: 3,
      applied: false
    },
    {
      id: nanoid(),
      title: "Tech Revolution",
      description: "New technology has revolutionized the tech industry, increasing profits.",
      type: "POSITIVE",
      affectedBusinessTypes: ["TECH_STARTUP"],
      multiplier: 1.5, // 50% boost
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Tourism Surge",
      description: "A surge in tourism benefits local businesses.",
      type: "POSITIVE",
      affectedBusinessTypes: ["FOOD_TRUCK", "RETAIL_STORE"],
      multiplier: 1.3, // 30% boost
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Stock Market Rally",
      description: "The stock market is experiencing a strong rally.",
      type: "POSITIVE",
      affectedStocks: [], // Will be filled with actual stock IDs
      multiplier: 1.4, // 40% boost
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Real Estate Boom",
      description: "Property values are rising rapidly.",
      type: "POSITIVE",
      affectedBusinessTypes: ["REAL_ESTATE"],
      multiplier: 1.4, // 40% boost
      duration: 3,
      applied: false
    },
    
    // Negative events
    {
      id: nanoid(),
      title: "Economic Recession",
      description: "An economic downturn is affecting all businesses negatively.",
      type: "NEGATIVE",
      multiplier: 0.8, // 20% reduction
      duration: 3,
      applied: false
    },
    {
      id: nanoid(),
      title: "Supply Chain Issues",
      description: "Supply chain disruptions are impacting retail businesses.",
      type: "NEGATIVE",
      affectedBusinessTypes: ["RETAIL_STORE", "ONLINE_SHOP"],
      multiplier: 0.7, // 30% reduction
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Food Safety Concern",
      description: "Food safety concerns have reduced customers for food businesses.",
      type: "NEGATIVE",
      affectedBusinessTypes: ["FOOD_TRUCK", "FRANCHISE"],
      multiplier: 0.6, // 40% reduction
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Market Crash",
      description: "The stock market is experiencing a significant crash.",
      type: "NEGATIVE",
      affectedStocks: [], // Will be filled with actual stock IDs
      multiplier: 0.6, // 40% reduction
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Interest Rate Hike",
      description: "Rising interest rates are affecting real estate businesses.",
      type: "NEGATIVE",
      affectedBusinessTypes: ["REAL_ESTATE"],
      multiplier: 0.7, // 30% reduction
      duration: 3,
      applied: false
    },
    
    // Neutral events
    {
      id: nanoid(),
      title: "Market Shift",
      description: "The market is shifting, creating winners and losers.",
      type: "NEUTRAL",
      multiplier: 1.0, // No change overall
      duration: 2,
      applied: false
    },
    {
      id: nanoid(),
      title: "Consumer Trends Changing",
      description: "Consumer preferences are evolving rapidly.",
      type: "NEUTRAL",
      multiplier: 1.0, // No change overall
      duration: 2,
      applied: false
    }
  ];
  
  return events;
}
