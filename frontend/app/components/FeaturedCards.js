"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const FeaturedCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCards = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      console.log("Fetching featured cards from:", apiUrl);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCards(data.slice(0, 3)); // Limit to 3 featured cards
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCards();
  }, []);

  return (
    <section className="py-10 container">
      <h2 className="text-4xl font-bold text-center mb-11">Featured Cards</h2>

      {loading && <p className="text-center text-lg">Loading featured cards...</p>}

      {error && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}

      {!loading && !error && cards.length === 0 && (
        <p className="text-center text-lg">No featured cards available.</p>
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <div className="relative w-full h-60 mb-4">
                <Image
                  src={card.imageUrl || "https://via.placeholder.com/300"}
                  alt={card.name || "No Image Available"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                  loading="lazy"
                />
              </div>
              <h3 className="text-2xl">{card.name}</h3>
              <p className="text-blue-500 text-lg">Price: {card.prices || "N/A"}</p>
              <p className="text-gray-500 text-lg">Rarity: {card.rarity || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCards;
