import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameContext } from "@/context/GameContext";
import { Sidebar } from "@/components/sidebar";
import { BusinessCard } from "@/components/BusinessCard";
import { formatCurrency } from "@/lib/businessLogic";
import { Business } from "@shared/schema";
import { Building, Briefcase, TrendingUp, DollarSign } from "lucide-react";

export default function BusinessPage() {
  const { gameState, purchaseBusiness, upgradeBusiness, sellBusiness, activateQuickMoney, purchaseBusinessUpgrade, applyBusinessStrategy } = useGameContext();
  
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [dialogType, setDialogType] = useState<'purchase' | 'upgrade' | 'sell' | null>(null);
  
  const handlePurchaseBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setDialogType('purchase');
  };
  
  const handleUpgradeBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setDialogType('upgrade');
  };
  
  const handleSellBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setDialogType('sell');
  };
  
  const confirmAction = () => {
    if (!selectedBusiness) return;
    
    switch (dialogType) {
      case 'purchase':
        purchaseBusiness(selectedBusiness.id);
        break;
      case 'upgrade':
        upgradeBusiness(selectedBusiness.id);
        break;
      case 'sell':
        sellBusiness(selectedBusiness.id);
        break;
    }
    
    setDialogType(null);
    setSelectedBusiness(null);
  };
  
  const cancelAction = () => {
    setDialogType(null);
    setSelectedBusiness(null);
  };
  
  // Filter businesses by owned/available
  const ownedBusinesses = gameState?.businesses.filter(b => b.owned) || [];
  const availableBusinesses = gameState?.businesses.filter(b => b.unlocked && !b.owned) || [];
  const lockedBusinesses = gameState?.businesses.filter(b => !b.unlocked && !b.owned) || [];
  
  if (!gameState) return null;
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6" /> 
              Businesses
            </h1>
            <p className="text-muted-foreground">
              Manage and grow your business portfolio
            </p>
          </div>
          
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Cash</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(gameState.player.cash)}</h2>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Businesses Owned</p>
                  <h2 className="text-2xl font-bold">{ownedBusinesses.length}</h2>
                </div>
                <Briefcase className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Business Revenue</p>
                  <h2 className="text-2xl font-bold">
                    {formatCurrency(
                      ownedBusinesses.reduce((total, business) => total + (business.revenue * business.level), 0)
                    )}
                    <span className="text-sm text-muted-foreground ml-1">/turn</span>
                  </h2>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
          </div>
          
          {/* Business Tabs */}
          <Tabs defaultValue="owned" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="owned">
                Owned Businesses ({ownedBusinesses.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available For Purchase ({availableBusinesses.length})
              </TabsTrigger>
              <TabsTrigger value="locked">
                Locked Businesses ({lockedBusinesses.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Owned Businesses Tab */}
            <TabsContent value="owned">
              {ownedBusinesses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No Businesses Owned</h3>
                    <p className="text-muted-foreground mt-2">
                      You don't own any businesses yet. Check the "Available For Purchase" tab to buy your first business.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedBusinesses.map(business => (
                    <BusinessCard 
                      key={business.id} 
                      business={business}
                      onUpgrade={() => handleUpgradeBusiness(business)}
                      onSell={() => handleSellBusiness(business)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Available Businesses Tab */}
            <TabsContent value="available">
              {availableBusinesses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No Businesses Available</h3>
                    <p className="text-muted-foreground mt-2">
                      There are no businesses available for purchase at the moment. Keep growing your net worth to unlock more opportunities.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableBusinesses.map(business => (
                    <BusinessCard 
                      key={business.id} 
                      business={business}
                      onPurchase={() => handlePurchaseBusiness(business)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Locked Businesses Tab */}
            <TabsContent value="locked">
              {lockedBusinesses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">All Businesses Unlocked</h3>
                    <p className="text-muted-foreground mt-2">
                      You've unlocked all available business opportunities. Congratulations!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedBusinesses.map(business => (
                    <Card key={business.id} className="border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between opacity-60">
                          <span className="flex items-center">
                            {business.name}
                          </span>
                          <Badge variant="outline">Locked</Badge>
                        </CardTitle>
                        <CardDescription className="opacity-60">
                          {business.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mt-2">
                          This business will unlock when your net worth reaches approximately {formatCurrency(business.purchasePrice * 2)}.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Confirmation Dialogs */}
          <Dialog open={dialogType !== null} onOpenChange={(open) => !open && cancelAction()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {dialogType === 'purchase' ? 'Purchase Business' : 
                   dialogType === 'upgrade' ? 'Upgrade Business' : 'Sell Business'}
                </DialogTitle>
                <DialogDescription>
                  {dialogType === 'purchase' 
                    ? 'Are you sure you want to purchase this business?' 
                    : dialogType === 'upgrade'
                    ? 'Are you sure you want to upgrade this business?'
                    : 'Are you sure you want to sell this business?'}
                </DialogDescription>
              </DialogHeader>
              
              {selectedBusiness && (
                <div className="py-4">
                  <h3 className="font-semibold text-lg mb-2">{selectedBusiness.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedBusiness.description}</p>
                  
                  {dialogType === 'purchase' && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Purchase Price:</span>
                      <span className="font-bold">{formatCurrency(selectedBusiness.purchasePrice)}</span>
                    </div>
                  )}
                  
                  {dialogType === 'upgrade' && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Current Level:</span>
                        <span className="font-bold">{selectedBusiness.level}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">New Level:</span>
                        <span className="font-bold">{selectedBusiness.level + 1}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Current Revenue:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedBusiness.revenue * selectedBusiness.level)}/turn
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">New Revenue:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedBusiness.revenue * (selectedBusiness.level + 1))}/turn
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Upgrade Cost:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedBusiness.upgradePrice * selectedBusiness.level)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {dialogType === 'sell' && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Original Purchase:</span>
                        <span className="font-bold">{formatCurrency(selectedBusiness.purchasePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Selling Price:</span>
                        <span className="font-bold">
                          {formatCurrency(selectedBusiness.purchasePrice * selectedBusiness.level * 0.8)}
                        </span>
                      </div>
                      <p className="text-sm text-amber-600 mt-4">
                        Warning: Selling this business will reset its level to 1 if you repurchase it later.
                      </p>
                    </>
                  )}
                </div>
              )}
              
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={cancelAction}>
                  Cancel
                </Button>
                <Button 
                  variant={dialogType === 'sell' ? 'destructive' : 'default'}
                  onClick={confirmAction}
                >
                  {dialogType === 'purchase' ? 'Purchase' : 
                   dialogType === 'upgrade' ? 'Upgrade' : 'Sell'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
