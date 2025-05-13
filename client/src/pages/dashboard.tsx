import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/GameContext";
import { SaveGameModal } from "@/components/SaveGameModal";
import { LoadGameModal } from "@/components/LoadGameModal";
import { Sidebar } from "@/components/sidebar";
import { BusinessCard } from "@/components/BusinessCard";
import { FinancialSummary } from "@/components/FinancialSummary";
import { MarketTrends } from "@/components/MarketTrends";
import { StockChart } from "@/components/StockChart";
import { Briefcase, TrendingUp, DollarSign, LineChart, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/businessLogic";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { gameState, endTurn, hasActiveGame, saveGame, loadGame } = useGameContext();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  
  // If no active game, redirect to home
  if (!hasActiveGame) {
    navigate("/");
    return null;
  }
  
  const handleSaveGame = async (saveName: string) => {
    const success = await saveGame(saveName);
    if (success) {
      setShowSaveModal(false);
    }
  };
  
  const handleLoadGame = async (saveId: number) => {
    const success = await loadGame(saveId);
    if (success) {
      setShowLoadModal(false);
    }
  };
  
  const handleEndTurn = () => {
    endTurn();
  };
  
  // Get owned businesses
  const ownedBusinesses = gameState?.businesses.filter(b => b.owned) || [];
  
  // Get top performing stocks (highest percentage gain)
  const topStocks = [...(gameState?.stocks || [])]
    .sort((a, b) => {
      const aPercentChange = a.history.length > 1 
        ? ((a.price - a.history[a.history.length - 2]) / a.history[a.history.length - 2]) * 100
        : 0;
      const bPercentChange = b.history.length > 1 
        ? ((b.price - b.history[b.history.length - 2]) / b.history[b.history.length - 2]) * 100
        : 0;
      return bPercentChange - aPercentChange;
    })
    .slice(0, 3);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Business overview and financial summary
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 lg:mt-0">
              <Button variant="outline" onClick={() => setShowSaveModal(true)}>
                Save Game
              </Button>
              
              <Button variant="outline" onClick={() => setShowLoadModal(true)}>
                Load Game
              </Button>
              
              <Button onClick={handleEndTurn}>
                End Turn ({gameState?.turn})
              </Button>
            </div>
          </div>
          
          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cash</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(gameState?.player.cash || 0)}</h2>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(gameState?.player.netWorth || 0)}</h2>
                </div>
                <Briefcase className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Market Trend</p>
                  <h2 className="text-2xl font-bold">
                    <span className={gameState?.marketTrend && gameState.marketTrend > 0 ? 'text-success' : 'text-destructive'}>
                      {gameState?.marketTrend ? (gameState.marketTrend > 0 ? '+' : '') + (gameState.marketTrend * 100).toFixed(1) + '%' : '0%'}
                    </span>
                  </h2>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turn</p>
                  <h2 className="text-2xl font-bold">{gameState?.turn}</h2>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Business Summary */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Businesses</span>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/business")}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ownedBusinesses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You don't own any businesses yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate("/business")}
                      >
                        Purchase a Business
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ownedBusinesses.slice(0, 4).map(business => (
                        <BusinessCard 
                          key={business.id} 
                          business={business} 
                          compact
                          onClick={() => navigate("/business")}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialSummary />
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Market & Stock Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketTrends />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Top Performing Stocks</span>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/investments")}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topStocks.map(stock => (
                    <div 
                      key={stock.id} 
                      className="border-b border-border last:border-0 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium">{stock.name} ({stock.symbol})</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(stock.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          {stock.history.length > 1 && (
                            <p className={`font-medium ${
                              stock.price > stock.history[stock.history.length - 2] 
                                ? 'text-success' 
                                : 'text-destructive'
                            }`}>
                              {stock.price > stock.history[stock.history.length - 2] ? '+' : ''}
                              {(((stock.price - stock.history[stock.history.length - 2]) / stock.history[stock.history.length - 2]) * 100).toFixed(2)}%
                            </p>
                          )}
                          {stock.owned > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {stock.owned} shares owned
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-16">
                        <StockChart data={stock.history} />
                      </div>
                    </div>
                  ))}
                  
                  {topStocks.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No stock data available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {gameState?.activeEvents && gameState.activeEvents.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Active Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {gameState.activeEvents.map((event, index) => (
                      <div 
                        key={index}
                        className={`mb-3 p-3 rounded-md border ${
                          event.type === 'POSITIVE' 
                            ? 'bg-success/10 border-success/20 text-success-foreground' 
                            : event.type === 'NEGATIVE'
                              ? 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
                              : 'bg-secondary border-secondary/20'
                        }`}
                      >
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm mt-1">{event.description}</p>
                        {event.turnsLeft && (
                          <p className="text-xs mt-2">
                            Turns remaining: {event.turnsLeft}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Save Game Modal */}
      <SaveGameModal 
        open={showSaveModal} 
        onOpenChange={setShowSaveModal} 
        onSaveGame={handleSaveGame} 
      />
      
      {/* Load Game Modal */}
      <LoadGameModal 
        open={showLoadModal} 
        onOpenChange={setShowLoadModal} 
        onLoadGame={handleLoadGame} 
      />
    </div>
  );
}
