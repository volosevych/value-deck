"use client";

import React, { useState, useEffect } from "react";

export default function FeaturedCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/featured-cards");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCards(data.slice(0, 3)); // Limit to 3 featured cards
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCards();
  }, []);

  if (loading) {
    return (
      <section className="py-10 container">
        <h2 className="text-4xl font-bold text-center mb-6">Featured Cards</h2>
        <p className="text-center text-lg">Loading featured cards...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 container">
        <h2 className="text-4xl font-bold text-center mb-6">Featured Cards</h2>
        <p className="text-center text-red-500">{error}</p>
      </section>
    );
  }

  if (!cards.length) {
    return (
      <section className="py-10 container">
        <h2 className="text-4xl font-bold text-center mb-6">Featured Cards</h2>
        <p className="text-center text-lg">No featured cards available.</p>
      </section>
    );
  }

  return (
    <section className="py-10 container">
      <h2 className="text-4xl font-bold text-center mb-11">Featured Cards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
          >
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-auto object-cover mb-4"
              loading="lazy" // Add lazy loading for better performance
            />
            <h3 className="text-2xl">{card.name}</h3>
            <p className="text-blue-500 text-lg">Price: {card.prices}</p>
            <p className="text-gray-500 text-lg">{card.rarity}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
