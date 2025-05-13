import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/sidebar";
import { useGameContext } from "@/context/GameContext";
import { StockChart } from "@/components/StockChart";
import { Stock } from "@shared/schema";
import { formatCurrency } from "@/lib/businessLogic";
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";

export default function Investments() {
  const { gameState, buyStock, sellStock } = useGameContext();
  
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dialogType, setDialogType] = useState<'buy' | 'sell' | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  if (!gameState) return null;
  
  const handleBuyStock = (stock: Stock) => {
    setSelectedStock(stock);
    setDialogType('buy');
    setQuantity(1);
  };
  
  const handleSellStock = (stock: Stock) => {
    setSelectedStock(stock);
    setDialogType('sell');
    setQuantity(stock.owned || 1);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const handleMaxShares = () => {
    if (dialogType === 'buy' && selectedStock) {
      const maxAffordable = Math.floor(gameState.player.cash / selectedStock.price);
      setQuantity(maxAffordable);
    } else if (dialogType === 'sell' && selectedStock && selectedStock.owned) {
      setQuantity(selectedStock.owned);
    }
  };
  
  const confirmAction = () => {
    if (!selectedStock) return;
    
    if (dialogType === 'buy') {
      buyStock(selectedStock.id, quantity);
    } else if (dialogType === 'sell') {
      sellStock(selectedStock.id, quantity);
    }
    
    setDialogType(null);
    setSelectedStock(null);
  };
  
  const cancelAction = () => {
    setDialogType(null);
    setSelectedStock(null);
  };
  
  // Calculate portfolio value
  const portfolioValue = gameState.stocks.reduce((total, stock) => {
    return total + (stock.price * (stock.owned || 0));
  }, 0);
  
  // Calculate today's gain/loss
  const todaysChange = gameState.stocks.reduce((total, stock) => {
    if (stock.owned && stock.owned > 0 && stock.history.length > 1) {
      const previousPrice = stock.history[stock.history.length - 2];
      return total + ((stock.price - previousPrice) * stock.owned);
    }
    return total;
  }, 0);
  
  // Calculate total gain/loss
  const totalChange = gameState.stocks.reduce((total, stock) => {
    if (stock.owned && stock.owned > 0 && stock.purchasePrice) {
      return total + ((stock.price - stock.purchasePrice) * stock.owned);
    }
    return total;
  }, 0);
  
  // Filter stocks that the player owns
  const ownedStocks = gameState.stocks.filter(stock => stock.owned && stock.owned > 0);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" /> 
              Stock Investments
            </h1>
            <p className="text-muted-foreground">
              Grow your wealth through stock market investments
            </p>
          </div>
          
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(portfolioValue)}</h2>
                </div>
                <CreditCard className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Change</p>
                  <h2 className={`text-2xl font-bold ${todaysChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {todaysChange >= 0 ? '+' : ''}{formatCurrency(todaysChange)}
                  </h2>
                </div>
                {todaysChange >= 0 
                  ? <TrendingUp className="h-8 w-8 text-success opacity-80" />
                  : <TrendingDown className="h-8 w-8 text-destructive opacity-80" />
                }
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Gain/Loss</p>
                  <h2 className={`text-2xl font-bold ${totalChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)}
                  </h2>
                </div>
                {totalChange >= 0 
                  ? <TrendingUp className="h-8 w-8 text-success opacity-80" />
                  : <TrendingDown className="h-8 w-8 text-destructive opacity-80" />
                }
              </CardContent>
            </Card>
          </div>
          
          {/* Portfolio Summary */}
          {ownedStocks.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>
                  Stocks you currently own
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">Stock</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Shares</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Avg. Price</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Current Price</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Value</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Gain/Loss</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownedStocks.map(stock => {
                        const value = stock.price * (stock.owned || 0);
                        const purchaseValue = (stock.purchasePrice || stock.price) * (stock.owned || 0);
                        const gainLoss = value - purchaseValue;
                        const gainLossPercent = (gainLoss / purchaseValue) * 100;
                        
                        return (
                          <tr key={stock.id} className="border-b border-border">
                            <td className="py-3">
                              <div className="font-medium">{stock.name}</div>
                              <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                            </td>
                            <td className="text-right py-3">{stock.owned}</td>
                            <td className="text-right py-3">{formatCurrency(stock.purchasePrice || 0)}</td>
                            <td className="text-right py-3">{formatCurrency(stock.price)}</td>
                            <td className="text-right py-3">{formatCurrency(value)}</td>
                            <td className="text-right py-3">
                              <div className={gainLoss >= 0 ? 'text-success' : 'text-destructive'}>
                                {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                              </div>
                              <div className={`text-xs ${gainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                              </div>
                            </td>
                            <td className="text-right py-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSellStock(stock)}
                              >
                                Sell
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Stock Market */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Market</CardTitle>
              <CardDescription>
                Available stocks for trading (Market Trend: 
                <span className={gameState.marketTrend > 0 ? 'text-success' : 'text-destructive'}>
                  {' '}{gameState.marketTrend > 0 ? '+' : ''}{(gameState.marketTrend * 100).toFixed(1)}%
                </span>)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.stocks.map(stock => {
                  const priceChange = stock.history.length > 1 
                    ? ((stock.price - stock.history[stock.history.length - 2]) / stock.history[stock.history.length - 2]) * 100
                    : 0;
                  
                  return (
                    <Card key={stock.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{stock.name}</CardTitle>
                            <CardDescription>{stock.symbol}</CardDescription>
                          </div>
                          <div className={`text-right ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                            <div className="text-lg font-bold">{formatCurrency(stock.price)}</div>
                            <div className="text-sm flex items-center justify-end">
                              {priceChange >= 0 
                                ? <TrendingUp className="w-3 h-3 mr-1" /> 
                                : <TrendingDown className="w-3 h-3 mr-1" />
                              }
                              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="h-20 -mx-2">
                          <StockChart data={stock.history} />
                        </div>
                        
                        {stock.owned && stock.owned > 0 && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            You own {stock.owned} shares
                            {stock.purchasePrice && (
                              <span> (avg. {formatCurrency(stock.purchasePrice)})</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-4">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleBuyStock(stock)}
                          >
                            Buy
                          </Button>
                          
                          {stock.owned && stock.owned > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSellStock(stock)}
                            >
                              Sell
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Trade Dialog */}
          <Dialog open={dialogType !== null} onOpenChange={(open) => !open && cancelAction()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialogType === 'buy' ? 'Buy Stocks' : 'Sell Stocks'}</DialogTitle>
                <DialogDescription>
                  {dialogType === 'buy' 
                    ? 'Select how many shares you want to purchase'
                    : 'Select how many shares you want to sell'}
                </DialogDescription>
              </DialogHeader>
              
              {selectedStock && (
                <div className="py-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedStock.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedStock.symbol}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{formatCurrency(selectedStock.price)}</div>
                      {selectedStock.history.length > 1 && (
                        <div className={
                          selectedStock.price > selectedStock.history[selectedStock.history.length - 2]
                            ? 'text-success text-sm'
                            : 'text-destructive text-sm'
                        }>
                          {selectedStock.price > selectedStock.history[selectedStock.history.length - 2] ? '+' : ''}
                          {(((selectedStock.price - selectedStock.history[selectedStock.history.length - 2]) / 
                             selectedStock.history[selectedStock.history.length - 2]) * 100).toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2" 
                        onClick={handleMaxShares}
                      >
                        {dialogType === 'buy' ? 'Max' : 'All'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price per share:</span>
                      <span>{formatCurrency(selectedStock.price)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">{formatCurrency(selectedStock.price * quantity)}</span>
                    </div>
                    
                    {dialogType === 'buy' && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Cash after purchase:</span>
                        <span className={gameState.player.cash >= selectedStock.price * quantity ? '' : 'text-destructive'}>
                          {formatCurrency(gameState.player.cash - (selectedStock.price * quantity))}
                        </span>
                      </div>
                    )}
                    
                    {dialogType === 'sell' && selectedStock.purchasePrice && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Profit/Loss:</span>
                        <span className={selectedStock.price >= selectedStock.purchasePrice ? 'text-success' : 'text-destructive'}>
                          {selectedStock.price >= selectedStock.purchasePrice ? '+' : ''}
                          {formatCurrency((selectedStock.price - selectedStock.purchasePrice) * quantity)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={cancelAction}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmAction}
                  disabled={
                    dialogType === 'buy' && (gameState.player.cash < (selectedStock?.price || 0) * quantity) || 
                    dialogType === 'sell' && (quantity > (selectedStock?.owned || 0))
                  }
                >
                  {dialogType === 'buy' ? 'Buy' : 'Sell'} {quantity} {quantity === 1 ? 'Share' : 'Shares'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
