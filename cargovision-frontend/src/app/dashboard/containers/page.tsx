"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Upload,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { historyService, ContainerScanHistory } from '@/lib/api';

interface ContainerStats {
  totalContainers: number;
  flaggedContainers: number;
  cleanContainers: number;
  pendingContainers: number;
  averageConfidence: number;
  scansByType: {
    illegal: number;
    category: number;
    ocr: number;
  };
  recentActivity: ContainerScanHistory[];
}



export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerScanHistory[]>([]);
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch container data
  const fetchContainerData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const [containerHistory, containerStats] = await Promise.all([
        historyService.getAllContainerHistory(),
        historyService.getContainerStats()
      ]);

      setContainers(containerHistory);
      setStats(containerStats);
    } catch (err) {
      console.error('Error fetching container data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load container data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchContainerData();
  }, []);

  // Filter containers based on search and status
  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.containerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.scanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || container.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Define table columns
  const columns = [
    {
      key: 'containerID',
      header: 'Container ID',
      accessor: (row: ContainerScanHistory) => (
        <div className="font-medium">{row.containerID}</div>
      ),
    },
    {
      key: 'scanType',
      header: 'Scan Type',
      accessor: (row: ContainerScanHistory) => (
        <Badge variant="secondary" className="capitalize">
          {row.scanType}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row: ContainerScanHistory) => {
        const status = row.status;
        const variant = status === 'flagged' ? 'destructive' : 
                       status === 'clean' ? 'default' : 'secondary';
        const icon = status === 'flagged' ? AlertTriangle : 
                    status === 'clean' ? CheckCircle : Clock;
        const Icon = icon;
        
        return (
          <Badge variant={variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {status}
          </Badge>
        );
      },
    },
    {
      key: 'confidence',
      header: 'Confidence',
      accessor: (row: ContainerScanHistory) => (
        <div className="text-sm font-medium">
          {row.confidence}%
        </div>
      ),
    },
    {
      key: 'detections',
      header: 'Detections',
      accessor: (row: ContainerScanHistory) => (
        <div className="text-sm">{row.detections}</div>
      ),
    },
    {
      key: 'createdTime',
      header: 'Last Scan',
      accessor: (row: ContainerScanHistory) => (
        <div className="text-sm text-gray-500">
          {new Date(row.createdTime).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row: ContainerScanHistory) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadReport(row)}
            className="h-8 px-2"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Handle view details
  const handleViewDetails = (container: ContainerScanHistory) => {
    // Open modal or navigate to details page
    console.log('View details for:', container);
  };

  // Handle download report
  const handleDownloadReport = (container: ContainerScanHistory) => {
    // Generate and download report
    console.log('Download report for:', container);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchContainerData(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error Loading Container Data</span>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchContainerData()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Container Management</h1>
          <p className="text-gray-600">Monitor and manage container scans</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            New Scan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Container className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Containers</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalContainers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Flagged</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {stats?.flaggedContainers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Clean</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats?.cleanContainers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.pendingContainers || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Container Scans</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search containers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('flagged')}>
                    Flagged
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('clean')}>
                    Clean
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContainers.length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No containers found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by uploading container images for scanning.'}
              </p>
            </div>
          ) : (
            <DataTable
              data={filteredContainers}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 