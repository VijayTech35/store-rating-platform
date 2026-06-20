export function downloadCSV(data, filename, columns) {
  const header = columns.map((c) => c.label).join(',');
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.accessor(row);
      const str = val == null ? '' : String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );
  const bom = '\uFEFF';
  const csv = bom + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
