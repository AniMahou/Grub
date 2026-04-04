import React from 'react';

function SearchBar({ searchTerm, onSearchChange, placeholder }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || "🔍 Search restaurants..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;