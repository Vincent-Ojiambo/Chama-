import { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  BarChart2,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import { AppLayout } from '../App';

const AdminReportsPage = ({
  isMobile,
  sidebarMinimized,
  setSidebarMinimized,
  sidebarOpen,
  setSidebarOpen
}) => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showReportFilters, setShowReportFilters] = useState(false);

  // Memoize mock data to prevent recreation on every render
  const mockReports = useCallback(() => [
    {
      id: 1,
      title: 'Monthly Contributions',
      type: 'contributions',
      description: 'Detailed report of all contributions for the selected period',
      lastGenerated: '2025-05-18T10:30:00',
      generatedBy: 'Admin User',
      status: 'completed',
      fileType: 'PDF',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Loan Disbursements',
      type: 'loans',
      description: 'Report of all loans disbursed in the selected period',
      lastGenerated: '2025-05-17T14:15:00',
      generatedBy: 'Admin User',
      status: 'completed',
      fileType: 'Excel',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Member Activity',
      type: 'members',
      description: 'Detailed activity log for all members',
      lastGenerated: '2025-05-16T09:45:00',
      generatedBy: 'System',
      status: 'completed',
      fileType: 'PDF',
      fileSize: '3.2 MB'
    },
    {
      id: 4,
      title: 'Financial Summary',
      type: 'financial',
      description: 'Comprehensive financial summary including income, expenses, and balances',
      lastGenerated: '2025-05-15T16:20:00',
      generatedBy: 'Admin User',
      status: 'completed',
      fileType: 'PDF',
      fileSize: '4.1 MB'
    },
    {
      id: 5,
      title: 'Meeting Minutes',
      type: 'meetings',
      description: 'Compilation of all meeting minutes',
      lastGenerated: '2025-05-14T11:10:00',
      generatedBy: 'System',
      status: 'completed',
      fileType: 'Word',
      fileSize: '1.5 MB'
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    const fetchReports = () => {
      setLoading(true);
      setTimeout(() => {
        setReports(mockReports());
        setLoading(false);
      }, 1000);
    };

    fetchReports();
  }, [mockReports]);

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // This function is kept for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const handleGenerateReport = (report) => {
    // In a real app, this would trigger an API call to generate the report
    console.log('Generating report:', report);
  };

  const handleDownload = (report) => {
    // In a real app, this would trigger a download
    console.log('Downloading report:', report);
  };

  const handlePrint = (report) => {
    // In a real app, this would open the print dialog
    console.log('Printing report:', report);
    window.print();
  };

  const handleEmail = (report) => {
    // In a real app, this would open an email dialog
    console.log('Emailing report:', report);
  };

  const handleShare = (report) => {
    // In a real app, this would open a share dialog
    console.log('Sharing report:', report);
  };

  const getReportTypeColor = (type) => {
    const colors = {
      contributions: 'bg-blue-100 text-blue-800',
      loans: 'bg-purple-100 text-purple-800',
      members: 'bg-green-100 text-green-800',
      financial: 'bg-yellow-100 text-yellow-800',
      meetings: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getFileTypeIcon = (fileType) => {
    const icons = {
      PDF: <FileText className="w-4 h-4" />,
      Excel: <BarChart2 className="w-4 h-4" />,
      Word: <FileText className="w-4 h-4" />,
    };
    return icons[fileType] || <FileText className="w-4 h-4" />;
  };

  return (
    <AppLayout
      isMobile={isMobile}
      sidebarMinimized={sidebarMinimized}
      setSidebarMinimized={setSidebarMinimized}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isAdminRoute={true}
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1">Generate and manage system reports</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowReportFilters(!showReportFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showReportFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showReportFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Reports
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-from"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-to"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setSearchTerm('');
                  setDateRange({ start: '', end: '' });
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // Apply filters
                  console.log('Applying filters:', { searchTerm, dateRange });
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          {getFileTypeIcon(report.fileType)}
                          <span className="ml-1">{report.fileType}</span>
                        </div>
                        <div>
                          {report.fileSize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Generated by <span className="font-medium">{report.generatedBy}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePrint(report)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Print"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEmail(report)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare(report)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminReportsPage;
