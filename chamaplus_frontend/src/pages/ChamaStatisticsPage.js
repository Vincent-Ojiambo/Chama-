import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Users, DollarSign, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function ChamaStatisticsPage() {
  const { chamaId } = useParams();
  const navigate = useNavigate();
  const [chamaData, setChamaData] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const sampleData = {
    monthlyContributions: [
      { month: 'Jan', amount: 2000 },
      { month: 'Feb', amount: 2500 },
      { month: 'Mar', amount: 3000 },
      { month: 'Apr', amount: 2800 },
      { month: 'May', amount: 3200 },
      { month: 'Jun', amount: 3500 },
      { month: 'Jul', amount: 3800 },
      { month: 'Aug', amount: 4000 },
      { month: 'Sep', amount: 4200 },
      { month: 'Oct', amount: 4500 },
      { month: 'Nov', amount: 4800 },
      { month: 'Dec', amount: 5000 },
    ],
    loanStatus: [
      { name: 'Approved', value: 40 },
      { name: 'Pending', value: 30 },
      { name: 'Rejected', value: 20 },
      { name: 'Paid', value: 10 },
    ],
    memberActivity: [
      { name: 'Active', value: 70 },
      { name: 'Inactive', value: 30 },
    ],
    membersList: [
      { name: 'John Doe', role: 'Chairperson', status: 'active', lastActivity: '2 hours ago' },
      { name: 'Jane Smith', role: 'Secretary', status: 'active', lastActivity: '1 day ago' },
      { name: 'Mike Johnson', role: 'Member', status: 'inactive', lastActivity: '1 week ago' },
      { name: 'Sarah Wilson', role: 'Member', status: 'active', lastActivity: '45 minutes ago' },
    ],
    loanHistory: [
      { borrower: 'John Doe', amount: 50000, status: 'paid', dueDate: '2025-05-15' },
      { borrower: 'Jane Smith', amount: 30000, status: 'pending', dueDate: '2025-05-20' },
      { borrower: 'Mike Johnson', amount: 20000, status: 'paid', dueDate: '2025-05-05' },
    ],
    recentActivity: [
      { type: 'contribution', icon: '💰', title: 'Monthly Contribution', description: 'Members have made their monthly contributions', time: 'Just now' },
      { type: 'loan', icon: '💳', title: 'New Loan Request', description: 'Jane Smith requested a loan of KSH 30,000', time: '1 hour ago' },
      { type: 'meeting', icon: '👥', title: 'Monthly Meeting', description: 'Monthly meeting scheduled for tomorrow', time: '2 hours ago' },
    ],
    totalFunds: '2,500,000',
    meetingCount: 12,
    loanCount: 3,
  };

  useEffect(() => {
    setChamaData(sampleData);
  }, []);

  const handleExport = (format) => {
    console.log('Exporting report in', format);
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 px-3 sm:px-4 py-2 sm:py-2.5"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              <span className="text-sm sm:text-base text-white">Back to Dashboard</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{chamaData?.title || 'Chama Statistics'}</h1>
            <p className="text-gray-600 text-lg mt-1">{chamaData?.description}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white/20 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-center mb-6">Chama Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50/20 rounded-lg">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xl font-semibold text-blue-800">KSH {chamaData?.totalFunds || '0'}</p>
              <p className="text-gray-600">Total Funds</p>
            </div>
            <div className="text-center p-4 bg-green-50/20 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-xl font-semibold text-green-800">{chamaData?.members || '0'}</p>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center p-4 bg-purple-50/20 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-xl font-semibold text-purple-800">{chamaData?.meetingCount || '0'}</p>
              <p className="text-gray-600">Meetings</p>
            </div>
            <div className="text-center p-4 bg-yellow-50/20 rounded-lg">
              <FileText className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-xl font-semibold text-yellow-800">{chamaData?.loanCount || '0'}</p>
              <p className="text-gray-600">Active Loans</p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Contributions Chart */}
          <div className="bg-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">Monthly Contributions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chamaData?.monthlyContributions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Status Pie Chart */}
          <div className="bg-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">Loan Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chamaData?.loanStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chamaData?.loanStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Member Activity Chart */}
          <div className="bg-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">Member Activity</h2>
            <div className="grid grid-cols-1 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={chamaData?.memberActivity}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Member Activity"
                    dataKey="value"
                    stroke="#0088FE"
                    fill="#0088FE"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chamaData?.membersList?.map((member, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'active' ? 'bg-green-100 text-green-800' :
                            member.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Loan History */}
          <div className="bg-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">Loan History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chamaData?.loanHistory?.map((loan, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.borrower}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSH {loan.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.status === 'paid' ? 'bg-green-100 text-green-800' :
                          loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {chamaData?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'contribution' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'loan' ? 'bg-green-100 text-green-600' :
                      activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/20 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4 text-center">Export Options</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export as Excel
                </button>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChamaStatisticsPage;
