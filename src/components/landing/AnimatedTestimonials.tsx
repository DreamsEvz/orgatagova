"use client";

import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

interface TestimonialProps {
  text: string;
  author: string;
  rating: number;
}

function TestimonialCard({ text, author, rating }: TestimonialProps) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="mx-auto max-w-lg px-4">
        <div className="p-6 md:p-8 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
          <div className="flex text-teal-400 mb-4">
            {[...Array(rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="text-gray-300 italic mb-4 text-lg">{text}</p>
          <p className="text-teal-400 font-semibold">{author}</p>
        </div>
      </div>
    </div>
  );
}

export function AnimatedTestimonials({ testimonials }: { testimonials: TestimonialProps[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative py-12 md:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Carousel container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index} 
                {...testimonial} 
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="p-3 rounded-full bg-gray-800/80 border border-gray-700/50 text-teal-400 hover:bg-gray-700/80 transition-colors"
            onClick={prev}
          >
            <FaChevronLeft />
          </button>
          <button
            className="p-3 rounded-full bg-gray-800/80 border border-gray-700/50 text-teal-400 hover:bg-gray-700/80 transition-colors"
            onClick={next}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex ? 'bg-teal-400' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 