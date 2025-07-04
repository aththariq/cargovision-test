"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Flag, CheckCircle, AlertTriangle, Loader2, FileText, Calendar, Eye } from "lucide-react";
import { historyService, IllegalScan } from "@/lib/services/history";
import toast from "react-hot-toast";

interface ContainerDetailData {
  containerID: string;
  scans: IllegalScan[];
  status: 'flagged' | 'clean' | 'pending';
  totalDetections: number;
  lastScanTime: string;
}

export default function ContainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const containerId = params.id as string;

  const [containerData, setContainerData] = useState<ContainerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [imageViewMode, setImageViewMode] = useState<'scan' | 'visualization'>('scan');

  const fetchContainerData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await historyService.getIllegalHistoryByContainer(containerId);
      
      if (response.status === 'success') {
        const scans = response.data.illegalScans;
        const totalDetections = scans.reduce((sum, scan) => sum + scan.detections.length, 0);
        const status = totalDetections > 0 ? 'flagged' : 'clean';
        const lastScanTime = scans.length > 0 ? scans[0].createdTime : '';

        setContainerData({
          containerID: containerId,
          scans,
          status,
          totalDetections,
          lastScanTime
        });

        // Select the first scan by default
        if (scans.length > 0) {
          setSelectedScanId(scans[0].id);
        }
      } else {
        toast.error('Failed to load container data');
      }
    } catch (error) {
      console.error('Error fetching container data:', error);
      toast.error('Error loading container data');
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  useEffect(() => {
    fetchContainerData();
  }, [fetchContainerData]);

  const selectedScan = containerData?.scans.find(scan => scan.id === selectedScanId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="destructive" className="gap-1"><Flag className="w-3 h-3" />Flagged</Badge>;
      case 'clean':
        return <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Clean</Badge>;
      case 'pending':
        return <Badge variant="outline" className="gap-1"><AlertTriangle className="w-3 h-3" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading container data...</span>
        </div>
      </div>
    );
  }

  if (!containerData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard/containers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Containers
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Container Not Found</h2>
          <p className="text-gray-600">No data found for container {containerId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/containers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Containers
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Container {containerData.containerID}</h1>
            <p className="text-gray-600">Detailed scan analysis and detection results</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(containerData.status)}
        </div>
      </div>

      {/* Container Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Container Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Container ID</label>
              <p className="text-lg font-semibold">{containerData.containerID}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Scans</label>
              <p className="text-lg font-semibold">{containerData.scans.length}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Detections</label>
              <p className="text-lg font-semibold text-red-600">{containerData.totalDetections}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Scan</label>
              <p className="text-lg font-semibold">{containerData.lastScanTime ? formatDate(containerData.lastScanTime) : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Scan Images
                </CardTitle>
                {selectedScan && (
                  <div className="flex gap-2">
                    <Button
                      variant={imageViewMode === 'scan' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageViewMode('scan')}
                    >
                      Original Scan
                    </Button>
                    <Button
                      variant={imageViewMode === 'visualization' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageViewMode('visualization')}
                    >
                      Detection Results
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedScan ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={imageViewMode === 'scan' ? selectedScan.scanImage : selectedScan.visualizationImage}
                      alt={`${imageViewMode === 'scan' ? 'Original scan' : 'Detection visualization'} for ${selectedScan.id}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Scan ID: {selectedScan.id}</span>
                    <span>Detections: {selectedScan.detections.length}</span>
                    <span>{formatDate(selectedScan.createdTime)}</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No scan selected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scan History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scan History
              </CardTitle>
              <CardDescription>
                All illegal detection scans for this container
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {containerData.scans.map((scan) => (
                  <div
                    key={scan.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedScanId === scan.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedScanId(scan.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Scan {scan.id.slice(-6)}
                      </span>
                      {scan.detections.length > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {scan.detections.length} detections
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Clean
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatDate(scan.createdTime)}
                    </p>
                  </div>
                ))}
                {containerData.scans.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No scans available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 