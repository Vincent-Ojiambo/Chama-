import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function MeetingDetailsPage({ isAdmin = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const meeting = location.state?.meeting;

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-gray-600">No Meeting selected.</div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(isAdmin ? '/admin/meetings' : '/meetings');
  };

  const handleJoinMeeting = () => {
    if (meeting.meetingLink) {
      // If it's a full URL, open directly, otherwise assume it's a meeting ID
      if (meeting.meetingLink.startsWith('http')) {
        window.open(meeting.meetingLink, '_blank');
      } else {
        // Handle meeting ID (e.g., for Zoom, Google Meet, etc.)
        // You can add specific handling for different meeting platforms here
        window.open(`https://meet.google.com/${meeting.meetingLink}`, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-800">Meeting Details</h1>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Meetings
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Meeting Overview</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Chama:</p>
                <p className="font-semibold text-gray-800 mt-1">{meeting.chama}</p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-semibold text-gray-800 mt-1">{meeting.date}</p>
              </div>
              <div>
                <p className="text-gray-600">Time:</p>
                <p className="font-semibold text-gray-800 mt-1">{meeting.time}</p>
              </div>
              <div>
                <p className="text-gray-600">Type:</p>
                <p className="font-semibold text-gray-800 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    meeting.type === 'physical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {meeting.type === 'physical' ? 'Physical' : 'Virtual'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {meeting.type === 'physical' && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
              <div className="mt-4">
                <p className="text-gray-600">Location:</p>
                <p className="font-semibold text-gray-800 mt-1">{meeting.location}</p>
              </div>
            </div>
          )}

          {meeting.type === 'online' && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Virtual Meeting Details</h2>
              <div className="mt-4">
                <p className="text-gray-600">Meeting Link:</p>
                <p className="font-semibold text-gray-800 mt-1 break-all">{meeting.meetingLink}</p>
                <button
                  onClick={handleJoinMeeting}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                >
                  Join Meeting
                </button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Agenda</h2>
            <div className="mt-4 space-y-3">
              {meeting.agenda.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-blue-500">•</span>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailsPage;
