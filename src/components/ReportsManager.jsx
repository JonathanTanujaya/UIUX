import React, { useState, useEffect } from 'react';

const ReportsManager = () => {
  const [activeReport, setActiveReport] = useState('stok-summary');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const reports = [
    { id: 'stok-summary', label: 'Stock Summary', endpoint: '/api/reports/stok-summary' },
    { id: 'financial-report', label: 'Financial Report', endpoint: '/api/reports/financial-report' },
    { id: 'aging-report', label: 'Aging Report', endpoint: '/api/reports/aging-report' },
    { id: 'sales-summary', label: 'Sales Summary', endpoint: '/api/reports/sales-summary' },
    { id: 'return-summary', label: 'Return Summary', endpoint: '/api/reports/return-summary' },
    { id: 'dashboard-kpi', label: 'Dashboard KPI', endpoint: '/api/reports/dashboard-kpi' },
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeReport]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const report = reports.find(r => r.id === activeReport);
      if (report) {
        const response = await fetch(report.endpoint);
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderReportTable = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading report data...</div>;
    }

    if (!reportData || reportData.length === 0) {
      return <div className="p-4 text-center text-gray-500">No data available</div>;
    }

    const columns = Object.keys(reportData[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports Manager</h1>
        
        {/* Report Selection Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeReport === report.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {report.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Report Actions */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {reports.find(r => r.id === activeReport)?.label}
        </h2>
        <div className="space-x-2">
          <button
            onClick={fetchReportData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh Data
          </button>
          <button
            onClick={() => {
              const csvContent = reportData.map(row => Object.values(row).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${activeReport}.csv`;
              a.click();
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={!reportData.length}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {renderReportTable()}
      </div>
    </div>
  );
};

export default ReportsManager;
