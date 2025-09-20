import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../App';
import {
  Briefcase,
  Wallet,
  Calendar,
  Users,
  Coins,
  PlusCircle,
  DollarSign,
  BarChart2,
} from "lucide-react";
import StatCard from "../components/StatCard"; // Adjust path if needed

function DashboardPage() {
  const { currentUser: authUser } = useAuth();
  const overviewStats = [
    { icon: <Briefcase />, title: "Active Chamas", value: "3" },
    { icon: <Users />, title: "Total Members", value: "35" },
    { icon: <Coins />, title: "Total Funds", value: "KSH 25,000" },
    { icon: <Calendar />, title: "Upcoming Meetings", value: "2" },
  ];

  const recentActivities = [
    {
      type: "Contribution Received",
      details: "Mwanzo Chama - KSH 2,000",
      time: "Today",
    },
    {
      type: "Loan Approved",
      details: "Ujenzi Chama - KSH 15,000",
      time: "Yesterday",
    },
    {
      type: "Meeting Scheduled",
      details: "Mwanzo Chama - May 5, 2025",
      time: "2 days ago",
    },
  ];


  const chamaStats = [
    { id: 1, title: "Mwanzo Chama", totalFunds: "KSH 145,000", members: "12", description: "This is a savings group.", created: "January 1, 2022" },
    { id: 2, title: "Ujenzi Chama", totalFunds: "KSH 98,000", members: "8", description: "This is a construction group.", created: "June 15, 2023" },
    { id: 3, title: "Savings Group C", totalFunds: "KSH 62,000", members: "15", description: "", created: "N/A" },
  ];

  const navigate = useNavigate();

  // Navigation for quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case "Create New Chama":
        navigate("/admin/chamas/new");
        break;
      case "View My Chamas":
        navigate("/my-chamas");
        break;
      case "Apply for a Loan":
        navigate("/loans");
        break;
      case "Schedule Meeting":
        navigate("/meetings");
        break;
      case "View Statistics":
        navigate("/statistics");
        break;
      default:
        break;
    }
  };

  // Check if user has admin role to show Create New Chama action
  const quickActions = [
    ...(authUser?.role === 'admin' ? [{
      label: "Create New Chama",
      icon: <PlusCircle />,
    }] : []),
    {
      label: "View My Chamas",
      icon: <Briefcase />,
    },
    {
      label: "Apply for a Loan",
      icon: <DollarSign />,
    },
    {
      label: "Schedule Meeting",
      icon: <Calendar />,
    },
    {
      label: "View Statistics",
      icon: <BarChart2 />,
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100">
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 pt-20 space-y-10">
        {/* Hero Welcome Section */}
        <div 
          className="rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between mb-6 relative overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.7), rgba(67, 56, 202, 0.7)), url(/Assets/background_img.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '220px'
          }}
        >
          <div className="z-10 flex-1 w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Welcome back Member!</h1>
            <p className="text-lg text-blue-50 mb-4 md:mb-0">Empowering your Chama journey, one step at a time.</p>
          </div>
          {/* Decorative element */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full z-0" />
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {overviewStats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow group relative overflow-hidden cursor-pointer"
              onClick={() => {
                if (stat.title === 'Active Chamas') {
                  navigate('/my-chamas');
                } else if (stat.title === 'Total Members') {
                  navigate('/my-chamas');
                } else if (stat.title === 'Total Funds') {
                  navigate('/contributions');
                } else if (stat.title === 'Upcoming Meetings') {
                  navigate('/meetings');
                }
              }}
            >
              <div className="mb-3 p-3 rounded-full bg-gradient-to-tr from-green-300 via-blue-200 to-purple-200 group-hover:scale-110 transition-transform">
                <span className="text-green-700 text-2xl">{stat.icon}</span>
              </div>
              <div className="font-semibold text-lg text-gray-800">{stat.title}</div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-1">{stat.value}</div>
              <div className="absolute right-0 bottom-0 w-10 h-10 bg-white/20 rounded-tl-full z-0" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.label)}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 hover:from-blue-100 hover:via-green-100 hover:to-purple-100 rounded-xl p-4 sm:p-6 transition-all shadow group focus:outline-none focus:ring-2 focus:ring-blue-300 hover:scale-105"
                aria-label={action.label}
              >
                <span className="text-blue-600 mb-2 group-hover:scale-125 transition-transform text-3xl">{action.icon}</span>
                <span className="text-base font-semibold text-gray-800 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities Section with Background */}
        <div 
          className="relative rounded-2xl shadow-lg overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.4), rgba(67, 56, 202, 0.4)), url(/chama_group.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '500px',
            backgroundBlendMode: 'multiply'
          }}
        >
          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold mb-6 text-white drop-shadow">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 group relative cursor-pointer"
                onClick={() => {
                  if (activity.type === 'Contribution Received') {
                    navigate('/contributions');
                  } else if (activity.type === 'Loan Approved') {
                    navigate('/loans');
                  } else if (activity.type === 'Meeting Scheduled') {
                    navigate('/meetings');
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Activity Type Badge */}
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                      {activity.type === 'Contribution Received' && <Coins className="text-blue-200 w-6 h-6" />}
                      {activity.type === 'Loan Approved' && <DollarSign className="text-green-200 w-6 h-6" />}
                      {activity.type === 'Meeting Scheduled' && <Calendar className="text-purple-200 w-6 h-6" />}
                      {activity.type === 'New Member Joined' && <Users className="text-yellow-200 w-6 h-6" />}
                    </div>
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-white drop-shadow-lg">{activity.type}</span>
                      {i === 0 && (
                        <span className="bg-white/90 text-green-700 text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-md">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-blue-50 text-sm italic font-medium mb-3">{activity.details}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-100">
                      <span className="bg-white/20 px-3 py-1.5 rounded-full">{activity.time}</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/50">{activity.type === 'Contribution Received' ? 'Income' : 
                                                     activity.type === 'Loan Approved' ? 'Finance' : 
                                                     activity.type === 'Meeting Scheduled' ? 'Event' : 
                                                     'Member'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Activity Actions */}
                <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-blue-200 hover:text-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="text-blue-200 hover:text-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          </div>
          
          {/* View All Button */}
          <div className="relative z-10 flex justify-center mt-8 pb-4">
            <Link
              to="/activities"
              className="relative bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white font-extrabold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-2xl flex items-center text-sm sm:text-base transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 hover:scale-105 hover:shadow-3xl border-2 border-white/60 group overflow-hidden"
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 17l4 4 4-4m0-5V3m0 0H4m16 0h-4' /></svg>
              View All Activities
            </Link>
          </div>
        </div>

        {/* Chama Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Chama Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamaStats.map((chama, index) => (
              <div key={index} className="border border-blue-100 rounded-xl p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 shadow hover:shadow-lg transition-shadow flex flex-col items-start">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
                  <Briefcase className="text-blue-400" /> {chama.title}
                </h3>
                {/* Match description and date with user's MyChamasPage data if available */}
                {(() => {
                  const myChamas = JSON.parse(localStorage.getItem('myChamas') || '[]');
                  const match = myChamas.find(c => c.name === chama.title);
                  return (
                    <>
                      <p className="text-gray-600 text-xs mb-1">Description: <span className="font-normal">{(match && match.description) || chama.description || "No description provided."}</span></p>
                      <p className="text-gray-500 text-xs mb-2">Date of Creation: {(match && match.created) || chama.created || "N/A"}</p>
                    </>
                  );
                })()}
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">Members: {chama.members}</span>
                <p className="text-gray-600 text-sm mb-4">Total Funds: <span className="font-bold text-blue-700">{chama.totalFunds}</span></p>
                <Link 
                  to={`/chama-statistics/${chama.id}`}
                  className="mt-auto text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all flex items-center gap-2"
                >
                  <span>View Statistics</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
