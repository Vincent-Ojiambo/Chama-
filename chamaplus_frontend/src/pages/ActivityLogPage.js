import React from 'react';
import { Clock, User, CreditCard, FileText, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityLogPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = React.useState([
    {
      id: 1,
      type: 'contribution',
      amount: 5000,
      date: '2025-05-07 14:30',
      description: 'Monthly contribution processed',
      category: 'success',
      icon: <TrendingUp className="w-4 h-4 text-green-500" />
    },
    {
      id: 2,
      type: 'meeting',
      date: '2025-05-06 19:00',
      description: 'Weekly meeting attended',
      category: 'info',
      icon: <Clock className="w-4 h-4 text-blue-500" />
    },
    {
      id: 3,
      type: 'loan',
      amount: 100000,
      date: '2025-05-05 10:45',
      description: 'Loan application approved',
      category: 'success',
      icon: <CreditCard className="w-4 h-4 text-green-500" />
    },
    {
      id: 4,
      type: 'member',
      date: '2025-05-04 15:30',
      description: 'New member joined: John Doe',
      category: 'info',
      icon: <User className="w-4 h-4 text-blue-500" />
    },
    {
      id: 5,
      type: 'report',
      date: '2025-05-01 08:00',
      description: 'Monthly report generated',
      category: 'info',
      icon: <FileText className="w-4 h-4 text-blue-500" />
    },
    {
      id: 6,
      type: 'contribution',
      amount: 2500,
      date: '2025-05-01 14:30',
      description: 'Additional contribution',
      category: 'success',
      icon: <TrendingUp className="w-4 h-4 text-green-500" />
    },
    {
      id: 7,
      type: 'withdrawal',
      amount: 10000,
      date: '2025-05-01 12:00',
      description: 'Emergency withdrawal',
      category: 'warning',
      icon: <TrendingDown className="w-4 h-4 text-yellow-500" />
    }
  ]);

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filterActivities = (category) => {
    setSelectedCategory(category);
  };

  const filteredActivities = activities.filter((activity) => {
    if (selectedCategory === 'all') return true;
    return activity.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => filterActivities('all')}
              className={`px-3 py-1 rounded-lg ${
                selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => filterActivities('success')}
              className={`px-3 py-1 rounded-lg ${
                selectedCategory === 'success' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => filterActivities('info')}
              className={`px-3 py-1 rounded-lg ${
                selectedCategory === 'info' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => filterActivities('warning')}
              className={`px-3 py-1 rounded-lg ${
                selectedCategory === 'warning' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              Warning
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start p-4 rounded-lg ${
                activity.category === 'success' ? 'bg-green-50' :
                activity.category === 'warning' ? 'bg-yellow-50' :
                'bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {activity.icon}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </h3>
                    {activity.amount && (
                      <p className="mt-1 text-sm text-gray-500">
                        {activity.category === 'withdrawal' ? '-' : '+'}
                        KSH {activity.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
