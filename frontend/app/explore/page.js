"use client";

import React, { useState } from "react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ebay: true,
    psa: true,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleFilterChange = (api) => {
    setFilters((prev) => ({ ...prev, [api]: !prev[api] }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Search query cannot be empty.");
      return;
    }

    if (!filters.ebay && !filters.psa) {
      setError("At least one filter must be selected.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          filters,
        }),
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 flex flex-col items-center h-[100vh] w-full">
      <h1 className="text-4xl pb-10">Start Looking for Cards</h1>
      {/* Search Bar */}
      <div className="flex justify-between w-full">
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Palafin-EX 061/167"
            className="px-6 py-2 rounded-lg focus:outline-none border border-gray-300"
            aria-label="Search cards"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray rounded-lg ml-2"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 justify-center ml-10 flex-col">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.ebay}
              onChange={() => handleFilterChange("ebay")}
              aria-label="Toggle eBay Listings"
            />
            <span>eBay Listings</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.psa}
              onChange={() => handleFilterChange("psa")}
              aria-label="Toggle PSA Graded"
            />
            <span>PSA Graded</span>
          </label>
        </div>
      </div>

      {/* Results */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <p>{result.source}</p>
              <p>Price: {result.price || "N/A"}</p>
            </div>
          ))
        ) : (
          !loading &&
          !error && <p>No results found for "{searchQuery}".</p>
        )}
      </div>
    </div>
  );
}
