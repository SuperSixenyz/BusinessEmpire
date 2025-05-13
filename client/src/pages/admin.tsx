import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AdminPanel } from "@/components/AdminPanel";
import { AdminAccessModal } from "@/components/AdminAccessModal";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  const [location, setLocation] = useState<any>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { gameState } = useGameContext();
  
  // Check if there's an active game
  useEffect(() => {
    if (!gameState) {
      setLocation("/");
    }
  }, [gameState, setLocation]);
  
  // Show admin access modal on page load
  useEffect(() => {
    setAdminModalOpen(true);
  }, []);
  
  const handleAccessGranted = () => {
    setIsAuthorized(true);
  };
  
  if (!gameState) {
    return null;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
      </div>
      
      {isAuthorized ? (
        <AdminPanel />
      ) : (
        <Card className="p-8 max-w-md mx-auto mt-12 text-center">
          <CardContent className="pt-6 flex flex-col items-center">
            <Lock className="h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">
              This section requires administrator privileges to access. Please enter the correct password.
            </p>
            <Button 
              onClick={() => setAdminModalOpen(true)}
              className="flex items-center"
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      )}
      
      <AdminAccessModal 
        open={adminModalOpen} 
        onOpenChange={setAdminModalOpen}
        onAccessGranted={handleAccessGranted}
      />
    </div>
  );
}