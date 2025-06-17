import { buttonVariants } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { FaEye, FaPlus } from "react-icons/fa";

export default function Page() {
  return <main className="flex flex-col items-center justify-center min-h-100 bg-gray-900 p-6">
    <h1 className="text-4xl font-bold text-teal-400 mb-8 text-center">Trouver un covoiturage</h1>
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
      <Card className="flex-1 hover:scale-105 transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-teal-400 flex items-center gap-2">
            <FaPlus className="h-6 w-6" />
            Créer un covoiturage
          </CardTitle>
          <p className="text-gray-300">Proposez un trajet et partagez votre route avec d'autres personnes</p>
        </CardHeader>
        <CardContent>
          <Link href="/carpool/new" className={cn(buttonVariants({ variant: "default" }), "w-full bg-teal-500 hover:bg-teal-600 text-lg py-6")}>
            Créer un nouveau trajet
          </Link>
        </CardContent>
      </Card>

      <Card className="flex-1 hover:scale-105 transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-teal-400 flex items-center gap-2">
            <FaEye className="h-6 w-6" />
            Voir les covoiturages
          </CardTitle>
          <p className="text-gray-300">Trouvez un trajet qui correspond à vos besoins</p>
        </CardHeader>
        <CardContent>
          <Link href="/carpool/view" className={cn(buttonVariants({ variant: "default" }), "w-full bg-teal-500 hover:bg-teal-600 text-lg py-6")}>
            Parcourir les trajets
          </Link>
        </CardContent>
      </Card>
    </div>
  </main>;
}