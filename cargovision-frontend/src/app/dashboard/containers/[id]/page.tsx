"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import XRayImageViewer from "@/components/ai/x-ray-image-viewer";
import DetectionResultsPanel from "@/components/ai/detection-results-panel";
import { AnomalyDetection } from "@/components/ai/anomaly-overlay";
import { HeatmapData } from "@/components/ai/heatmap-overlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Flag, CheckCircle, AlertTriangle, Loader2, FileText } from "lucide-react";
import PDFService from "@/lib/services/pdf-service";
import PDFPreviewModal from "@/components/reports/pdf-preview-modal";
import toast from "react-hot-toast";

export default function ContainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const containerId = params.id as string;

  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showConfidenceScores, setShowConfidenceScores] = useState(true);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>();
  const [heatmapOpacity] = useState(0.6);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Handle comprehensive PDF export with full container and anomaly data
  const handleExportReport = async () => {
    const toastId = toast.loading(
      `Generating detailed PDF report for ${containerId}... 0%`,
      { duration: Infinity }
    );

    try {
      setIsExporting(true);
      setExportProgress(0);

      // Prepare comprehensive report data using all available information
      const reportData = PDFService.prepareReportData(
        {
          id: containerId,
          containerId: containerId,
          status: containerInfo.status,
          location: containerInfo.location,
          inspector: containerInfo.inspector,
          scanTime: containerInfo.scanTime,
          vessel: containerInfo.vessel,
          origin: containerInfo.origin,
          destination: containerInfo.destination,
          weight: containerInfo.weight
        },
        sampleAnomalies,
        containerInfo.inspectionHistory
      );

      // Generate PDF with progress tracking
      const blob = await PDFService.generateReportWithProgress(reportData, (progress) => {
        setExportProgress(progress);
        toast.loading(
          `Generating detailed PDF report for ${containerId}... ${progress}%`,
          { id: toastId }
        );
      });

      // Download the blob
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `detailed-container-report-${containerId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        `Detailed PDF report for ${containerId} downloaded successfully!`,
        { id: toastId }
      );
    } catch (error) {
      console.error('Error generating detailed PDF report:', error);
      toast.error(
        `Failed to generate detailed PDF report for ${containerId}. Please try again.`,
        { id: toastId }
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Sample X-ray image URL (you can replace with actual X-ray images)
  const sampleImageUrl = "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop&crop=center";

  // Sample anomaly data
  const sampleAnomalies: AnomalyDetection[] = [
    {
      id: "anom-001",
      type: "Suspicious Object",
      confidence: 0.92,
      boundingBox: {
        x: 15, // 15% from left
        y: 20, // 20% from top
        width: 25, // 25% of image width
        height: 20, // 20% of image height
      },
      zone: "Upper-Left"
    },
    {
      id: "anom-002", 
      type: "Density Anomaly",
      confidence: 0.78,
      boundingBox: {
        x: 45,
        y: 40,
        width: 20,
        height: 15,
      },
      zone: "Center"
    },
    {
      id: "anom-003",
      type: "Shape Irregularity", 
      confidence: 0.65,
      boundingBox: {
        x: 70,
        y: 65,
        width: 18,
        height: 22,
      },
      zone: "Bottom-Right"
    }
  ];

  const handleAnomalyClick = (anomaly: AnomalyDetection) => {
    console.log("Clicked anomaly:", anomaly);
    setSelectedAnomalyId(anomaly.id);
  };

  // Container metadata (would come from API in real app)
  const containerInfo = {
    id: containerId,
    status: "flagged" as const,
    scanTime: "2024-01-15 14:30:25",
    location: "Port A - Bay 12",
    inspector: "John Anderson",
    priority: "high" as const,
    vessel: "MSC Fortune",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    weight: "24,500 kg",
    inspectionHistory: [
      {
        date: "2024-01-15 14:30:25",
        inspector: "John Anderson", 
        status: "flagged",
        anomalies: 3
      },
      {
        date: "2024-01-14 09:15:00",
        inspector: "Sarah Mitchell",
        status: "clean", 
        anomalies: 0
      }
    ]
  };

  // Sample heatmap data
  const sampleHeatmapData: HeatmapData[] = [
    {
      confidence: 0.9,
      coordinates: {
        x: 20, // 20% from left
        y: 25, // 25% from top
        radius: 15, // 15% radius
      }
    },
    {
      confidence: 0.75,
      coordinates: {
        x: 50,
        y: 45,
        radius: 12,
      }
    },
    {
      confidence: 0.6,
      coordinates: {
        x: 75,
        y: 70,
        radius: 10,
      }
    },
    {
      confidence: 0.85,
      coordinates: {
        x: 30,
        y: 60,
        radius: 8,
      }
    },
    {
      confidence: 0.4,
      coordinates: {
        x: 65,
        y: 30,
        radius: 6,
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      flagged: "destructive",
      clean: "secondary", 
      pending: "outline",
      "in-progress": "default"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (priority === 'medium') return <Flag className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Container {containerId}</h1>
            {getStatusBadge(containerInfo.status)}
            {getPriorityIcon(containerInfo.priority)}
          </div>
          <p className="text-muted-foreground">
            Detailed inspection analysis and anomaly detection
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowPreview(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Preview Report
          </Button>
          <Button 
            variant="outline"
            disabled={isExporting}
            onClick={handleExportReport}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating... {exportProgress}%
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
          <Button>Mark as Reviewed</Button>
        </div>
      </div>

      {/* Container Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containerInfo.location}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containerInfo.inspector}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vessel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containerInfo.vessel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containerInfo.weight}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* X-ray Analysis */}
        <div className="lg:col-span-2 bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">X-ray Analysis</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Scan Time:</span>
              <span className="text-sm font-medium">
                {new Date(containerInfo.scanTime).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="h-[calc(100%-60px)]">
            <XRayImageViewer 
              imageUrl={sampleImageUrl}
              alt={`Container X-ray scan ${containerId}`}
              onImageLoad={() => console.log("X-ray image loaded")}
              anomalies={sampleAnomalies}
              heatmapData={sampleHeatmapData}
              showBoundingBoxes={showBoundingBoxes}
              showHeatmap={showHeatmap}
              showConfidenceScores={showConfidenceScores}
              heatmapOpacity={heatmapOpacity}
              onAnomalyClick={handleAnomalyClick}
            />
          </div>
        </div>

        {/* Detection Results Panel */}
        <div className="bg-card rounded-lg border p-4">
          <DetectionResultsPanel
            anomalies={sampleAnomalies}
            containerInfo={containerInfo}
            showBoundingBoxes={showBoundingBoxes}
            showHeatmap={showHeatmap}
            showConfidenceScores={showConfidenceScores}
            onToggleBoundingBoxes={setShowBoundingBoxes}
            onToggleHeatmap={setShowHeatmap}
            onToggleConfidenceScores={setShowConfidenceScores}
            onAnomalySelect={handleAnomalyClick}
            selectedAnomalyId={selectedAnomalyId}
          />
        </div>
      </div>

      {/* Inspection History */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection History</CardTitle>
          <CardDescription>Previous inspections for this container</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {containerInfo.inspectionHistory.map((inspection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{inspection.inspector}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(inspection.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    {inspection.anomalies} anomalies found
                  </div>
                  {getStatusBadge(inspection.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview Modal */}
      {showPreview && (
        <PDFPreviewModal 
          container={{
            id: containerInfo.id,
            containerId: containerId,
            status: containerInfo.status,
            location: containerInfo.location,
            inspector: containerInfo.inspector,
            scanTime: containerInfo.scanTime,
            vessel: containerInfo.vessel,
            origin: containerInfo.origin,
            destination: containerInfo.destination,
            weight: containerInfo.weight
          }}
          anomalies={sampleAnomalies}
          history={containerInfo.inspectionHistory}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
} 