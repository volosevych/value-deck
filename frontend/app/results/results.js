"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic"; // Force dynamic rendering

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          }
        );

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            errorDetails?.error || `HTTP Error ${response.status}`
          );
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message || "Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-6">Search Results for "{query}":</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 flex flex-col items-center"
          >
            <img
              src={result.imageUrl || "https://via.placeholder.com/300"}
              alt={result.name || "Card Image"}
              className="w-full h-72 object-contain mb-4"
            />
            <h2 className="text-xl">{result.name}</h2>
            <p>{result.set || "Unknown Set"}</p>
            <p>Rarity: {result.rarity || "Unknown"}</p>
            <p>Price: {result.price ? `$${result.price}` : "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
