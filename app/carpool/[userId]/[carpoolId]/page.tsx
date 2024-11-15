import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { prisma } from "@/src/lib/prisma/prisma";
import { FaCar } from "react-icons/fa";

export default async function Page({ params }: { params: { userId: string; carpoolId: string } }) {
  
  const carpool = await prisma.carpool.findUnique({
    where: {
      id: parseInt(params.carpoolId),
    },
  });

  return ( <main className="flex min-h-screen items-center justify-center p-4">
  <Card className="w-full max-w-md hover:scale-105 transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
    <CardHeader className="space-y-2">
      <CardTitle className="text-2xl text-teal-400 flex items-center gap-2">
        <FaCar className="h-6 w-6" />
        Détails du trajet
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Départ</span>
          <p className="text-gray-300">{carpool?.departure}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Arrivée</span>
          <p className="text-gray-300">{carpool?.arrival}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Date de départ</span>
          <p className="text-gray-300">{carpool?.departureDate?.toLocaleDateString()}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Heure de départ</span>
          <p className="text-gray-300">{carpool?.departureTime}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Places disponibles</span>
          <p className="text-gray-300">{carpool?.availableSeats}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Description</span>
          <p className="text-gray-300">{carpool?.description}</p>
        </div>
      </div>
      {carpool?.isPrivate && (
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Code privé</span>
          <p className="text-gray-300">{carpool?.privateCode}</p>
        </div>
      )}
    </CardContent>
  </Card>
</main>
  );
  
}
