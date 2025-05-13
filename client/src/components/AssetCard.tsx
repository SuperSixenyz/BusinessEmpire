import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Asset } from "@shared/schema";
import { formatCurrency } from "@/lib/businessLogic";
import { Building2, Car, GemIcon, CircleDollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
  onPurchase?: () => void;
  onSell?: () => void;
}

export function AssetCard({
  asset,
  onPurchase,
  onSell
}: AssetCardProps) {
  const appreciationRate = (asset.appreciation * 100).toFixed(1);
  
  // Calculate value change from original cost
  const valueChange = asset.value - asset.cost;
  const valueChangePercent = ((valueChange / asset.cost) * 100).toFixed(1);
  
  const renderAssetIcon = () => {
    switch (asset.type) {
      case 'PROPERTY':
        return <Building2 className="h-5 w-5" />;
      case 'VEHICLE':
        return <Car className="h-5 w-5" />;
      case 'LUXURY':
        return <CircleDollarSign className="h-5 w-5" />;
      case 'COLLECTIBLE':
        return <GemIcon className="h-5 w-5" />;
      default:
        return <GemIcon className="h-5 w-5" />;
    }
  };
  
  const renderCustomIcon = () => {
    // Using asset.icon field to determine which icon to show
    switch (asset.icon) {
      case 'apartment':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M17 22V5c0-2-1.7-3-3-3s-3 1-3 3v17"/><path d="M17 8h2a2 2 0 0 1 2 2v12"/><path d="M2 12h2a2 2 0 0 1 2 2v8"/><path d="M11 4h2"/><path d="M11 8h2"/><path d="M11 12h2"/><path d="M11 16h2"/><path d="M11 20h2"/></svg>;
      case 'house':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
      case 'mansion':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M4 21V8a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v13"/><path d="M20 21V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"/><path d="M15 21V8a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v13"/></svg>;
      case 'car':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z"/><path d="M6 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z"/><path d="M8 17H6a6 6 0 0 1 1.5-4H4v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2h-3.5a6 6 0 0 1 1.5 4h-2.3"/><path d="M14 9h-4V5h4v4Z"/></svg>;
      case 'sportscar':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M5 18h2"/><path d="M17 18h2"/><path d="M5 9h14v5H5z"/><path d="M6 4h10l2 5H4z"/></svg>;
      case 'yacht':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.4 0 2.4-1.5 4.8-1.5 1.3 0 1.9.5 2.5 1 .7-.5 1.2-1 2.5-1 2.4 0 2.4 1.5 4.8 1.5 1.3 0 1.9-.5 2.5-1"/><path d="M19 16.1c1.2 0 2.2.9 2.2 2.1v.3c0 1.2-1 2.1-2.2 2.1-1.9 0-2.3-1.4-4.2-1.4-1.2 0-2.2.9-2.2 2.1v.3"/><path d="M7 12v7.4c0 1.2-1 2.1-2.2 2.1C3.1 21.5 2.6 20 .5 20 3 20 5 18 5 15m11-5.3V15"/><path d="M13.8 9.8A18 18 0 0 0 6.2 7c-2 0-3.8 1.3-4.4 3.1h0C1.3 11.4 2 13 4 13h1"/><path d="M18.2 12c2 0 3.8-1.3 4.4-3.1h0c.5-1.3-.2-2.9-2.2-2.9"/><path d="M16 9h.01"/><path d="M19 9h.01"/><path d="M15 5h.01"/><path d="M18 5h.01"/><path d="M21 5h.01"/><path d="M22 2 9 11"/></svg>;
      case 'watch':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="6"/><polyline points="12 9 12 12 13.5 13.5"/><path d="m16.51 17.35-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>;
      case 'jewellery':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12l4 4-10 16L2 6l4-4Z"/><path d="M11 12 5 6"/></svg>;
      case 'art':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="6" r="3"/><path d="M7 9h14l-9 13H2L7 9Z"/></svg>;
      case 'coin':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>;
      default:
        return renderAssetIcon();
    }
  };

  return (
    <Card className={asset.owned ? 'border-success/50' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              {renderCustomIcon()}
            </div>
            <CardTitle>{asset.name}</CardTitle>
          </div>
          <Badge variant="outline">
            {asset.type.charAt(0) + asset.type.slice(1).toLowerCase()}
          </Badge>
        </div>
        <CardDescription>{asset.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          {!asset.owned && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Purchase Price</span>
              <span className="font-medium">{formatCurrency(asset.cost)}</span>
            </div>
          )}
          
          {asset.owned && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm">Original Cost</span>
                <span className="font-medium">{formatCurrency(asset.cost)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Value</span>
                <span className="font-medium">{formatCurrency(asset.value)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Value Change</span>
                <div className="flex items-center">
                  {valueChange > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-success mr-1" />
                      <span className="font-medium text-success">
                        +{formatCurrency(valueChange)} ({valueChangePercent}%)
                      </span>
                    </>
                  ) : valueChange < 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      <span className="font-medium text-destructive">
                        {formatCurrency(valueChange)} ({valueChangePercent}%)
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">No change</span>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Appreciation Rate</span>
            <span className="font-medium text-success">+{appreciationRate}% per turn</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {!asset.owned && onPurchase && (
          <Button className="w-full" onClick={onPurchase}>Purchase</Button>
        )}
        
        {asset.owned && onSell && (
          <Button variant="outline" className="w-full" onClick={onSell}>
            Sell for {formatCurrency(asset.value)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
