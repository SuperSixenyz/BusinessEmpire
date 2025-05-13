import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/businessLogic";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { PassiveIncome } from "@shared/schema";
import { Coins, ArrowUp, AlertCircle, Clock, DollarSign, TrendingUp, Zap } from "lucide-react";

export default function PassiveIncomePage() {
  const [location] = useLocation();
  const { gameState, setGameState } = useGameContext();
  const [selectedIncome, setSelectedIncome] = useState<PassiveIncome | null>(null);
  
  if (!gameState) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Game</AlertTitle>
          <AlertDescription>
            Start a new game or load a saved game to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const { passiveIncomes, player } = gameState;
  
  const purchasePassiveIncome = (passiveIncome: PassiveIncome) => {
    if (player.cash < passiveIncome.initialCost) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(passiveIncome.initialCost)} to purchase this income source.`,
        variant: "destructive"
      });
      return;
    }
    
    const newState = { ...gameState };
    const incomeIndex = newState.passiveIncomes.findIndex(i => i.id === passiveIncome.id);
    
    if (incomeIndex === -1) return;
    
    // Update passive income status
    newState.passiveIncomes[incomeIndex].active = true;
    
    // Deduct cost from player cash
    newState.player.cash -= passiveIncome.initialCost;
    
    setGameState(newState);
    
    toast({
      title: "Passive Income Acquired",
      description: `You've successfully acquired ${passiveIncome.name}!`,
    });
  };
  
  const upgradePassiveIncome = (passiveIncome: PassiveIncome) => {
    if (player.cash < passiveIncome.upgradeCost) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(passiveIncome.upgradeCost)} to upgrade this income source.`,
        variant: "destructive"
      });
      return;
    }
    
    if (passiveIncome.currentLevel >= passiveIncome.maxLevel) {
      toast({
        title: "Maximum Level Reached",
        description: `This passive income source is already at its maximum level.`,
        variant: "destructive"
      });
      return;
    }
    
    const newState = { ...gameState };
    const incomeIndex = newState.passiveIncomes.findIndex(i => i.id === passiveIncome.id);
    
    if (incomeIndex === -1) return;
    
    // Update passive income level
    newState.passiveIncomes[incomeIndex].currentLevel += 1;
    
    // Increase income based on the upgrade multiplier
    newState.passiveIncomes[incomeIndex].income = Math.round(
      newState.passiveIncomes[incomeIndex].income * passiveIncome.upgradeMultiplier
    );
    
    // Increase upgrade cost for next level
    newState.passiveIncomes[incomeIndex].upgradeCost = Math.round(
      newState.passiveIncomes[incomeIndex].upgradeCost * 1.8
    );
    
    // Deduct cost from player cash
    newState.player.cash -= passiveIncome.upgradeCost;
    
    setGameState(newState);
    
    toast({
      title: "Passive Income Upgraded",
      description: `You've successfully upgraded ${passiveIncome.name} to level ${newState.passiveIncomes[incomeIndex].currentLevel}!`,
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Passive Income Sources</h1>
          <div className="flex items-center bg-muted px-3 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm font-medium">
              Available Cash: {formatCurrency(player.cash)}
            </span>
          </div>
        </div>
        
        {passiveIncomes.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Passive Income Sources</AlertTitle>
            <AlertDescription>
              No passive income opportunities are available yet. Continue playing to unlock them.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passiveIncomes.map((income) => (
              <Card key={income.id} className={`${income.active ? 'border-green-200 dark:border-green-800' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center">
                      <Coins className="h-5 w-5 mr-2 text-amber-500" />
                      {income.name}
                    </CardTitle>
                    {income.active && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{income.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Income per turn:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(income.income)}
                      </span>
                    </div>
                    
                    {income.active && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Level:</span>
                          <span>{income.currentLevel}/{income.maxLevel}</span>
                        </div>
                        <Progress value={(income.currentLevel / income.maxLevel) * 100} className="h-2" />
                      </div>
                    )}
                    
                    {income.cooldownTurns > 0 && income.active && (
                      <div className="flex items-center space-x-2 text-amber-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Cooldown: {income.cooldownTurns} turns</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  {!income.active ? (
                    <Button 
                      className="w-full" 
                      onClick={() => purchasePassiveIncome(income)}
                      disabled={player.cash < income.initialCost}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Purchase for {formatCurrency(income.initialCost)}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => upgradePassiveIncome(income)}
                      disabled={player.cash < income.upgradeCost || income.currentLevel >= income.maxLevel}
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      Upgrade to Level {income.currentLevel + 1} ({formatCurrency(income.upgradeCost)})
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">How Passive Income Works</h2>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Earn Without Active Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Passive income generates money every turn without requiring direct management like businesses do.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Upgrade for Better Returns</h3>
                    <p className="text-sm text-muted-foreground">
                      Upgrade your passive income sources to increase their revenue generation each turn.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Diversify Your Income</h3>
                    <p className="text-sm text-muted-foreground">
                      Spreading your investments across multiple passive income sources can help maintain a steady cash flow.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}