"use client";

import { ConfirmAlertDialog } from "@/src/components/shared/ConfirmAlertDialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Carpool, User } from "@prisma/client";
import { use, useEffect, useState } from "react";
import { FaCar, FaCrown, FaTrash } from "react-icons/fa";
import { CarpoolStatus, deleteParticipantAction, findUniqueCarpool, finishCarpoolAction, getCarpoolParticipants, getCarpoolStatus } from "../../carpool.action";

export default function Page({ params }: {  params: Promise<{ userId: string; carpoolId: string }>}) {
  const [carpool, setCarpool] = useState<Carpool | null>(null);
  const [status, setStatus] = useState<CarpoolStatus | null>(null);
  const [participants, setParticipants] = useState<User[] | null>(null);
  const {carpoolId } = use(params);

  useEffect(() => {
    findUniqueCarpool(parseInt(carpoolId))
      .then(data => setCarpool(data))
      .catch(error => console.error('Error fetching carpool:', error));
    getCarpoolStatus(parseInt(carpoolId))
      .then(data => {
        setStatus(data ? data : null);
        console.log(data);
      })
      .catch(error => console.error('Error fetching carpool status:', error));
    getCarpoolParticipants(parseInt(carpoolId))
      .then(data => {
        setParticipants(data ? data : null);
      })
      .catch(error => console.error('Error fetching carpool participants:', error));
  }, []);

  const getStatusColorAndText = (status: CarpoolStatus) => {
    if (status === "finished") return { color: "bg-red-400", text: "Terminé" };
    if (status === "archived") return { color: "bg-gray-400", text: "Archivé" };
    if (status === "ongoing") return { color: "bg-green-400", text: "En cours" };
    return { color: "bg-gray-400", text: "Inconnu" };
  }

  const isUserCarpoolOwner = (participantId: string) => {
    return participantId === carpool?.creatorId;
  }

  const removeParticipant = (participantId: string) => {
    setParticipants(participants?.filter((participant) => participant.id !== participantId) || []);
    deleteParticipantAction(parseInt(carpoolId), participantId);
  }

  return (
    <main className="flex min-h-100 flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-md transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="flex justify-between text-2xl text-teal-400 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <FaCar className="h-6 w-6" />
              Détails du trajet
            </div>
            {status && ( 
              <Badge variant="outline" className={`${getStatusColorAndText(status).color} text-white`}>
                {getStatusColorAndText(status).text}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
        <CardFooter>
          <ConfirmAlertDialog
            title="Terminer le trajet"
            description="Voulez-vous vraiment terminer le trajet ?"
            onConfirm={() => {
              finishCarpoolAction(parseInt(carpoolId));
              setStatus("finished");
            }}
          >
            <Button className="bg-teal-400 hover:bg-teal-500">
              Terminer le trajet
            </Button>
          </ConfirmAlertDialog>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-teal-400">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          {participants?.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              {isUserCarpoolOwner(participant.id) && (
                <FaCrown className="text-yellow-400" />
              )}
              <div className="flex justify-between w-full">
                <p className="text-gray-300">{participant.name}</p>
                {
                  !isUserCarpoolOwner(participant.id) && (
                    <ConfirmAlertDialog
                      title="Supprimer le participant"
                      description="Voulez-vous vraiment supprimer le participant ?"
                      onConfirm={() => removeParticipant(participant.id)}
                    >
                      <FaTrash className="text-red-400" />
                    </ConfirmAlertDialog>
                ) 
                }
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
