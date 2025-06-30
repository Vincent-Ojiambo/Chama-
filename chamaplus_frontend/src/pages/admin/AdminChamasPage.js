import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Edit, 
  Home,
  Users as MembersIcon,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminChamasPage = () => {
  const [chama, setChama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch admin's chama from API
  useEffect(() => {
    const fetchChama = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/chamas/my-chama', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch chama');
        }
        
        const responseData = await response.json();
        console.log('Chama data from API:', responseData); // Debug log
        
        // Check if response has data property
        const chamaData = responseData.data || responseData;
        
        if (!chamaData) {
          throw new Error('No chama data received from server');
        }
        
        if (!chamaData.name) {
          console.error('Chama name is missing in the response data:', chamaData);
        } else {
          console.log('Chama name found:', chamaData.name);
        }
        
        setChama(chamaData);
      } catch (error) {
        console.error('Error fetching chama:', error);
        toast.error('Failed to load chama');
      } finally {
        setLoading(false);
      }
    };

    fetchChama();
  }, []);

  // Handle chama deletion
  const handleDeleteChama = async () => {
    if (!chama) return;
    
    if (window.confirm('Are you sure you want to delete this chama? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`http://localhost:5000/api/chamas/${chama._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete chama');
        }

        toast.success('Chama deleted successfully');
        // Redirect to chama creation or dashboard
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('Error deleting chama:', error);
        toast.error('Failed to delete chama');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!chama) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Chama Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don't have a chama yet. Create a new chama to get started with managing your group's finances and activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/admin/chamas/new')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create New Chama
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{chama.name}</h1>
          <p className="text-gray-600">Manage your chama details and settings</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => navigate(`/admin/chamas/${chama._id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Chama
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Home className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{chama.name}</h2>
              <p className="mt-1 text-gray-600">{chama.description || 'No description provided'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  chama.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {chama.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {chama.members?.length || 0} Members
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Created: {new Date(chama.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <MembersIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Members</h3>
                  <p className="text-2xl font-bold">{chama.members?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Contributions</h3>
                  <p className="text-2xl font-bold">KSh {chama.totalContributions?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Next Meeting</h3>
                  <p className="text-lg font-medium">
                    {chama.nextMeeting 
                      ? new Date(chama.nextMeeting).toLocaleDateString() 
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chama Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Chama ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{chama._id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created On</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(chama.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      chama.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {chama.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Members</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {chama.members?.length || 0} members
                  </p>
                </div>
              </div>
              
              {chama.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {chama.notes}
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/admin/chamas/${chama._id}/edit`)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleDeleteChama}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Chama'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChamasPage;
