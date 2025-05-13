import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EconomicEvent } from "@shared/schema";
import { TrendingUp, TrendingDown, Calendar, Building, LineChart } from "lucide-react";

interface EventCardProps {
  event: EconomicEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className={`
        ${onClick ? 'cursor-pointer hover:border-primary transition-colors' : ''}
        ${event.applied ? 'opacity-70' : ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3
              ${event.type === 'POSITIVE' 
                ? 'bg-success/10 text-success' 
                : event.type === 'NEGATIVE'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-secondary/50 text-secondary-foreground'}
            `}>
              {event.type === 'POSITIVE' ? (
                <TrendingUp className="h-4 w-4" />
              ) : event.type === 'NEGATIVE' ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <LineChart className="h-4 w-4" />
              )}
            </div>
            <h3 className="font-medium">{event.title}</h3>
          </div>
          <Badge variant={
            event.type === 'POSITIVE' ? 'success' : 
            event.type === 'NEGATIVE' ? 'destructive' : 
            'secondary'
          }>
            {event.type.charAt(0) + event.type.slice(1).toLowerCase()}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
        
        <div className="flex flex-wrap gap-y-2 text-xs">
          <div className="w-full md:w-1/2 flex items-center">
            <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">Duration: {event.duration} {event.duration === 1 ? 'turn' : 'turns'}</span>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center">
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
          
          {event.affectedBusinessTypes && event.affectedBusinessTypes.length > 0 && (
            <div className="w-full flex items-center flex-wrap gap-1 mt-1">
              <Building className="h-3 w-3 text-muted-foreground mr-1" />
              <span className="text-muted-foreground mr-1">Affects:</span>
              {event.affectedBusinessTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0 h-4">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}
          
          {event.applied && (
            <div className="w-full mt-1">
              <Badge variant="outline" className="text-xs">Previously occurred</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
