"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, AlertTriangle, CheckCircle, Clock, RefreshCw, TrendingUp, Users, Activity } from "lucide-react";
import { historyService } from "@/lib/services/history";
import { DashboardStats, RecentActivity } from "@/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const dashboardStats = await historyService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
    toast.success('Dashboard data refreshed');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getScanTypeColor = (type: 'illegal' | 'category' | 'ocr') => {
    switch (type) {
      case 'illegal': return 'destructive';
      case 'category': return 'secondary';
      case 'ocr': return 'outline';
      default: return 'secondary';
    }
  };

  const getScanTypeLabel = (type: 'illegal' | 'category' | 'ocr') => {
    switch (type) {
      case 'illegal': return 'Illegal Detection';
      case 'category': return 'Item Category';
      case 'ocr': return 'OCR Analysis';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-96">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CargoVision Dashboard</h1>
          <p className="text-gray-600">Real-time container monitoring and analysis</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalContainers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Containers tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Containers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.flaggedContainers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scans performed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean Containers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(stats?.totalContainers || 0) - (stats?.flaggedContainers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              No issues detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest scan results and detections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity: RecentActivity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getScanTypeColor(activity.type)}>
                        {getScanTypeLabel(activity.type)}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {activity.containerID ? `Container ${activity.containerID}` : 'Scan Analysis'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.detectionCount > 0 
                            ? `${activity.detectionCount} detection${activity.detectionCount > 1 ? 's' : ''} found`
                            : 'No detections found'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.status === 'flagged' ? 'destructive' : 'secondary'}>
                        {activity.status === 'flagged' ? 'Flagged' : 'Clean'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/containers" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Container className="w-4 h-4 mr-2" />
                Container Monitoring
              </Button>
            </Link>
            
            <Link href="/dashboard/analytics" className="block">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
            </Link>
            
            <Link href="/dashboard/reports" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Inspection Reports
              </Button>
            </Link>

            <Link href="/dashboard/chat" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 