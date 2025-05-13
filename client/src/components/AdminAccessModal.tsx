import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AdminAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccessGranted: () => void;
}

export function AdminAccessModal({ open, onOpenChange, onAccessGranted }: AdminAccessModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if password matches the admin password
    if (password === "Ansh1234") {
      setError(null);
      onAccessGranted();
      onOpenChange(false);
    } else {
      setError("Invalid admin password. Access denied.");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
          <DialogDescription>
            Enter the admin password to access advanced features and game cheats.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col space-y-2">
            <Input 
              type="password" 
              placeholder="Enter admin password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Access Admin Panel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}