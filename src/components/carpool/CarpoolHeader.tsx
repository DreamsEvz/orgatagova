"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEye, FaList, FaPlus, FaCog } from "react-icons/fa";
import { Button } from "../ui/button";

export default function CarpoolHeader() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/carpool/view",
      icon: <FaEye className="h-5 w-5" />,
      label: "Voir",
      desktopLabel: "Voir les covoiturages"
    },
    {
      href: "/carpool/new",
      icon: <FaPlus className="h-5 w-5" />,
      label: "Créer",
      desktopLabel: "Créer un covoiturage"
    },
    {
      href: `/carpool/${userId}/list`,
      icon: <FaList className="h-5 w-5" />,
      label: "Mes covoit",
      desktopLabel: "Mes covoiturages"
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden sm:flex items-center gap-6 p-4 sm:p-6 bg-gray-800/75 text-white shadow-md border-b border-gray-700">
        <nav className="flex items-center gap-4 sm:gap-6">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant="ghost"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                  ${pathname === item.href 
                    ? "text-teal-300 border-b-2 border-teal-400 hover:text-teal-200" 
                    : "text-teal-400 hover:text-teal-300 hover:bg-teal-400/10"
                  }`}
              >
                {item.icon}
                <span className="ml-2">{item.desktopLabel}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <Button
            onClick={() => signOut({ redirectTo: "/" })}
            variant="ghost"
            className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
          >
            <FaCog className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700 px-2 py-2 backdrop-blur-lg">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors
                ${pathname === item.href
                  ? "text-teal-300 border-t-2 border-teal-400"
                  : "text-gray-400 hover:text-teal-400"
                }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut({ redirectTo: "/" })}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-400 rounded-lg transition-colors"
          >
            <FaCog className="h-5 w-5" />
            <span className="text-xs mt-1">Réglages</span>
          </button>
        </div>
      </nav>

      {/* Add padding to bottom of the page on mobile to account for fixed navigation */}
      <div className="sm:hidden h-16" />
    </>
  );
}
