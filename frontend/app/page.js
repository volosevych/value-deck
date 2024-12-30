"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { benefits } from './data/data';

// components
import FeaturedCards from './components/FeaturedCards';

export default function Page() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        router.push('/explore');
    }, 500);};

  return (
    <main className="">
        <div className='relative h-[50vh] overflow-hidden bg-black'>
            {/* Hero Image */}
            <img 
                src="/hero/hero-image.png"
                className="w-full h-full object-cover blur-sm"
                alt="Hero Image"
            />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-50">
                <h1 className="text-4xl md:text-5xl mb-4 text-shadow-strong">
                Discover Card Values and PSA Price Rates!
                </h1>
                <p className="text-lg md:text-2xl text-shadow-strong">
                Easily search for trading card prices, compare market trends, and explore PSA-graded values—all in one place.
                </p>

                    <button
                    onClick={handleNavigation}
                    className="mt-10 text-2xl px-6 py-3 text-white border border-black bg-black hover:bg-opacity-80 rounded-lg shadow-md transition"
                    >
                    Start Exploring
                    </button>
                
            </div>

        </div>

        {/* Features */}
        <section className="py-10 container">
            <div className='flex justify-center flex-col items-center space-y-10'>
                {/* Section Title */}
                <h1 className='text-4xl text-center'>Why Choose Us?</h1>

                {/* Benefits Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-4'>
                {benefits.map((benefit, index) => (
                    <div
                    key={index}
                    className='flex flex-col items-center text-center p-4 border rounded-lg bg-green shadow-md text-black relative overflow-hidden group'
                    >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-0.5 
                    transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                    opacity-0 group-hover:opacity-20 group-hover:animate-shimmer"></div>
                    {/* Box Title */}
                    <h3 className='text-2xl mb-2'>
                        {benefit.title}
                    </h3>

                    {/* Box Description */}
                    <p className='text-lg'>
                        {benefit.description}
                    </p>
                    </div>
                ))}
                </div>
            </div>
        </section>

        <FeaturedCards/>

    </main>
  );
}

