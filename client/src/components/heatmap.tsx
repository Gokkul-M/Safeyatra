import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Heatmap } from '@shared/schema';

interface HeatmapComponentProps {
  className?: string;
  showLegend?: boolean;
  interactive?: boolean;
}

export function HeatmapComponent({ className = '', showLegend = true, interactive = true }: HeatmapComponentProps) {
  const [heatmapData, setHeatmapData] = useState<Heatmap[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const heatmapRef = ref(database, 'heatmaps');
    const unsubscribe = onValue(heatmapRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const heatmapArray = Object.values(data) as Heatmap[];
        setHeatmapData(heatmapArray);
        setLastUpdated(new Date());
      }
    });

    return () => unsubscribe();
  }, []);

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-orange-500';
      case 'crowded':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCrowdLevelSize = (level: string, currentCount: number, capacity: number) => {
    const percentage = (currentCount / capacity) * 100;
    if (percentage < 30) return 'w-4 h-4';
    if (percentage < 70) return 'w-6 h-6';
    return 'w-8 h-8';
  };

  return (
    <div className={className}>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
        {/* Background map placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-50"></div>
        
        {/* Grid overlay for reference */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-10 grid-rows-8 h-full">
            {Array.from({ length: 80 }, (_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Crowd markers */}
        {heatmapData.map((point, index) => (
          <div
            key={point.id}
            className={`
              absolute rounded-full transition-transform cursor-pointer
              ${getCrowdLevelColor(point.crowdLevel)}
              ${getCrowdLevelSize(point.crowdLevel, point.currentCount, point.capacity)}
              ${interactive ? 'hover:scale-125' : ''}
            `}
            style={{
              top: `${20 + (index * 15) % 60}%`,
              left: `${20 + (index * 20) % 60}%`,
            }}
            title={`${point.area}: ${point.crowdLevel} - ${point.currentCount}/${point.capacity}`}
            data-testid={`heatmap-marker-${point.id}`}
          />
        ))}

        {/* Current location indicator (center for demo) */}
        <div
          className="absolute w-6 h-6 bg-blue-500 border-4 border-white rounded-full animate-pulse"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          title="Your Location"
          data-testid="current-location"
        />
      </div>

      {showLegend && (
        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Safe (0-30%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Moderate (31-70%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Crowded (71-100%)</span>
            </div>
          </div>
          <span className="text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}
