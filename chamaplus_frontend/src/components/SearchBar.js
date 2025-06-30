import React from "react";

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;
