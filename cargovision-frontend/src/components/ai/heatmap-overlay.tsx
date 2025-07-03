"use client";

import React from "react";

export interface HeatmapData {
  confidence: number; // 0-1
  coordinates: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
    radius: number; // percentage radius (0-100)
  };
}

interface HeatmapOverlayProps {
  heatmapData: HeatmapData[];
  imageScale: number;
  imagePosition: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  showHeatmap?: boolean;
  opacity?: number; // 0-1
  blendMode?: "multiply" | "overlay" | "soft-light" | "normal";
}

export default function HeatmapOverlay({
  heatmapData,
  imageScale,
  imagePosition,
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
  showHeatmap = true,
  opacity = 0.6,
  blendMode = "multiply"
}: HeatmapOverlayProps) {
  if (!showHeatmap || heatmapData.length === 0) {
    return null;
  }

  // Calculate scaled image dimensions and position
  const scaledImageWidth = imageWidth * imageScale;
  const scaledImageHeight = imageHeight * imageScale;

  // Calculate image position relative to container
  const imageLeft = (containerWidth - scaledImageWidth) / 2 + imagePosition.x;
  const imageTop = (containerHeight - scaledImageHeight) / 2 + imagePosition.y;

  // Generate gradient stops for heatmap colors
  const getHeatmapColor = (confidence: number) => {
    // Blue (low) -> Green (medium) -> Yellow -> Red (high)
    if (confidence < 0.25) {
      const intensity = confidence / 0.25;
      return `rgba(0, ${Math.round(intensity * 100)}, 255, ${confidence})`;
    } else if (confidence < 0.5) {
      const intensity = (confidence - 0.25) / 0.25;
      return `rgba(0, ${Math.round(100 + intensity * 155)}, ${Math.round(255 - intensity * 255)}, ${confidence})`;
    } else if (confidence < 0.75) {
      const intensity = (confidence - 0.5) / 0.25;
      return `rgba(${Math.round(intensity * 255)}, 255, 0, ${confidence})`;
    } else {
      const intensity = (confidence - 0.75) / 0.25;
      return `rgba(255, ${Math.round(255 - intensity * 255)}, 0, ${confidence})`;
    }
  };

  // Create SVG gradient definitions for each heatmap point
  const gradientId = (index: number) => `heatmap-gradient-${index}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg
        className="absolute inset-0"
        width={containerWidth}
        height={containerHeight}
        style={{ overflow: "visible" }}
      >
        {/* Define gradients */}
        <defs>
          {heatmapData.map((point, index) => (
            <radialGradient
              key={index}
              id={gradientId(index)}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor={getHeatmapColor(point.confidence)}
                stopOpacity={point.confidence * 0.8}
              />
              <stop
                offset="50%"
                stopColor={getHeatmapColor(point.confidence * 0.7)}
                stopOpacity={point.confidence * 0.4}
              />
              <stop
                offset="100%"
                stopColor={getHeatmapColor(point.confidence * 0.3)}
                stopOpacity={0}
              />
            </radialGradient>
          ))}
        </defs>

        {/* Render heatmap circles */}
        {heatmapData.map((point, index) => {
          // Calculate position and size relative to the scaled image
          const pointX = imageLeft + (point.coordinates.x / 100) * scaledImageWidth;
          const pointY = imageTop + (point.coordinates.y / 100) * scaledImageHeight;
          const radius = ((point.coordinates.radius / 100) * Math.min(scaledImageWidth, scaledImageHeight)) / 2;

          return (
            <circle
              key={index}
              cx={pointX}
              cy={pointY}
              r={radius}
              fill={`url(#${gradientId(index)})`}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Heatmap Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Confidence Heatmap</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex h-3 w-16 rounded overflow-hidden">
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="flex-1 bg-red-500"></div>
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Opacity: {Math.round(opacity * 100)}%
        </div>
      </div>
    </div>
  );
} 