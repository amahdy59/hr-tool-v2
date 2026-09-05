export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert array of objects to CSV string
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(fieldName => {
        let cellData = row[fieldName];
        // Handle undefined or null
        if (cellData === null || cellData === undefined) {
          cellData = '';
        } else if (typeof cellData === 'string') {
          // Escape quotes and wrap in quotes if there's a comma
          cellData = `"${cellData.replace(/"/g, '""')}"`;
        }
        return cellData;
      }).join(',')
    )
  ].join('\n');

  // Create a Blob from the CSV string with UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export async function exportToExcel(data: any[], filename: string, sheetName = 'Data') {
  if (!data || !data.length) {
    return;
  }
  const XLSX = await import('xlsx');
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export interface PDFReportOptions {
  title: string;
  subtitle?: string;
  metadata?: Record<string, string>;
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  isArabic?: boolean;
}

export async function exportToBrandedPDF(options: PDFReportOptions) {
  const { title, subtitle, metadata = {}, headers, rows, filename } = options;
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // 1. Corporate Header Band
  doc.setFillColor(15, 118, 110); // Teal / Primary theme (#0f766e)
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ADVANSYS HR ENTERPRISE SUITE', margin, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Executive Report • Generated ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}`, margin, 18);

  y = 34;

  // 2. Title & Subtitle
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, y);
  y += 7;

  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(subtitle, margin, y);
    y += 7;
  }

  // 3. Metadata Key-Values
  const metaKeys = Object.keys(metadata);
  if (metaKeys.length > 0) {
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD');

    let metaX = margin + 4;
    doc.setFontSize(8.5);
    metaKeys.forEach((key) => {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.text(`${key}: `, metaX, y + 9);
      const keyWidth = doc.getTextWidth(`${key}: `);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(String(metadata[key]), metaX + keyWidth, y + 9);
      metaX += keyWidth + doc.getTextWidth(String(metadata[key])) + 10;
    });
    y += 20;
  }

  // 4. Data Table
  const tableWidth = pageWidth - margin * 2;
  const colWidth = tableWidth / Math.max(headers.length, 1);
  const rowHeight = 7.5;

  // Table Header
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(margin, y, tableWidth, rowHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  headers.forEach((header, idx) => {
    const textX = margin + idx * colWidth + 2;
    doc.text(String(header), textX, y + 5);
  });
  y += rowHeight;

  // Table Rows (Zebra striped)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  rows.forEach((row, rowIdx) => {
    // Check if near page bottom
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    if (rowIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, tableWidth, rowHeight, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + tableWidth, y + rowHeight);

    doc.setTextColor(51, 65, 85);
    row.forEach((cell, cellIdx) => {
      const cellX = margin + cellIdx * colWidth + 2;
      const cellText = String(cell ?? '');
      doc.text(doc.splitTextToSize(cellText, colWidth - 4)[0] || '', cellX, y + 5);
    });
    y += rowHeight;
  });

  // 5. Signature & Verification Stamp
  y = Math.max(y + 12, pageHeight - 28);
  if (y > pageHeight - 20) {
    doc.addPage();
    y = margin + 10;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + 60, y);
  doc.line(pageWidth - margin - 60, y, pageWidth - margin, y);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Authorized Official Signature', margin, y + 4);
  doc.text('HR Department Verification Stamp', pageWidth - margin - 60, y + 4);

  // 6. Footer Page Number
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Advansys HR Suite • Document Verification: ${Math.random().toString(36).substring(2, 10).toUpperCase()} • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
}
