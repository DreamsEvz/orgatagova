"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { FaRoute } from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function AnimatedHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('/images/party-bg.jpg')] bg-cover bg-center"></div>
      </div>
      
      <motion.div 
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200"
          variants={fadeIn}
        >
          Partage ta route, prolonge la fête
        </motion.h1>
        <motion.p 
          className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          variants={fadeIn}
        >
          Transformez vos trajets en moments de partage. Covoiturez pour des soirées plus responsables et conviviales.
        </motion.p>
        <motion.div 
          className="mt-8"
          variants={fadeIn}
        >
          <Link href="/login">
            <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
              Commencer l'aventure
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FaRoute className="text-teal-400 text-4xl" />
      </motion.div>
    </section>
  );
} 