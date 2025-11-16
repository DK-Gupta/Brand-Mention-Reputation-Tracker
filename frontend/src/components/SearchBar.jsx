// // src/components/SearchBar.jsx
// import React, { useState } from "react";

// const SearchBar = ({ onSearch }) => {
//   const [query, setQuery] = useState("");

//   const handleSearch = () => {
//     if (!query) return;
//     onSearch(query); // pass single input
//   };

//   return (
//     <div className="flex items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg mb-6">
//       <input
//         type="text"
//         placeholder="Enter Brand or Keyword"
//         className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <button
//         onClick={handleSearch}
//         className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md"
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;
