'use client';

import { CarpoolWithCreator } from "@/app/carpool/carpool.action";
import { Carpool } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function CarpoolViewList({ carpools }: { carpools: Carpool[] | CarpoolWithCreator[] }) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 max-w-7xl mx-auto max-h-[80vh] overflow-y-auto">
      {carpools.map((carpool) => (
        <CarpoolViewListCard carpool={carpool} key={carpool.id} />
      ))}
    </div>
  );
}

export function CarpoolViewListCard({ carpool }: { carpool: Carpool | CarpoolWithCreator }) {
  return (
    <Card className="w-full h-full transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl p-4">
      <div className="flex flex-col h-full">
        <div className="flex flex-row items-center gap-2 mb-4">
            <Image src={'creator' in carpool ? carpool.creator?.image || "" : ""} alt={'creator' in carpool ? carpool.creator?.name || "" : ""} width={40} height={40} className="rounded-full" />
            <p className="text-gray-300 break-words">{'creator' in carpool ? carpool.creator?.name : 'Utilisateur'}</p>
          </div>
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
            <span className="text-teal-400 font-medium block">Places disponibles</span>
            <p className="text-gray-300">{carpool.availableSeats}</p>
          </div>
          <div className="space-y-2">
            <span className="text-teal-400 font-medium block">Type de trajet</span>
            <p className="text-gray-300">{carpool.isPrivate ? 'Privé' : 'Public'}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <span className="text-teal-400 font-medium block">Sam nécessaire</span>
            <p className="text-gray-300">{carpool.isDriverSoberNeeded ? 'Oui' : 'Non'}</p>
          </div>
        </div>
        <div className="mt-auto">
          <Link 
            href={`/carpool/${carpool.id}`} 
            className="w-full block"
          >
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors duration-200">
              Voir le trajet
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
