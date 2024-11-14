"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa"; // Utilisation d'une icône utilisateur pour le style
import { Button } from "../ui/button";

export default function CarpoolHeader() {
  const pathname =  usePathname();

  return (
    <header className="flex items-center gap-6 p-4 sm:p-6 bg-gray-800/75 text-white shadow-md border-b border-gray-700">
      <nav className="flex items-center gap-4 sm:gap-6">
        {pathname !== "/carpool/view" && (
          <Link
            href="/carpool/view"
          className="text-sm font-medium hover:text-teal-400 transition-colors"
        >
          Voir les covoiturages
          </Link>
        )}
        {pathname !== "/carpool/new" && (
          <Link
            href="/carpool/new"
          className="text-sm font-medium hover:text-teal-400 transition-colors"
        >
          Créer un covoiturage
          </Link>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <Button
          className="h-8 w-8 p-0 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
          variant="ghost"
        >
          <FaUserCircle className="text-teal-400" size={20} />
        </Button>
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="text-sm border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white transition-colors duration-150"
        >
          Se déconnecter
        </Button>
      </div>
    </header>
  );
}
