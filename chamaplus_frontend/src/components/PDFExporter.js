import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import autoTable and initialize it with jsPDF
import autoTable from 'jspdf-autotable';

// Add autoTable to jsPDF prototype
jsPDF.autoTable = autoTable;

// Initialize jsPDF with proper configuration
const initJSPDF = () => {
  const doc = new jsPDF();
  // Ensure autoTable is available
  if (!doc.autoTable) {
    doc.autoTable = autoTable;
  }
  return doc;
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount);
};

export const PDFExporter = ({ title, data, type, reportData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to capture chart as image
  const captureChart = async (element) => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#FFFFFF'
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  // Function to generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    console.log('Starting PDF generation...');
    
    try {
      // Initialize PDF document
      const doc = initJSPDF();
      
      // Validate inputs
      if (!title || !data) {
        throw new Error('Missing required data for PDF generation');
      }
      console.log('Data for PDF:', { title, type, dataLength: data?.length });
      // Set document properties
      doc.setProperties({
        title: title,
        subject: `${type} Report`,
        author: 'Chama Plus',
        creator: 'Chama Plus App'
      });

      // Set document properties
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = 20;

      // Add title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(title, margin, yPosition, { maxWidth });
      yPosition += 10;

      // Add date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.text(`Generated on: ${date}`, margin, yPosition);
      yPosition += 15;

      // Add filter information if available
      if (reportData) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Report Details', margin, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Chama: ${reportData.chama || 'All Chamas'}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Report Type: ${reportData.type || 'All Types'}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Date Range: ${reportData.dateRange || 'Last 12 months'}`, margin, yPosition);
        yPosition += 15;
      }

      // Add charts if available
      const charts = document.querySelectorAll('.chart-container');
      console.log(`Found ${charts.length} charts to process`);
      
      if (charts.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Charts', margin, yPosition);
        yPosition += 10;

        for (const chart of charts) {
          // Add new page if needed
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Capture chart as image
          const imgData = await captureChart(chart);
          if (imgData) {
            // Calculate dimensions to maintain aspect ratio
            const imgProps = doc.getImageProperties(imgData);
            const imgWidth = maxWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            // Add image to PDF
            doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          }
        }
      }


      // Add data table if available
      console.log('Processing data table...', data);
      if (data && data.length > 0) {
        // Add new page if needed
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Report Data', margin, yPosition);
        yPosition += 10;

        // Prepare table data
        const headers = ['Date', 'Chama', 'Type', 'Amount', 'Status'];
        const tableData = data.map(item => [
          formatDate(item.date),
          item.chama,
          item.type || type,
          formatCurrency(parseFloat(item.amount.replace(/[^0-9.-]+/g, ''))),
          item.status || 'Ready'
        ]);

        // Ensure autoTable is available
        if (!doc.autoTable) {
          console.error('AutoTable not available, initializing...');
          doc.autoTable = autoTable;
        }
        
        // Add table
        doc.autoTable({
          head: [headers],
          body: tableData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          headStyles: {
            fillColor: [59, 130, 246], // blue-500
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 3
          },
          alternateRowStyles: {
            fillColor: [243, 244, 246] // gray-100
          },
          styles: {
            cellPadding: 3,
            overflow: 'linebreak',
            lineWidth: 0.1,
            lineColor: [209, 213, 219] // gray-300
          },
          columnStyles: {
            0: { cellWidth: 30, halign: 'left' },
            1: { cellWidth: 40, halign: 'left' },
            2: { cellWidth: 40, halign: 'left' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 25, halign: 'center' }
          }
        });
      }


      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      // Generate PDF filename
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Saving PDF as:', filename);
      
      // Save the PDF
      try {
        doc.save(filename);
        console.log('PDF saved successfully');
      } catch (saveError) {
        console.error('Error saving PDF:', saveError);
        // Fallback to opening in new tab if save fails
        const pdfOutput = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, '_blank');
      }

    } catch (error) {
      console.error('Error generating PDF:', {
        error: error.message,
        stack: error.stack,
        data: { title, type, dataLength: data?.length }
      });
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Please check the console for more details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all ${
        isGenerating ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isGenerating ? 'Generating...' : 'Export to PDF'}
    </button>
  );
}

// Export as a named export instead of default
export default PDFExporter;
