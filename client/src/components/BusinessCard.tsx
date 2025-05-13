import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Business } from "@shared/schema";
import { formatCurrency } from "@/lib/businessLogic";
import { Building2, TrendingUp, Users, Star, ArrowUp } from "lucide-react";

interface BusinessCardProps {
  business: Business;
  compact?: boolean;
  onPurchase?: () => void;
  onUpgrade?: () => void;
  onSell?: () => void;
  onClick?: () => void;
}

export function BusinessCard({
  business,
  compact = false,
  onPurchase,
  onUpgrade,
  onSell,
  onClick
}: BusinessCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const renderBusinessIcon = () => {
    // Using business.icon field to determine which icon to show
    switch (business.icon) {
      case 'lemonade':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8"/><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/><path d="M7 15a6.472 6.472 0 0 1-5-5.5 6.472 6.472 0 0 1 5-5.5"/><path d="M17 15a6.472 6.472 0 0 0 5-5.5 6.472 6.472 0 0 0-5-5.5"/></svg>;
      case 'freelance':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
      case 'shop':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>;
      case 'foodtruck':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M18 15V9a3 3 0 0 0-3-3H10L4 9v6"/><path d="M10 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M4 17h4"/><path d="m14 19 2-2"/><path d="m14 15 2 2"/></svg>;
      case 'retail':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
      case 'tech':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>;
      case 'realestate':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>;
      case 'franchise':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2Z"/><path d="M16 8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2Z"/><path d="M4 17a2 2 0 0 0 2 2h1a4 4 0 0 0 4-4v-2a2 2 0 0 0-2-2H4Z"/><path d="M8 8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2Z"/></svg>;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  // For compact rendering (mainly for dashboard)
  if (compact) {
    return (
      <Card
        className={`cursor-pointer hover:border-primary transition-colors ${business.owned ? 'border-success/50' : ''}`}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                {renderBusinessIcon()}
              </div>
              <div>
                <h3 className="font-medium">{business.name}</h3>
                <p className="text-xs text-muted-foreground">Level {business.level}</p>
              </div>
            </div>
            <Badge variant="outline">{business.type.replace('_', ' ')}</Badge>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue/Turn:</span>
              <span className="font-medium">{formatCurrency(business.revenue * business.level)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={business.owned ? 'border-success/50' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              {renderBusinessIcon()}
            </div>
            <CardTitle>{business.name}</CardTitle>
          </div>
          <Badge variant="outline">{business.type.replace('_', ' ')}</Badge>
        </div>
        <CardDescription>{business.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {business.owned && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-warning mr-1" />
                <span className="text-sm font-medium">Level {business.level}</span>
              </div>
              <Badge variant="secondary">Owned</Badge>
            </div>
          )}
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">Revenue/Turn</span>
              </div>
              <span className="font-medium text-success">
                {formatCurrency(business.revenue * business.level)}
              </span>
            </div>
            
            {business.employees > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">Employees</span>
                </div>
                <span className="font-medium">{business.employees}</span>
              </div>
            )}
            
            {!business.owned && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Purchase Price</span>
                <span className="font-medium">{formatCurrency(business.purchasePrice)}</span>
              </div>
            )}
            
            {business.owned && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">Upgrade Cost</span>
                </div>
                <span className="font-medium">{formatCurrency(business.upgradePrice * business.level)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {!business.owned && onPurchase && (
          <Button className="w-full" onClick={onPurchase}>Purchase</Button>
        )}
        
        {business.owned && (
          <>
            {onUpgrade && (
              <Button className="flex-1" onClick={onUpgrade}>
                Upgrade
              </Button>
            )}
            
            {onSell && (
              <Button variant="outline" className="flex-1" onClick={onSell}>
                Sell
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
