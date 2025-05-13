import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Business, Upgrade, BusinessStrategy, Resource } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/businessLogic";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TruckIcon, 
  Wrench, 
  MapPin, 
  Megaphone, 
  Cpu, 
  GraduationCap, 
  FileText, 
  Package,
  FlaskConical,
  AlertTriangle
} from "lucide-react";

interface BusinessCustomizationProps {
  business: Business;
  onClose: () => void;
}

export function BusinessCustomization({ business, onClose }: BusinessCustomizationProps) {
  const { gameState, setGameState, activateQuickMoney, purchaseBusinessUpgrade, applyBusinessStrategy } = useGameContext();
  const [activeTab, setActiveTab] = useState("upgrades");
  
  // Function to get the appropriate icon for a resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "STAFF": return <Users className="h-5 w-5 text-blue-500" />;
      case "SUPPLIER": return <TruckIcon className="h-5 w-5 text-green-500" />;
      case "EQUIPMENT": return <Wrench className="h-5 w-5 text-orange-500" />;
      case "LOCATION": return <MapPin className="h-5 w-5 text-red-500" />;
      case "MARKETING": return <Megaphone className="h-5 w-5 text-purple-500" />;
      case "TECHNOLOGY": return <Cpu className="h-5 w-5 text-indigo-500" />;
      case "TRAINING": return <GraduationCap className="h-5 w-5 text-yellow-500" />;
      case "LICENSE": return <FileText className="h-5 w-5 text-blue-400" />;
      case "LOGISTICS": return <Package className="h-5 w-5 text-teal-500" />;
      case "RESEARCH": return <FlaskConical className="h-5 w-5 text-pink-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleActivateQuickMoney = () => {
    activateQuickMoney(business.id);
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    purchaseBusinessUpgrade(business.id, upgradeId);
  };

  const handleApplyStrategy = (strategyId: string) => {
    applyBusinessStrategy(business.id, strategyId);
  };
  
  const handleAcquireResource = (resource: Resource) => {
    if (!gameState) return;
    
    // Clone the current game state
    const newState = JSON.parse(JSON.stringify(gameState));
    
    // Find the business
    const businessIndex = newState.businesses.findIndex((b: Business) => b.id === business.id);
    if (businessIndex === -1) return;
    
    // Find the resource
    const resourceIndex = newState.businesses[businessIndex].resources.findIndex(
      (r: Resource) => r.id === resource.id
    );
    if (resourceIndex === -1) return;
    
    // Check if player has enough cash
    if (newState.player.cash < resource.cost) {
      alert("Not enough cash to acquire this resource!");
      return;
    }
    
    // Update resource and player cash
    newState.businesses[businessIndex].resources[resourceIndex].acquired = true;
    newState.player.cash -= resource.cost;
    
    // Update business revenue based on the resource's revenue bonus
    const revenueBonus = resource.revenueBonus;
    if (revenueBonus > 0) {
      newState.businesses[businessIndex].revenue = Math.round(
        newState.businesses[businessIndex].revenue * (1 + revenueBonus)
      );
    }
    
    // Update the state
    setGameState(newState);
  };
  
  const handleUpgradeResource = (resource: Resource) => {
    if (!gameState) return;
    
    // Clone the current game state
    const newState = JSON.parse(JSON.stringify(gameState));
    
    // Find the business
    const businessIndex = newState.businesses.findIndex((b: Business) => b.id === business.id);
    if (businessIndex === -1) return;
    
    // Find the resource
    const resourceIndex = newState.businesses[businessIndex].resources.findIndex(
      (r: Resource) => r.id === resource.id
    );
    if (resourceIndex === -1) return;
    
    // Calculate the upgrade cost (50% more than original)
    const upgradeCost = Math.round(resource.cost * 0.5);
    
    // Check if player has enough cash
    if (newState.player.cash < upgradeCost) {
      alert("Not enough cash to upgrade this resource!");
      return;
    }
    
    // Check if resource is at max level
    if (resource.level >= resource.maxLevel) {
      alert("This resource is already at maximum level!");
      return;
    }
    
    // Update resource level and player cash
    newState.businesses[businessIndex].resources[resourceIndex].level += 1;
    newState.player.cash -= upgradeCost;
    
    // Increase business revenue based on the resource's revenue bonus (with diminishing returns)
    const additionalBonus = resource.revenueBonus * 0.5; // Half the original bonus for each upgrade
    if (additionalBonus > 0) {
      newState.businesses[businessIndex].revenue = Math.round(
        newState.businesses[businessIndex].revenue * (1 + additionalBonus)
      );
    }
    
    // Update the state
    setGameState(newState);
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
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
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
        
        <TabsContent value="resources" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Resources</h3>
            <p className="text-sm text-muted-foreground">Acquire and upgrade essential resources for your business</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.resources && business.resources.length > 0 ? (
                business.resources.map((resource: Resource) => (
                  <Card key={resource.id} className={resource.acquired ? "bg-muted" : ""}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <CardTitle className="text-base">{resource.name}</CardTitle>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {resource.acquired ? (
                        <>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Level:</span>
                            <Badge variant="outline">
                              {resource.level}/{resource.maxLevel}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Efficiency</span>
                              <span>{Math.round((resource.level / resource.maxLevel) * 100)}%</span>
                            </div>
                            <Progress value={(resource.level / resource.maxLevel) * 100} className="h-2" />
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Effects:</p>
                            {resource.revenueBonus > 0 && (
                              <p className="text-sm text-green-600">
                                +{Math.round(resource.revenueBonus * 100)}% Revenue
                              </p>
                            )}
                            {resource.costReduction > 0 && (
                              <p className="text-sm text-green-600">
                                -{Math.round(resource.costReduction * 100)}% Costs
                              </p>
                            )}
                            {resource.qualityBonus > 0 && (
                              <p className="text-sm text-green-600">
                                +{Math.round(resource.qualityBonus * 100)}% Quality
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Benefits:</p>
                          {resource.revenueBonus > 0 && (
                            <p className="text-sm text-gray-500">
                              +{Math.round(resource.revenueBonus * 100)}% Revenue
                            </p>
                          )}
                          {resource.costReduction > 0 && (
                            <p className="text-sm text-gray-500">
                              -{Math.round(resource.costReduction * 100)}% Costs
                            </p>
                          )}
                          {resource.qualityBonus > 0 && (
                            <p className="text-sm text-gray-500">
                              +{Math.round(resource.qualityBonus * 100)}% Quality
                            </p>
                          )}
                        </div>
                      )}
                      <p className="font-medium mt-2">
                        {resource.acquired 
                          ? `Upgrade Cost: ${formatCurrency(Math.round(resource.cost * 0.5))}` 
                          : `Cost: ${formatCurrency(resource.cost)}`}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      {resource.acquired ? (
                        <Button 
                          onClick={() => handleUpgradeResource(resource)}
                          disabled={resource.level >= resource.maxLevel}
                          variant="default"
                          className="w-full"
                        >
                          {resource.level >= resource.maxLevel ? "Max Level" : "Upgrade Resource"}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleAcquireResource(resource)}
                          variant="default"
                          className="w-full"
                        >
                          Acquire Resource
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center h-40">
                  <p className="text-muted-foreground">This business doesn't have any resources yet.</p>
                </div>
              )}
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