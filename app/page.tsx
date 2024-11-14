// app/page.tsx
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { FaBell, FaFilter, FaSearchLocation, FaUserShield } from 'react-icons/fa';

export default function Page() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="text-center py-16 sm:py-20 bg-gradient-to-b from-gray-800 to-gray-900 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Bienvenue sur OrgaTagova
        </h1>
        <p className="mt-4 sm:mt-6 text-lg sm:text-2xl max-w-4xl mx-auto text-gray-300">
          Covoiturez pour des soirées plus conviviales, économiques et écologiques !
        </p>
        <Link href="/login" passHref>
          <Button className="mt-6 sm:mt-8 bg-teal-500 hover:bg-teal-600 text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg">
            Rejoignez-nous dès maintenant
          </Button>
        </Link>
      </header>

      <main className="space-y-8 sm:space-y-10 py-16 sm:py-24 px-4 sm:px-6 bg-gray-900">
        <Section
          emoji="🚗"
          title="Partagez un trajet"
          description="Rencontrez de nouveaux amis de soirée et partagez des moments fun en covoiturant. Connectez-vous avec des gens sympas et rendez chaque trajet aussi mémorable que la soirée elle-même !"
        />
        
        <Arrow />

        <Section
          emoji="💸"
          title="Économisez de l'argent"
          description="Réduisez vos dépenses en partageant les frais de déplacement. Une solution économique et pratique pour vos sorties nocturnes !"
        />

        <Arrow />

        <Section
          emoji="🌍"
          title="Préservez l'environnement"
          description="Réduisez votre empreinte carbone en optant pour le covoiturage. C'est un moyen simple et efficace de protéger notre planète tout en profitant de la nuit !"
        />

        <Arrow />

        <Section
          emoji="🎉"
          title="Un covoiturage réussi"
          description="Avec OrgaTagova, profitez d'un covoiturage sûr et agréable pour une soirée réussie. Faites de chaque trajet une expérience unique, responsable et conviviale !"
        />
        
        <KeyFeaturesSection />

        <TestimonialsSection />
      </main>

      <footer className="py-6 sm:py-10 bg-gray-800 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} OrgaTagova - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}

// Section Component
function Section({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="max-w-5xl mx-auto text-center p-8 sm:p-12 rounded-lg bg-gray-800/60 shadow-lg border border-gray-700">
      <span className="text-4xl sm:text-5xl mb-4">{emoji}</span>
      <h2 className="text-2xl sm:text-4xl font-semibold mb-4 text-teal-400">{title}</h2>
      <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

// KeyFeaturesSection Component
function KeyFeaturesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-900 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-8 sm:mb-12">Fonctionnalités Clés</h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <Feature
          icon={<FaSearchLocation size={32} className="text-teal-400 mb-4 mx-auto" />}
          title="Recherche en temps réel"
          description="Trouvez des covoiturages disponibles instantanément pour votre soirée, en fonction de l'heure et du lieu."
        />
        <Feature
          icon={<FaFilter size={32} className="text-teal-400 mb-4 mx-auto" />}
          title="Filtrage par proximité"
          description="Affinez votre recherche par proximité ou par événement pour trouver des trajets qui vous conviennent."
        />
        <Feature
          icon={<FaUserShield size={32} className="text-teal-400 mb-4 mx-auto" />}
          title="Profils vérifiés"
          description="Voyagez en toute sécurité avec des profils vérifiés et des avis d'utilisateurs pour chaque conducteur et passager."
        />
        <Feature
          icon={<FaBell size={32} className="text-teal-400 mb-4 mx-auto" />}
          title="Notifications en direct"
          description="Recevez des notifications pour les trajets réservés et soyez informé des changements en temps réel."
        />
      </div>
    </section>
  );
}

function Feature({ icon, title, description }: { icon: JSX.Element; title: string; description: string }) {
  return (
    <div className="bg-gray-800/60 rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-semibold text-teal-400 mt-4">{title}</h3>
      <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

// TestimonialsSection Component
function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-900 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-8 sm:mb-12">Les avis de nos utilisateurs</h2>
      
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <blockquote className="relative px-4 sm:px-6 py-8 sm:py-10 text-base sm:text-lg bg-gray-800/80 rounded-lg shadow-md leading-relaxed">
          <p className="italic text-gray-300">
            "OrgaTagova m'a permis de rencontrer de nouvelles personnes formidables et de réduire mes frais de déplacement. Une application parfaite pour les sorties en soirée !"
          </p>
          <footer className="mt-4 text-teal-400">— Marie, 28 ans</footer>
        </blockquote>

        <blockquote className="relative px-4 sm:px-6 py-8 sm:py-10 text-base sm:text-lg bg-gray-800/80 rounded-lg shadow-md leading-relaxed">
          <p className="italic text-gray-300">
            "Grâce à OrgaTagova, je fais des économies tout en contribuant à préserver l'environnement. Je recommande à tous ceux qui sortent régulièrement !"
          </p>
          <footer className="mt-4 text-teal-400">— Julien, 34 ans</footer>
        </blockquote>

        <blockquote className="relative px-4 sm:px-6 py-8 sm:py-10 text-base sm:text-lg bg-gray-800/80 rounded-lg shadow-md leading-relaxed">
          <p className="italic text-gray-300">
            "La meilleure application de covoiturage pour les sorties nocturnes ! Convivialité et sécurité assurées à chaque trajet."
          </p>
          <footer className="mt-4 text-teal-400">— Sophie, 26 ans</footer>
        </blockquote>
      </div>
    </section>
  );
}

// Arrow Component
function Arrow() {
  return (
    <div className="flex justify-center items-center py-4 sm:py-6">
      <span className="text-gray-500 text-2xl sm:text-3xl">⬇️</span>
    </div>
  );
}
