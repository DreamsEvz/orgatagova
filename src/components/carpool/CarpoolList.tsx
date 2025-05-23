import { joinCarpoolAction, joinCarpoolAsSoberAction } from "@/app/carpool/carpool.action";
import { Carpool } from "@prisma/client";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function CarpoolList({carpools }: { carpools: Carpool[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pr-10 items-center max-w-full max-h-[70vh] overflow-y-auto">
      {carpools.map((carpool) => (
        <CarpoolListCard carpool={carpool} key={carpool.id} />
      ))}
    </div>
  );
}

export function CarpoolListCard({ carpool }: { carpool: Carpool }) {

  const joinCarpool = async () => {
    "use server";
    await joinCarpoolAction(carpool.id);
  }

  const joinCarpoolAsSober = async () => {
    "use server";
    await joinCarpoolAsSoberAction(carpool.id);
  } 

  return (
    <Card className="w-full max-w-md transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl p-4 mb-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Départ</span>
          <p className="text-gray-300">{carpool.departure}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Arrivée</span>
          <p className="text-gray-300">{carpool.arrival}</p>
        </div>
        <div className="space-y-2">
          <span className="text-teal-400 font-medium">Date de départ</span>
          <p className="text-gray-300">{carpool.departureDate?.toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={joinCarpool} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            Rejoindre
          </Button>
          <Button onClick={joinCarpoolAsSober} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            Rejoindre en tant que SAM
          </Button>
        </div>
      </div>
    </Card>
  );
}

