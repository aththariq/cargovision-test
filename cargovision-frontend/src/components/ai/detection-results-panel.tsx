"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AnomalyDetection } from "./anomaly-overlay";
import { AlertTriangle, Eye, EyeOff, MapPin, TrendingUp } from "lucide-react";

interface DetectionResultsPanelProps {
  anomalies: AnomalyDetection[];
  containerInfo?: {
    id: string;
    status: "analyzing" | "completed" | "failed" | "flagged";
    scanTime?: string;
  };
  showBoundingBoxes: boolean;
  showHeatmap: boolean;
  showConfidenceScores: boolean;
  onToggleBoundingBoxes: (show: boolean) => void;
  onToggleHeatmap: (show: boolean) => void;
  onToggleConfidenceScores: (show: boolean) => void;
  onAnomalySelect?: (anomaly: AnomalyDetection) => void;
  selectedAnomalyId?: string;
}

export default function DetectionResultsPanel({
  anomalies,
  containerInfo,
  showBoundingBoxes,
  showHeatmap,
  showConfidenceScores,
  onToggleBoundingBoxes,
  onToggleHeatmap,
  onToggleConfidenceScores,
  onAnomalySelect,
  selectedAnomalyId
}: DetectionResultsPanelProps) {
  
  // Calculate statistics
  const totalAnomalies = anomalies.length;
  const highConfidenceAnomalies = anomalies.filter(a => a.confidence >= 0.8).length;
  const averageConfidence = anomalies.length > 0 
    ? Math.round((anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length) * 100)
    : 0;

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.8) return "destructive";
    if (confidence >= 0.6) return "default";
    return "secondary";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzing": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "flagged": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Analysis Summary</h3>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-2xl font-bold text-red-600">{totalAnomalies}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Anomalies</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-2xl font-bold text-blue-600">{averageConfidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </div>
        </div>

        {/* Status Badge */}
        {containerInfo && (
          <div className="flex items-center justify-between mb-4 p-2 bg-muted/20 rounded">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(containerInfo.status)}`} />
              {containerInfo.status}
            </Badge>
          </div>
        )}

        {highConfidenceAnomalies > 0 && (
          <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded">
            <span className="text-muted-foreground">High confidence:</span>
            <Badge variant="destructive" className="text-xs">
              {highConfidenceAnomalies} / {totalAnomalies}
            </Badge>
          </div>
        )}
      </div>

      {/* Detected Anomalies */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Detected Anomalies</h4>
        <div className="space-y-3">
          {anomalies.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No anomalies detected</p>
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  selectedAnomalyId === anomaly.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-muted/20"
                }`}
                onClick={() => onAnomalySelect?.(anomaly)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-1">{anomaly.type}</h5>
                    {anomaly.zone && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{anomaly.zone}</span>
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={getConfidenceBadgeVariant(anomaly.confidence)}
                    className="text-xs font-medium"
                  >
                    {Math.round(anomaly.confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                  <span className="font-medium">Position:</span> {Math.round(anomaly.boundingBox.x)}%, {Math.round(anomaly.boundingBox.y)}%
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Display Controls */}
      <div>
        <h4 className="font-medium mb-3">Display Options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Bounding Boxes</span>
            </div>
            <Button
              variant={showBoundingBoxes ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleBoundingBoxes(!showBoundingBoxes)}
              className="h-8 px-3"
            >
              {showBoundingBoxes ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm" />
              <span className="text-sm">Heatmap</span>
            </div>
            <Button
              variant={showHeatmap ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleHeatmap(!showHeatmap)}
              className="h-8 px-3"
            >
              {showHeatmap ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="h-4 w-8 text-xs p-0 justify-center">%</Badge>
              <span className="text-sm">Confidence Scores</span>
            </div>
            <Button
              variant={showConfidenceScores ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleConfidenceScores(!showConfidenceScores)}
              className="h-8 px-3"
            >
              {showConfidenceScores ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Scan Information */}
      {containerInfo?.scanTime && (
        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground text-center">
          Scanned: {new Date(containerInfo.scanTime).toLocaleString()}
        </div>
      )}
    </div>
  );
} 