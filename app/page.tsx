"use client";

import { AnimatedCTA } from '@/src/components/landing/AnimatedCTA';
import { AnimatedFeatures } from '@/src/components/landing/AnimatedFeatures';
import { AnimatedHero } from '@/src/components/landing/AnimatedHero';
import { AnimatedStats } from '@/src/components/landing/AnimatedStats';
import { AnimatedTestimonials } from '@/src/components/landing/AnimatedTestimonials';
// app/page.tsx
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { FaCar, FaShieldAlt, FaUsers, FaLeaf, FaMoon, FaRoute, FaHandshake } from 'react-icons/fa';

export default function Page() {
  const stats = [
    { number: "2500+", label: "Trajets partagés", icon: <FaCar /> },
    { number: "4800+", label: "Utilisateurs actifs", icon: <FaUsers /> },
    { number: "12K+", label: "Kg CO2 économisés", icon: <FaLeaf /> }
  ];

  const features = [
    {
      icon: <FaMoon />,
      title: "Spécial soirées",
      description: "Trouvez des covoiturages adaptés à vos sorties nocturnes"
    },
    {
      icon: <FaShieldAlt />,
      title: "Sécurité garantie",
      description: "Profils vérifiés et système de notation transparent"
    },
    {
      icon: <FaHandshake />,
      title: "Communauté active",
      description: "Rencontrez des personnes partageant vos centres d'intérêt"
    }
  ];

  const testimonials = [
    {
      text: "Une super app qui m'a permis de faire de belles rencontres !",
      author: "Marie, 24 ans",
      rating: 5
    },
    {
      text: "Plus besoin de me soucier du retour de soirée, c'est pratique et économique.",
      author: "Thomas, 28 ans",
      rating: 5
    },
    {
      text: "La meilleure solution pour sortir de façon responsable.",
      author: "Julie, 26 ans",
      rating: 5
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      <AnimatedHero />

      <section className="py-12 md:py-16 bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedStats stats={stats} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Une expérience unique de covoiturage nocturne
          </h2>
          <AnimatedFeatures features={features} />
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-800/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Ce qu'en pensent nos utilisateurs
          </h2>
          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedCTA />
        </div>
      </section>

      <footer className="py-6 bg-gray-800/50 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} OrgaTagova - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
