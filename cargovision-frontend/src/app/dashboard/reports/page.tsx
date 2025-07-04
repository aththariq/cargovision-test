"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  BarChart3
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import PDFPreviewModal from '@/components/reports/pdf-preview-modal';

import type { Container } from '@/types';

interface ReportSummary {
  totalReports: number;
  flaggedContainers: number;
  cleanContainers: number;
  pendingInspections: number;
  averageConfidence: number;
  thisWeekReports: number;
  lastWeekReports: number;
}

interface ReportListItem {
  id: string;
  containerId: string;
  containerNumber: string;
  status: 'flagged' | 'clean' | 'pending' | 'in-progress';
  inspectionDate: string;
  inspector: string;
  location: string;
  aiConfidence: number;
  anomalyCount: number;
  reportGenerated: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportListItem[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'flagged' | 'clean' | 'pending' | 'in-progress'>('all');
  const [selectedReport, setSelectedReport] = useState<Container | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: ReportListItem[] = [
        {
          id: '1',
          containerId: 'CONT001',
          containerNumber: 'MSKU-1234567',
          status: 'flagged',
          inspectionDate: '2024-01-15T10:30:00Z',
          inspector: 'John Smith',
          location: 'Port of Jakarta',
          aiConfidence: 92.5,
          anomalyCount: 3,
          reportGenerated: true,
          priority: 'high'
        },
        {
          id: '2',
          containerId: 'CONT002',
          containerNumber: 'MSKU-2345678',
          status: 'clean',
          inspectionDate: '2024-01-15T11:15:00Z',
          inspector: 'Sarah Johnson',
          location: 'Port of Jakarta',
          aiConfidence: 98.1,
          anomalyCount: 0,
          reportGenerated: true,
          priority: 'low'
        },
        {
          id: '3',
          containerId: 'CONT003',
          containerNumber: 'MSKU-3456789',
          status: 'pending',
          inspectionDate: '2024-01-15T12:00:00Z',
          inspector: 'Mike Brown',
          location: 'Port of Surabaya',
          aiConfidence: 0,
          anomalyCount: 0,
          reportGenerated: false,
          priority: 'medium'
        },
        {
          id: '4',
          containerId: 'CONT004',
          containerNumber: 'MSKU-4567890',
          status: 'in-progress',
          inspectionDate: '2024-01-15T13:30:00Z',
          inspector: 'Lisa Davis',
          location: 'Port of Jakarta',
          aiConfidence: 85.3,
          anomalyCount: 1,
          reportGenerated: false,
          priority: 'medium'
        },
        {
          id: '5',
          containerId: 'CONT005',
          containerNumber: 'MSKU-5678901',
          status: 'flagged',
          inspectionDate: '2024-01-14T09:45:00Z',
          inspector: 'John Smith',
          location: 'Port of Medan',
          aiConfidence: 89.7,
          anomalyCount: 2,
          reportGenerated: true,
          priority: 'high'
        }
      ];

      const mockSummary: ReportSummary = {
        totalReports: 127,
        flaggedContainers: 23,
        cleanContainers: 89,
        pendingInspections: 15,
        averageConfidence: 91.2,
        thisWeekReports: 45,
        lastWeekReports: 38
      };

      setReports(mockReports);
      setFilteredReports(mockReports);
      setSummary(mockSummary);
      setIsLoading(false);
    };

    fetchReports();
  }, []);

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.containerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'clean':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Clean</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleViewReport = (report: ReportListItem) => {
    // Convert ReportListItem to Container for PDF preview
    // Map "in-progress" to "pending" for compatibility with Container type
    const mappedStatus = report.status === 'in-progress' ? 'pending' : report.status as "flagged" | "clean" | "pending";
    
    const container: Container = {
      id: report.id,
      containerID: report.containerNumber,
      status: mappedStatus,
      lastScan: new Date(report.inspectionDate).toISOString(),
      // Additional properties that might be needed by Container type
      totalScans: 1,
      illegalDetections: report.anomalyCount,
      categoryDetections: 0
    };

    setSelectedReport(container);
    setShowPDFPreview(true);
  };

  const handleDownloadReport = async (report: ReportListItem) => {
    // Mock download functionality
    console.log('Downloading report for:', report.containerNumber);
    
    // In a real app, this would trigger the PDF download
    const fileName = `inspection-report-${report.containerNumber}.pdf`;
    console.log('Would download:', fileName);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'containerNumber',
      header: 'Container ID',
      render: (report: ReportListItem) => (
        <div className="font-medium">{report.containerNumber}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (report: ReportListItem) => getStatusBadge(report.status)
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (report: ReportListItem) => getPriorityBadge(report.priority)
    },
    {
      key: 'inspectionDate',
      header: 'Inspection Date',
      render: (report: ReportListItem) => (
        <div className="text-sm text-gray-600">
          {formatDate(report.inspectionDate)}
        </div>
      )
    },
    {
      key: 'inspector',
      header: 'Inspector',
      render: (report: ReportListItem) => (
        <div className="text-sm">{report.inspector}</div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (report: ReportListItem) => (
        <div className="text-sm text-gray-600">{report.location}</div>
      )
    },
    {
      key: 'aiConfidence',
      header: 'AI Confidence',
      render: (report: ReportListItem) => (
        <div className="text-sm">
          {report.aiConfidence > 0 ? `${report.aiConfidence}%` : 'N/A'}
        </div>
      )
    },
    {
      key: 'anomalyCount',
      header: 'Anomalies',
      render: (report: ReportListItem) => (
        <div className="text-sm font-medium">
          {report.anomalyCount}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (report: ReportListItem) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewReport(report)}
            disabled={!report.reportGenerated}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadReport(report)}
            disabled={!report.reportGenerated}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))}
        </div>
        
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection Reports</h1>
          <p className="text-gray-600">View and manage container inspection reports</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{summary.totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{summary.thisWeekReports - summary.lastWeekReports} this week
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{summary.flaggedContainers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Requires attention
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clean</p>
                <p className="text-2xl font-bold text-green-600">{summary.cleanContainers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Passed inspection
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pendingInspections}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Awaiting inspection
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by container ID, inspector, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
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
              <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                In Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </Card>

      {/* Reports Table */}
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredReports.length} of {reports.length} reports
              </span>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <DataTable
            data={filteredReports}
            columns={columns}
          />
        </div>
      </Card>

      {/* PDF Preview Modal */}
      {selectedReport && showPDFPreview && (
        <PDFPreviewModal
          container={selectedReport}
          onClose={() => {
            setShowPDFPreview(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
} 