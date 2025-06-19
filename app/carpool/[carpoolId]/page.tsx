"use client";

import { CarpoolStatus, deleteParticipantAction, findUniqueCarpool, finishCarpoolAction, getCarpoolParticipants, getCarpoolSoberDriver, getCarpoolStatus } from "@/app/carpool/carpool.action";
import { ConfirmAlertDialog } from "@/src/components/shared/ConfirmAlertDialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Carpool, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FaCar, FaCheck, FaCopy, FaCrown, FaTrash, FaUserMinus, FaUserShield } from "react-icons/fa";

export default function Page({ params }: {  params: Promise<{ carpoolId: string }>}) {
  const {data: session} = useSession();
  const [carpool, setCarpool] = useState<Carpool | null>(null);
  const [status, setStatus] = useState<CarpoolStatus | null>(null);
  const [participants, setParticipants] = useState<User[] | null>(null);
  const [soberDriver, setSoberDriver] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(session?.user as User);
  const router = useRouter();
  const {carpoolId} = use(params);

  useEffect(() => {
    findUniqueCarpool(carpoolId)
      .then(data => setCarpool(data))
      .catch(error => console.error('Error fetching carpool:', error));
    getCarpoolStatus(carpoolId)
      .then(data => {
        setStatus(data ? data : null);
        console.log(data);
      })
      .catch(error => console.error('Error fetching carpool status:', error));
    getCarpoolParticipants(carpoolId)
      .then(data => {
        setParticipants(data ? data : null);
      })
      .catch(error => console.error('Error fetching carpool participants:', error));
    getCarpoolSoberDriver(carpoolId)
      .then(data => {
        setSoberDriver(data ? data : null);
      })
      .catch(error => console.error('Error fetching carpool sober driver:', error));
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

  const isCurrentUser = (participantId: string) => {
    return participantId === currentUser?.id;
  }

  const canRemoveParticipant = (participantId: string) => {
    const isCreator = currentUser?.id === carpool?.creatorId;
    const isParticipantCreator = participantId === carpool?.creatorId;
    const isCurrentUserParticipant = currentUser?.id === participantId;

    // Le créateur ne peut pas se retirer lui-même
    if (isParticipantCreator && isCurrentUserParticipant) {
      return false;
    }

    // Le créateur peut retirer tout le monde (sauf lui-même)
    if (isCreator && !isParticipantCreator) {
      return true;
    }

    // Les participants ne peuvent se retirer qu'eux-mêmes
    if (isCurrentUserParticipant && !isParticipantCreator) {
      return true;
    }

    return false;
  }

  const removeParticipant = async (participantId: string) => {
    if (!currentUser?.id) return;
    
    const result = await deleteParticipantAction(carpoolId, participantId, currentUser.id);
    
    if (result.success) {
      setParticipants(participants?.filter((participant) => participant.id !== participantId) || []);
      router.push(`/carpool`);
    } else {
      // Optionnel : afficher un message d'erreur à l'utilisateur
      console.error("Erreur lors de la suppression:", result.error);
      alert(result.error);
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(carpool?.invitationCode || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
            <div className="space-y-2">
              <span className="text-teal-400 font-medium">Code d'invitation</span>
              <div className="flex items-center gap-2">
                <p className="text-gray-300">{carpool?.invitationCode}</p> {isCopied ? <FaCheck className="text-teal-400" /> :  <FaCopy onClick={copyCode} className="text-teal-400 cursor-pointer" />}
              </div>
            </div>
        </CardContent>
        <CardFooter>
          <ConfirmAlertDialog
            title="Terminer le trajet"
            description="Voulez-vous vraiment terminer le trajet ?"
            onConfirm={() => {
              finishCarpoolAction(carpoolId);
              setStatus("finished");
            }}
          >
            {status === "ongoing" && (
              <Button className="bg-red-400 hover:bg-red-500">
                Terminer le trajet
              </Button>
            )}
          </ConfirmAlertDialog>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md transition-transform duration-200 bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-teal-400">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          {participants?.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2 mb-2">
              {soberDriver === participant.id && (
                <FaUserShield className="text-green-400" title="Conducteur sobre" />
              )}
              <div className="flex justify-between w-full">
              <Link href={`/profile/${participant.id}`} className="text-gray-300 hover:text-white">
                <Badge className={`p-2 ${
                  isUserCarpoolOwner(participant.id) 
                    ? "bg-yellow-600 text-white" 
                    : "bg-gray-700 text-gray-300"
                }`}>
                  {isUserCarpoolOwner(participant.id) && (
                    <FaCrown className="text-yellow-300 inline-block mr-2" title="Créateur" />
                  )}
                  
                    {participant.name}
                  </Badge>
                </Link>


                <div className="flex items-center gap-2">
                  {/* Indication pour le créateur qu'il ne peut pas se retirer */}
                  {isUserCarpoolOwner(participant.id) && isCurrentUser(participant.id) && (
                    <span className="text-xs text-gray-500 italic" title="Le créateur ne peut pas se retirer">
                      Créateur
                    </span>
                  )}
                  
                  {/* Bouton de suppression/retrait */}
                  {canRemoveParticipant(participant.id) && (
                    <ConfirmAlertDialog
                      title={isCurrentUser(participant.id) ? "Se retirer du covoiturage" : "Supprimer le participant"}
                      description={
                        isCurrentUser(participant.id) 
                          ? "Voulez-vous vraiment vous retirer de ce covoiturage ?" 
                          : "Voulez-vous vraiment supprimer ce participant ?"
                      }
                      onConfirm={() => removeParticipant(participant.id)}
                    >
                      {isCurrentUser(participant.id) ? (
                        <FaUserMinus className="text-orange-400 cursor-pointer hover:text-orange-300" title="Se retirer" />
                      ) : (
                        <FaTrash className="text-red-400 cursor-pointer hover:text-red-300" title="Supprimer le participant" />
                      )}
                    </ConfirmAlertDialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
