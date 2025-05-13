import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Business, Upgrade, BusinessStrategy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/businessLogic";

interface BusinessCustomizationProps {
  business: Business;
  onClose: () => void;
}

export function BusinessCustomization({ business, onClose }: BusinessCustomizationProps) {
  const { activateQuickMoney, purchaseBusinessUpgrade, applyBusinessStrategy } = useGameContext();
  const [activeTab, setActiveTab] = useState("upgrades");

  const handleActivateQuickMoney = () => {
    activateQuickMoney(business.id);
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    purchaseBusinessUpgrade(business.id, upgradeId);
  };

  const handleApplyStrategy = (strategyId: string) => {
    applyBusinessStrategy(business.id, strategyId);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{business.name} Customization</span>
          <Badge variant="outline">Level {business.level}</Badge>
        </CardTitle>
        <CardDescription>
          Customize and optimize your business operations to maximize profits
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="quickMoney">Quick Money</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upgrades" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Upgrades</h3>
            <p className="text-sm text-muted-foreground">Improve your business with permanent upgrades</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.upgrades.map((upgrade: Upgrade) => (
                <Card key={upgrade.id} className={upgrade.purchased ? "bg-muted" : ""}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{upgrade.name}</CardTitle>
                    <CardDescription>{upgrade.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {upgrade.revenueMultiplier > 1 && (
                      <p className="text-sm text-green-600">+{Math.round((upgrade.revenueMultiplier - 1) * 100)}% Revenue</p>
                    )}
                    {upgrade.costReduction > 0 && (
                      <p className="text-sm text-green-600">-{Math.round(upgrade.costReduction * 100)}% Costs</p>
                    )}
                    <p className="font-medium mt-2">Cost: {formatCurrency(upgrade.cost)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => handlePurchaseUpgrade(upgrade.id)}
                      disabled={upgrade.purchased || !upgrade.unlocked}
                      variant={upgrade.purchased ? "secondary" : "default"}
                      className="w-full"
                    >
                      {upgrade.purchased ? "Purchased" : "Purchase Upgrade"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="strategies" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Strategies</h3>
            <p className="text-sm text-muted-foreground">Choose a business strategy to optimize operations</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.strategies.map((strategy: BusinessStrategy) => (
                <Card key={strategy.id} className={strategy.active ? "bg-muted" : ""}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{strategy.name}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenue Multiplier:</span>
                      <Badge variant={strategy.revenueMultiplier > 1 ? "default" : "destructive"}>
                        x{strategy.revenueMultiplier.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Cost Multiplier:</span>
                      <Badge variant={strategy.costMultiplier < 1 ? "default" : "destructive"}>
                        x{strategy.costMultiplier.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Risk Level:</span>
                      <Badge variant={strategy.riskLevel > 5 ? "destructive" : "outline"}>
                        {strategy.riskLevel}/10
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => handleApplyStrategy(strategy.id)}
                      disabled={!strategy.unlocked}
                      variant={strategy.active ? "secondary" : "default"}
                      className="w-full"
                    >
                      {strategy.active ? "Active Strategy" : "Apply Strategy"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="quickMoney" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Money Options</h3>
            <p className="text-sm text-muted-foreground">Generate immediate cash with special business actions</p>
            
            {business.quickMoneyOption ? (
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Special Ability</CardTitle>
                  <CardDescription>{business.specialAbility || "Use this business's special ability to generate quick cash"}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">
                    Generate a cash boost between 2x and 4x your business's base revenue ({formatCurrency(business.revenue * business.level)}).
                  </p>
                  <p className="text-sm mt-2">
                    This option can only be used once per turn.
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    onClick={handleActivateQuickMoney}
                    disabled={business.boostActive}
                    variant="default"
                    className="w-full"
                  >
                    {business.boostActive ? "Already Used (Wait for next turn)" : "Generate Quick Cash"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">This business doesn't have quick money options.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="p-4 flex justify-end">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
}