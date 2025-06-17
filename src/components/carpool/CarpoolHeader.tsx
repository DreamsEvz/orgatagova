"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEye, FaList, FaPlus, FaUserCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import React from "react";

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
      {/* Desktop Sidebar */}
      <aside className="hidden sm:fixed sm:flex flex-col top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-xl z-40 items-center py-10 gap-6">
        <div className="flex flex-col gap-2 w-full px-4 mt-4">
          {navigationItems.map((item, index) => (
            <div key={item.href} className="w-full">
              <Link href={item.href} className="block w-full">
                <Button
                  variant="default"
                  className={`w-full h-10 flex items-center justify-start rounded-xl border
                    ${pathname === item.href
                      ? "bg-teal-500/20 text-teal-300 border-teal-400/50"
                      : "bg-white/5 text-gray-300 border-white/10"
                    }`}
                >
                  <span className="mr-4 flex items-center justify-center">
                    {item.icon && React.cloneElement(item.icon, { className: 'h-6 w-6' })}
                  </span>
                  <span className="font-medium text-base">
                    {item.desktopLabel}
                  </span>
                </Button>
              </Link>
              {index < navigationItems.length - 1 && (
                <div className="h-px bg-white/10 mx-4 mt-2" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Floating Profile Button (top right) */}
      <button
        onClick={() => signOut({ redirectTo: "/" })}
        className="flex fixed top-4 right-4 md:top-10 md:right-10 z-50 bg-white/10 hover:bg-teal-500/20 text-teal-400 hover:text-white border border-white/20 shadow-lg rounded-full w-16 h-16 items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50"
        aria-label="Profil"
      >
        <FaUserCircle className="w-10 h-10" />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700 px-2 py-2 backdrop-blur-lg z-50">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center rounded-lg transition-colors
                ${pathname === item.href
                  ? "text-teal-300 border-t-2 border-teal-400"
                  : "text-gray-400 hover:text-teal-400"
                }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add padding to bottom of the page on mobile to account for fixed navigation */}
      <div className="sm:hidden h-16" />
    </>
  );
}
