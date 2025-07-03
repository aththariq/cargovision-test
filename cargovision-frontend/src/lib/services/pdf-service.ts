import React from 'react';
import { AnomalyDetection } from '@/components/ai/anomaly-overlay';

export interface PDFReportData {
  container: {
    id: string;
    containerId: string;
    status: 'pending' | 'inspecting' | 'completed' | 'failed' | 'flagged' | 'clean' | 'in-progress';
    location: string;
    inspector?: string;
    scanTime?: string;
    vessel?: string;
    origin?: string;
    destination?: string;
    weight?: string;
  };
  anomalies: AnomalyDetection[];
  summary: {
    totalAnomalies: number;
    highRiskCount: number;
    aiConfidence: number;
    scanDuration?: number;
  };
  inspectionHistory?: Array<{
    date: string;
    inspector: string;
    status: string;
    anomalies: number;
  }>;
}

export class PDFService {
  /**
   * Generate PDF blob from inspection data
   */
  static async generatePDF(reportData: PDFReportData): Promise<Blob> {
    try {
      // Dynamically import PDF renderer to avoid SSR issues
      const [{ pdf }, { default: InspectionPDFTemplate }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/reports/inspection-pdf-template')
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(React.createElement(InspectionPDFTemplate, { data: reportData }) as any).toBlob();
      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  /**
   * Alias for generatePDF - used by PDFPreviewModal
   */
  static async generatePDFBlob(reportData: PDFReportData): Promise<Blob> {
    return this.generatePDF(reportData);
  }

  /**
   * Download PDF report
   */
  static async downloadReport(
    reportData: PDFReportData, 
    filename?: string
  ): Promise<void> {
    try {
      const blob = await this.generatePDF(reportData);
      
      // Dynamically import file-saver to avoid SSR issues
      const { saveAs } = await import('file-saver');
      
      const defaultFilename = `container-report-${reportData.container.containerId}-${Date.now()}.pdf`;
      saveAs(blob, filename || defaultFilename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF report');
    }
  }

  /**
   * Generate PDF preview URL (for displaying in iframe or preview component)
   */
  static async generatePreviewURL(reportData: PDFReportData): Promise<string> {
    try {
      const blob = await this.generatePDF(reportData);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      throw new Error('Failed to generate PDF preview');
    }
  }

  /**
   * Validate report data before PDF generation
   */
  static validateReportData(data: PDFReportData): boolean {
    if (!data.container || !data.container.containerId) {
      throw new Error('Container information is required');
    }
    
    if (!data.container.inspector || !data.container.scanTime) {
      throw new Error('Inspector and scan time are required');
    }

    if (!Array.isArray(data.anomalies)) {
      throw new Error('Anomalies data must be an array');
    }

    if (!data.summary || typeof data.summary.totalAnomalies !== 'number') {
      throw new Error('Summary data is invalid');
    }

    return true;
  }

  /**
   * Generate report with progress tracking
   */
  static async generateReportWithProgress(
    reportData: PDFReportData,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    try {
      // Validate data first
      this.validateReportData(reportData);
      onProgress?.(25);

      // Generate PDF
      onProgress?.(50);
      const blob = await this.generatePDF(reportData);
      onProgress?.(100);

      return blob;
    } catch (error) {
      console.error('Error generating report with progress:', error);
      throw error;
    }
  }

  /**
   * Prepare report data from container and detection information
   */
  static prepareReportData(
    containerInfo: {
      id: string;
      containerId?: string;
      status: 'pending' | 'inspecting' | 'completed' | 'failed' | 'flagged' | 'clean' | 'in-progress';
      location: string;
      inspector?: string;
      scanTime?: string;
      vessel?: string;
      origin?: string;
      destination?: string;
      weight?: string;
    },
    anomalies: AnomalyDetection[],
    inspectionHistory?: Array<{
      date: string;
      inspector: string;
      status: string;
      anomalies: number;
    }>
  ): PDFReportData {
    const highRiskAnomalies = anomalies.filter(a => a.confidence > 0.8);
    
    return {
      container: {
        id: containerInfo.id,
        containerId: containerInfo.containerId || containerInfo.id,
        status: containerInfo.status,
        location: containerInfo.location,
        inspector: containerInfo.inspector || 'Unknown',
        scanTime: containerInfo.scanTime || new Date().toISOString(),
        vessel: containerInfo.vessel,
        origin: containerInfo.origin,
        destination: containerInfo.destination,
        weight: containerInfo.weight,
      },
      anomalies,
      summary: {
        totalAnomalies: anomalies.length,
        highRiskCount: highRiskAnomalies.length,
        aiConfidence: anomalies.length > 0 
          ? anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length
          : 0,
        scanDuration: 30 // Mock scan duration - in real app would come from API
      },
      inspectionHistory
    };
  }
}

export default PDFService; 