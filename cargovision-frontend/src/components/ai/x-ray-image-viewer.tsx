"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnomalyOverlay, { AnomalyDetection } from "./anomaly-overlay";
import HeatmapOverlay, { HeatmapData } from "./heatmap-overlay";

interface XRayImageViewerProps {
  imageUrl: string;
  alt?: string;
  onImageLoad?: () => void;
  className?: string;
  anomalies?: AnomalyDetection[];
  heatmapData?: HeatmapData[];
  showBoundingBoxes?: boolean;
  showHeatmap?: boolean;
  showConfidenceScores?: boolean;
  heatmapOpacity?: number;
  onAnomalyClick?: (anomaly: AnomalyDetection) => void;
}

export default function XRayImageViewer({
  imageUrl,
  alt = "X-ray container image",
  onImageLoad,
  className = "",
  anomalies = [],
  heatmapData = [],
  showBoundingBoxes = true,
  showHeatmap = false,
  showConfidenceScores = true,
  heatmapOpacity = 0.6,
  onAnomalyClick
}: XRayImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    onImageLoad?.();
  }, [onImageLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const fitToContainer = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    
    const container = containerRef.current;
    const image = imageRef.current;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some padding
    
    setScale(newScale);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const zoomFactor = 1.1;
    
    setScale(prev => {
      const newScale = delta > 0 ? prev * zoomFactor : prev / zoomFactor;
      return Math.max(0.1, Math.min(5, newScale));
    });
  }, []);

  // Mouse drag pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Fit to container on image load
  useEffect(() => {
    if (imageLoaded) {
      fitToContainer();
    }
  }, [imageLoaded, fitToContainer]);

  return (
    <div className={`relative w-full h-full bg-gray-900 overflow-hidden ${className}`}>
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading X-ray image...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-lg font-semibold">Failed to load image</p>
            <p className="text-sm text-gray-400">Please check the image URL and try again</p>
          </div>
        </div>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* X-ray Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt={alt}
          className="absolute top-1/2 left-1/2 pointer-events-none select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
            filter: "contrast(1.2) brightness(1.1)", // Enhance X-ray visibility
            maxWidth: "none",
            maxHeight: "none"
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />

        {/* Heatmap Overlay */}
        {imageLoaded && containerRef.current && imageRef.current && showHeatmap && heatmapData.length > 0 && (
          <HeatmapOverlay
            heatmapData={heatmapData}
            imageScale={scale}
            imagePosition={position}
            containerWidth={containerRef.current.clientWidth}
            containerHeight={containerRef.current.clientHeight}
            imageWidth={imageRef.current.naturalWidth}
            imageHeight={imageRef.current.naturalHeight}
            showHeatmap={showHeatmap}
            opacity={heatmapOpacity}
          />
        )}

        {/* Anomaly Overlay */}
        {imageLoaded && containerRef.current && imageRef.current && anomalies.length > 0 && (
          <AnomalyOverlay
            anomalies={anomalies}
            imageScale={scale}
            imagePosition={position}
            containerWidth={containerRef.current.clientWidth}
            containerHeight={containerRef.current.clientHeight}
            imageWidth={imageRef.current.naturalWidth}
            imageHeight={imageRef.current.naturalHeight}
            showBoundingBoxes={showBoundingBoxes}
            showConfidenceScores={showConfidenceScores}
            onAnomalyClick={onAnomalyClick}
          />
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={zoomIn}
          className="w-10 h-10 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={zoomOut}
          className="w-10 h-10 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={fitToContainer}
          className="w-10 h-10 p-0"
          title="Fit to Window"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={resetView}
          className="w-10 h-10 p-0"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
} 