import React from "react";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h2 className="font-semibold text-lg text-blue-600 mb-4">Activity Feed</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-blue-600 mt-1"></div>
            <div>
              <p className="text-sm text-gray-700">{activity.text}</p>
              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
