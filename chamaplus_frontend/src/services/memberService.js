import api from '../api/api';

// Get all members (admin only)
export const getMembers = async () => {
  try {
    console.log('Fetching members from API...');
    const response = await api.get('/users');
    console.log('Members API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.config?.headers
    });
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch members',
      status: error.response?.status
    };
  }
};

// Create a new member (admin only)
export const createMember = async (memberData) => {
  try {
    console.log('Creating new member with data:', memberData);
    const response = await api.post('/users/register', {
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      role: 'member'
    });
    
    console.log('Member created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating member:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Extract the error message from the response if available
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create member';
    
    throw new Error(errorMessage);
  }
};

// Update member status (admin only)
export const updateMemberStatus = async (userId, isActive) => {
  try {
    const response = await api.put(
      `/users/${userId}/status`,
      { isActive }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating member status:', error);
    throw error.response?.data || { message: 'Failed to update member status' };
  }
};
