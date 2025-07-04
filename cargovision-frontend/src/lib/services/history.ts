import { apiService, ApiResponse } from './api';
import { 
  OcrHistoryResponse, 
  IllegalHistoryResponse, 
  CategoryHistoryResponse,
  OcrScan,
  IllegalScan, 
  CategoryScan,
  ContainerData,
  DashboardStats,
  RecentActivity,
  ContainerTableRow 
} from '@/types';



class HistoryService {
  // Get OCR scan history
  async getOcrHistory(): Promise<ApiResponse<OcrHistoryResponse>> {
    return apiService.get<OcrHistoryResponse>('/service/history/ocr');
  }

  // Get illegal detection scan history
  async getIllegalHistory(): Promise<ApiResponse<IllegalHistoryResponse>> {
    return apiService.get<IllegalHistoryResponse>('/service/history/illegal');
  }

  // Get illegal detection scan history for specific container
  async getIllegalHistoryByContainer(containerID: string): Promise<ApiResponse<IllegalHistoryResponse>> {
    return apiService.get<IllegalHistoryResponse>(`/service/history/illegal?containerID=${containerID}`);
  }

  // Get category detection scan history
  async getCategoryHistory(): Promise<ApiResponse<CategoryHistoryResponse>> {
    return apiService.get<CategoryHistoryResponse>('/service/history/category');
  }

  // Get category detection scan history for specific container  
  async getCategoryHistoryByContainer(containerID: string): Promise<ApiResponse<CategoryHistoryResponse>> {
    return apiService.get<CategoryHistoryResponse>(`/service/history/category?containerID=${containerID}`);
  }

  // Get combined container data from illegal and category scans
  async getContainersData(): Promise<ContainerData[]> {
    try {
      const [illegalResponse, categoryResponse] = await Promise.all([
        this.getIllegalHistory(),
        this.getCategoryHistory()
      ]);

      const containerMap = new Map<string, ContainerData>();
      
      // Process illegal scans
      illegalResponse.data.illegalScans.forEach((scan: IllegalScan) => {
        if (!scan.containerID) return;
        
        const existing = containerMap.get(scan.containerID);
        if (existing) {
          existing.illegalScans.push(scan);
          existing.totalDetections += scan.detections.length;
          if (scan.createdTime > existing.lastScanTime) {
            existing.lastScanTime = scan.createdTime;
          }
        } else {
          containerMap.set(scan.containerID, {
            containerID: scan.containerID,
            illegalScans: [scan],
            categoryScans: [],
            status: scan.detections.length > 0 ? 'flagged' : 'clean',
            totalDetections: scan.detections.length,
            lastScanTime: scan.createdTime,
            scanTypes: ['illegal']
          });
        }
      });

      // Process category scans
      categoryResponse.data.categoryScans.forEach((scan: CategoryScan) => {
        if (!scan.containerID) return;
        
        const existing = containerMap.get(scan.containerID);
        if (existing) {
          existing.categoryScans.push(scan);
          existing.totalDetections += scan.detections.length;
          if (scan.createdTime > existing.lastScanTime) {
            existing.lastScanTime = scan.createdTime;
          }
          if (!existing.scanTypes.includes('category')) {
            existing.scanTypes.push('category');
          }
        } else {
          containerMap.set(scan.containerID, {
            containerID: scan.containerID,
            illegalScans: [],
            categoryScans: [scan],
            status: 'clean', // Category scans don't flag containers
            totalDetections: scan.detections.length,
            lastScanTime: scan.createdTime,
            scanTypes: ['category']
          });
        }
      });

      // Update status based on illegal detections
      containerMap.forEach((container) => {
        const hasIllegalDetections = container.illegalScans.some(scan => scan.detections.length > 0);
        container.status = hasIllegalDetections ? 'flagged' : 'clean';
      });

      return Array.from(containerMap.values());
    } catch (error) {
      console.error('Error fetching containers data:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const containers = await this.getContainersData();
      const [illegalResponse, categoryResponse, ocrResponse] = await Promise.all([
        this.getIllegalHistory(),
        this.getCategoryHistory(), 
        this.getOcrHistory()
      ]);

      const totalContainers = containers.length;
      const flaggedContainers = containers.filter(c => c.status === 'flagged').length;
      
      // Calculate total scans across all types
      const totalScans = illegalResponse.data.illegalScans.length + 
                        categoryResponse.data.categoryScans.length + 
                        ocrResponse.data.ocrScans.length;

      // Create recent activity from all scan types
      const recentActivity: RecentActivity[] = [];
      
      // Add illegal scans to recent activity
      illegalResponse.data.illegalScans.forEach((scan: IllegalScan) => {
        recentActivity.push({
          id: scan.id,
          type: 'illegal',
          containerID: scan.containerID || undefined,
          timestamp: scan.createdTime,
          status: scan.detections.length > 0 ? 'flagged' : 'clean',
          detectionCount: scan.detections.length
        });
      });

      // Add category scans to recent activity
      categoryResponse.data.categoryScans.forEach((scan: CategoryScan) => {
        recentActivity.push({
          id: scan.id,
          type: 'category',
          containerID: scan.containerID || undefined,
          timestamp: scan.createdTime,
          status: 'clean', // Category scans don't flag
          detectionCount: scan.detections.length
        });
      });

      // Add OCR scans to recent activity  
      ocrResponse.data.ocrScans.forEach((scan: OcrScan) => {
        recentActivity.push({
          id: scan.id,
          type: 'ocr',
          containerID: undefined, // OCR doesn't have containerID
          timestamp: scan.createdTime,
          status: 'clean', // OCR is informational
          detectionCount: scan.detections.length
        });
      });

      // Sort by timestamp (most recent first) and take top 10
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        totalContainers,
        flaggedContainers,
        totalScans,
        recentActivity: recentActivity.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Convert container data to table rows
  convertToTableRows(containers: ContainerData[]): ContainerTableRow[] {
    return containers.map(container => ({
      id: container.containerID,
      containerID: container.containerID,
      status: container.status,
      lastScan: container.lastScanTime,
      totalScans: container.illegalScans.length + container.categoryScans.length,
      illegalDetections: container.illegalScans.reduce((sum, scan) => sum + scan.detections.length, 0),
      categoryDetections: container.categoryScans.reduce((sum, scan) => sum + scan.detections.length, 0),
      scanTypes: container.scanTypes
    }));
  }
}

export const historyService = new HistoryService();
export type { OcrScan, IllegalScan, CategoryScan, ContainerData }; 