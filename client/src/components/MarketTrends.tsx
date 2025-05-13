import { useGameContext } from "@/context/GameContext";
import { StockChart } from "@/components/StockChart";
import { formatCurrency } from "@/lib/businessLogic";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";

export function MarketTrends() {
  const { gameState } = useGameContext();
  
  if (!gameState) return null;
  
  // Calculate market indices based on stock performance
  // Group stocks by sectors (using types as proxy for sectors)
  const stocksByType = gameState.stocks.reduce((acc, stock) => {
    // Using first word of the stock name as a "sector" for simplicity
    const sector = stock.name.split(' ')[0];
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(stock);
    return acc;
  }, {} as Record<string, typeof gameState.stocks>);
  
  // Calculate average performance for each sector
  const sectorPerformance = Object.entries(stocksByType).map(([sector, stocks]) => {
    // Calculate average current price and previous price
    const totalCurrentPrice = stocks.reduce((sum, stock) => sum + stock.price, 0);
    const avgCurrentPrice = totalCurrentPrice / stocks.length;
    
    // Use last history point if available, otherwise use current price * 0.95 as a fallback
    const totalPreviousPrice = stocks.reduce((sum, stock) => {
      const previousPrice = stock.history.length > 1 
        ? stock.history[stock.history.length - 2] 
        : stock.price * 0.95;
      return sum + previousPrice;
    }, 0);
    const avgPreviousPrice = totalPreviousPrice / stocks.length;
    
    // Calculate percentage change
    const percentChange = ((avgCurrentPrice - avgPreviousPrice) / avgPreviousPrice) * 100;
    
    // Generate simplified "history" for the sector chart
    const history = stocks[0]?.history.map((_, index) => {
      // Average price across all stocks in the sector for this history point
      return stocks.reduce((sum, stock) => {
        // Use actual history point if available, otherwise estimate
        const historyPoint = stock.history[index] || stock.price * (0.9 + index * 0.01);
        return sum + historyPoint;
      }, 0) / stocks.length;
    });
    
    return {
      sector,
      performance: percentChange,
      currentPrice: avgCurrentPrice,
      history: history || [],
      isUp: percentChange >= 0
    };
  }).sort((a, b) => b.performance - a.performance);
  
  // Generate some market indicators
  const economicIndicators = [
    {
      name: "Market Trend",
      value: (gameState.marketTrend * 100).toFixed(1) + "%",
      change: gameState.marketTrend,
      description: "Overall market direction"
    },
    {
      name: "Economic Health",
      value: gameState.economicHealth.toFixed(0) + "/100",
      change: gameState.economicHealth > 50 ? 1 : gameState.economicHealth > 30 ? 0 : -1,
      description: "General economic stability"
    },
    {
      name: "Volatility",
      value: (Math.abs(gameState.marketTrend) * 200).toFixed(1) + "%",
      change: Math.abs(gameState.marketTrend) > 0.2 ? -1 : 1,
      description: "Market price fluctuations"
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Economic Indicators */}
      <div className="space-y-4">
        {economicIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                <h3 className="font-medium">{indicator.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">{indicator.value}</div>
              <div className={`text-xs flex items-center justify-end ${
                indicator.change > 0 ? 'text-success' : 
                indicator.change < 0 ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {indicator.change > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : indicator.change < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <Activity className="h-3 w-3 mr-1" />
                )}
                {indicator.change > 0 ? 'Positive' : indicator.change < 0 ? 'Negative' : 'Neutral'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Sector Performance */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Sector Performance</h3>
        <div className="space-y-4">
          {sectorPerformance.map((sector, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium">{sector.sector} Sector</h4>
                  <p className="text-xs text-muted-foreground">Avg Price: {formatCurrency(sector.currentPrice)}</p>
                </div>
                <div className={`flex items-center ${sector.isUp ? 'text-success' : 'text-destructive'}`}>
                  {sector.isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="font-medium">
                    {sector.isUp ? '+' : ''}{sector.performance.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="h-12">
                <StockChart 
                  data={sector.history}
                  color={sector.isUp ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Market Events */}
      {gameState.activeEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Active Market Events</h3>
          <div className="space-y-2">
            {gameState.activeEvents.map((event, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md ${
                  event.type === 'POSITIVE' 
                    ? 'bg-success/10 border border-success/20' 
                    : event.type === 'NEGATIVE'
                    ? 'bg-destructive/10 border border-destructive/20'
                    : 'bg-secondary/20 border border-secondary/20'
                }`}
              >
                <div className="font-medium mb-1">{event.title}</div>
                <p className="text-xs">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
