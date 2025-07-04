"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  Users, 
  Clock,
  FileText,
  Bell,
  Settings,
  Eye,
  Target,
  RefreshCw,
  Loader2
} from "lucide-react";
import { historyService, ContainerData } from "@/lib/services/history";
import { DashboardStats, RecentActivity } from "@/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Fetch container data to calculate statistics
      const containers = await historyService.getContainersData();
      
      // Calculate statistics from container data
      const stats = calculateStats(containers);
      setDashboardStats(stats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Calculate statistics from container data
  const calculateStats = (containers: ContainerData[]): DashboardStats => {
    const totalContainers = containers.length;
    const flaggedContainers = containers.filter(c => c.status === 'flagged').length;
    const cleanContainers = containers.filter(c => c.status === 'clean').length;
    const pendingContainers = containers.filter(c => c.status === 'pending').length;
    
    // Calculate average confidence
    const containersWithConfidence = containers.filter(c => c.confidence && c.confidence > 0);
    const averageConfidence = containersWithConfidence.length > 0 
      ? containersWithConfidence.reduce((sum, c) => sum + (c.confidence || 0), 0) / containersWithConfidence.length
      : 0;
    
    // Calculate total detections
    const totalDetections = containers.reduce((sum, c) => 
      sum + (c.illegalDetections || 0) + (c.categoryDetections || 0), 0
    );
    
    // Generate recent activity from containers
    const recentActivity: RecentActivity[] = containers
      .filter(c => c.lastScanTime)
      .sort((a, b) => new Date(b.lastScanTime!).getTime() - new Date(a.lastScanTime!).getTime())
      .slice(0, 4)
      .map(c => ({
        id: c.id,
        containerId: c.containerID || c.id,
        action: c.status === 'flagged' ? 'Flagged for inspection' : 
                c.status === 'clean' ? 'Cleared inspection' : 
                c.status === 'pending' ? 'Awaiting inspection' : 'Processing complete',
        timestamp: formatTimeAgo(c.lastScanTime!),
        severity: c.status === 'flagged' ? 'high' : c.status === 'pending' ? 'medium' : 'low',
        confidence: Math.round((c.confidence || 0.95) * 100)
      }));
    
    return {
      totalContainers,
      flaggedContainers,
      cleanContainers,
      pendingContainers,
      averageConfidence: Math.round(averageConfidence * 100),
      totalDetections,
      recentActivity
    };
  };

  // Format time ago helper
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Mock alerts data (could be fetched from backend in future)
  const alerts = [
    {
      id: 1,
      type: "warning" as const,
      message: "High anomaly detection rate in recent scans",
      time: "30 minutes ago"
    },
    {
      id: 2,
      type: "info" as const,
      message: "System performing optimally",
      time: "2 hours ago"
    },
    {
      id: 3,
      type: "success" as const,
      message: "All scheduled scans completed",
      time: "4 hours ago"
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of cargo inspection activities</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  const stats = dashboardStats!;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of cargo inspection activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContainers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalDetections} total detections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.flaggedContainers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalContainers > 0 ? ((stats.flaggedContainers / stats.totalContainers) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.cleanContainers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalContainers > 0 ? ((stats.cleanContainers / stats.totalContainers) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageConfidence}%</div>
            <p className="text-xs text-muted-foreground">
              Average confidence score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingContainers}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting inspection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detections</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalDetections}</div>
            <p className="text-xs text-muted-foreground">
              Total anomalies found
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Inspections</CardTitle>
            <Activity className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{stats.recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent activity count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Processing Overview
          </CardTitle>
          <CardDescription>
            Real-time inspection progress and system performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Clean Containers</span>
              <span>{stats.totalContainers > 0 ? ((stats.cleanContainers / stats.totalContainers) * 100).toFixed(1) : 0}%</span>
            </div>
            <Progress value={stats.totalContainers > 0 ? (stats.cleanContainers / stats.totalContainers) * 100 : 0} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Processing Accuracy</span>
              <span>{stats.averageConfidence}%</span>
            </div>
            <Progress value={stats.averageConfidence} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Detection Coverage</span>
              <span>{stats.totalContainers > 0 ? Math.round((stats.totalDetections / stats.totalContainers) * 100) : 0}%</span>
            </div>
            <Progress value={stats.totalContainers > 0 ? (stats.totalDetections / stats.totalContainers) * 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest container inspection updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.severity === 'high' ? 'bg-red-500' :
                        activity.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.containerId}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.severity === 'high' ? 'destructive' : 'default'}>
                        {activity.confidence}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and system updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span className="font-medium">New Inspection</span>
              <span className="text-xs text-muted-foreground mt-1">Start manual inspection</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-medium">Generate Report</span>
              <span className="text-xs text-muted-foreground mt-1">Export inspection data</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="font-medium">Review Flagged</span>
              <span className="text-xs text-muted-foreground mt-1">Check pending containers</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span className="font-medium">System Settings</span>
              <span className="text-xs text-muted-foreground mt-1">Configure AI parameters</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 