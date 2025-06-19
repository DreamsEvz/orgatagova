import { useScreenFormat } from "@/src/lib/hooks/useScreenFormat";
import { X } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function ProfileComponent({ children, session }: { children: React.ReactNode, session: Session | null }) {

  const isMobile = useScreenFormat();

  return (
    <Sheet modal={true}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className="h-[85vh] w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-0 overflow-hidden md:h-auto md:w-1/2 md:flex md:justify-center"
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-teal-500 to-teal-600 rounded-b-3xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
              <SheetHeader className="text-center">
                <SheetTitle className="text-2xl font-bold mb-2">Mon Profil</SheetTitle>
                <p className="text-teal-100 text-sm">Gérez vos informations personnelles</p>
              </SheetHeader>
            </div>
            {/* Close Button */}
            <SheetClose className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 p-2 transition-colors">
              <X className="h-5 w-5 text-white" />
            </SheetClose>
          </div>

          {/* Profile Content */}
          <div className="flex-1 px-6 -mt-16 relative z-10">
            {/* Profile Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Profile Image and Info */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-lg">
                      <Image 
                        src={session?.user?.image || '/vercel.svg'} 
                        alt="Profile" 
                        width={96} 
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full border-2 border-white dark:border-slate-700"></div>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {session?.user?.name || 'Utilisateur'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {session?.user?.email || 'email@example.com'}
                  </p>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    Membre Actif
                  </Badge>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">12</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Covoiturages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">8</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Conducteur</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">4</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Passager</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Modifier le profil
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Paramètres
                  </Button>
                  
                  <Button 
                    onClick={() => signOut()}
                    variant="destructive" 
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
