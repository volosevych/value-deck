"use client";

import React, { useState } from 'react'

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        ebay: true,
        psa: true,
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFilterChange = (api) => {
        setFilters((prev) => ({...prev, [api]: !prev[api]}));
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch("http://localhost:5000/api/search", {
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
        <div className='container py-10 flex flex-col items-center h-[100vh] w-full'>
            <h1 className='text-4xl pb-10'>Start Looking for Cards</h1>
            {/* Search Bar */}
            <div className='flex jusitfy-between '>
                <div>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Palafin-EX 061/167'
                        className='px-6 py-2 rounded-lg focus:outline-none border border-gray-300'
                    />

                    <button
                        onClick={handleSearch}
                        className='px-6 py-2 bg-gray rounded-lg ml-2'
                    >
                        Search
                    </button>
                </div>

                {/* filters */}
                <div className='flex gap-4 justify-center ml-10 flex-col'>
                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={filters.ebay}
                            onChange={() => handleFilterChange('ebay')}
                        />
                        <span>eBay Listings</span>
                    </label>

                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={filters.psa}
                            onChange={() => handleFilterChange('psa')}
                        />
                        <span>PSA Graded</span>
                    </label>
                </div>

                {/* results */}
                {loading &&  <p>Loading...</p>}
                {error && <p className='text-red-500'>{error}</p>}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {Array.isArray(results) && results.map((result, index) => (
                        <div key={index} className='p-4 border rounded shadow'>
                        <p>{result.source}</p>
                        <p>Price: {result.price || "N/A"}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
