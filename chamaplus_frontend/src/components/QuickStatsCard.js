import React from "react";

const QuickStatsCard = ({ label, value, color }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-slate-500 font-medium">{label}</h3>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color === "blue" ? "#3B82F6" : color === "green" ? "#22C55E" : color === "yellow" ? "#FBBF24" : "#A855F7" }}></div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default QuickStatsCard;
