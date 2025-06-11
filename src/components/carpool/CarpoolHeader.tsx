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
      <header className="hidden sm:flex items-center gap-6 p-4 sm:p-6 bg-gray-900/90 backdrop-blur-xl text-white shadow-2xl border-b border-white/10">
        <nav className="flex items-center gap-3">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant="ghost"
                className={`group relative flex items-center px-5 py-3 text-sm font-medium transition-all duration-200 rounded-xl backdrop-blur-sm border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/30
                  ${pathname === item.href 
                    ? "text-white bg-teal-500/10 border-teal-400/20 hover:text-gray-100 hover:bg-teal-500/12 hover:border-teal-400/25 active:scale-95" 
                    : "text-gray-300 bg-transparent border-white/8"
                  }`}
              >
                <span className={`transition-transform duration-200 ${pathname === item.href ? 'text-teal-300' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="ml-3 relative">
                  {item.desktopLabel}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></span>
                  )}
                </span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <Button
            onClick={() => signOut({ redirectTo: "/" })}
            variant="ghost"
            className="group relative flex items-center px-5 py-3 text-sm font-medium text-gray-300 bg-transparent backdrop-blur-sm border border-white/8 hover:text-gray-200 hover:bg-red-500/3 hover:border-red-400/10 transition-all duration-200 rounded-xl shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
          >
            <FaCog className="mr-3 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
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
