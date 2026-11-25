const escapeCsv = (value) => {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const initBilling = () => {
  const printBtn = document.getElementById('btn-print-receipts');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rows = document.querySelectorAll('#billing-table tbody tr[data-receipt]');
      if (!rows.length) return;

      const lines = ['Receipt,Date,Expedition,Status,Amount'];
      rows.forEach((row) => {
        const { receipt, date, tour, status, amount } = row.dataset;
        lines.push(
          [receipt, date, tour, status, amount].map(escapeCsv).join(','),
        );
      });

      const blob = new Blob([lines.join('\n')], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'natours-billing-receipts.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
};
