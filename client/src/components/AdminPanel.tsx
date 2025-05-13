import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Rocket, 
  Trophy, 
  TrendingUp, 
  Briefcase,
  Building2,
  Star,
  Award,
  Clock,
  Zap
} from "lucide-react";
import { formatCurrency } from "@/lib/businessLogic";

export function AdminPanel() {
  const { gameState, setGameState } = useGameContext() as any; // Adding setGameState for direct state manipulation
  
  const [cashAmount, setCashAmount] = useState<number>(10000);
  const [businessLevel, setBusinessLevel] = useState<number>(1);
  const [turnSkip, setTurnSkip] = useState<number>(5);
  
  if (!gameState) return null;
  
  // Cheat functions
  const addCash = () => {
    if (!gameState) return;
    
    const newState = {...gameState};
    newState.player.cash += cashAmount;
    setGameState(newState);
  };
  
  const unlockAllBusinesses = () => {
    if (!gameState) return;
    
    const newState = {...gameState};
    newState.businesses.forEach(business => {
      business.unlocked = true;
    });
    setGameState(newState);
  };
  
  const maxBusinessLevels = () => {
    if (!gameState) return;
    
    const newState = {...gameState};
    newState.businesses.forEach(business => {
      if (business.owned) {
        business.level = businessLevel;
      }
    });
    setGameState(newState);
  };
  
  const skipTurns = () => {
    if (!gameState) return;
    
    // Creating a deep copy to avoid reference issues
    let newState = JSON.parse(JSON.stringify(gameState));
    
    // Simulate multiple turns
    for (let i = 0; i < turnSkip; i++) {
      // Increment turn
      newState.turn += 1;
      
      // Process business revenue
      let totalRevenue = 0;
      newState.businesses.forEach(business => {
        if (business.owned) {
          // Apply strategies
          const activeStrategy = business.strategies.find(s => s.active);
          let businessRevenue = business.revenue * business.level;
          
          if (activeStrategy) {
            businessRevenue = Math.round(businessRevenue * activeStrategy.revenueMultiplier);
          }
          
          totalRevenue += businessRevenue;
          business.cash += businessRevenue;
          business.boostActive = false;
        }
      });
      
      // Add revenue to player cash
      newState.player.cash += totalRevenue;
      
      // Update market prices randomly
      newState.stocks.forEach(stock => {
        const baseChange = (Math.random() * 2 - 1) * stock.volatility;
        const marketInfluence = newState.marketTrend * 5;
        const trendInfluence = stock.trend * 2;
        const percentChange = baseChange + marketInfluence + trendInfluence;
        const newPrice = stock.price * (1 + percentChange / 100);
        stock.price = Math.max(1, newPrice);
        
        stock.history.push(stock.price);
        if (stock.history.length > 30) {
          stock.history.shift();
        }
        
        // Slightly adjust trend
        stock.trend = stock.trend + (Math.random() * 0.2 - 0.1);
        stock.trend = Math.max(-2, Math.min(2, stock.trend));
      });
      
      // Update assets
      newState.assets.forEach(asset => {
        if (asset.owned) {
          asset.value = Math.round(asset.value * (1 + asset.appreciation));
        }
      });
    }
    
    // Recalculate net worth
    let netWorth = newState.player.cash;
    newState.businesses.forEach(business => {
      if (business.owned) {
        const businessValue = business.purchasePrice * business.level * 1.5;
        netWorth += businessValue;
      }
    });
    
    newState.stocks.forEach(stock => {
      if (stock.owned > 0) {
        netWorth += stock.price * stock.owned;
      }
    });
    
    newState.assets.forEach(asset => {
      if (asset.owned) {
        netWorth += asset.value;
      }
    });
    
    newState.player.netWorth = netWorth;
    
    setGameState(newState);
  };
  
  const resetGame = () => {
    if (confirm("Are you sure you want to reset all game progress? This cannot be undone.")) {
      localStorage.removeItem("tempGameState");
      window.location.reload();
    }
  };
  
  const unlockAllUpgrades = () => {
    if (!gameState) return;
    
    const newState = {...gameState};
    newState.businesses.forEach(business => {
      business.upgrades.forEach(upgrade => {
        upgrade.unlocked = true;
      });
    });
    setGameState(newState);
  };
  
  const maxOutNetWorth = () => {
    if (!gameState) return;
    
    const newState = {...gameState};
    newState.player.cash += 1000000000; // Add 1 billion dollars
    newState.player.netWorth += 1000000000;
    setGameState(newState);
  };
  
  return (
    <div className="p-6 max-h-[80vh] overflow-auto">
      <div className="mb-6 flex items-center text-red-600">
        <Trophy className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">Admin Cheats Panel</h1>
      </div>
      
      <Tabs defaultValue="money" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="money">Money</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="progress">Game Progress</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>
        
        {/* Money Cheats */}
        <TabsContent value="money" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Cash Injection
              </CardTitle>
              <CardDescription>Add funds to your account instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    min={1}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <span className="text-sm font-medium">
                    {formatCurrency(cashAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addCash} className="w-full">
                Add Cash
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-600" />
                Ultimate Wealth
              </CardTitle>
              <CardDescription>Become an instant billionaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will add $1,000,000,000 to your account and net worth, making you one of the richest players instantly.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={maxOutNetWorth} variant="secondary" className="w-full">
                Become Billionaire
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Business Cheats */}
        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Unlock All Businesses
              </CardTitle>
              <CardDescription>Make all businesses available for purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will make all businesses visible and available for purchase, regardless of your net worth or progress.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={unlockAllBusinesses} className="w-full">
                Unlock All Businesses
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-600" />
                Max Business Levels
              </CardTitle>
              <CardDescription>Set all owned businesses to a specific level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Level: {businessLevel}</span>
                    <Input 
                      type="number" 
                      min={1}
                      max={100}
                      value={businessLevel}
                      onChange={(e) => setBusinessLevel(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                  <Slider
                    value={[businessLevel]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setBusinessLevel(value[0])}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={maxBusinessLevels} className="w-full">
                Set Business Levels
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-purple-600" />
                Unlock All Upgrades
              </CardTitle>
              <CardDescription>Make all business upgrades available for purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will unlock all possible upgrades for all businesses, allowing you to purchase any upgrade.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={unlockAllUpgrades} className="w-full">
                Unlock All Upgrades
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Game Progress Cheats */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Skip Turns
              </CardTitle>
              <CardDescription>Fast forward through multiple turns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Turns to skip: {turnSkip}</span>
                    <Input 
                      type="number" 
                      min={1}
                      max={100}
                      value={turnSkip}
                      onChange={(e) => setTurnSkip(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                  <Slider
                    value={[turnSkip]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setTurnSkip(value[0])}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={skipTurns} className="w-full">
                Skip {turnSkip} Turns
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-red-600" />
                Tycoon Mode
              </CardTitle>
              <CardDescription>Instantly max out everything</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will give you $1 billion, unlock all businesses and upgrades, and set all owned businesses to level 50.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary"
                onClick={() => {
                  maxOutNetWorth();
                  unlockAllBusinesses();
                  unlockAllUpgrades();
                  setBusinessLevel(50);
                  setTimeout(() => maxBusinessLevels(), 100);
                }} 
                className="w-full"
              >
                Activate Tycoon Mode
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Debug Tools */}
        <TabsContent value="debug" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-destructive" />
                Reset Game
              </CardTitle>
              <CardDescription>Completely reset all game progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">
                WARNING: This will delete all game progress and cannot be undone!
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={resetGame} className="w-full">
                Reset All Game Progress
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Game State Information</CardTitle>
              <CardDescription>Current game state details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Turn:</div>
                <div>{gameState.turn}</div>
                
                <div className="font-medium">Player Cash:</div>
                <div>{formatCurrency(gameState.player.cash)}</div>
                
                <div className="font-medium">Net Worth:</div>
                <div>{formatCurrency(gameState.player.netWorth)}</div>
                
                <div className="font-medium">Businesses Owned:</div>
                <div>{gameState.businesses.filter(b => b.owned).length}</div>
                
                <div className="font-medium">Economic Health:</div>
                <div>{gameState.economicHealth}%</div>
              </div>
              
              <Separator className="my-4" />
              
              <details>
                <summary className="cursor-pointer font-medium">View Raw Game State JSON</summary>
                <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-auto max-h-[200px]">
                  {JSON.stringify(gameState, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Admin Panel - For authorized users only</p>
      </div>
    </div>
  );
}