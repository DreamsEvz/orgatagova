"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { generatePrivateCode } from "@/src/lib/utils";


export async function createCarpoolAction(data: any) {

  const currentUserId : string | null = await getCurrentUserId();

  try {
    const carpool = await prisma.carpool.create({
      data: {
        departure: data.departure,
        arrival: data.arrival,
        description: data.description,
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        availableSeats: parseInt(data.availableSeats),
        isDriverSoberNeeded: data.isDriverSoberNeeded,
        soberDriverFound: !data.isDriverSoberNeeded ? true : false,
        isPrivate: data.isPrivate,
        privateCode: data.isPrivate ? generatePrivateCode() : null,
        isArchived: false,
        isFinished: false,
        creatorId: currentUserId as string,
        soberDriverId: data.soberDriverFound ? currentUserId as string : null,
      },
  });
    return carpool;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function joinCarpool(carpoolId: number, userId: string) {
  const carpool = await prisma.carpoolParticipants.create({
    data: { carpoolId, userId },
  });
  return carpool;
}
