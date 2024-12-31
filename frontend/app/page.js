"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { benefits } from "./data/data"; // Ensure this path is correct
import Image from "next/image";

// Components
import FeaturedCards from "./components/FeaturedCards";

export default function Page() {
  const router = useRouter();

  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden bg-black">
        {/* Hero Image */}
        <Image
          src="/hero/hero-image.png"
          alt="Hero Image"
          fill
          style={{ objectFit: "cover" }}
          className="blur-sm"
        />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-50">
          <h1 className="text-4xl md:text-5xl mb-4 text-shadow-strong">
            Discover Card Values and PSA Price Rates!
          </h1>
          <p className="text-lg md:text-2xl text-shadow-strong">
            Easily search for trading card prices, compare market trends, and explore PSA-graded values—all in one place.
          </p>
          
        </div>
      </div>

      {/* Features Section */}
      <section className="py-10 container">
        <div className="flex justify-center flex-col items-center space-y-10">
          {/* Section Title */}
          <h2 className="text-4xl text-center">Why Choose Us?</h2>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {benefits.length ? (
              benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 border rounded-lg bg-green shadow-md text-black relative overflow-hidden group"
                >
                  <h3 className="text-2xl mb-2">{benefit.title}</h3>
                  <p className="text-lg">{benefit.description}</p>
                </div>
              ))
            ) : (
              <p className="text-center">No benefits available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <FeaturedCards />
    </main>
  );
}
