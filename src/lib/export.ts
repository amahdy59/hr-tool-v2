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

  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
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
