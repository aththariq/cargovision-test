"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      case "analyzing": return "bg-yellow-50 text-yellow-800 ring-yellow-600/20";
      case "completed": return "bg-green-50 text-green-800 ring-green-600/20";
      case "failed": return "bg-red-50 text-red-800 ring-red-600/20";
      case "flagged": return "bg-red-50 text-red-800 ring-red-600/20";
      default: return "bg-gray-50 text-gray-800 ring-gray-600/20";
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
        {containerInfo && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ID: {containerInfo.id}</span>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(containerInfo.status)} ring-1 ring-inset`}
            >
              {containerInfo.status}
            </Badge>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-2xl font-bold text-red-600">{totalAnomalies}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Anomalies</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-2xl font-bold text-blue-600">{averageConfidence}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
          
          {highConfidenceAnomalies > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">High confidence:</span>
                <Badge variant="destructive" className="text-xs">
                  {highConfidenceAnomalies} / {totalAnomalies}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Anomalies List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Detected Anomalies</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2 max-h-64 overflow-y-auto">
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No anomalies detected</p>
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedAnomalyId === anomaly.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => onAnomalySelect?.(anomaly)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{anomaly.type}</p>
                    {anomaly.zone && (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                        <p className="text-xs text-muted-foreground">{anomaly.zone}</p>
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={getConfidenceBadgeVariant(anomaly.confidence)}
                    className="text-xs"
                  >
                    {Math.round(anomaly.confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Position: {Math.round(anomaly.boundingBox.x)}%, {Math.round(anomaly.boundingBox.y)}%
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Display Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Display Options</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Bounding Boxes</span>
            </div>
            <Button
              variant={showBoundingBoxes ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleBoundingBoxes(!showBoundingBoxes)}
              className="h-7 px-2"
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
              className="h-7 px-2"
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
              className="h-7 px-2"
            >
              {showConfidenceScores ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Information */}
      {containerInfo?.scanTime && (
        <div className="text-xs text-muted-foreground text-center border-t pt-2">
          Scanned: {containerInfo.scanTime}
        </div>
      )}
    </div>
  );
} 