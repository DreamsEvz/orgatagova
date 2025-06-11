"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description, index }: FeatureProps & { index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      className={`flex items-center gap-4 md:gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} my-8 md:my-12`}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="relative flex-shrink-0 w-20 h-20 md:w-32 md:h-32 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative bg-gray-800 rounded-full p-4 md:p-6 border border-teal-500/30">
          <div className="text-teal-400 text-xl md:text-3xl">{icon}</div>
        </div>
      </motion.div>
      
      <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
        <motion.h3 
          className="text-lg md:text-xl font-semibold mb-2 bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-sm md:text-base text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function AnimatedFeatures({ features }: { features: FeatureProps[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={index} {...feature} index={index} />
      ))}
    </div>
  );
} 