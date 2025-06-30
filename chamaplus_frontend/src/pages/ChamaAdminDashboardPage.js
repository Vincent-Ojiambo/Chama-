import React, { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  RefreshCw, 
  UserPlus, 
  FileText, 
  Calendar, 
  CheckCircle,
  Plus,
  Clock as Clock3,
  TrendingUp
} from 'lucide-react';
import QuickStatsCard from "../components/QuickStatsCard";
import SearchBar from "../components/SearchBar";
import ChartWidget from "../components/ChartWidget";
import ActivityFeed from "../components/ActivityFeed";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Error Boundary Component
const DashboardErrorBoundary = ({ children }) => (
  <ErrorBoundary 
    fallback={
      <div className="p-6 text-center">
        <h2 className="text-lg font-medium text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We're having trouble loading the dashboard. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh Dashboard
        </button>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

const ChamaAdminDashboardPage = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    activities: [],
    chartData: [],
    recentTransactions: [],
    pendingApprovals: 0,
    quickStats: {}
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          stats: [
            { 
              label: 'Total Members', 
              value: '42', 
              change: '+5',
              icon: <Users className="w-6 h-6 text-blue-500" />,
              color: 'blue',
              trend: 'up',
              trendValue: '12%',
              trendLabel: 'from last month'
            },
            { 
              label: 'Total Balance', 
              value: 'KES 2,850,000', 
              change: '+KES 245,000',
              icon: <DollarSign className="w-6 h-6 text-green-500" />,
              color: 'green',
              trend: 'up',
              trendValue: '8.5%',
              trendLabel: 'from last month'
            },
            { 
              label: 'Active Loans', 
              value: '8', 
              change: '-2',
              icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
              color: 'purple',
              trend: 'down',
              trendValue: '20%',
              trendLabel: 'from last month'
            },
            { 
              label: 'Pending Approvals', 
              value: '5', 
              change: '+3',
              icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
              color: 'yellow',
              trend: 'up',
              trendValue: '150%',
              trendLabel: 'from last week'
            },
            { 
              label: 'This Month\'s Savings', 
              value: 'KES 450,000', 
              change: '+KES 50,000',
              icon: <DollarSign className="w-6 h-6 text-teal-500" />,
              color: 'teal',
              trend: 'up',
              trendValue: '12.5%',
              trendLabel: 'from last month'
            },
            { 
              label: 'Upcoming Meetings', 
              value: '3', 
              change: '0',
              icon: <Calendar className="w-6 h-6 text-indigo-500" />,
              color: 'indigo',
              trend: 'same',
              trendValue: '0',
              trendLabel: 'no change'
            }
          ],
          activities: [
            {
              id: 1,
              user: { name: 'Grace Mwangi', avatar: 'GM' },
              action: 'made a contribution of',
              amount: 10000,
              date: new Date(),
              type: 'contribution',
              status: 'completed'
            },
            {
              id: 2,
              user: { name: 'John Doe', avatar: 'JD' },
              action: 'requested a loan of',
              amount: 50000,
              date: new Date(Date.now() - 3600000 * 2),
              type: 'loan',
              status: 'pending'
            },
            {
              id: 3,
              user: { name: 'Mary Wangari', avatar: 'MW' },
              action: 'attended the monthly meeting',
              date: new Date(Date.now() - 86400000),
              type: 'meeting',
              status: 'completed'
            },
            {
              id: 4,
              user: { name: 'James Kariuki', avatar: 'JK' },
              action: 'paid loan installment of',
              amount: 15000,
              date: new Date(Date.now() - 172800000),
              type: 'payment',
              status: 'completed'
            },
          ],
          recentTransactions: [
            {
              id: 1,
              user: 'Grace Mwangi',
              type: 'Contribution',
              amount: 10000,
              date: new Date(),
              status: 'completed'
            },
            {
              id: 2,
              user: 'John Doe',
              type: 'Loan Request',
              amount: 50000,
              date: new Date(Date.now() - 3600000 * 2),
              status: 'pending'
            },
            {
              id: 3,
              user: 'James Kariuki',
              type: 'Loan Payment',
              amount: 15000,
              date: new Date(Date.now() - 86400000),
              status: 'completed'
            },
            {
              id: 4,
              user: 'Sarah Wanjiku',
              type: 'Contribution',
              amount: 8000,
              date: new Date(Date.now() - 86400000 * 2),
              status: 'completed'
            }
          ],
          pendingApprovals: 5,
          quickStats: {
            totalContributions: 'KES 1,250,000',
            totalLoans: 'KES 2,450,000',
            monthlySavings: 'KES 450,000',
            attendanceRate: '85%'
          },
          chartData: [
            { month: 'Jan', amount: 40000 },
            { month: 'Feb', amount: 35000 },
            { month: 'Mar', amount: 45000 },
            { month: 'Apr', amount: 50000 },
            { month: 'May', amount: 55000 },
            { month: 'Jun', amount: 60000 },
          ]
        };
        
        setDashboardData(mockData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <DashboardErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      </DashboardErrorBoundary>
    );
  }

  const { stats, activities, chartData, recentTransactions, pendingApprovals } = dashboardData;



  // Quick actions
  const quickActions = [
    { 
      id: 'addMember', 
      label: 'Add Member', 
      icon: <UserPlus className="w-5 h-5" />,
      color: 'blue',
      action: () => console.log('Add member')
    },
    { 
      id: 'recordPayment', 
      label: 'Record Payment', 
      icon: <DollarSign className="w-5 h-5" />,
      color: 'green',
      action: () => console.log('Record payment')
    },
    { 
      id: 'approveRequest', 
      label: 'Approve Requests', 
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'yellow',
      badge: pendingApprovals,
      action: () => console.log('Approve requests')
    },
    { 
      id: 'generateReport', 
      label: 'Generate Report', 
      icon: <FileText className="w-5 h-5" />,
      color: 'purple',
      action: () => console.log('Generate report')
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-slate-50 px-6 pb-6">
        {/* Refresh Button */}
        <button 
          onClick={handleRefresh}
          className="fixed bottom-6 right-6 z-50 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Refresh dashboard"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 pt-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your chama.</p>
            </div>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search activities..."
              className="w-full md:w-96"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="font-semibold text-lg text-blue-600 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all`}
                  >
                    <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-600 group-hover:bg-${action.color}-200 transition-colors`}>
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      {action.badge && (
                        <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <QuickStatsCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                trendLabel={stat.trendLabel}
              />
            ))}
          </div>
          
          {/* Charts and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ChartWidget 
                title="Monthly Contributions"
                data={chartData}
                xKey="month"
                yKey="amount"
                color="#4f46e5"
                type="line"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                  <button 
                    onClick={handleRefresh}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Refresh activities"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto max-h-96">
                  <ActivityFeed 
                    activities={activities.filter(activity => 
                      activity.user.name.toLowerCase().includes(search.toLowerCase()) ||
                      activity.action.toLowerCase().includes(search.toLowerCase())
                    )} 
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all activity
                </button>
              </div>
            </div>
          </div>
        
        {/* Group Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-4">
            <h2 className="font-semibold text-lg text-blue-600">Group Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chama Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="Umoja Investment Group"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Schedule</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option selected>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Amount (KES)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="5000"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow">
            <div className="p-6">
              <h2 className="font-semibold text-lg text-blue-600 mb-4 flex items-center">
                <span>Recent Transactions</span>
                <span className="ml-auto text-sm text-blue-500">View All</span>
              </h2>
              <div className="space-y-4">
                {recentTransactions.slice(0, 4).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        txn.type.includes('Contribution') ? 'bg-green-100 text-green-600' : 
                        txn.type.includes('Loan') ? 'bg-blue-100 text-blue-600' : 
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {txn.type.includes('Contribution') ? (
                          <Plus className="w-4 h-4" />
                        ) : txn.type.includes('Loan') ? (
                          <DollarSign className="w-4 h-4" />
                        ) : (
                          <Clock3 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{txn.user}</p>
                        <p className="text-xs text-gray-500">{formatDate(txn.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        txn.type.includes('Payment') ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {formatCurrency(txn.amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
          {/* Additional content can be added here in the future */}
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default ChamaAdminDashboardPage;
