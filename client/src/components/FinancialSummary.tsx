import { useGameContext } from "@/context/GameContext";
import { Card } from "@/components/ui/card";
import { StockChart } from "@/components/StockChart";
import { formatCurrency } from "@/lib/businessLogic";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function FinancialSummary() {
  const { gameState } = useGameContext();
  
  if (!gameState) return null;
  
  // Create net worth history
  // For this simplified version, we'll generate some data based on current state
  const netWorthHistory = [];
  const currentNetWorth = gameState.player.netWorth;
  const initialNetWorth = 1000; // Starting capital
  const turns = gameState.turn;
  
  // Create simulated net worth history data
  // In a real implementation, this would come from stored historical data
  for (let i = 0; i < Math.min(turns + 1, 10); i++) {
    const turnNumber = Math.max(1, turns - 9 + i);
    // Make the growth slightly exponential to simulate business growth
    const netWorth = initialNetWorth * Math.pow(currentNetWorth / initialNetWorth, i / Math.max(9, turns));
    netWorthHistory.push({
      turn: turnNumber,
      value: netWorth
    });
  }
  
  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };
  
  // Calculate portfolio breakdown data
  const ownedBusinesses = gameState.businesses.filter(b => b.owned);
  const ownedStocks = gameState.stocks.filter(s => s.owned && s.owned > 0);
  const ownedAssets = gameState.assets.filter(a => a.owned);
  
  const businessValue = ownedBusinesses.reduce((total, business) => 
    total + (business.purchasePrice * business.level * 1.5), 0);
  
  const stocksValue = ownedStocks.reduce((total, stock) => 
    total + (stock.price * (stock.owned || 0)), 0);
  
  const assetsValue = ownedAssets.reduce((total, asset) => 
    total + asset.value, 0);
  
  const cashValue = gameState.player.cash;
  
  const portfolioData = [
    { name: 'Cash', value: cashValue, color: 'hsl(var(--chart-1))' },
    { name: 'Businesses', value: businessValue, color: 'hsl(var(--chart-2))' },
    { name: 'Stocks', value: stocksValue, color: 'hsl(var(--chart-3))' },
    { name: 'Assets', value: assetsValue, color: 'hsl(var(--chart-4))' }
  ].filter(item => item.value > 0);
  
  // For the business revenue breakdown
  const businessRevenueData = ownedBusinesses.map(business => ({
    name: business.name,
    value: business.revenue * business.level,
    color: `hsl(${220 + Math.random() * 180}, 70%, 50%)`
  }));
  
  return (
    <div className="space-y-6">
      {/* Net Worth Chart */}
      <div>
        <h3 className="font-medium mb-2">Net Worth Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={netWorthHistory}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="turn" 
                label={{ value: 'Turn', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                tickFormatter={(value) => `$${Math.round(value / 1000)}k`} 
                label={{ value: 'Net Worth', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => `Turn ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Portfolio Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-4">Portfolio Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(name) => name}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs">{item.name}: {formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Business Revenue Breakdown */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Business Revenue</h3>
          {ownedBusinesses.length === 0 ? (
            <div className="h-56 flex items-center justify-center">
              <p className="text-muted-foreground">No businesses owned yet</p>
            </div>
          ) : (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={businessRevenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {businessRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      labelFormatter={(name) => name as string}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {businessRevenueData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-nowrap overflow-hidden text-ellipsis">
                      {item.name}: {formatCurrency(item.value)}/turn
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
