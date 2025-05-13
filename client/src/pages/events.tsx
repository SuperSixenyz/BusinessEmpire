import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { EventCard } from "@/components/EventCard";
import { useGameContext } from "@/context/GameContext";
import { EconomicEvent } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  BarChart 
} from "lucide-react";

export default function Events() {
  const { gameState } = useGameContext();
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  
  if (!gameState) return null;
  
  // Filter events by type
  const positiveEvents = gameState.events.filter(e => e.type === 'POSITIVE');
  const negativeEvents = gameState.events.filter(e => e.type === 'NEGATIVE');
  const neutralEvents = gameState.events.filter(e => e.type === 'NEUTRAL');
  
  // Active events
  const activeEvents = gameState.activeEvents || [];
  
  // Historic events (events that have been applied)
  const historicEvents = gameState.events.filter(e => e.applied);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6" /> 
              Economic Events
            </h1>
            <p className="text-muted-foreground">
              Market events that impact your business empire
            </p>
          </div>
          
          {/* Active Events Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-warning" />
                Active Events
              </CardTitle>
              <CardDescription>
                Events currently affecting your businesses and the market
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">There are no active events at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEvents.map((event, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        event.type === 'POSITIVE' 
                          ? 'bg-success/10 border-success/20' 
                          : event.type === 'NEGATIVE'
                            ? 'bg-destructive/10 border-destructive/20'
                            : 'bg-muted border-muted-foreground/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge variant={
                          event.type === 'POSITIVE' ? 'success' : 
                          event.type === 'NEGATIVE' ? 'destructive' : 'secondary'
                        }>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{event.description}</p>
                      
                      {event.turnsLeft && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{event.turnsLeft} {event.turnsLeft === 1 ? 'turn' : 'turns'} remaining</span>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        {event.affectedBusinessTypes && event.affectedBusinessTypes.length > 0 && (
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-1 items-center mb-1">
                            <span>Affects:</span>
                            {event.affectedBusinessTypes.map((type, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {type.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs mt-1">
                          <span className="text-muted-foreground mr-2">Impact:</span>
                          <div className="flex items-center">
                            {event.multiplier > 1 ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-success mr-1" />
                                <span className="text-success">+{((event.multiplier - 1) * 100).toFixed(0)}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                                <span className="text-destructive">-{((1 - event.multiplier) * 100).toFixed(0)}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Economic Indicators */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Economic Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Market Trend</p>
                  <div className="flex items-center">
                    {gameState.marketTrend > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success mr-2" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive mr-2" />
                    )}
                    <span className={`text-lg font-semibold ${
                      gameState.marketTrend > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {gameState.marketTrend > 0 ? '+' : ''}
                      {(gameState.marketTrend * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Economic Health</p>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          gameState.economicHealth > 70 ? 'bg-success' :
                          gameState.economicHealth > 30 ? 'bg-warning' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${gameState.economicHealth}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-semibold">{gameState.economicHealth.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Current Turn</p>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <span className="text-lg font-semibold">{gameState.turn}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Events Database</CardTitle>
              <CardDescription>
                Possible economic events that can occur in the game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Events ({gameState.events.length})</TabsTrigger>
                  <TabsTrigger value="positive">Positive ({positiveEvents.length})</TabsTrigger>
                  <TabsTrigger value="negative">Negative ({negativeEvents.length})</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral ({neutralEvents.length})</TabsTrigger>
                  <TabsTrigger value="historic">Historic ({historicEvents.length})</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[400px] pr-4">
                  <TabsContent value="all" className="space-y-4">
                    {gameState.events.map((event, index) => (
                      <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="positive" className="space-y-4">
                    {positiveEvents.map((event, index) => (
                      <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                    
                    {positiveEvents.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No positive events found.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="negative" className="space-y-4">
                    {negativeEvents.map((event, index) => (
                      <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                    
                    {negativeEvents.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No negative events found.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="neutral" className="space-y-4">
                    {neutralEvents.map((event, index) => (
                      <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                    
                    {neutralEvents.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No neutral events found.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="historic" className="space-y-4">
                    {historicEvents.map((event, index) => (
                      <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                    
                    {historicEvents.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No historic events found.</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
