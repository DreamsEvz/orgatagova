"use client";

import { joinCarpoolAction, joinCarpoolAsSoberAction } from "@/app/carpool/carpool.action";
import { Carpool } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
  
export function CarpoolList({carpools }: { carpools: Carpool[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 max-w-7xl mx-auto max-h-[80vh] overflow-y-auto pb-20">
      {carpools.map((carpool) => (
        <CarpoolListCard carpool={carpool} key={carpool.id} />
      ))}
    </div>
  );
}

export function CarpoolListCard({ carpool }: { carpool: Carpool }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const joinCarpool = async (carpoolId: number) => {
    try {
      await joinCarpoolAction(carpoolId, currentUserId as string);
    } catch (error) {
      console.error("Error joining carpool:", error);
    }
  }

  const joinCarpoolAsSober = async (carpoolId: number) => {
    try {
      await joinCarpoolAsSoberAction(carpoolId);
    } catch (error) {
      console.error("Error joining carpool as sober:", error);
    }
  }

  return (
    <Card className="w-full h-full transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl p-4">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Départ</span>
            <p className="text-gray-300 break-words">{carpool.departure}</p>
          </div>
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Arrivée</span>
            <p className="text-gray-300 break-words">{carpool.arrival}</p>
          </div>
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Date de départ</span>
            <p className="text-gray-300">{carpool.departureDate?.toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Places disponibles</span>
            <p className="text-gray-300">{carpool.availableSeats}</p>
          </div>
        </div>
        {carpool.creatorId !== currentUserId && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-auto">
            <Button 
              onClick={() => joinCarpool(carpool.id)} 
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors duration-200"
            >
              Rejoindre
            </Button>
            <Button 
              onClick={() => joinCarpoolAsSober(carpool.id)} 
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold transition-colors duration-200"
            >
              Rejoindre en tant que SAM
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}


