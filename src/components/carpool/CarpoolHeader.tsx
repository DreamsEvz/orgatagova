"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaEye, FaList, FaPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Button } from "../ui/button";

export default function CarpoolHeader() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="flex items-center gap-6 p-4 sm:p-6 bg-gray-800/75 text-white shadow-md border-b border-gray-700">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="sm:hidden text-teal-400"
          onClick={toggleMenu}
        >
          <FaBars className="h-6 w-6" />
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
          {pathname !== "/carpool/view" && (
            <Link href="/carpool/view" className="block">
              <Button
                variant="ghost"
                className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
              >
                <FaEye className="mr-2 h-4 w-4" />
                Voir les covoiturages
              </Button>
            </Link>
          )}
          {pathname !== "/carpool/new" && (
            <Link href="/carpool/new" className="block">
              <Button
                variant="ghost"
                className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Créer un covoiturage
              </Button>
            </Link>
          )}
          {pathname !== `/carpool/${userId}/list` && (
            <Link href={`/carpool/${userId}/list`} className="block">
              <Button
                variant="ghost"
                className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
              >
                <FaList className="mr-2 h-4 w-4" />
                Mes covoiturages
              </Button>
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button
            className="h-10 w-10 p-0 bg-gray-700/50 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:ring-2 hover:ring-teal-400/50"
            variant="ghost"
          >
            <FaUserCircle className="text-teal-400 h-6 w-6" />
          </Button>
          <Button
            onClick={() => signOut({ redirectTo: "/" })}
            variant="ghost"
            className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center justify-center mb-8">
              <FaUserCircle className="text-teal-400 h-12 w-12" />
            </div>
            <nav className="flex flex-col gap-2">
              {pathname !== "/carpool/view" && (
                <Link
                  href="/carpool/view"
                  className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
                >
                  <FaEye className="mr-2 h-4 w-4" />
                  Voir les covoiturages
                </Link>
              )}
              {pathname !== "/carpool/new" && (
                <Link
                  href="/carpool/new"
                  className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
                >
                  <FaPlus className="mr-2 h-4 w-4" />
                  Créer un covoiturage
                </Link>
              )}
              {pathname !== `/carpool/${userId}/list` && (
                <Link
                  href={`/carpool/${userId}/list`}
                  className="flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
                >
                  <FaList className="mr-2 h-4 w-4" />
                  Mes covoiturages
                </Link>
              )}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-gray-700">
            <button
              onClick={() => signOut({ redirectTo: "/" })}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300 transition-all duration-200 rounded-lg"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
