import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGameContext } from "@/context/GameContext";
import { LoadGameModal } from "@/components/LoadGameModal";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { startNewGame, hasActiveGame, loadGame, savedGames, login, register } = useGameContext();
  
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoadGameModal, setShowLoadGameModal] = useState(false);
  
  const [playerName, setPlayerName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleStartGame = () => {
    startNewGame(playerName);
    setShowNewGameModal(false);
    navigate("/dashboard");
  };
  
  const handleContinueGame = () => {
    if (hasActiveGame) {
      navigate("/dashboard");
    } else {
      toast({
        title: "No Active Game",
        description: "Please start a new game or load a saved game.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      setShowLoginModal(false);
      setUsername("");
      setPassword("");
    }
  };
  
  const handleRegister = async () => {
    const success = await register(username, password);
    if (success) {
      setShowRegisterModal(false);
      setUsername("");
      setPassword("");
    }
  };
  
  const handleLoadGame = async (saveId: number) => {
    const success = await loadGame(saveId);
    if (success) {
      setShowLoadGameModal(false);
      navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-blue-100 flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-primary">Business Empire</h1>
        <p className="text-lg text-gray-600 mt-2">Build your business empire from the ground up</p>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to Business Empire</CardTitle>
            <CardDescription className="text-center">
              Start with $1,000 and build your business empire through smart investments and strategic decisions.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Make wise decisions, expand your businesses, invest in stocks, and acquire assets to grow your wealth.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                className="w-full" 
                onClick={() => setShowNewGameModal(true)}
              >
                Start New Game
              </Button>
              
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleContinueGame}
                disabled={!hasActiveGame}
              >
                Continue Game
              </Button>
              
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setShowLoadGameModal(true)}
                disabled={savedGames.length === 0}
              >
                Load Game
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
              Login
            </Button>
            <Button variant="ghost" onClick={() => setShowRegisterModal(true)}>
              Register
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>© 2023 Business Empire Simulation Game</p>
      </footer>
      
      {/* New Game Modal */}
      <Dialog open={showNewGameModal} onOpenChange={setShowNewGameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Game</DialogTitle>
            <DialogDescription>
              Enter your name to begin your business journey.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">Your Name (Optional)</Label>
              <Input 
                id="playerName"
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewGameModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartGame}>
              Start Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Login to access your saved games.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogin}>
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Register Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>
              Create an account to save your game progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reg-username">Username</Label>
              <Input 
                id="reg-username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input 
                id="reg-password"
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowRegisterModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister}>
              Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Load Game Modal */}
      <LoadGameModal 
        open={showLoadGameModal} 
        onOpenChange={setShowLoadGameModal} 
        onLoadGame={handleLoadGame}
      />
    </div>
  );
}
