import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

interface NewGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewGameModal({ open, onOpenChange }: NewGameModalProps) {
  const [, navigate] = useLocation();
  const { startNewGame } = useGameContext();
  const [playerName, setPlayerName] = useState("");
  
  const handleStartGame = () => {
    startNewGame(playerName.trim() || undefined);
    onOpenChange(false);
    navigate("/dashboard");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Game</DialogTitle>
          <DialogDescription>
            Begin your journey as a business tycoon with $1,000 in starting capital.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name (Optional)</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="mt-4 bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Game Objective</h4>
            <p className="text-sm text-muted-foreground">
              Start with $1,000 and build a business empire through smart investments.
              Purchase businesses, invest in stocks, and acquire valuable assets as you
              grow your net worth and expand your business portfolio.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartGame}>
            Start New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
