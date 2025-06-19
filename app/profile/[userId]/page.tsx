import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArrowLeft, Calendar, Car, Clock, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "../user.actions";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;
  const user = await getUser(userId);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Utilisateur non trouvé
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Cet utilisateur n'existe pas ou a supprimé son compte.
            </p>
            <Link href="/">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Button className="h-10 absolute top-4 right-4 bg-gray-600 hover:bg-gray-700 z-10">
        <Link href="/carpool" className="flex items-center gap-2 text-white">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </Button>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-teal-500 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>

        <div className="relative h-full flex items-end justify-center pb-8 px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Profil de {user.name || 'Utilisateur'}
            </h1>
            <p className="text-teal-100 text-lg">
              Membre depuis {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long' 
              }) : 'récemment'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-lg bg-gradient-to-br from-teal-400 to-teal-600">
                      {user.image ? (
                        <Image 
                          src={user.image} 
                          alt={user.name || 'Profile'} 
                          width={128} 
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-700 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {user.name || 'Utilisateur'}
                  </h2>
                  
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 mb-4">
                    {user.isActive ? 'Membre Actif' : 'Inactif'}
                  </Badge>

                  {user.bio && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {user.email && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4 mr-3 text-teal-600" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 mr-3 text-teal-600" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">12</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Covoiturages</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.8</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Note</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <Car className="w-4 h-4 mr-2" />
                    Voir ses covoiturages
                  </Button>
                  
                  <Button variant="outline" className="w-full border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                    <Users className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-slate-200">
                  <Clock className="w-5 h-5 mr-2 text-teal-600" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        Covoiturage créé
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Paris → Lyon • 15 décembre 2024
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Actif
                    </Badge>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        Rejoint un covoiturage
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Marseille → Nice • 10 décembre 2024
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Terminé
                    </Badge>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        A reçu une évaluation
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        5 étoiles • "Excellent conducteur !"
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-semibold">5.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-slate-200">
                  Préférences de voyage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Conducteur</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Aime conduire</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Passager</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Aime voyager</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Régions</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Île-de-France, PACA</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Fréquence</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">2-3 fois par mois</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 