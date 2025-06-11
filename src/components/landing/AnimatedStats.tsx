"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsProps {
  number: string;
  label: string;
  icon: ReactNode;
}

function CircularStat({ number, label, icon, index }: StatsProps & { index: number }) {
  return (
    <motion.div 
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <motion.div 
        className="relative w-48 h-48 mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-700/50" />
        
        {/* Animated progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="96"
            cy="96"
            r="44"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-teal-500"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-teal-400 text-3xl mb-2">{icon}</div>
          <motion.div 
            className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
          >
            <span className="block text-xl md:text-sm">{number}</span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.p 
        className="text-xl text-gray-400 text-center max-w-[200px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

export function AnimatedStats({ stats }: { stats: StatsProps[] }) {
  return (
    <div className="py-8">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {stats.map((stat, index) => (
          <CircularStat key={index} {...stat} index={index} />
        ))}
      </motion.div>
    </div>
  );
} 