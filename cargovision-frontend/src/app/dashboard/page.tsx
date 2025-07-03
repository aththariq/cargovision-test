import { Metadata } from "next";
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
  Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | CargoVision",
};

export default function DashboardPage() {
  // Mock data for demonstration
  const stats = {
    totalContainers: 2847,
    flaggedContainers: 47,
    cleanContainers: 2653,
    pendingInspections: 147,
    aiAccuracy: 97.3,
    activeInspectors: 12,
    todayInspections: 89,
    avgProcessingTime: "3.2m"
  };

  const recentActivity = [
    {
      id: 1,
      containerId: "CONT-2024-001",
      action: "Flagged for inspection",
      confidence: 94,
      timestamp: "2 minutes ago",
      severity: "high"
    },
    {
      id: 2,
      containerId: "CONT-2024-002",
      action: "Cleared inspection",
      confidence: 98,
      timestamp: "5 minutes ago",
      severity: "low"
    },
    {
      id: 3,
      containerId: "CONT-2024-003",
      action: "Manual review required",
      confidence: 72,
      timestamp: "12 minutes ago",
      severity: "medium"
    },
    {
      id: 4,
      containerId: "CONT-2024-004",
      action: "AI processing complete",
      confidence: 96,
      timestamp: "18 minutes ago",
      severity: "low"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "High anomaly detection rate in Port A",
      time: "30 minutes ago"
    },
    {
      id: 2,
      type: "info",
      message: "System maintenance scheduled for tonight",
      time: "2 hours ago"
    },
    {
      id: 3,
      type: "success",
      message: "Monthly compliance report generated",
      time: "4 hours ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of cargo inspection activities</p>
        </div>
        <div className="flex items-center space-x-2">
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
              +{stats.todayInspections} today
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
              {((stats.flaggedContainers / stats.totalContainers) * 100).toFixed(1)}% of total
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
              {((stats.cleanContainers / stats.totalContainers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.aiAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              +0.2% from last week
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
            <div className="text-2xl font-bold text-orange-600">{stats.pendingInspections}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting inspection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Inspectors</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.activeInspectors}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Inspections</CardTitle>
            <Activity className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{stats.todayInspections}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.avgProcessingTime}</div>
            <p className="text-xs text-muted-foreground">
              -0.3m from last week
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
              <span>{((stats.cleanContainers / stats.totalContainers) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(stats.cleanContainers / stats.totalContainers) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Processing Accuracy</span>
              <span>{stats.aiAccuracy}%</span>
            </div>
            <Progress value={stats.aiAccuracy} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Inspection Goal</span>
              <span>{((stats.todayInspections / 120) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(stats.todayInspections / 120) * 100} className="h-2" />
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
              {recentActivity.map((activity) => (
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
              ))}
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