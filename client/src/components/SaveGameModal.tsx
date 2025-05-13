import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

interface SaveGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveGame: (saveName: string) => Promise<void>;
}

export function SaveGameModal({ open, onOpenChange, onSaveGame }: SaveGameModalProps) {
  const { gameState, userId } = useGameContext();
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!saveName.trim()) return;
    
    setIsSaving(true);
    try {
      await onSaveGame(saveName.trim());
      setSaveName("");
    } catch (error) {
      console.error("Failed to save game:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate a default save name based on current game state
  const defaultSaveName = gameState ? 
    `Business Empire - ${gameState.player.name || "Player"} - Turn ${gameState.turn}` : 
    "New Save";
  
  // If no user ID, prompt to login
  const showLoginPrompt = !userId;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Game</DialogTitle>
          <DialogDescription>
            {showLoginPrompt ? 
              "You need to be logged in to save your game." : 
              "Save your current game progress with a custom name."}
          </DialogDescription>
        </DialogHeader>
        
        {!showLoginPrompt ? (
          <>
            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="saveName">Save Name</Label>
                <Input
                  id="saveName"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={defaultSaveName}
                />
              </div>
              
              {gameState && (
                <div className="mt-4 bg-muted p-3 rounded-md text-sm">
                  <p><strong>Turn:</strong> {gameState.turn}</p>
                  <p><strong>Cash:</strong> ${gameState.player.cash.toLocaleString()}</p>
                  <p><strong>Net Worth:</strong> ${gameState.player.netWorth.toLocaleString()}</p>
                  <p><strong>Businesses:</strong> {gameState.businesses.filter(b => b.owned).length}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !saveName.trim()}
              >
                {isSaving ? "Saving..." : "Save Game"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 p-4 rounded-md">
              <p className="text-sm">
                You need to be logged in to save your game progress. Please log in or register a new account.
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
