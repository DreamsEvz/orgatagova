"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export function AnimatedCTA() {
  return (
    <motion.div 
      className="container mx-auto px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Prêt à rejoindre l'aventure ?
      </h2>
      <Link href="/login">
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
          Créer un compte gratuitement
        </Button>
      </Link>
    </motion.div>
  );
} 