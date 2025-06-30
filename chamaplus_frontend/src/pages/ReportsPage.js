import React, { useRef, useState } from 'react';
import ContributionGrowthChart from '../components/ContributionGrowthChart';
import { PDFExporter } from '../components/PDFExporter';
import { Link } from "react-router-dom";

const contributions = [
  { id: 1, date: "2025-01-15", amount: "KSH 5,000", chama: "Mwanzo Chama" },
  { id: 2, date: "2025-01-20", amount: "KSH 3,000", chama: "Ujenzi Chama" },
  { id: 3, date: "2025-02-05", amount: "KSH 7,500", chama: "Mwanzo Chama" },
  { id: 4, date: "2025-02-15", amount: "KSH 4,000", chama: "Ujenzi Chama" },
  { id: 5, date: "2025-03-01", amount: "KSH 6,000", chama: "Mwanzo Chama" },
  { id: 6, date: "2025-03-10", amount: "KSH 3,500", chama: "Ujenzi Chama" },
  { id: 7, date: "2025-04-05", amount: "KSH 8,000", chama: "Mwanzo Chama" },
  { id: 8, date: "2025-04-20", amount: "KSH 4,500", chama: "Ujenzi Chama" },
  { id: 9, date: "2025-05-01", amount: "KSH 9,000", chama: "Mwanzo Chama" },
  { id: 10, date: "2025-05-15", amount: "KSH 5,000", chama: "Ujenzi Chama" }
];

function ReportsPage() {
  const [selectedChama, setSelectedChama] = useState('All Chamas');
  const [dateRange, setDateRange] = useState('Last 12 months');
  const [reportType, setReportType] = useState('All Types');
  
  // Original reports data - should not be modified
  const originalReports = [
    // January 2024
    {
      id: 1,
      date: "Jan 1, 2024",
      chama: "Mwanzo Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    },
    // February 2024
    {
      id: 2,
      date: "Feb 1, 2024",
      chama: "Ujenzi Chama",
      type: "Loans",
      status: "Ready",
      url: "#"
    },
    // March 2024
    {
      id: 3,
      date: "Mar 1, 2024",
      chama: "Mwanzo Chama",
      type: "Member Activity",
      status: "Ready",
      url: "#"
    },
    // April 2024
    {
      id: 4,
      date: "Apr 1, 2024",
      chama: "Ujenzi Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    },
    // May 2024
    {
      id: 5,
      date: "May 1, 2024",
      chama: "Mwanzo Chama",
      type: "Loans",
      status: "Ready",
      url: "#"
    },
    // June 2024
    {
      id: 6,
      date: "Jun 1, 2024",
      chama: "Ujenzi Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    },
    // July 2024
    {
      id: 7,
      date: "Jul 1, 2024",
      chama: "Mwanzo Chama",
      type: "Member Activity",
      status: "Ready",
      url: "#"
    },
    // August 2024
    {
      id: 8,
      date: "Aug 1, 2024",
      chama: "Ujenzi Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    },
    // September 2024
    {
      id: 9,
      date: "Sep 1, 2024",
      chama: "Mwanzo Chama",
      type: "Loans",
      status: "Ready",
      url: "#"
    },
    // October 2024
    {
      id: 10,
      date: "Oct 1, 2024",
      chama: "Ujenzi Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    },
    // November 2024
    {
      id: 11,
      date: "Nov 1, 2024",
      chama: "Mwanzo Chama",
      type: "Member Activity",
      status: "Ready",
      url: "#"
    },
    // December 2024
    {
      id: 12,
      date: "Dec 1, 2024",
      chama: "Ujenzi Chama",
      type: "Contributions",
      status: "Ready",
      url: "#"
    }
  ];

  // State for filtered reports
  const [filteredReports, setFilteredReports] = useState([...originalReports]);
  const [filteredContributions, setFilteredContributions] = useState([...contributions]);
  const chartRef = useRef(null);

  const handleDownload = (report) => {
    // Create a temporary PDFExporter component to handle the download
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    
    // Import ReactDOM to render the component
    import('react-dom').then(ReactDOM => {
      ReactDOM.render(
        <PDFExporter 
          title={`${report.type} Report - ${report.chama}`}
          data={[report]}
          type={report.type}
          reportData={{
            chama: report.chama,
            type: report.type,
            dateRange: 'Custom'
          }}
        />,
        tempDiv,
        () => {
          // Trigger the download
          tempDiv.querySelector('button').click();
          // Clean up
          setTimeout(() => {
            ReactDOM.unmountComponentAtNode(tempDiv);
            document.body.removeChild(tempDiv);
          }, 1000);
        }
      );
    });
  };

  // Helper function to parse date strings in the format "Month Day, Year"
  const parseReportDate = (dateStr) => {
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const [month, day, year] = dateStr.replace(',', '').split(' ');
    return new Date(year, months[month], parseInt(day));
  };

  const handleFilterChange = () => {
    // First filter the contributions data for the chart
    let filteredChartData = [...contributions];
    
    // Filter by chama for chart data
    if (selectedChama !== 'All Chamas') {
      filteredChartData = filteredChartData.filter(contribution => contribution.chama === selectedChama);
    }

    // Filter by date range for chart data (only for contributions)
    const today = new Date();
    switch (dateRange) {
      case 'Last 12 months':
        filteredChartData = filteredChartData.filter(contribution => {
          const date = new Date(contribution.date);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          return date >= oneYearAgo;
        });
        break;
      case 'Last 6 months':
        filteredChartData = filteredChartData.filter(contribution => {
          const date = new Date(contribution.date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          return date >= sixMonthsAgo;
        });
        break;
      case 'Last 3 months':
        filteredChartData = filteredChartData.filter(contribution => {
          const date = new Date(contribution.date);
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(today.getMonth() - 3);
          return date >= threeMonthsAgo;
        });
        break;
      case 'Last month':
        filteredChartData = filteredChartData.filter(contribution => {
          const date = new Date(contribution.date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(today.getMonth() - 1);
          return date >= oneMonthAgo;
        });
        break;
      case 'Custom range':
        // Custom range logic would go here
        break;
      default:
        // No additional filtering needed for other cases
        break;
    }

    // Start with all original reports
    let filteredReportsList = [...originalReports];
    
    // Filter reports by chama
    if (selectedChama !== 'All Chamas') {
      filteredReportsList = filteredReportsList.filter(report => report.chama === selectedChama);
    }
    
    // Filter reports by report type
    if (reportType !== 'All Types') {
      filteredReportsList = filteredReportsList.filter(report => report.type === reportType);
    }

    // Filter reports by date range
    const todayForReports = new Date();
    switch (dateRange) {
      case 'Last 12 months':
        filteredReportsList = filteredReportsList.filter(report => {
          const reportDate = parseReportDate(report.date);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(todayForReports.getFullYear() - 1);
          return reportDate >= oneYearAgo;
        });
        break;
      case 'Last 6 months':
        filteredReportsList = filteredReportsList.filter(report => {
          const reportDate = parseReportDate(report.date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(todayForReports.getMonth() - 6);
          return reportDate >= sixMonthsAgo;
        });
        break;
      case 'Last 3 months':
        filteredReportsList = filteredReportsList.filter(report => {
          const reportDate = parseReportDate(report.date);
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(todayForReports.getMonth() - 3);
          return reportDate >= threeMonthsAgo;
        });
        break;
      case 'Last month':
        filteredReportsList = filteredReportsList.filter(report => {
          const reportDate = parseReportDate(report.date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(todayForReports.getMonth() - 1);
          return reportDate >= oneMonthAgo;
        });
        break;
      case 'Custom range':
        // Custom range logic would go here
        break;
      default:
        // No additional filtering needed for other cases
        break;
    }

    setFilteredContributions(filteredChartData);
    setFilteredReports(filteredReportsList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Financial Reports</h1>
          <p className="text-lg text-blue-50">View and download financial reports</p>
        </div>

        {/* Report Filters */}
        <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Chama</label>
              <select 
                value={selectedChama}
                onChange={(e) => setSelectedChama(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-green-300"
              >
                <option value="All Chamas">All Chamas</option>
                <option value="Mwanzo Chama">Mwanzo Chama</option>
                <option value="Ujenzi Chama">Ujenzi Chama</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Date Range</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-green-300"
              >
                <option value="Last 12 months">Last 12 months</option>
                <option value="Last 6 months">Last 6 months</option>
                <option value="Last 3 months">Last 3 months</option>
                <option value="Last month">Last month</option>
                <option value="Custom range">Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-green-300"
              >
                <option value="All Types">All Types</option>
                <option value="Contributions">Contributions</option>
                <option value="Loans">Loans</option>
                <option value="Member Activity">Member Activity</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="button"
                onClick={handleFilterChange}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Chart/Card Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Contribution Growth</h2>
            <PDFExporter 
              title="Chama Plus Contribution Report"
              data={filteredContributions}
              type="contributions"
              reportData={{
                chama: selectedChama,
                type: reportType,
                dateRange: dateRange
              }}
            />
          </div>
          <div ref={chartRef} className="chart-container">
            <ContributionGrowthChart contributions={filteredContributions} />
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chama</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-medium">{report.date}</td>
                    <td className="px-4 py-3 text-blue-700 font-bold">{report.chama}</td>
                    <td className="px-4 py-3 text-gray-600">{report.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        disabled
                        className="bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-lg shadow cursor-not-allowed transition-all"
                        title="Download functionality is currently disabled"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
