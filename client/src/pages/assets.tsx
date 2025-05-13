import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { AssetCard } from "@/components/AssetCard";
import { useGameContext } from "@/context/GameContext";
import { Asset } from "@shared/schema";
import { formatCurrency } from "@/lib/businessLogic";
import { GemIcon, Building2, Car, CircleDollarSign, DollarSign } from "lucide-react";

export default function Assets() {
  const { gameState, purchaseAsset, sellAsset } = useGameContext();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dialogType, setDialogType] = useState<'purchase' | 'sell' | null>(null);
  
  if (!gameState) return null;
  
  const handlePurchaseAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogType('purchase');
  };
  
  const handleSellAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogType('sell');
  };
  
  const confirmAction = () => {
    if (!selectedAsset) return;
    
    if (dialogType === 'purchase') {
      purchaseAsset(selectedAsset.id);
    } else if (dialogType === 'sell') {
      sellAsset(selectedAsset.id);
    }
    
    setDialogType(null);
    setSelectedAsset(null);
  };
  
  const cancelAction = () => {
    setDialogType(null);
    setSelectedAsset(null);
  };
  
  // Filter assets by type and ownership
  const propertyAssets = gameState.assets.filter(a => a.type === 'PROPERTY');
  const vehicleAssets = gameState.assets.filter(a => a.type === 'VEHICLE');
  const luxuryAssets = gameState.assets.filter(a => a.type === 'LUXURY');
  const collectibleAssets = gameState.assets.filter(a => a.type === 'COLLECTIBLE');
  
  const ownedAssets = gameState.assets.filter(a => a.owned);
  const availableAssets = gameState.assets.filter(a => !a.owned);
  
  // Calculate total assets value
  const totalAssetsValue = ownedAssets.reduce((total, asset) => total + asset.value, 0);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <GemIcon className="mr-2 h-6 w-6" /> 
              Assets
            </h1>
            <p className="text-muted-foreground">
              Luxury purchases and appreciating assets
            </p>
          </div>
          
          {/* Stats */}
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
                  <p className="text-sm font-medium text-muted-foreground">Assets Owned</p>
                  <h2 className="text-2xl font-bold">{ownedAssets.length}</h2>
                </div>
                <GemIcon className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assets Value</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(totalAssetsValue)}</h2>
                </div>
                <CircleDollarSign className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Tabs: Owned/Available */}
          <Tabs defaultValue="owned" className="w-full mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="owned">
                Owned Assets ({ownedAssets.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available Assets ({availableAssets.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Owned Assets Tab */}
            <TabsContent value="owned">
              {ownedAssets.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No Assets Owned</h3>
                    <p className="text-muted-foreground mt-2">
                      You don't own any assets yet. Check the "Available Assets" tab to make your first luxury purchase.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedAssets.map(asset => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset}
                      onSell={() => handleSellAsset(asset)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Available Assets Tab */}
            <TabsContent value="available">
              {availableAssets.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">All Assets Purchased</h3>
                    <p className="text-muted-foreground mt-2">
                      You've purchased all available assets. Congratulations on your luxury collection!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableAssets.map(asset => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset}
                      onPurchase={() => handlePurchaseAsset(asset)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Asset Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Categories</CardTitle>
              <CardDescription>
                Browse assets by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="property">
                <TabsList className="mb-4">
                  <TabsTrigger value="property" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" /> Properties
                  </TabsTrigger>
                  <TabsTrigger value="vehicle" className="flex items-center">
                    <Car className="h-4 w-4 mr-2" /> Vehicles
                  </TabsTrigger>
                  <TabsTrigger value="luxury" className="flex items-center">
                    <CircleDollarSign className="h-4 w-4 mr-2" /> Luxury Items
                  </TabsTrigger>
                  <TabsTrigger value="collectible" className="flex items-center">
                    <GemIcon className="h-4 w-4 mr-2" /> Collectibles
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="property">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {propertyAssets.map(asset => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset}
                        onPurchase={!asset.owned ? () => handlePurchaseAsset(asset) : undefined}
                        onSell={asset.owned ? () => handleSellAsset(asset) : undefined}
                      />
                    ))}
                    
                    {propertyAssets.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No property assets available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="vehicle">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicleAssets.map(asset => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset}
                        onPurchase={!asset.owned ? () => handlePurchaseAsset(asset) : undefined}
                        onSell={asset.owned ? () => handleSellAsset(asset) : undefined}
                      />
                    ))}
                    
                    {vehicleAssets.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No vehicle assets available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="luxury">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {luxuryAssets.map(asset => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset}
                        onPurchase={!asset.owned ? () => handlePurchaseAsset(asset) : undefined}
                        onSell={asset.owned ? () => handleSellAsset(asset) : undefined}
                      />
                    ))}
                    
                    {luxuryAssets.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No luxury assets available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="collectible">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collectibleAssets.map(asset => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset}
                        onPurchase={!asset.owned ? () => handlePurchaseAsset(asset) : undefined}
                        onSell={asset.owned ? () => handleSellAsset(asset) : undefined}
                      />
                    ))}
                    
                    {collectibleAssets.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No collectible assets available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Confirmation Dialogs */}
          <Dialog open={dialogType !== null} onOpenChange={(open) => !open && cancelAction()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {dialogType === 'purchase' ? 'Purchase Asset' : 'Sell Asset'}
                </DialogTitle>
                <DialogDescription>
                  {dialogType === 'purchase' 
                    ? 'Are you sure you want to purchase this asset?' 
                    : 'Are you sure you want to sell this asset?'}
                </DialogDescription>
              </DialogHeader>
              
              {selectedAsset && (
                <div className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {selectedAsset.type === 'PROPERTY' && <Building2 />}
                      {selectedAsset.type === 'VEHICLE' && <Car />}
                      {selectedAsset.type === 'LUXURY' && <CircleDollarSign />}
                      {selectedAsset.type === 'COLLECTIBLE' && <GemIcon />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedAsset.name}</h3>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {selectedAsset.type.charAt(0) + selectedAsset.type.slice(1).toLowerCase()}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{selectedAsset.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {dialogType === 'purchase' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Purchase Price:</span>
                          <span className="font-bold">{formatCurrency(selectedAsset.cost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Your Cash:</span>
                          <span className="font-medium">{formatCurrency(gameState.player.cash)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Cash After Purchase:</span>
                          <span className={gameState.player.cash >= selectedAsset.cost ? 'font-medium' : 'font-medium text-destructive'}>
                            {formatCurrency(gameState.player.cash - selectedAsset.cost)}
                          </span>
                        </div>
                        
                        {selectedAsset.appreciation > 0 && (
                          <p className="text-sm text-success mt-4">
                            This asset appreciates at approximately {(selectedAsset.appreciation * 100).toFixed(1)}% per turn.
                          </p>
                        )}
                      </>
                    )}
                    
                    {dialogType === 'sell' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Original Cost:</span>
                          <span className="font-medium">{formatCurrency(selectedAsset.cost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Current Value:</span>
                          <span className="font-bold">{formatCurrency(selectedAsset.value)}</span>
                        </div>
                        {selectedAsset.value > selectedAsset.cost ? (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Profit:</span>
                            <span className="font-medium text-success">
                              +{formatCurrency(selectedAsset.value - selectedAsset.cost)}
                            </span>
                          </div>
                        ) : selectedAsset.value < selectedAsset.cost ? (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Loss:</span>
                            <span className="font-medium text-destructive">
                              -{formatCurrency(selectedAsset.cost - selectedAsset.value)}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={cancelAction}>
                  Cancel
                </Button>
                <Button 
                  variant={dialogType === 'sell' ? 'destructive' : 'default'}
                  onClick={confirmAction}
                  disabled={dialogType === 'purchase' && gameState.player.cash < (selectedAsset?.cost || 0)}
                >
                  {dialogType === 'purchase' ? 'Purchase' : 'Sell'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
