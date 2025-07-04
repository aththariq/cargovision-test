"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContainerTableRow, ContainerListFilters } from "@/types";
import { Search, Filter, Eye, Download, Loader2, FileText, RefreshCw } from "lucide-react";
import { historyService, ContainerData } from "@/lib/services/history";
import toast from "react-hot-toast";

// Dynamically import PDFPreviewModal to avoid SSR issues with PDF libraries
const PDFPreviewModal = dynamic(
  () => import("@/components/reports/pdf-preview-modal"),
  { 
    ssr: false,
    loading: () => <div>Loading PDF preview...</div>
  }
);

export default function ContainersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ContainerListFilters>({
    status: 'all',
    search: '',
    scanType: 'all'
  });
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [previewContainer, setPreviewContainer] = useState<ContainerTableRow | null>(null);
  const [containerData, setContainerData] = useState<ContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch container data from backend
  const fetchContainerData = async () => {
    try {
      setRefreshing(true);
      const data = await historyService.getContainersData();
      setContainerData(data);
    } catch (error) {
      console.error('Error fetching container data:', error);
      toast.error('Failed to fetch container data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContainerData();
  }, []);

  // Convert backend data to table row format
  const convertToTableData = (containers: ContainerData[]): ContainerTableRow[] => {
    return containers.map(container => ({
      id: container.id,
      containerId: container.containerID || container.id,
      status: container.status,
      inspectionTime: container.lastScanTime,
      location: "Auto-detected", // Would come from API in real implementation
      inspector: "AI System", // Would come from API in real implementation
      aiConfidence: container.confidence || 0.95,
      anomalyCount: (container.illegalDetections || 0) + (container.categoryDetections || 0),
      priority: container.status === 'flagged' ? 'high' : container.status === 'pending' ? 'medium' : 'low',
      illegalDetections: container.illegalDetections,
      categoryDetections: container.categoryDetections,
      scanTypes: container.scanTypes,
      lastScanTime: container.lastScanTime
    }));
  };

  // Handle PDF download for container
  const handleDownloadReport = async (container: ContainerTableRow) => {
    const toastId = toast.loading(
      `Generating PDF report for ${container.containerId}... 0%`,
      { duration: Infinity }
    );

    try {
      setDownloadingIds(prev => new Set(prev).add(container.containerId));

      // Dynamically import PDF service to avoid SSR issues
      const { default: PDFService } = await import("@/lib/services/pdf-service");

      // Find the original container data
      const originalContainer = containerData.find(c => 
        (c.containerID === container.containerId) || (c.id === container.containerId)
      );

      // Prepare report data from container information
      const reportData = PDFService.prepareReportData(
        {
          id: container.id,
          containerId: container.containerId,
          status: container.status,
          location: container.location,
          inspector: container.inspector,
          scanTime: container.inspectionTime,
          vessel: "MSC Mediterranean", // Sample data - would come from API
          origin: "Shanghai Port",      // Sample data - would come from API
          destination: "Los Angeles",   // Sample data - would come from API
          weight: "28,450 kg",          // Sample data - would come from API
          ...(originalContainer?.images && { images: originalContainer.images })
        },
        [] // No anomalies for basic list download - could be enhanced
      );

      // Generate PDF with progress tracking
      const blob = await PDFService.generateReportWithProgress(reportData, (progress) => {
        toast.loading(
          `Generating PDF report for ${container.containerId}... ${progress}%`,
          { id: toastId }
        );
      });

      // Download the blob
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `container-report-${container.containerId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        `PDF report for ${container.containerId} downloaded successfully!`,
        { id: toastId }
      );
    } catch (error) {
      console.error('Error downloading PDF report:', error);
      toast.error(
        `Failed to generate PDF report for ${container.containerId}. Please try again.`,
        { id: toastId }
      );
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(container.containerId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: ContainerTableRow['status']) => {
    const variants = {
      flagged: "destructive",
      clean: "secondary", 
      pending: "outline",
      "in-progress": "default"
    } as const;
    
    const labels = {
      flagged: "Flagged",
      clean: "Clean", 
      pending: "Pending",
      "in-progress": "In Progress"
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getConfidenceDisplay = (confidence: number) => {
    if (confidence === 0) return "N/A";
    const percentage = Math.round(confidence * 100);
    const color = percentage >= 90 ? "text-green-600" : 
                  percentage >= 70 ? "text-yellow-600" : "text-red-600";
    return <span className={color}>{percentage}%</span>;
  };

  const getScanTypesBadges = (scanTypes?: string[]) => {
    if (!scanTypes || scanTypes.length === 0) return "None";
    
    return (
      <div className="flex gap-1 flex-wrap">
        {scanTypes.map(type => (
          <Badge key={type} variant="outline" className="text-xs">
            {type.toUpperCase()}
          </Badge>
        ))}
      </div>
    );
  };

  const columns: Column<ContainerTableRow>[] = [
    {
      key: "containerId",
      header: "Container ID",
      className: "font-mono"
    },
    {
      key: "status", 
      header: "Status",
      accessor: (row) => getStatusBadge(row.status)
    },
    {
      key: "scanTypes",
      header: "Scan Types",
      accessor: (row) => getScanTypesBadges(row.scanTypes)
    },
    {
      key: "inspectionTime",
      header: "Last Scan",
      accessor: (row) => new Date(row.inspectionTime).toLocaleString()
    },
    {
      key: "aiConfidence",
      header: "AI Confidence", 
      accessor: (row) => getConfidenceDisplay(row.aiConfidence)
    },
    {
      key: "anomalyCount",
      header: "Detections",
      accessor: (row) => {
        const illegal = row.illegalDetections || 0;
        const category = row.categoryDetections || 0;
        const total = illegal + category;
        
        if (total === 0) return "0";
        
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{total}</div>
            {illegal > 0 && <div className="text-xs text-red-600">Illegal: {illegal}</div>}
            {category > 0 && <div className="text-xs text-blue-600">Category: {category}</div>}
          </div>
        );
      }
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/containers/${row.containerId}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewContainer(row);
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            disabled={downloadingIds.has(row.containerId)}
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadReport(row);
            }}
          >
            {downloadingIds.has(row.containerId) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    }
  ];

  const tableData = convertToTableData(containerData);
  
  const filteredData = tableData.filter(container => {
    if (filters.status && filters.status !== 'all' && container.status !== filters.status) {
      return false;
    }
    if (filters.search && !container.containerId.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.scanType && filters.scanType !== 'all') {
      if (!container.scanTypes?.includes(filters.scanType)) {
        return false;
      }
    }
    return true;
  });

  const handleRowClick = (container: ContainerTableRow) => {
    router.push(`/dashboard/containers/${container.containerId}`);
  };

  const handleRefresh = () => {
    fetchContainerData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Container Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time container inspection tracking and management
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading container data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Container Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time container inspection tracking and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Container ID..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filters.status || 'all'}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            status: e.target.value as ContainerListFilters['status'] 
          }))}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="clean">Clean</option>
          <option value="flagged">Flagged</option>
        </select>
        <select
          value={filters.scanType || 'all'}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            scanType: e.target.value as ContainerListFilters['scanType'] 
          }))}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Scan Types</option>
          <option value="illegal">Illegal Detection</option>
          <option value="category">Categorization</option>
          <option value="ocr">OCR Analysis</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {tableData.filter(c => c.status === 'clean').length}
          </div>
          <div className="text-sm text-muted-foreground">Clean Containers</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {tableData.filter(c => c.status === 'flagged').length}
          </div>
          <div className="text-sm text-muted-foreground">Flagged Containers</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {tableData.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Pending Inspection</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {tableData.filter(c => c.status === 'in-progress').length}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Container List</h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {tableData.length} containers
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredData}
          onRowClick={handleRowClick}
        />
      </div>

      {/* PDF Preview Modal */}
      {previewContainer && (
        <PDFPreviewModal 
          container={{
            id: previewContainer.id,
            containerId: previewContainer.containerId,
            status: previewContainer.status,
            location: previewContainer.location,
            inspector: previewContainer.inspector,
            scanTime: previewContainer.inspectionTime,
            vessel: "MSC Mediterranean", // Sample data - would come from API
            origin: "Shanghai Port",      // Sample data - would come from API
            destination: "Los Angeles",   // Sample data - would come from API
            weight: "28,450 kg"          // Sample data - would come from API
          }}
          anomalies={[]} // No anomalies for basic preview - could be enhanced
          onClose={() => setPreviewContainer(null)}
        />
      )}
    </div>
  );
} 