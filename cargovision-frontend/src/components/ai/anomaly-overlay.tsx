"use client";

import React from "react";

export interface AnomalyDetection {
  id: string;
  type: string;
  confidence: number;
  boundingBox: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
    width: number; // percentage of image width (0-100)
    height: number; // percentage of image height (0-100)
  };
  zone?: string;
}

interface AnomalyOverlayProps {
  anomalies: AnomalyDetection[];
  imageScale: number;
  imagePosition: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  showBoundingBoxes?: boolean;
  showConfidenceScores?: boolean;
  onAnomalyClick?: (anomaly: AnomalyDetection) => void;
}

export default function AnomalyOverlay({
  anomalies,
  imageScale,
  imagePosition,
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
  showBoundingBoxes = true,
  showConfidenceScores = true,
  onAnomalyClick
}: AnomalyOverlayProps) {
  
  // Calculate the actual displayed image dimensions
  const displayedImageWidth = imageWidth * imageScale;
  const displayedImageHeight = imageHeight * imageScale;
  
  // Calculate the image offset from container center
  const imageOffsetX = (containerWidth / 2) + imagePosition.x - (displayedImageWidth / 2);
  const imageOffsetY = (containerHeight / 2) + imagePosition.y - (displayedImageHeight / 2);

  // Function to get color based on confidence level
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "border-red-500 bg-red-500";
    if (confidence >= 0.6) return "border-orange-500 bg-orange-500";
    return "border-yellow-500 bg-yellow-500";
  };

  // Function to get confidence text color
  const getConfidenceTextColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-red-100 bg-red-600";
    if (confidence >= 0.6) return "text-orange-100 bg-orange-600";
    return "text-yellow-100 bg-yellow-600";
  };

  if (!showBoundingBoxes && !showConfidenceScores) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {anomalies.map((anomaly) => {
        // Calculate bounding box position and size in pixels
        const boxX = imageOffsetX + (anomaly.boundingBox.x / 100) * displayedImageWidth;
        const boxY = imageOffsetY + (anomaly.boundingBox.y / 100) * displayedImageHeight;
        const boxWidth = (anomaly.boundingBox.width / 100) * displayedImageWidth;
        const boxHeight = (anomaly.boundingBox.height / 100) * displayedImageHeight;

        // Check if the bounding box is visible within the container
        const isVisible = 
          boxX + boxWidth > 0 && 
          boxX < containerWidth && 
          boxY + boxHeight > 0 && 
          boxY < containerHeight;

        if (!isVisible) return null;

        return (
          <div key={anomaly.id}>
            {/* Bounding Box */}
            {showBoundingBoxes && (
              <div
                className={`absolute border-2 ${getConfidenceColor(anomaly.confidence)} bg-opacity-10 cursor-pointer pointer-events-auto hover:bg-opacity-20 transition-all duration-200`}
                style={{
                  left: `${boxX}px`,
                  top: `${boxY}px`,
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                }}
                onClick={() => onAnomalyClick?.(anomaly)}
                title={`${anomaly.type} - ${Math.round(anomaly.confidence * 100)}% confidence`}
              >
                {/* Corner indicators for better visibility */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-gray-600"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-gray-600"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-gray-600"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-gray-600"></div>
              </div>
            )}

            {/* Confidence Score Badge */}
            {showConfidenceScores && (
              <div
                className={`absolute px-2 py-1 text-xs font-medium rounded ${getConfidenceTextColor(anomaly.confidence)} border border-white shadow-lg pointer-events-auto`}
                style={{
                  left: `${boxX}px`,
                  top: `${boxY - 28}px`, // Position above the bounding box
                  transform: boxY < 30 ? 'translateY(32px)' : 'none' // Move below if too close to top
                }}
                onClick={() => onAnomalyClick?.(anomaly)}
              >
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{Math.round(anomaly.confidence * 100)}%</span>
                  <span className="text-xs opacity-90">{anomaly.type}</span>
                </div>
              </div>
            )}

            {/* Anomaly ID for debugging (small indicator) */}
            <div
              className="absolute w-4 h-4 bg-white text-black text-xs flex items-center justify-center font-bold rounded-full border pointer-events-auto opacity-75 hover:opacity-100"
              style={{
                left: `${boxX + boxWidth - 8}px`,
                top: `${boxY - 8}px`,
              }}
              title={`Anomaly ID: ${anomaly.id}`}
            >
              {anomaly.id.slice(-1)}
            </div>
          </div>
        );
      })}
    </div>
  );
} 