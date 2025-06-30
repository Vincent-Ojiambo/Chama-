import React from "react"; // Import React

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start">
        <div className="mr-3 text-gray-500">{icon}</div>
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard; // Add the default export
