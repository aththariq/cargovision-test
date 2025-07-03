"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Users,
  MapPin,
  Activity
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface AnalyticsData {
  overview: {
    totalInspections: number;
    flaggedContainers: number;
    cleanContainers: number;
    averageConfidence: number;
    inspectionRate: number;
    averageProcessingTime: number;
  };
  trends: {
    dailyInspections: Array<{
      date: string;
      inspections: number;
      flagged: number;
      clean: number;
    }>;
    weeklyComparison: {
      thisWeek: number;
      lastWeek: number;
      change: number;
    };
  };
  locations: Array<{
    name: string;
    inspections: number;
    flaggedRate: number;
    efficiency: number;
  }>;
  inspectors: Array<{
    name: string;
    inspections: number;
    flaggedRate: number;
    accuracy: number;
  }>;
  aiPerformance: {
    totalScans: number;
    averageConfidence: number;
    confidenceDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockData: AnalyticsData = {
        overview: {
          totalInspections: 1547,
          flaggedContainers: 234,
          cleanContainers: 1313,
          averageConfidence: 93.2,
          inspectionRate: 52.3,
          averageProcessingTime: 2.4
        },
        trends: {
          dailyInspections: [
            { date: '2024-01-09', inspections: 45, flagged: 8, clean: 37 },
            { date: '2024-01-10', inspections: 52, flagged: 12, clean: 40 },
            { date: '2024-01-11', inspections: 48, flagged: 7, clean: 41 },
            { date: '2024-01-12', inspections: 61, flagged: 15, clean: 46 },
            { date: '2024-01-13', inspections: 39, flagged: 5, clean: 34 },
            { date: '2024-01-14', inspections: 55, flagged: 11, clean: 44 },
            { date: '2024-01-15', inspections: 47, flagged: 9, clean: 38 }
          ],
          weeklyComparison: {
            thisWeek: 347,
            lastWeek: 312,
            change: 11.2
          }
        },
        locations: [
          { name: 'Port of Jakarta', inspections: 542, flaggedRate: 14.2, efficiency: 87.3 },
          { name: 'Port of Surabaya', inspections: 398, flaggedRate: 16.8, efficiency: 82.1 },
          { name: 'Port of Medan', inspections: 287, flaggedRate: 12.9, efficiency: 91.2 },
          { name: 'Port of Makassar', inspections: 210, flaggedRate: 18.5, efficiency: 78.6 },
          { name: 'Port of Semarang', inspections: 110, flaggedRate: 11.8, efficiency: 89.4 }
        ],
        inspectors: [
          { name: 'John Smith', inspections: 156, flaggedRate: 15.4, accuracy: 94.2 },
          { name: 'Sarah Johnson', inspections: 142, flaggedRate: 13.8, accuracy: 96.1 },
          { name: 'Mike Brown', inspections: 134, flaggedRate: 16.2, accuracy: 92.8 },
          { name: 'Lisa Davis', inspections: 128, flaggedRate: 14.1, accuracy: 95.3 },
          { name: 'David Chen', inspections: 119, flaggedRate: 12.6, accuracy: 97.2 }
        ],
        aiPerformance: {
          totalScans: 1547,
          averageConfidence: 93.2,
          confidenceDistribution: [
            { range: '90-100%', count: 1085, percentage: 70.1 },
            { range: '80-89%', count: 308, percentage: 19.9 },
            { range: '70-79%', count: 123, percentage: 8.0 },
            { range: '60-69%', count: 31, percentage: 2.0 }
          ]
        }
      };

      setData(mockData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 30 Days';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Container inspection analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {getTimeRangeLabel(timeRange)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('7d')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30d')}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('90d')}>
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inspections</p>
              <p className="text-2xl font-bold">{formatNumber(data.overview.totalInspections)}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-red-600">{formatNumber(data.overview.flaggedContainers)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clean</p>
              <p className="text-2xl font-bold text-green-600">{formatNumber(data.overview.cleanContainers)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Confidence</p>
              <p className="text-2xl font-bold">{formatPercentage(data.overview.averageConfidence)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inspection Rate</p>
              <p className="text-2xl font-bold">{formatPercentage(data.overview.inspectionRate)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Time</p>
              <p className="text-2xl font-bold">{data.overview.averageProcessingTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Weekly Comparison */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Weekly Performance</h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={data.trends.weeklyComparison.change > 0 ? "default" : "secondary"}
              className={data.trends.weeklyComparison.change > 0 ? "bg-green-100 text-green-800" : ""}
            >
              {data.trends.weeklyComparison.change > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(Math.abs(data.trends.weeklyComparison.change))}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-3xl font-bold text-blue-600">{formatNumber(data.trends.weeklyComparison.thisWeek)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Last Week</p>
            <p className="text-3xl font-bold text-gray-600">{formatNumber(data.trends.weeklyComparison.lastWeek)}</p>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Inspections Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Inspections Trend</h2>
          <div className="space-y-3">
            {data.trends.dailyInspections.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('id-ID', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-sm text-gray-600">{day.inspections}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full relative"
                      style={{ width: `${(day.inspections / 65) * 100}%` }}
                    >
                      <div 
                        className="bg-red-500 h-2 rounded-full absolute top-0 right-0"
                        style={{ width: `${(day.flagged / day.inspections) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Confidence Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">AI Confidence Distribution</h2>
          <div className="space-y-4">
            {data.aiPerformance.confidenceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium">{item.range}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 min-w-[60px] text-right">
                  {formatNumber(item.count)} ({formatPercentage(item.percentage)})
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Locations</h2>
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Location</th>
                  <th className="text-right py-2">Inspections</th>
                  <th className="text-right py-2">Flagged Rate</th>
                  <th className="text-right py-2">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {data.locations.map((location, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{location.name}</td>
                    <td className="py-2 text-right">{formatNumber(location.inspections)}</td>
                    <td className="py-2 text-right">
                      <span className={`${location.flaggedRate > 15 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatPercentage(location.flaggedRate)}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className={`${location.efficiency > 85 ? 'text-green-600' : 'text-orange-600'}`}>
                        {formatPercentage(location.efficiency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Inspectors */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Inspectors</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Inspector</th>
                  <th className="text-right py-2">Inspections</th>
                  <th className="text-right py-2">Flagged Rate</th>
                  <th className="text-right py-2">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {data.inspectors.map((inspector, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{inspector.name}</td>
                    <td className="py-2 text-right">{formatNumber(inspector.inspections)}</td>
                    <td className="py-2 text-right">
                      <span className={`${inspector.flaggedRate > 15 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatPercentage(inspector.flaggedRate)}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className={`${inspector.accuracy > 95 ? 'text-green-600' : 'text-orange-600'}`}>
                        {formatPercentage(inspector.accuracy)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
} 