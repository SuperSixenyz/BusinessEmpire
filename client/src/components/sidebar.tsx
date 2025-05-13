import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameContext } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { formatCurrency } from "@/lib/businessLogic";
import {
  LayoutDashboard,
  Building,
  TrendingUp,
  Gem,
  Bell,
  LogOut,
  Save,
  Menu,
  X,
  DollarSign,
  User,
  Home,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { gameState, logout, userId, saveGame } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showQuickSaveDialog, setShowQuickSaveDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    window.location.href = "/";
  };

  const handleQuickSave = async () => {
    if (gameState) {
      const saveName = `Quick Save - Turn ${gameState.turn}`;
      await saveGame(saveName);
      setShowQuickSaveDialog(false);
    }
  };

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Businesses",
      href: "/business",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Investments",
      href: "/investments",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Assets",
      href: "/assets",
      icon: <Gem className="h-5 w-5" />,
    },
    {
      title: "Events",
      href: "/events",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="relative">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-white dark:bg-gray-950 border-r border-border w-64 
          flex-shrink-0 flex flex-col z-40
          ${isOpen ? "fixed inset-0 ease-in" : "fixed -translate-x-full md:translate-x-0 md:relative ease-out"}
          transition-all duration-200
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-bold text-lg">Business Empire</h1>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {gameState && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Cash</span>
              <span className="text-sm font-semibold">{formatCurrency(gameState.player.cash)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Net Worth</span>
              <span className="text-sm font-semibold">{formatCurrency(gameState.player.netWorth)}</span>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          {userId && (
            <>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Player #{userId}</p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setShowQuickSaveDialog(true)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Quick Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </>
          )}
          {!userId && (
            <p className="text-sm text-center text-muted-foreground">
              Login to save your progress
            </p>
          )}
        </div>
      </aside>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? Make sure to save your game progress first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Save Dialog */}
      <Dialog open={showQuickSaveDialog} onOpenChange={setShowQuickSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Save</DialogTitle>
            <DialogDescription>
              Save your current game progress as "Quick Save - Turn {gameState?.turn}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuickSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickSave}>
              Save Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
