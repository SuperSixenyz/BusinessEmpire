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
  // Create standard upgrade options
  const createUpgrades = (businessType: BusinessType, baseUpgradePrice: number) => {
    return [
      {
        id: nanoid(),
        name: "Efficiency Optimization",
        description: "Streamline operations to increase revenue by 15%.",
        cost: baseUpgradePrice * 1.2,
        revenueMultiplier: 1.15,
        costReduction: 0,
        unlocked: true,
        purchased: false,
        icon: "chart-up"
      },
      {
        id: nanoid(),
        name: "Cost Reduction",
        description: "Reduce operational costs by 10%.",
        cost: baseUpgradePrice * 1.5,
        revenueMultiplier: 1.0,
        costReduction: 0.1,
        unlocked: true,
        purchased: false,
        icon: "chart-down"
      },
      {
        id: nanoid(),
        name: "Premium Offerings",
        description: "Introduce premium options to increase revenue by 25%.",
        cost: baseUpgradePrice * 2,
        revenueMultiplier: 1.25,
        costReduction: 0,
        unlocked: true,
        purchased: false,
        icon: "star"
      }
    ];
  };

  // Create business strategies
  const createStrategies = (businessType: BusinessType) => {
    return [
      {
        id: nanoid(),
        name: "Aggressive Growth",
        description: "Focus on rapid expansion with higher revenue but increased costs.",
        revenueMultiplier: 1.4,
        costMultiplier: 1.2,
        riskLevel: 7,
        unlocked: true,
        active: false
      },
      {
        id: nanoid(),
        name: "Balanced Approach",
        description: "Maintain a balance between growth and stability.",
        revenueMultiplier: 1.2,
        costMultiplier: 1.1,
        riskLevel: 4,
        unlocked: true,
        active: false
      },
      {
        id: nanoid(),
        name: "Conservative Management",
        description: "Focus on stability and cost reduction with slower growth.",
        revenueMultiplier: 1.1,
        costMultiplier: 0.9,
        riskLevel: 2,
        unlocked: true,
        active: false
      }
    ];
  };

  // Original businesses with enhanced features
  const originalBusinesses = [
    {
      id: nanoid(),
      name: "Lemonade Stand",
      type: "LEMONADE_STAND",
      level: 1,
      revenue: 100,
      cost: 50,
      cash: 0,
      employees: 0,
      upgrades: createUpgrades("LEMONADE_STAND", 200),
      strategies: createStrategies("LEMONADE_STAND"),
      purchasePrice: 500,
      upgradePrice: 200,
      unlocked: true,
      owned: false,
      description: "A simple roadside lemonade stand. Low investment, modest returns.",
      icon: "lemonade",
      autoSell: false,
      boostActive: false,
      specialAbility: "Quick Sales: Generate a small immediate cash boost once per day",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("FREELANCE_GIG", 300),
      strategies: createStrategies("FREELANCE_GIG"),
      purchasePrice: 800,
      upgradePrice: 300,
      unlocked: true,
      owned: false,
      description: "Offer your skills as a freelancer. Low overhead with decent income.",
      icon: "freelance",
      autoSell: false,
      boostActive: false,
      specialAbility: "Rush Job: Take on an urgent project for double pay but increased stress",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("ONLINE_SHOP", 500),
      strategies: createStrategies("ONLINE_SHOP"),
      purchasePrice: 1500,
      upgradePrice: 500,
      unlocked: false,
      owned: false,
      description: "Sell products online with global reach. Good growth potential.",
      icon: "shop",
      autoSell: false,
      boostActive: false,
      specialAbility: "Flash Sale: Run a promotional sale to quickly generate cash",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("FOOD_TRUCK", 1000),
      strategies: createStrategies("FOOD_TRUCK"),
      purchasePrice: 5000,
      upgradePrice: 1000,
      unlocked: false,
      owned: false,
      description: "Mobile food business serving tasty treats. Popular in urban areas.",
      icon: "foodtruck",
      autoSell: false,
      boostActive: false,
      specialAbility: "Special Event Catering: Cater a special event for a large one-time payment",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("RETAIL_STORE", 3000),
      strategies: createStrategies("RETAIL_STORE"),
      purchasePrice: 15000,
      upgradePrice: 3000,
      unlocked: false,
      owned: false,
      description: "Physical store selling products. Established business model.",
      icon: "retail",
      autoSell: false,
      boostActive: false,
      specialAbility: "Inventory Clearance: Sell excess inventory at a discount for quick cash",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("TECH_STARTUP", 10000),
      strategies: createStrategies("TECH_STARTUP"),
      purchasePrice: 50000,
      upgradePrice: 10000,
      unlocked: false,
      owned: false,
      description: "Innovative tech company with high risk and high reward potential.",
      icon: "tech",
      autoSell: false,
      boostActive: false,
      specialAbility: "Venture Funding: Secure a round of funding for immediate cash injection",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("REAL_ESTATE", 20000),
      strategies: createStrategies("REAL_ESTATE"),
      purchasePrice: 100000,
      upgradePrice: 20000,
      unlocked: false,
      owned: false,
      description: "Buy, sell, and rent properties. Stable income with growth potential.",
      icon: "realestate",
      autoSell: false,
      boostActive: false,
      specialAbility: "Luxury Sale: Broker a high-end property deal for a large commission",
      quickMoneyOption: true,
      managementLevel: 1
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
      upgrades: createUpgrades("FRANCHISE", 50000),
      strategies: createStrategies("FRANCHISE"),
      purchasePrice: 250000,
      upgradePrice: 50000,
      unlocked: false,
      owned: false,
      description: "Expand your restaurant brand across multiple locations. High overhead but substantial returns.",
      icon: "franchise",
      autoSell: false,
      boostActive: false,
      specialAbility: "Celebrity Partnership: Partner with a celebrity for a marketing boost",
      quickMoneyOption: false,
      managementLevel: 1
    }
  ];

  // New quick money-making businesses
  const quickMoneyBusinesses = [
    {
      id: nanoid(),
      name: "Social Media Influencer",
      type: "SOCIAL_MEDIA",
      level: 1,
      revenue: 180,
      cost: 70,
      cash: 0,
      employees: 0,
      upgrades: createUpgrades("SOCIAL_MEDIA", 350),
      strategies: createStrategies("SOCIAL_MEDIA"),
      purchasePrice: 1000,
      upgradePrice: 350,
      unlocked: true,
      owned: false,
      description: "Build a following and monetize your content. Low startup costs with viral potential.",
      icon: "socialMedia",
      autoSell: false,
      boostActive: false,
      specialAbility: "Sponsored Post: Create sponsored content for immediate payment",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Crypto Mining Operation",
      type: "CRYPTO_MINING",
      level: 1,
      revenue: 250,
      cost: 150,
      cash: 0,
      employees: 1,
      upgrades: createUpgrades("CRYPTO_MINING", 800),
      strategies: createStrategies("CRYPTO_MINING"),
      purchasePrice: 2000,
      upgradePrice: 800,
      unlocked: false,
      owned: false,
      description: "Mine cryptocurrency with specialized hardware. Volatile but potentially lucrative.",
      icon: "crypto",
      autoSell: false,
      boostActive: false,
      specialAbility: "Market Timing: Sell mined coins during a price spike",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Dropshipping Business",
      type: "DROPSHIPPING",
      level: 1,
      revenue: 220,
      cost: 110,
      cash: 0,
      employees: 1,
      upgrades: createUpgrades("DROPSHIPPING", 600),
      strategies: createStrategies("DROPSHIPPING"),
      purchasePrice: 1800,
      upgradePrice: 600,
      unlocked: false,
      owned: false,
      description: "Sell products online without holding inventory. Low overhead with good margins.",
      icon: "dropshipping",
      autoSell: false,
      boostActive: false,
      specialAbility: "Trending Product: Identify and sell a viral product for quick profits",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Mobile Game Studio",
      type: "MOBILE_GAME",
      level: 1,
      revenue: 350,
      cost: 200,
      cash: 0,
      employees: 3,
      upgrades: createUpgrades("MOBILE_GAME", 1200),
      strategies: createStrategies("MOBILE_GAME"),
      purchasePrice: 7000,
      upgradePrice: 1200,
      unlocked: false,
      owned: false,
      description: "Develop and monetize mobile games. High potential returns with the right hit.",
      icon: "game",
      autoSell: false,
      boostActive: false,
      specialAbility: "In-App Purchase Promotion: Run a special offer for a quick revenue boost",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Content Creation Studio",
      type: "CONTENT_CREATION",
      level: 1,
      revenue: 300,
      cost: 150,
      cash: 0,
      employees: 2,
      upgrades: createUpgrades("CONTENT_CREATION", 1000),
      strategies: createStrategies("CONTENT_CREATION"),
      purchasePrice: 6000,
      upgradePrice: 1000,
      unlocked: false,
      owned: false,
      description: "Create and monetize digital content across platforms. Scalable with audience growth.",
      icon: "content",
      autoSell: false,
      boostActive: false,
      specialAbility: "Viral Content: Create trending content for rapid monetization",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Business Consulting",
      type: "CONSULTING",
      level: 1,
      revenue: 400,
      cost: 100,
      cash: 0,
      employees: 1,
      upgrades: createUpgrades("CONSULTING", 1500),
      strategies: createStrategies("CONSULTING"),
      purchasePrice: 8000,
      upgradePrice: 1500,
      unlocked: false,
      owned: false,
      description: "Provide expert business advice to clients. High margins with professional expertise.",
      icon: "consulting",
      autoSell: false,
      boostActive: false,
      specialAbility: "Emergency Consultation: Provide urgent business advice at premium rates",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Day Trading Desk",
      type: "DAY_TRADING",
      level: 1,
      revenue: 500,
      cost: 300,
      cash: 0,
      employees: 1,
      upgrades: createUpgrades("DAY_TRADING", 2000),
      strategies: createStrategies("DAY_TRADING"),
      purchasePrice: 10000,
      upgradePrice: 2000,
      unlocked: false,
      owned: false,
      description: "Trade financial markets for short-term profits. High risk with potential for significant gains.",
      icon: "trading",
      autoSell: false,
      boostActive: false,
      specialAbility: "Market Arbitrage: Exploit temporary market inefficiencies for quick profits",
      quickMoneyOption: true,
      managementLevel: 1
    },
    {
      id: nanoid(),
      name: "Affiliate Marketing Agency",
      type: "AFFILIATE_MARKETING",
      level: 1,
      revenue: 250,
      cost: 125,
      cash: 0,
      employees: 2,
      upgrades: createUpgrades("AFFILIATE_MARKETING", 900),
      strategies: createStrategies("AFFILIATE_MARKETING"),
      purchasePrice: 4000,
      upgradePrice: 900,
      unlocked: false,
      owned: false,
      description: "Earn commissions by promoting other companies' products. Performance-based revenue model.",
      icon: "affiliate",
      autoSell: false,
      boostActive: false,
      specialAbility: "Promotional Campaign: Run a high-conversion campaign for quick commission earnings",
      quickMoneyOption: true,
      managementLevel: 1
    }
  ];
  
  // Cast array to Business[] to ensure type safety
  const businesses: Business[] = [...originalBusinesses, ...quickMoneyBusinesses] as Business[];
  
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
