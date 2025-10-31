"use client";

import { joinCarpoolAction, joinCarpoolAsSoberAction } from "@/app/carpool/carpool.action";
import { Carpool, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FaUserPlus, FaUserShield } from "react-icons/fa";

export function CarpoolList({carpools }: { carpools: (Carpool & { creator: User })[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 max-w-7xl mx-auto max-h-[80vh] overflow-y-auto pb-20">
      {carpools.map((carpool) => (
        <CarpoolListCard carpool={carpool} key={carpool.id} />
      ))}
    </div>
  );
}

export function CarpoolListCard({ carpool }: { carpool: Carpool & { creator: User } }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const router = useRouter();

  const joinCarpool = async (carpoolId: string) => {
    try {
      const result = await joinCarpoolAction(carpoolId, currentUserId as string);
      if (result.success) {
        router.push(`/carpool/${carpoolId}`);
      } else {
        console.error("Error joining carpool:", result.error);
      }
    } catch (error) {
      console.error("Error joining carpool:", error);
    }
  }

  const joinCarpoolAsSober = async (carpoolId: string) => {
    try {
      await joinCarpoolAsSoberAction(carpoolId, currentUserId as string);
      router.push(`/carpool/${carpoolId}`);
    } catch (error) {
      console.error("Error joining carpool as sober:", error);
    }
  }

  return (
    <Card className="w-full h-full transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl p-4">
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex flex-row items-center gap-2">
            <Image src={carpool.creator?.image || ""} alt={carpool.creator?.name || ""} width={40} height={40} className="rounded-full" />
            <p className="text-gray-300 break-words">{carpool.creator?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Trajet</span>
            <p className="text-gray-300 break-words">{carpool.title}</p>
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
              <FaUserPlus className="mr-2" />
              Rejoindre
            </Button>
            <Button 
              onClick={() => joinCarpoolAsSober(carpool.id)} 
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold transition-colors duration-200"
            >
              <FaUserShield className="mr-2" />
              Rejoindre en tant que conducteur sobre
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}


