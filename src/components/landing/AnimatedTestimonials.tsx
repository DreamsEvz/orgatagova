"use client";

import { motion, useAnimation } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

interface TestimonialProps {
  text: string;
  author: string;
  rating: number;
}

function TestimonialCard({ text, author, rating, index, activeIndex, totalItems }: TestimonialProps & { index: number; activeIndex: number; totalItems: number }) {
  // Calculate the position and scale based on distance from active index
  const position = ((index - activeIndex + totalItems) % totalItems);
  const isActive = position === 0;
  
  // Calculate transform values for carousel effect
  let xPosition = position * 60 - 30; // percentage
  
  // Adjust position for mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    xPosition = position * 100;
  }
  
  let scale = position === 0 ? 1 : 0.8;
  let zIndex = totalItems - Math.abs(position);
  let opacity = 1 - (Math.abs(position) * 0.2);
  
  return (
    <motion.div 
      className="absolute top-0 left-0 w-full md:w-auto md:relative"
      animate={{
        x: `${xPosition}%`,
        scale,
        zIndex,
        opacity
      }}
      transition={{ duration: 0.5 }}
      style={{ 
        filter: isActive ? 'none' : 'blur(1px)',
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      <div className="mx-auto max-w-lg px-4 md:px-0">
        <motion.div 
          className="p-6 md:p-8 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50"
          whileHover={isActive ? { scale: 1.02 } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="flex text-teal-400 mb-4">
            {[...Array(rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="text-gray-300 italic mb-4 text-lg">{text}</p>
          <p className="text-teal-400 font-semibold">{author}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AnimatedTestimonials({ testimonials }: { testimonials: TestimonialProps[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();

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
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/3 left-0 w-32 h-32 md:w-64 md:h-64 bg-teal-500/5 rounded-full blur-2xl transform -translate-x-1/2" />
        <div className="absolute bottom-1/3 right-0 w-32 h-32 md:w-64 md:h-64 bg-teal-500/5 rounded-full blur-2xl transform translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="relative h-[300px] md:h-[400px]">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              {...testimonial} 
              index={index}
              activeIndex={activeIndex}
              totalItems={testimonials.length}
            />
          ))}
        </div>

        {/* Navigation buttons - Hide on mobile */}
        <div className="hidden md:flex justify-center gap-4 mt-8">
          <motion.button
            className="p-3 rounded-full bg-gray-800/80 border border-gray-700/50 text-teal-400 hover:bg-gray-700/80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prev}
          >
            <FaChevronLeft />
          </motion.button>
          <motion.button
            className="p-3 rounded-full bg-gray-800/80 border border-gray-700/50 text-teal-400 hover:bg-gray-700/80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={next}
          >
            <FaChevronRight />
          </motion.button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-teal-400' : 'bg-gray-600'}`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 