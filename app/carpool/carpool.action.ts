"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { generatePrivateCode } from "@/src/lib/utils";
import { User } from "@prisma/client";

export async function createCarpoolAction(data: any) {
  const currentUserId: string | null = await getCurrentUserId();

  try {
    const privateCode = data.isPrivate ? generatePrivateCode() : null;

    // Step 1: Create the carpool
    const carpool = await prisma.carpool.create({
      data: {
        departure: data.departure,
        arrival: data.arrival,
        description: data.description,
        departureDate: new Date(data.departureDate),
        departureTime: data.departureTime,
        availableSeats: parseInt(data.availableSeats),
        isDriverSoberNeeded: data.isDriverSoberNeeded,
        soberDriverFound: !data.isDriverSoberNeeded ? true : false,
        isPrivate: data.isPrivate,
        privateCode: privateCode,
        isArchived: false,
        isFinished: false,
        creatorId: currentUserId as string,
        soberDriverId: !data.isDriverSoberNeeded ? currentUserId as string : null,
      },
    });

    await prisma.carpoolParticipants.create({
      data: {
        userId: currentUserId as string,
        carpoolId: carpool.id,
      },
    });

    return carpool;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function joinCarpoolAction(carpoolId: number, userId: string) {
  try {
    await prisma.carpoolParticipants.create({
      data: {
        userId: userId,
        carpoolId: carpoolId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function joinCarpoolAsSoberAction(carpoolId: number) {}

export async function finishCarpoolAction(carpoolId: number) {
  try {
    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { isFinished: true },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getUserUnFinishedCarpools() {
  const currentUserId: string | null = await getCurrentUserId();

  const carpools = await prisma.carpool.findMany({
    where: { isFinished: false, participants: { some: { userId: currentUserId as string } } },
  });

  return carpools;
}

export async function findUniqueCarpool(carpoolId: number) {
  const carpool = await prisma.carpool.findUnique({
    where: { id: carpoolId },
  });
  return carpool;
}

export type CarpoolStatus = "finished" | "archived" | "ongoing"

export async function getCarpoolStatus(carpoolId: number) {
  const carpool = await prisma.carpool.findUnique({
    where: { id: carpoolId },
  });

  
  if (carpool?.isFinished) {
    return "finished" as CarpoolStatus;
  }

  if (carpool?.isArchived) {
    return "archived" as CarpoolStatus;
  }

  return "ongoing" as CarpoolStatus;
}

export async function getCarpoolParticipants(carpoolId: number) {
  const participants = await prisma.carpoolParticipants.findMany({
    where: { carpoolId: carpoolId },
  });

  const participantsWithUser: User[] = await prisma.user.findMany({
    where: { id: { in: participants.map((participant) => participant.userId) } },
  });

  return participantsWithUser;
}

