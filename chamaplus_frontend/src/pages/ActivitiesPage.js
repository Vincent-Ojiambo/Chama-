import React from 'react';
import {
  Coins,
  DollarSign,
  Calendar,
  Users,
  ChevronRight,
  Filter,
  Clock,
  Users2,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ActivitiesPage() {
  const navigate = useNavigate();
  // Sample activities data - this should be fetched from your backend
  const activities = [
    {
      id: 1,
      type: "Contribution Received",
      details: "Mwanzo Chama - KSH 2,000",
      time: "Today",
      category: "Income",
      amount: "KSH 2,000",
      chama: "Mwanzo Chama",
      member: "John Doe",
      status: "Completed",
    },
    {
      id: 2,
      type: "Loan Approved",
      details: "Ujenzi Chama - KSH 15,000",
      time: "Yesterday",
      category: "Finance",
      amount: "KSH 15,000",
      chama: "Ujenzi Chama",
      member: "Jane Smith",
      status: "Pending",
    },
    {
      id: 3,
      type: "Meeting Scheduled",
      details: "Mwanzo Chama - May 5, 2025",
      time: "2 days ago",
      category: "Event",
      chama: "Mwanzo Chama",
      location: "Online",
      status: "Upcoming",
    },
    // Add more sample activities as needed
  ];

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter activities based on category
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.chama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.member.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && activity.category.toLowerCase() === filter;
  });

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'Contribution Received':
        return <Coins className="text-blue-500 w-5 h-5" />;
      case 'Loan Approved':
        return <DollarSign className="text-green-500 w-5 h-5" />;
      case 'Meeting Scheduled':
        return <Calendar className="text-purple-500 w-5 h-5" />;
      default:
        return <Users className="text-yellow-500 w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-4 sm:p-6 flex items-center justify-between shadow-lg sticky top-24 z-10">
          <div className="flex-1 hidden sm:block">
            <h1 className="text-2xl font-bold text-gray-900">All Activities</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 px-3 sm:px-4 py-2 sm:py-2.5"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              <span className="text-sm sm:text-base text-white">Back</span>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/20 text-gray-900 placeholder-gray-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/20 text-gray-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="income">Income</option>
              <option value="finance">Finance</option>
              <option value="event">Events</option>
              <option value="member">Members</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white/20 rounded-xl p-6 hover:bg-white/30 transition-colors duration-300 group relative shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Activity Type Badge */}
                <div className="flex flex-col justify-center items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                {/* Activity Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">{activity.type}</span>
                      {activity.status === 'New' && (
                        <span className="bg-white/90 text-green-700 text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-md">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-700 bg-white/20 px-3 py-1.5 rounded-full">
                      {activity.time}
                    </span>
                  </div>
                  
                  {/* Chama and Amount */}
                  <div className="mt-2 flex items-center gap-6">
                    {activity.chama && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{activity.chama}</span>
                      </div>
                    )}
                    {activity.amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 space-y-2">
                    <p className="text-gray-700 text-sm italic font-medium">{activity.details}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <Users2 className="w-4 h-4" />
                        {activity.member}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {activity.time}
                      </span>
                      {activity.amount && (
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {activity.amount}
                        </span>
                      )}
                      {activity.location && (
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {activity.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'Completed' ? 'bg-green-500/30 text-green-700' :
                  activity.status === 'Pending' ? 'bg-yellow-500/30 text-yellow-700' :
                  activity.status === 'Upcoming' ? 'bg-blue-500/30 text-blue-700' :
                  'bg-gray-500/30 text-gray-700'
                }`}>
                  {activity.status}
                </span>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={() => {
                    // Add your view details logic here
                    console.log('Viewing details for activity:', activity);
                  }}
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (if needed) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Previous
          </button>
          <span className="text-gray-700">1-10 of 50</span>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesPage;
