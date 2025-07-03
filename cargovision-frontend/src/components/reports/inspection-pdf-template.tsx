import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { AnomalyDetection } from '../ai/anomaly-overlay';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2A8AFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A8AFB',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    color: '#333333',
  },
  value: {
    width: '70%',
    color: '#666666',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
  },
  flagged: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  clean: {
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
  },
  pending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  summary: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#374151',
  },
  summaryValue: {
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

interface InspectionReportData {
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

interface InspectionPDFTemplateProps {
  data: InspectionReportData;
}

const InspectionPDFTemplate: React.FC<InspectionPDFTemplateProps> = ({ data }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'flagged':
      case 'failed':
        return [styles.statusBadge, styles.flagged];
      case 'clean':
      case 'completed':
        return [styles.statusBadge, styles.clean];
      case 'pending':
      case 'inspecting':
      case 'in-progress':
        return [styles.statusBadge, styles.pending];
      default:
        return [styles.statusBadge];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Container Inspection Report</Text>
          <Text style={styles.subtitle}>AI-Powered X-ray Analysis Report</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date().toLocaleString()}
          </Text>
        </View>

        {/* Container Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Container Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Container ID:</Text>
            <Text style={styles.value}>{data.container.containerId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <View style={getStatusStyle(data.container.status)}>
              <Text style={styles.tableCell}>
                {data.container.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{data.container.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Inspector:</Text>
            <Text style={styles.value}>{data.container.inspector || 'Unknown'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Scan Time:</Text>
            <Text style={styles.value}>{data.container.scanTime ? formatDate(data.container.scanTime) : 'Not specified'}</Text>
          </View>
          {data.container.vessel && (
            <View style={styles.row}>
              <Text style={styles.label}>Vessel:</Text>
              <Text style={styles.value}>{data.container.vessel}</Text>
            </View>
          )}
          {data.container.weight && (
            <View style={styles.row}>
              <Text style={styles.label}>Weight:</Text>
              <Text style={styles.value}>{data.container.weight}</Text>
            </View>
          )}
        </View>

        {/* Inspection Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Summary</Text>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Anomalies Detected:</Text>
              <Text style={styles.summaryValue}>{data.summary.totalAnomalies}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>High Risk Anomalies:</Text>
              <Text style={styles.summaryValue}>{data.summary.highRiskCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>AI Confidence Score:</Text>
              <Text style={styles.summaryValue}>
                {Math.round(data.summary.aiConfidence * 100)}%
              </Text>
            </View>
            {data.summary.scanDuration && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Scan Duration:</Text>
                <Text style={styles.summaryValue}>{data.summary.scanDuration}s</Text>
              </View>
            )}
          </View>
        </View>

        {/* Anomaly Details */}
        {data.anomalies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anomaly Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>ID</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Type</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Zone</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Confidence</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Risk Level</Text>
                </View>
              </View>
              {data.anomalies.map((anomaly, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{anomaly.id}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{anomaly.type}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{anomaly.zone}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Math.round(anomaly.confidence * 100)}%
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {anomaly.confidence > 0.8 ? 'High' : 
                       anomaly.confidence > 0.6 ? 'Medium' : 'Low'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Inspection History */}
        {data.inspectionHistory && data.inspectionHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection History</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Date</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Inspector</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Status</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Anomalies</Text>
                </View>
              </View>
              {data.inspectionHistory.slice(0, 5).map((inspection, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {formatDate(inspection.date)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{inspection.inspector}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <View style={getStatusStyle(inspection.status)}>
                      <Text style={styles.tableCell}>
                        {inspection.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{inspection.anomalies}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated by CargoVision AI-powered container inspection system.
          {'\n'}Report ID: RPT-{data.container.containerId}-{Date.now()}
        </Text>
      </Page>
    </Document>
  );
};

export default InspectionPDFTemplate; 