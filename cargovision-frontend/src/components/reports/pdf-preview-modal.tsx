"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Container, InspectionHistoryEntry } from '@/types';
import type { AnomalyDetection } from '@/components/ai/anomaly-overlay';

interface PDFPreviewModalProps {
  container: Container;
  anomalies?: AnomalyDetection[];
  history?: InspectionHistoryEntry[];
  onClose: () => void;
}

// Dynamic PDF viewer component to avoid SSR issues
const PDFViewer: React.FC<{
  documentUrl: string;
  pageNumber: number;
  scale: number;
  rotation: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}> = ({ documentUrl, pageNumber, scale, rotation, onLoadSuccess, onLoadError }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Document, setDocument] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Page, setPage] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamically import react-pdf components to avoid SSR issues
    const loadPDFComponents = async () => {
      try {
        const reactPdf = await import('react-pdf');
        setDocument(() => reactPdf.Document);
        setPage(() => reactPdf.Page);
        
        // Set up PDF.js worker
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${reactPdf.pdfjs.version}/pdf.worker.min.js`;
      } catch (error) {
        console.error('Error loading PDF components:', error);
        onLoadError(new Error('Failed to load PDF viewer'));
      }
    };

    loadPDFComponents();
  }, [onLoadError]);

  if (!Document || !Page) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading PDF viewer...</span>
      </div>
    );
  }

  return (
    <Document
      file={documentUrl}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading PDF...</span>
        </div>
      }
    >
      <Page
        pageNumber={pageNumber}
        scale={scale}
        rotate={rotation}
        loading={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading page...</span>
          </div>
        }
      />
    </Document>
  );
};

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  container,
  anomalies = [],
  history = [],
  onClose
}) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // PDF viewer state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // Generate PDF when component mounts
  useEffect(() => {
    const generatePDF = async () => {
      try {
        setIsGenerating(true);
        setError(null);

        // Dynamically import PDF service to avoid SSR issues
        const { default: PDFService } = await import('@/lib/services/pdf-service');

        const reportData = PDFService.prepareReportData(
          {
            ...container,
            location: container.location || 'Unknown Location'
          }, 
          anomalies, 
          history
        );
        const blob = await PDFService.generatePDFBlob(reportData);
        
        setPdfBlob(blob);
        toast.success('PDF preview generated successfully!');
      } catch (err) {
        console.error('Error generating PDF preview:', err);
        setError('Failed to generate PDF preview');
        toast.error('Failed to generate PDF preview. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generatePDF();
  }, [container, anomalies, history]);

  // Create object URL from blob
  const documentUrl = React.useMemo(() => {
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
    return null;
  }, [pdfBlob]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoadingPdf(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF document');
    setIsLoadingPdf(false);
    toast.error('Failed to load PDF document');
  };

  const handleDownload = async () => {
    if (pdfBlob) {
      const toastId = toast.loading('Preparing download...');
      try {
        const filename = `container-report-${container.containerId}.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('PDF downloaded successfully!', { id: toastId });
      } catch {
        toast.error('Failed to download PDF', { id: toastId });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'flagged':
        return 'destructive';
      case 'clean':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'inspecting':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <DialogTitle className="text-lg font-semibold">
                PDF Report Preview
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Container {container.containerId}
                </span>
                <Badge variant={getStatusBadgeVariant(container.status)}>
                  {container.status}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Toolbar - only show when PDF is loaded */}
        {!isGenerating && pdfBlob && !error && (
          <div className="flex items-center justify-between p-3 border-b bg-muted/50 rounded-md flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Page Navigation */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom and Rotate Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setScale(prev => Math.max(prev - 0.25, 0.5))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setScale(prev => Math.min(prev + 0.25, 3.0))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRotation(prev => (prev + 90) % 360)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center">
          {isGenerating && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <div className="text-center">
                <p className="font-medium">Generating PDF Preview...</p>
                <p className="text-sm">This may take a few moments</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-destructive">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Error generating PDF</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!isGenerating && pdfBlob && documentUrl && !error && (
            <>
              {isLoadingPdf && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading PDF...</span>
                </div>
              )}
              <PDFViewer
                documentUrl={documentUrl}
                pageNumber={pageNumber}
                scale={scale}
                rotation={rotation}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {isGenerating ? 'Generating PDF...' : `container-report-${container.containerId}.pdf`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={handleDownload} 
                disabled={isGenerating || !pdfBlob || !!error}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreviewModal; 