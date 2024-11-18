"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { generatePrivateCode } from "@/src/lib/utils";


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


export async function joinCarpoolAction(carpoolId: number) {
  const currentUserId: string | null = await getCurrentUserId();

  try {
    await prisma.carpoolParticipants.create({
      data: {
        userId: currentUserId as string,
        carpoolId: carpoolId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function joinCarpoolAsSoberAction(carpoolId: number) {
  const currentUserId: string | null = await getCurrentUserId();

  try {
    await prisma.carpoolParticipants.create({
      data: {
        userId: currentUserId as string,
        carpoolId: carpoolId,
      },
    });
    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { soberDriverId: currentUserId as string, soberDriverFound: true },
    });
  } catch (error) {
    console.error(error);
  }
}
