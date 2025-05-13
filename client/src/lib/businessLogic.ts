import { GameState, Business, Stock, Asset } from "@shared/schema";

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculates the current net worth of the player
 */
export function calculateNetWorth(gameState: GameState): number {
  let netWorth = gameState.player.cash;
  
  // Add business values
  gameState.businesses.forEach(business => {
    if (business.owned) {
      const businessValue = business.purchasePrice * business.level * 1.5;
      netWorth += businessValue;
    }
  });
  
  // Add stock values
  gameState.stocks.forEach(stock => {
    if (stock.owned && stock.owned > 0) {
      netWorth += stock.price * stock.owned;
    }
  });
  
  // Add asset values
  gameState.assets.forEach(asset => {
    if (asset.owned) {
      netWorth += asset.value;
    }
  });
  
  return netWorth;
}

/**
 * Calculates the total revenue per turn from all businesses
 */
export function calculateTotalRevenue(gameState: GameState): number {
  return gameState.businesses
    .filter(business => business.owned)
    .reduce((total, business) => total + (business.revenue * business.level), 0);
}

/**
 * Calculates the profit or loss for a stock
 */
export function calculateStockProfitLoss(stock: Stock): number {
  if (!stock.owned || !stock.purchasePrice) return 0;
  
  return (stock.price - stock.purchasePrice) * stock.owned;
}

/**
 * Calculates the profit or loss percentage for a stock
 */
export function calculateStockProfitLossPercentage(stock: Stock): number {
  if (!stock.owned || !stock.purchasePrice) return 0;
  
  return ((stock.price - stock.purchasePrice) / stock.purchasePrice) * 100;
}

/**
 * Calculates the appreciation or depreciation for an asset
 */
export function calculateAssetValueChange(asset: Asset): number {
  if (!asset.owned) return 0;
  
  return asset.value - asset.cost;
}

/**
 * Calculates the appreciation or depreciation percentage for an asset
 */
export function calculateAssetValueChangePercentage(asset: Asset): number {
  if (!asset.owned) return 0;
  
  return ((asset.value - asset.cost) / asset.cost) * 100;
}

/**
 * Checks if a player can afford to purchase a business
 */
export function canAffordBusiness(gameState: GameState, business: Business): boolean {
  return gameState.player.cash >= business.purchasePrice;
}

/**
 * Checks if a player can afford to upgrade a business
 */
export function canAffordUpgrade(gameState: GameState, business: Business): boolean {
  const upgradeCost = business.upgradePrice * business.level;
  return gameState.player.cash >= upgradeCost;
}

/**
 * Checks if a player can afford to purchase a stock
 */
export function canAffordStock(gameState: GameState, stock: Stock, quantity: number): boolean {
  const cost = stock.price * quantity;
  return gameState.player.cash >= cost;
}

/**
 * Checks if a player can afford to purchase an asset
 */
export function canAffordAsset(gameState: GameState, asset: Asset): boolean {
  return gameState.player.cash >= asset.cost;
}

/**
 * Calculates the maximum affordable quantity of a stock
 */
export function maxAffordableQuantity(gameState: GameState, stock: Stock): number {
  return Math.floor(gameState.player.cash / stock.price);
}

/**
 * Calculates the percentage change between two values
 */
export function calculatePercentageChange(newValue: number, oldValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Gets a color class based on a percentage change value
 */
export function getTrendColorClass(percentChange: number): string {
  if (percentChange > 0) return 'text-success';
  if (percentChange < 0) return 'text-destructive';
  return 'text-muted-foreground';
}
