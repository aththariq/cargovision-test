"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { RefreshCw, Container, AlertTriangle, CheckCircle, Eye, Activity } from "lucide-react";
import { historyService } from "@/lib/services/history";
import { ContainerData, ContainerTableRow, ScanTypeFilter, StatusFilter } from "@/types";
import toast from "react-hot-toast";

const columns: Column<ContainerTableRow>[] = [
  {
    key: "containerID",
    header: "Container ID",
    accessor: (row) => (
      <Link 
        href={`/dashboard/containers/${row.containerID}`}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
      >
        {row.containerID}
      </Link>
    ),
  },
  {
    key: "status",
    header: "Status",
    accessor: (row) => {
      const status = row.status;
      return (
        <Badge 
          variant={
            status === "flagged" ? "destructive" : 
            status === "clean" ? "secondary" : 
            "outline"
          }
        >
          {status === "flagged" && <AlertTriangle className="w-3 h-3 mr-1" />}
          {status === "clean" && <CheckCircle className="w-3 h-3 mr-1" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    key: "lastScan",
    header: "Last Scan",
    accessor: (row) => new Date(row.lastScan).toLocaleString(),
  },
  {
    key: "totalScans",
    header: "Total Scans",
  },
  {
    key: "illegalDetections",
    header: "Illegal Detections",
    accessor: (row) => (
      <span className={row.illegalDetections > 0 ? "font-semibold text-red-600" : ""}>
        {row.illegalDetections}
      </span>
    ),
  },
  {
    key: "categoryDetections",
    header: "Category Detections",
  },
  {
    key: "scanTypes",
    header: "Scan Types",
    accessor: (row) => (
      <div className="flex gap-1">
        {row.scanTypes.map((type: string) => (
          <Badge key={type} variant="outline" className="text-xs">
            {type}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    accessor: (row) => (
      <Link href={`/dashboard/containers/${row.containerID}`}>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </Link>
    ),
  },
];

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [tableData, setTableData] = useState<ContainerTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanTypeFilter, setScanTypeFilter] = useState<ScanTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchContainerData = useCallback(async () => {
    try {
      setLoading(true);
      const containerData = await historyService.getContainersData();
      setContainers(containerData);
      
      // Convert to table format
      const rows = historyService.convertToTableRows(containerData);
      setTableData(rows);
    } catch (error) {
      console.error("Error fetching container data:", error);
      toast.error("Failed to load container data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContainerData();
  }, [fetchContainerData]);

  const handleRefresh = () => {
    fetchContainerData();
    toast.success("Container data refreshed");
  };

  // Filter data based on selected filters
  const filteredData = tableData.filter((container) => {
    const matchesStatus = statusFilter === "all" || container.status === statusFilter;
    const matchesScanType = scanTypeFilter === "all" || container.scanTypes.includes(scanTypeFilter);
    return matchesStatus && matchesScanType;
  });

  // Calculate statistics
  const stats = {
    total: containers.length,
    flagged: containers.filter(c => c.status === 'flagged').length,
    clean: containers.filter(c => c.status === 'clean').length,
    totalDetections: containers.reduce((sum, c) => sum + c.totalDetections, 0)
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-96">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading container data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Container Monitoring</h1>
          <p className="text-gray-600">Real-time container inspection status and results</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Currently tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.clean}</div>
            <p className="text-xs text-muted-foreground">No issues found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDetections}</div>
            <p className="text-xs text-muted-foreground">Across all scans</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>Filter containers by status and scan type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="flagged">Flagged</option>
                <option value="clean">Clean</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scan Type</label>
              <select
                value={scanTypeFilter}
                onChange={(e) => setScanTypeFilter(e.target.value as ScanTypeFilter)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="illegal">Illegal Detection</option>
                <option value="category">Category Analysis</option>
                <option value="ocr">OCR Analysis</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setScanTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Container List ({filteredData.length} of {tableData.length})
          </CardTitle>
          <CardDescription>
            Click on a Container ID to view detailed information and scan results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <DataTable columns={columns} data={filteredData} />
          ) : (
            <div className="text-center py-8">
              <Container className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">No containers match the current filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 