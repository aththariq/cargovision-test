"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContainerTableRow, ContainerListFilters } from "@/types";
import { Search, Filter, Eye, Download, Loader2, FileText } from "lucide-react";
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
    search: ''
  });
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const [previewContainer, setPreviewContainer] = useState<ContainerTableRow | null>(null);

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
          weight: "28,450 kg"          // Sample data - would come from API
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

  // Sample container data
  const containerData: ContainerTableRow[] = [
    {
      id: "1",
      containerId: "CTR-001-2024",
      status: "flagged",
      inspectionTime: "2024-01-15 14:30:25",
      location: "Port A - Bay 12",
      inspector: "John Anderson",
      aiConfidence: 0.92,
      anomalyCount: 3,
      priority: "high"
    },
    {
      id: "2", 
      containerId: "CTR-002-2024",
      status: "clean",
      inspectionTime: "2024-01-15 13:15:10",
      location: "Port A - Bay 8",
      inspector: "Sarah Mitchell",
      aiConfidence: 0.98,
      anomalyCount: 0,
      priority: "low"
    },
    {
      id: "3",
      containerId: "CTR-003-2024", 
      status: "pending",
      inspectionTime: "2024-01-15 15:45:00",
      location: "Port B - Bay 3",
      inspector: "Mike Rodriguez",
      aiConfidence: 0,
      priority: "medium"
    },
    {
      id: "4",
      containerId: "CTR-004-2024",
      status: "in-progress",
      inspectionTime: "2024-01-15 16:20:00",
      location: "Port A - Bay 15",
      inspector: "Emma Thompson",
      aiConfidence: 0.75,
      anomalyCount: 1,
      priority: "medium"
    },
    {
      id: "5",
      containerId: "CTR-005-2024",
      status: "flagged",
      inspectionTime: "2024-01-15 12:00:00",
      location: "Port C - Bay 1",
      inspector: "David Chen",
      aiConfidence: 0.84,
      anomalyCount: 2,
      priority: "high"
    }
  ];

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
      key: "inspectionTime",
      header: "Inspection Time",
      accessor: (row) => new Date(row.inspectionTime).toLocaleString()
    },
    {
      key: "location",
      header: "Location"
    },
    {
      key: "inspector",
      header: "Inspector"
    },
    {
      key: "aiConfidence",
      header: "AI Confidence", 
      accessor: (row) => getConfidenceDisplay(row.aiConfidence)
    },
    {
      key: "anomalyCount",
      header: "Anomalies",
      accessor: (row) => row.anomalyCount || "0"
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

  const filteredData = containerData.filter(container => {
    if (filters.status && filters.status !== 'all' && container.status !== filters.status) {
      return false;
    }
    if (filters.search && !container.containerId.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleRowClick = (container: ContainerTableRow) => {
    router.push(`/dashboard/containers/${container.containerId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Container Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time container inspection tracking and management
          </p>
        </div>
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Export Report
        </Button>
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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {containerData.filter(c => c.status === 'clean').length}
          </div>
          <div className="text-sm text-muted-foreground">Clean Containers</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {containerData.filter(c => c.status === 'flagged').length}
          </div>
          <div className="text-sm text-muted-foreground">Flagged Containers</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {containerData.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Pending Inspection</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {containerData.filter(c => c.status === 'in-progress').length}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Container List</h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {containerData.length} containers
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