import { useEffect, useRef } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StockChartProps {
  data: number[];
  height?: number;
  color?: string;
}

export function StockChart({ 
  data, 
  height = 50, 
  color
}: StockChartProps) {
  const processedData = data.map((value, index) => ({ value, index }));
  
  // Determine if the chart trend is positive (current value higher than starting value)
  const isPositive = data.length > 1 && data[data.length - 1] > data[0];
  const chartColor = color || (isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))');
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Fallback chart component that uses canvas for environments where Recharts might not work
 */
export function FallbackStockChart({ 
  data, 
  height = 50, 
  color 
}: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the chart when data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine if the chart trend is positive
    const isPositive = data[data.length - 1] > data[0];
    
    // Set the line color based on trend or provided color
    ctx.strokeStyle = color || (isPositive ? '#10b981' : '#ef4444');
    ctx.lineWidth = 2;

    // Find the min and max to scale properly
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    // Calculate scaling factors
    const xScale = canvas.width / (data.length - 1);
    const yScale = canvas.height / range;

    // Start the path
    ctx.beginPath();
    
    // Draw the line
    data.forEach((value, index) => {
      const x = index * xScale;
      const y = canvas.height - ((value - min) * yScale);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Stroke the path
    ctx.stroke();
  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      width="100%"
      height={height}
      style={{ width: '100%', height }}
    />
  );
}
