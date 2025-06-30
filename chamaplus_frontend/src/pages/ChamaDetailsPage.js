import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  FiUsers, FiDollarSign, FiCalendar, 
  FiUserPlus, FiUserX, FiDollarSign as FiDollar 
} from "react-icons/fi";

function ChamaDetailsPage({ hidePersonal }) {
  const location = useLocation();
  const chama = location.state?.chama;
  const navigate = useNavigate();

  // Initialize all state at the top level
  const [isMember, setIsMember] = React.useState(chama?.role !== 'Guest');
  const [members, setMembers] = React.useState(chama?.members || 0);
  const [totalFunds, setTotalFunds] = React.useState(
    typeof chama?.totalFunds === 'string' ? parseFloat(chama.totalFunds.replace(/[^\d.]/g, '')) : chama?.totalFunds || 0
  );
  const [contribution, setContribution] = React.useState(
    typeof chama?.contribution === 'string' ? parseFloat(chama.contribution.replace(/[^\d.]/g, '')) : chama?.contribution || 0
  );
  const userContribution = React.useRef(contribution);
  const [showJoinForm, setShowJoinForm] = React.useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Transaction and event form states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'meeting',
    location: ''
  });
  const [transactionForm, setTransactionForm] = useState({
    type: 'contribution',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'contribution', amount: 5000, description: 'Monthly contribution', date: '2023-06-15', status: 'completed' },
    { id: 2, type: 'withdrawal', amount: 2000, description: 'Emergency fund', date: '2023-06-10', status: 'completed' },
  ]);
  const [joinDetails, setJoinDetails] = useState({
    name: '',
    gender: '',
    age: '',
    county: '',
    subcounty: '',
    village: '',
    role: 'Member',
  });
  
  // Sample data for charts and recent activities
  const [recentActivities] = useState([
    { id: 1, type: 'contribution', amount: 5000, member: 'John Doe', date: '2023-06-15' },
    { id: 2, type: 'withdrawal', amount: 2000, member: 'Jane Smith', date: '2023-06-14' },
    { id: 3, type: 'meeting', title: 'Monthly Meeting', date: '2023-06-10' },
  ]);
  
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Quarterly Meeting', date: '2023-07-01', type: 'meeting', description: 'Monthly chama meeting to discuss finances and projects' },
    { id: 2, title: 'Contribution Deadline', date: '2023-07-05', type: 'reminder', description: 'Last day to submit monthly contributions' },
    { id: 3, title: 'Team Building', date: '2023-07-15', type: 'event', description: 'Annual team building retreat' },
  ]);

  // If chama is not passed, show a fallback (could fetch by ID in a real app)
  if (!chama) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Chama not found</h1>
          <p className="mt-2 text-gray-600">The requested chama could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/my-chamas");
  };

  const handleJoin = () => {
    setShowJoinForm(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setIsMember(true);
    setMembers((prev) => prev + 1);
    setTotalFunds((prev) => prev + userContribution.current);
    setContribution(userContribution.current);
    // Add user details to memberList (simulate update)
    if (Array.isArray(chama.memberList)) {
      chama.memberList.push({ ...joinDetails });
    }
    setShowJoinForm(false);
    // In a real app, here you would call an API to join the chama
  };

  const handleJoinChange = (e) => {
    const { name, value } = e.target;
    setJoinDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeave = () => {
    setIsMember(false);
    setMembers((prev) => (prev > 0 ? prev - 1 : 0));
    setTotalFunds((prev) => (prev - userContribution.current >= 0 ? prev - userContribution.current : 0));
    setContribution(0);
    // In a real app, here you would call an API to leave the chama
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      id: Date.now(),
      ...transactionForm,
      status: 'completed',
      amount: parseFloat(transactionForm.amount) || 0
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update total funds based on transaction type
    if (newTransaction.type === 'contribution') {
      setTotalFunds(prev => prev + newTransaction.amount);
    } else {
      setTotalFunds(prev => prev - newTransaction.amount);
    }
    
    // Reset form and close modal
    setTransactionForm({
      type: 'contribution',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowTransactionForm(false);
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      date: eventForm.date
    };

    setUpcomingEvents(prev => [newEvent, ...prev]);
    
    // Reset form and close modal
    setEventForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'meeting',
      location: ''
    });
    setShowEventForm(false);
  };

  // Sort members: Admin, Chairperson, Treasurer, Secretary, then Members (others)
  const sortRoles = ["Admin", "Chairperson", "Treasurer", "Secretary", "Member"];
  const sortedMembers = Array.isArray(chama.memberList)
    ? [...chama.memberList].sort((a, b) => {
        const aIdx = sortRoles.indexOf(a.role);
        const bIdx = sortRoles.indexOf(b.role);
        // If both roles are found, sort by index
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        // If only one role is found, put it first
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        // Otherwise, sort alphabetically by role
        return a.role.localeCompare(b.role);
      })
    : [];

  // Use the chama's statistics object
  const chamaStats = chama.statistics || {
    totalContributions: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    activeMembers: 1,
    pendingMembers: 0,
    totalMeetings: 0,
    averageAttendance: 100,
    currentBalance: 0,
    lastContributionDate: chama.created,
    lastMeetingDate: chama.created
  };

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <FiUsers className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Members</p>
                    <h3 className="text-2xl font-bold">{members}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <FiDollarSign className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Funds</p>
                    <h3 className="text-2xl font-bold">KSH {totalFunds.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <FiCalendar className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Event</p>
                    <h3 className="text-lg font-bold">
                      {upcomingEvents[0]?.title || 'No upcoming events'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activities</h3>
                <button className="text-blue-600 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${activity.type === 'contribution' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} mr-3`}>
                      {activity.type === 'contribution' ? <FiDollar className="text-lg" /> : <FiCalendar className="text-lg" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.type === 'contribution' 
                          ? `New contribution of KSH ${activity.amount}`
                          : activity.type === 'withdrawal'
                          ? `Withdrawal of KSH ${activity.amount}`
                          : activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.member ? `By ${activity.member} • ` : ''}
                        {activity.date}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">2h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'members':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Members ({members})</h3>
              <button 
                onClick={() => setShowJoinForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
              >
                <FiUserPlus className="mr-2" /> Add Member
              </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                            member.role === 'Treasurer' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h4>
                <p className="text-2xl font-bold">KSH {totalFunds.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Contributions</h4>
                <p className="text-2xl font-bold">KSH {chamaStats.totalContributions.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Withdrawals</h4>
                <p className="text-2xl font-bold">KSH {chamaStats.totalWithdrawals.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <button 
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  New Transaction
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{transaction.description || 'No description'}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.type}</td>
                        <td 
                          className={`px-6 py-4 whitespace-nowrap font-medium ${
                            transaction.type === 'contribution' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'contribution' ? '+' : '-'} KSH {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No transactions found. Add your first transaction.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button 
                onClick={() => setShowEventForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
              >
                <FiCalendar className="mr-2" /> New Event
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                      <p className="text-gray-500 text-sm mb-3">{event.date}</p>
                      <p className="text-gray-600 text-sm">{event.description || 'No description provided.'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'reminder' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button className="text-blue-600 text-sm font-medium">View Details</button>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      ))}
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">+5</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/my-chamas" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Chamas
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{chama.name}</h1>
              <p className="text-gray-600 mt-1">{chama.description || 'No description provided.'}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {isMember ? chama.role : 'Guest'}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {members} Members
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  KSH {totalFunds.toLocaleString()} Total
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {isMember ? (
                <button 
                  onClick={handleLeave}
                  className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg font-medium flex items-center text-sm"
                >
                  <FiUserX className="mr-2" /> Leave Chama
                </button>
              ) : (
                <button 
                  onClick={handleJoin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center text-sm"
                >
                  <FiUserPlus className="mr-2" /> Join Chama
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['overview', 'members', 'finance', 'events'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleBack} 
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
          >
            Back to My Chamas
          </button>
        </div>
        {/* Join Chama Modal/Form */}
        {showJoinForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4" onSubmit={handleJoinSubmit}>
              <h2 className="text-xl font-bold mb-4 text-blue-800">Join Chama</h2>
              <div className="grid grid-cols-1 gap-4">
                <input name="name" value={joinDetails.name} onChange={handleJoinChange} required placeholder="Full Name" className="border rounded px-3 py-2 w-full" />
                <select name="gender" value={joinDetails.gender} onChange={handleJoinChange} required className="border rounded px-3 py-2 w-full">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input name="age" value={joinDetails.age} onChange={handleJoinChange} required type="number" min="18" placeholder="Age" className="border rounded px-3 py-2 w-full" />
                <input name="county" value={joinDetails.county} onChange={handleJoinChange} required placeholder="County of Birth" className="border rounded px-3 py-2 w-full" />
                <input name="subcounty" value={joinDetails.subcounty} onChange={handleJoinChange} required placeholder="Subcounty" className="border rounded px-3 py-2 w-full" />
                <input name="village" value={joinDetails.village} onChange={handleJoinChange} required placeholder="Village" className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowJoinForm(false)}>Cancel</button>
                <button type="submit" className="px-6 py-2 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:from-green-600 hover:to-blue-600">Join</button>
              </div>
            </form>
          </div>
        )}

        {/* New Transaction Modal/Form */}
        {showTransactionForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4" onSubmit={handleTransactionSubmit}>
              <h2 className="text-xl font-bold mb-4 text-blue-800">New Transaction</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    name="type" 
                    value={transactionForm.type} 
                    onChange={handleTransactionChange} 
                    required 
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="contribution">Contribution</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KSH)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={transactionForm.amount} 
                    onChange={handleTransactionChange} 
                    required 
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={transactionForm.description} 
                    onChange={handleTransactionChange} 
                    required 
                    placeholder="Enter description"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={transactionForm.date} 
                    onChange={handleTransactionChange} 
                    required 
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowTransactionForm(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:from-green-600 hover:to-blue-600"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* New Event Modal/Form */}
        {showEventForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4" onSubmit={handleEventSubmit}>
              <h2 className="text-xl font-bold mb-4 text-blue-800">Create New Event</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={eventForm.title} 
                    onChange={handleEventChange} 
                    required 
                    placeholder="Enter event title"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select 
                    name="type" 
                    value={eventForm.type} 
                    onChange={handleEventChange} 
                    required 
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={eventForm.date} 
                    onChange={handleEventChange} 
                    required 
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={eventForm.location} 
                    onChange={handleEventChange} 
                    placeholder="Enter location"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={eventForm.description} 
                    onChange={handleEventChange} 
                    rows="3"
                    placeholder="Enter event description"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:from-green-600 hover:to-blue-600"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChamaDetailsPage;
