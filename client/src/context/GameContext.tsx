import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { 
  GameState, 
  Business, 
  Stock, 
  Asset, 
  EconomicEvent,
  gameStateSchema 
} from "@shared/schema";
import { generateInitialGameState } from "@/lib/gameData";

interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  hasActiveGame: boolean;
  userId: number | null;
  savedGames: { id: number; saveName: string }[];
  
  // Game actions
  startNewGame: (playerName?: string) => void;
  saveGame: (saveName: string) => Promise<boolean>;
  loadGame: (saveId: number) => Promise<boolean>;
  endTurn: () => void;
  
  // Business actions
  purchaseBusiness: (businessId: string) => boolean;
  upgradeBusiness: (businessId: string) => boolean;
  sellBusiness: (businessId: string) => boolean;
  activateQuickMoney: (businessId: string) => boolean;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string) => boolean;
  applyBusinessStrategy: (businessId: string, strategyId: string) => boolean;
  
  // Stock actions
  buyStock: (stockId: string, quantity: number) => boolean;
  sellStock: (stockId: string, quantity: number) => boolean;
  
  // Asset actions
  purchaseAsset: (assetId: string) => boolean;
  sellAsset: (assetId: string) => boolean;
  
  // Auth actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [savedGames, setSavedGames] = useState<{ id: number; saveName: string }[]>([]);
  
  const { toast } = useToast();
  
  // Check for saved user session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(parseInt(savedUserId));
      fetchSavedGames(parseInt(savedUserId));
    }
    
    // Check for temporary game state
    const tempGameState = localStorage.getItem("tempGameState");
    if (tempGameState) {
      try {
        const parsedState = JSON.parse(tempGameState);
        const validatedState = gameStateSchema.parse(parsedState);
        setGameState(validatedState);
      } catch (error) {
        console.error("Invalid temporary game state:", error);
        localStorage.removeItem("tempGameState");
      }
    }
  }, []);
  
  // Save temporary game state when it changes
  useEffect(() => {
    if (gameState) {
      localStorage.setItem("tempGameState", JSON.stringify(gameState));
    }
  }, [gameState]);
  
  const fetchSavedGames = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/saves?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch saved games");
      
      const saves = await response.json();
      setSavedGames(saves.map((save: any) => ({ id: save.id, saveName: save.saveName })));
    } catch (error) {
      setError("Failed to load saved games");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const startNewGame = (playerName?: string) => {
    setLoading(true);
    try {
      const initialState = generateInitialGameState(playerName);
      setGameState(initialState);
      
      toast({
        title: "New Game Started",
        description: "Your business journey begins with $1,000!",
      });
    } catch (error) {
      console.error("Error starting new game:", error);
      setError("Failed to start new game");
      
      toast({
        title: "Error",
        description: "Failed to start new game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveGame = async (saveName: string): Promise<boolean> => {
    if (!gameState || !userId) return false;
    
    setLoading(true);
    try {
      const saveData = {
        userId,
        saveName,
        gameState
      };
      
      await apiRequest("POST", "/api/saves", saveData);
      
      toast({
        title: "Game Saved",
        description: `Your game has been saved as "${saveName}"`,
      });
      
      // Refresh the list of saved games
      await fetchSavedGames(userId);
      return true;
    } catch (error) {
      console.error("Error saving game:", error);
      setError("Failed to save game");
      
      toast({
        title: "Error",
        description: "Failed to save game",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const loadGame = async (saveId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/saves/${saveId}`);
      if (!response.ok) {
        throw new Error("Failed to load game");
      }
      
      const saveData = await response.json();
      setGameState(saveData.gameState);
      
      toast({
        title: "Game Loaded",
        description: "Your saved game has been loaded successfully",
      });
      return true;
    } catch (error) {
      console.error("Error loading game:", error);
      setError("Failed to load game");
      
      toast({
        title: "Error",
        description: "Failed to load the saved game",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Game mechanics
  const endTurn = () => {
    if (!gameState) return;
    
    try {
      // Create a copy of the current state
      const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
      
      // Update turn counter
      newState.turn += 1;
      
      // Process business revenue with strategies and upgrades applied
      let totalRevenue = 0;
      newState.businesses.forEach(business => {
        if (business.owned) {
          // Get the active strategy if any
          const activeStrategy = business.strategies.find(s => s.active);
          
          // Calculate base revenue with level multiplier
          let businessRevenue = business.revenue * business.level;
          
          // Apply strategy multipliers if active
          if (activeStrategy) {
            businessRevenue = Math.round(businessRevenue * activeStrategy.revenueMultiplier);
          }
          
          // Add revenue to total
          totalRevenue += businessRevenue;
          
          // Update business cash
          business.cash += businessRevenue;
          
          // Reset any quick money boosts
          business.boostActive = false;
        }
      });
      
      // Add revenue to player cash
      newState.player.cash += totalRevenue;
      
      // Update market and stock prices
      updateMarket(newState);
      
      // Process active events
      processEvents(newState);
      
      // Generate new random events
      generateRandomEvent(newState);
      
      // Update player net worth
      calculateNetWorth(newState);
      
      // Check for business unlocks based on net worth
      checkBusinessUnlocks(newState);
      
      setGameState(newState);
      
      toast({
        title: "Turn Completed",
        description: `You earned $${totalRevenue.toLocaleString()} in revenue this turn.`,
      });
    } catch (error) {
      console.error("Error ending turn:", error);
      toast({
        title: "Error",
        description: "Failed to process turn",
        variant: "destructive",
      });
    }
  };
  
  const updateMarket = (state: GameState) => {
    // Update market trend (between -0.2 and 0.2)
    const trendChange = (Math.random() * 0.4) - 0.2;
    state.marketTrend = Math.max(-0.5, Math.min(0.5, state.marketTrend + trendChange));
    
    // Update economic health (0-100)
    let healthChange = (Math.random() * 10) - 5;
    if (state.marketTrend > 0) healthChange += 2;
    if (state.marketTrend < 0) healthChange -= 2;
    
    state.economicHealth = Math.max(0, Math.min(100, state.economicHealth + healthChange));
    
    // Update stock prices based on market trend and individual volatility
    state.stocks.forEach(stock => {
      // Base change based on stock's volatility
      const baseChange = (Math.random() * 2 - 1) * stock.volatility;
      
      // Influence from market trend
      const marketInfluence = state.marketTrend * 5;
      
      // Influence from stock's own trend
      const trendInfluence = stock.trend * 2;
      
      // Total percentage change
      const percentChange = baseChange + marketInfluence + trendInfluence;
      
      // Apply change to price
      const newPrice = stock.price * (1 + percentChange / 100);
      
      // Update price (minimum $1)
      stock.price = Math.max(1, newPrice);
      
      // Update price history
      stock.history.push(stock.price);
      if (stock.history.length > 30) {
        stock.history.shift();
      }
      
      // Slightly adjust stock trend
      stock.trend = stock.trend + (Math.random() * 0.2 - 0.1);
      stock.trend = Math.max(-2, Math.min(2, stock.trend));
    });
  };
  
  const processEvents = (state: GameState) => {
    const stillActiveEvents: EconomicEvent[] = [];
    
    state.activeEvents.forEach(event => {
      // Apply event effects
      if (event.affectedBusinessTypes) {
        state.businesses.forEach(business => {
          if (event.affectedBusinessTypes?.includes(business.type)) {
            // Apply revenue effect
            business.revenue = business.revenue * event.multiplier;
          }
        });
      }
      
      if (event.affectedStocks) {
        state.stocks.forEach(stock => {
          if (event.affectedStocks?.includes(stock.id)) {
            // Apply price effect
            stock.trend = stock.trend * event.multiplier;
          }
        });
      }
      
      // Reduce turns left
      if (event.turnsLeft && event.turnsLeft > 1) {
        stillActiveEvents.push({
          ...event,
          turnsLeft: event.turnsLeft - 1
        });
      }
    });
    
    state.activeEvents = stillActiveEvents;
  };
  
  const generateRandomEvent = (state: GameState) => {
    // 20% chance to generate an event
    if (Math.random() < 0.2) {
      // Get a random event from available events
      const availableEvents = state.events.filter(event => !event.applied);
      
      if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        const selectedEvent = availableEvents[randomIndex];
        
        // Mark event as applied
        const eventIndex = state.events.findIndex(e => e.id === selectedEvent.id);
        if (eventIndex >= 0) {
          state.events[eventIndex].applied = true;
        }
        
        // Add to active events
        state.activeEvents.push({
          ...selectedEvent,
          turnsLeft: selectedEvent.duration
        });
        
        toast({
          title: "Economic Event",
          description: selectedEvent.title,
          variant: selectedEvent.type === "POSITIVE" ? "default" : 
                   selectedEvent.type === "NEGATIVE" ? "destructive" : "default",
        });
      }
    }
  };
  
  const calculateNetWorth = (state: GameState) => {
    let netWorth = state.player.cash;
    
    // Add business values
    state.businesses.forEach(business => {
      if (business.owned) {
        const businessValue = business.purchasePrice * business.level * 1.5;
        netWorth += businessValue;
      }
    });
    
    // Add stock values
    state.stocks.forEach(stock => {
      if (stock.owned > 0) {
        netWorth += stock.price * stock.owned;
      }
    });
    
    // Add asset values
    state.assets.forEach(asset => {
      if (asset.owned) {
        netWorth += asset.value;
      }
    });
    
    state.player.netWorth = netWorth;
  };
  
  const checkBusinessUnlocks = (state: GameState) => {
    const { netWorth } = state.player;
    
    state.businesses.forEach(business => {
      // Unlock businesses based on net worth thresholds
      if (!business.unlocked) {
        if (
          (business.purchasePrice <= 5000 && netWorth >= 2000) ||
          (business.purchasePrice <= 20000 && netWorth >= 10000) ||
          (business.purchasePrice <= 50000 && netWorth >= 30000) ||
          (business.purchasePrice <= 200000 && netWorth >= 100000) ||
          (netWorth >= 500000)
        ) {
          business.unlocked = true;
          
          toast({
            title: "New Business Opportunity",
            description: `${business.name} is now available for purchase!`,
          });
        }
      }
    });
  };
  
  // Business actions
  const purchaseBusiness = (businessId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.unlocked || business.owned || gameState.player.cash < business.purchasePrice) {
      return false;
    }
    
    const newState = { ...gameState };
    newState.player.cash -= business.purchasePrice;
    newState.businesses[businessIndex].owned = true;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Business Purchased",
      description: `You now own ${business.name}!`,
    });
    
    return true;
  };
  
  const upgradeBusiness = (businessId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.owned) return false;
    
    const upgradePrice = business.upgradePrice * business.level;
    if (gameState.player.cash < upgradePrice) return false;
    
    const newState = { ...gameState };
    newState.player.cash -= upgradePrice;
    newState.businesses[businessIndex].level += 1;
    newState.player.upgradesPurchased += 1;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Business Upgraded",
      description: `${business.name} is now level ${business.level}!`,
    });
    
    return true;
  };
  
  const sellBusiness = (businessId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.owned) return false;
    
    const sellPrice = business.purchasePrice * business.level * 0.8;
    
    const newState = { ...gameState };
    newState.player.cash += sellPrice;
    newState.businesses[businessIndex].owned = false;
    newState.businesses[businessIndex].level = 1;
    newState.player.businessesSold += 1;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Business Sold",
      description: `You sold ${business.name} for $${sellPrice.toLocaleString()}!`,
    });
    
    return true;
  };
  
  // Stock actions
  const buyStock = (stockId: string, quantity: number): boolean => {
    if (!gameState || quantity <= 0) return false;
    
    const stockIndex = gameState.stocks.findIndex(s => s.id === stockId);
    if (stockIndex === -1) return false;
    
    const stock = gameState.stocks[stockIndex];
    const totalCost = stock.price * quantity;
    
    if (gameState.player.cash < totalCost) return false;
    
    const newState = { ...gameState };
    newState.player.cash -= totalCost;
    
    // Calculate average purchase price
    const currentValue = (stock.owned || 0) * (stock.purchasePrice || stock.price);
    const newTotalShares = (stock.owned || 0) + quantity;
    const newAveragePrice = (currentValue + totalCost) / newTotalShares;
    
    newState.stocks[stockIndex].owned = newTotalShares;
    newState.stocks[stockIndex].purchasePrice = newAveragePrice;
    newState.player.stocksTraded += quantity;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Stocks Purchased",
      description: `You bought ${quantity} shares of ${stock.name} for $${totalCost.toLocaleString()}!`,
    });
    
    return true;
  };
  
  const sellStock = (stockId: string, quantity: number): boolean => {
    if (!gameState || quantity <= 0) return false;
    
    const stockIndex = gameState.stocks.findIndex(s => s.id === stockId);
    if (stockIndex === -1) return false;
    
    const stock = gameState.stocks[stockIndex];
    if (!stock.owned || stock.owned < quantity) return false;
    
    const totalValue = stock.price * quantity;
    
    const newState = { ...gameState };
    newState.player.cash += totalValue;
    newState.stocks[stockIndex].owned -= quantity;
    newState.player.stocksTraded += quantity;
    
    // If all shares sold, reset purchase price
    if (newState.stocks[stockIndex].owned === 0) {
      newState.stocks[stockIndex].purchasePrice = undefined;
    }
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Stocks Sold",
      description: `You sold ${quantity} shares of ${stock.name} for $${totalValue.toLocaleString()}!`,
    });
    
    return true;
  };
  
  // Asset actions
  const purchaseAsset = (assetId: string): boolean => {
    if (!gameState) return false;
    
    const assetIndex = gameState.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;
    
    const asset = gameState.assets[assetIndex];
    if (asset.owned || gameState.player.cash < asset.cost) return false;
    
    const newState = { ...gameState };
    newState.player.cash -= asset.cost;
    newState.assets[assetIndex].owned = true;
    
    // Assets appreciate over time
    newState.assets[assetIndex].value = asset.cost;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Asset Purchased",
      description: `You purchased ${asset.name} for $${asset.cost.toLocaleString()}!`,
    });
    
    return true;
  };
  
  const sellAsset = (assetId: string): boolean => {
    if (!gameState) return false;
    
    const assetIndex = gameState.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;
    
    const asset = gameState.assets[assetIndex];
    if (!asset.owned) return false;
    
    const newState = { ...gameState };
    newState.player.cash += asset.value;
    newState.assets[assetIndex].owned = false;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Asset Sold",
      description: `You sold ${asset.name} for $${asset.value.toLocaleString()}!`,
    });
    
    return true;
  };
  
  // New business customization methods
  
  // Quick Money - Activate business special ability for immediate cash
  const activateQuickMoney = (businessId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.owned || !business.quickMoneyOption) return false;
    
    // Check if boost is already active
    if (business.boostActive) {
      toast({
        title: "Already Used",
        description: "This special ability is on cooldown. Wait until next turn.",
        variant: "destructive",
      });
      return false;
    }
    
    // Calculate quick money amount based on business level and revenue
    const baseAmount = business.revenue * business.level;
    const multiplier = 2 + (Math.random() * 2); // 2x to 4x
    const quickMoneyAmount = Math.round(baseAmount * multiplier);
    
    const newState = { ...gameState };
    newState.player.cash += quickMoneyAmount;
    newState.businesses[businessIndex].boostActive = true;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Quick Money Generated!",
      description: `${business.name} generated $${quickMoneyAmount.toLocaleString()} in quick cash!`,
    });
    
    return true;
  };
  
  // Purchase a specific upgrade for a business
  const purchaseBusinessUpgrade = (businessId: string, upgradeId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.owned) return false;
    
    const upgradeIndex = business.upgrades.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return false;
    
    const upgrade = business.upgrades[upgradeIndex];
    if (upgrade.purchased || !upgrade.unlocked) return false;
    
    // Check if player can afford the upgrade
    if (gameState.player.cash < upgrade.cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${upgrade.cost.toLocaleString()} to purchase this upgrade.`,
        variant: "destructive",
      });
      return false;
    }
    
    const newState = { ...gameState };
    
    // Pay for upgrade
    newState.player.cash -= upgrade.cost;
    
    // Apply upgrade effects
    newState.businesses[businessIndex].upgrades[upgradeIndex].purchased = true;
    
    // Apply revenue multiplier
    if (upgrade.revenueMultiplier > 1) {
      newState.businesses[businessIndex].revenue = 
        Math.round(newState.businesses[businessIndex].revenue * upgrade.revenueMultiplier);
    }
    
    // Apply cost reduction
    if (upgrade.costReduction > 0) {
      newState.businesses[businessIndex].cost = 
        Math.round(newState.businesses[businessIndex].cost * (1 - upgrade.costReduction));
    }
    
    newState.player.upgradesPurchased += 1;
    
    setGameState(newState);
    calculateNetWorth(newState);
    
    toast({
      title: "Upgrade Purchased",
      description: `You purchased the ${upgrade.name} upgrade for ${business.name}!`,
    });
    
    return true;
  };
  
  // Apply a business strategy to change revenue/cost structure
  const applyBusinessStrategy = (businessId: string, strategyId: string): boolean => {
    if (!gameState) return false;
    
    const businessIndex = gameState.businesses.findIndex(b => b.id === businessId);
    if (businessIndex === -1) return false;
    
    const business = gameState.businesses[businessIndex];
    if (!business.owned) return false;
    
    // Find the strategy
    const strategyIndex = business.strategies.findIndex(s => s.id === strategyId);
    if (strategyIndex === -1) return false;
    
    const strategy = business.strategies[strategyIndex];
    if (!strategy.unlocked) return false;
    
    const newState = { ...gameState };
    
    // Reset all strategies first
    newState.businesses[businessIndex].strategies.forEach(s => {
      s.active = false;
    });
    
    // Activate the selected strategy
    newState.businesses[businessIndex].strategies[strategyIndex].active = true;
    
    // Apply strategy effects (will take effect on next turn)
    // We'll adjust the revenue and cost calculations in the endTurn method
    
    setGameState(newState);
    
    toast({
      title: "Strategy Applied",
      description: `You've applied the ${strategy.name} strategy to ${business.name}. Changes will take effect starting next turn.`,
    });
    
    return true;
  };
  
  // Auth functions
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/users/auth", { username, password });
      const userData = await response.json();
      
      setUserId(userData.id);
      localStorage.setItem("userId", userData.id.toString());
      
      await fetchSavedGames(userData.id);
      
      toast({
        title: "Logged In",
        description: `Welcome back, ${userData.username}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed");
      
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/users", { username, password });
      const userData = await response.json();
      
      setUserId(userData.id);
      localStorage.setItem("userId", userData.id.toString());
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed");
      
      toast({
        title: "Registration Failed",
        description: "Username may already be taken",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUserId(null);
    setGameState(null);
    setSavedGames([]);
    localStorage.removeItem("userId");
    localStorage.removeItem("tempGameState");
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <GameContext.Provider value={{
      gameState,
      loading,
      error,
      hasActiveGame: !!gameState,
      userId,
      savedGames,
      
      // Game actions
      startNewGame,
      saveGame,
      loadGame,
      endTurn,
      
      // Business actions
      purchaseBusiness,
      upgradeBusiness,
      sellBusiness,
      activateQuickMoney,
      purchaseBusinessUpgrade,
      applyBusinessStrategy,
      
      // Stock actions
      buyStock,
      sellStock,
      
      // Asset actions
      purchaseAsset,
      sellAsset,
      
      // Auth actions
      login,
      register,
      logout
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
