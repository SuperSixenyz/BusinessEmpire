import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Building, CalendarDays, Clock } from "lucide-react";

interface LoadGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadGame: (saveId: number) => Promise<void>;
}

export function LoadGameModal({ open, onOpenChange, onLoadGame }: LoadGameModalProps) {
  const { userId, savedGames } = useGameContext();
  const [selectedSaveId, setSelectedSaveId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedSaveId(null);
      setIsLoading(false);
    }
  }, [open]);
  
  const handleLoad = async () => {
    if (selectedSaveId === null) return;
    
    setIsLoading(true);
    try {
      await onLoadGame(selectedSaveId);
    } catch (error) {
      console.error("Failed to load game:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If no user ID, prompt to login
  const showLoginPrompt = !userId;
  
  // Format the date from ISO string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Load Game</DialogTitle>
          <DialogDescription>
            {showLoginPrompt ? 
              "You need to be logged in to load saved games." : 
              savedGames.length > 0 ? 
                "Select a saved game to continue your business journey." : 
                "You don't have any saved games yet."
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showLoginPrompt ? (
          <>
            {savedGames.length > 0 ? (
              <div className="py-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {savedGames.map((save) => (
                      <Card
                        key={save.id}
                        className={`p-4 cursor-pointer ${
                          selectedSaveId === save.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedSaveId(save.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Building className="h-5 w-5 text-primary mr-2" />
                            <h3 className="font-medium">{save.saveName}</h3>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{formatDate(save.createdAt)}</span>
                          </div>
                        </div>
                        
                        {save.gameState && (
                          <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Turn:</span>
                              <span>{save.gameState.turn}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Cash:</span>
                              <span>${save.gameState.player.cash.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Net Worth:</span>
                              <span>${save.gameState.player.netWorth.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Businesses:</span>
                              <span>{save.gameState.businesses.filter(b => b.owned).length}</span>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="py-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p>You don't have any saved games yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start a new game and save your progress to see it here.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleLoad} 
                disabled={isLoading || selectedSaveId === null}
              >
                {isLoading ? "Loading..." : "Load Game"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 p-4 rounded-md">
              <p className="text-sm">
                You need to be logged in to access your saved games. Please log in or register a new account.
              </p>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
