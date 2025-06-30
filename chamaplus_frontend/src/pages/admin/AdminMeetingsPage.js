import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminMeetingsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [meetingType, setMeetingType] = useState('physical');
  const [upcomingMeetings, setUpcomingMeetings] = useState([
    {
      id: "1",
      title: "Monthly General Meeting",
      chama: "Mwanzo Chama",
      date: "May 5, 2025",
      time: "10:00 AM",
      location: "Community Hall",
      agenda: ["Review contributions", "Discuss upcoming projects"],
      type: 'physical'
    },
    {
      id: "2",
      title: "Quarterly Strategy Session",
      chama: "Mwanzo Chama",
      date: "May 12, 2025",
      time: "2:00 PM",
      location: "Chama Leader's Home",
      agenda: ["Loan applications review", "Fundraising strategy"],
      type: 'physical'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    meetingLink: '',
    agenda: ''
  });
  
  const defaultChamaName = "Mwanzo Chama"; // Default chama name since admin only controls one chama

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    const newMeeting = {
      id: Date.now().toString(),
      title: formData.title,
      chama: defaultChamaName, // Use the default chama name
      date: formData.date,
      time: formData.time,
      location: meetingType === 'physical' ? formData.location : 'Online',
      meetingLink: meetingType === 'online' ? formData.meetingLink : '',
      agenda: formData.agenda.split('\n').filter(item => item.trim() !== ''),
      type: meetingType
    };
    setUpcomingMeetings(prevMeetings => [...prevMeetings, newMeeting]);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      meetingLink: '',
      agenda: ''
    });
    setShowCreateForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4">
      <div className="flex items-center mb-6">
        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1 sm:mb-2 drop-shadow-lg">Meetings Management</h1>
              <p className="text-sm sm:text-base md:text-lg text-blue-50">Schedule and manage chama meetings</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 sm:mt-0 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-1.5 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 rounded-lg shadow-md sm:shadow-lg flex items-center justify-center text-xs sm:text-sm md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-green-300 whitespace-nowrap"
            >
              <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-2">+</span> Schedule New Meeting
            </button>
          </div>
        </div>

        {/* Create Meeting Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative my-8 mx-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Schedule New Meeting</h2>
              <form onSubmit={handleCreateMeeting} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="E.g., Monthly General Meeting"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Meeting Type</label>
                  <div className="flex items-center justify-center space-x-6">
                    <div 
                      className={`flex-1 text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ${meetingType === 'physical' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'}`}
                      onClick={() => setMeetingType('physical')}
                    >
                      <div className="flex flex-col items-center">
                        <svg className={`w-4 h-4 ${meetingType === 'physical' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className={`text-xs font-medium mt-0.5 ${meetingType === 'physical' ? 'text-blue-700' : 'text-gray-700'}`}>Physical</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex-1 text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ${meetingType === 'online' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'}`}
                      onClick={() => setMeetingType('online')}
                    >
                      <div className="flex flex-col items-center">
                        <svg className={`w-4 h-4 ${meetingType === 'online' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-xs font-medium mt-0.5 ${meetingType === 'online' ? 'text-blue-700' : 'text-gray-700'}`}>Virtual</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`transition-all duration-200 overflow-hidden ${meetingType === 'physical' ? 'max-h-24' : 'max-h-0'}`}>
                  <div className="pt-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter meeting location"
                        required={meetingType === 'physical'}
                      />
                    </div>
                  </div>
                </div>

                <div className={`transition-all duration-200 overflow-hidden ${meetingType === 'online' ? 'max-h-24' : 'max-h-0'}`}>
                  <div className="pt-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleFormChange}
                        className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="https://meet.google.com/abc-xyz-def"
                        required={meetingType === 'online'}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agenda (one per line)</label>
                  <textarea
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="1. Review previous meeting minutes\n2. Discuss new business\n3. Any other business"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Meetings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Meetings</h2>
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {meeting.chama}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {meeting.date} • {meeting.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {meeting.location}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    to={`/admin/meetings/${meeting.id}`}
                    state={{ meeting }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              {meeting.agenda && meeting.agenda.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Agenda:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMeetingsPage;
