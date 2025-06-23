"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { Carpool, User } from "@prisma/client";
import { 
  ParticipantOperationResult,
  CarpoolWithCreator 
} from "./types";
import { 
  validateIds, 
  validateCarpoolActive,
  canManageParticipant,
  createErrorResult,
  createSuccessResult
} from "./helpers";

// Participant management utilities
export async function checkParticipantExists(
  userId: string, 
  carpoolId: string
): Promise<boolean> {
  try {
    const participant = await prisma.carpoolParticipants.findUnique({
      where: { userId_carpoolId: { userId, carpoolId } },
    });
    return !!participant;
  } catch (error) {
    console.error("Error checking participant existence:", error);
    return false;
  }
}

export async function addParticipantAndUpdateSeats(
  userId: string,
  carpoolId: string,
  updateSeats: boolean = true
): Promise<ParticipantOperationResult> {
  try {
    // Check if user is already a participant
    const participantExists = await checkParticipantExists(userId, carpoolId);
    if (participantExists) {
      return { success: false, error: "User is already a participant" };
    }

    // Get current carpool data
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    // Validate carpool is active
    const validation = validateCarpoolActive(carpool);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Check available seats
    if (carpool.availableSeats <= 0) {
      return { success: false, error: "Carpool is full" };
    }

    // Add participant and update seats in transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.carpoolParticipants.create({
        data: { userId, carpoolId },
      });

      let updatedCarpool = carpool;
      if (updateSeats) {
        updatedCarpool = await tx.carpool.update({
          where: { id: carpoolId },
          data: { availableSeats: carpool.availableSeats - 1 },
        });
      }

      return updatedCarpool;
    });

    return { 
      success: true, 
      updatedSeats: result.availableSeats 
    };
  } catch (error) {
    console.error("Error adding participant:", error);
    return { success: false, error: "Failed to add participant" };
  }
}

export async function removeParticipantAndUpdateSeats(
  userId: string,
  carpoolId: string,
  updateSeats: boolean = true
): Promise<ParticipantOperationResult> {
  try {
    // Check if participant exists
    const participantExists = await checkParticipantExists(userId, carpoolId);
    if (!participantExists) {
      return { success: false, error: "Participant not found" };
    }

    // Get current carpool data
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    // Remove participant and update seats in transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.carpoolParticipants.delete({
        where: { userId_carpoolId: { userId, carpoolId } },
      });

      let updatedCarpool = carpool;
      if (updateSeats) {
        updatedCarpool = await tx.carpool.update({
          where: { id: carpoolId },
          data: { availableSeats: carpool.availableSeats + 1 },
        });
      }

      return updatedCarpool;
    });

    return { 
      success: true, 
      updatedSeats: result.availableSeats 
    };
  } catch (error) {
    console.error("Error removing participant:", error);
    return { success: false, error: "Failed to remove participant" };
  }
}



// Query utilities
export async function enrichCarpoolsWithCreators(
  carpools: Carpool[]
): Promise<CarpoolWithCreator[]> {
  if (carpools.length === 0) return [];

  const creatorIds = [...new Set(carpools.map(carpool => carpool.creatorId))];
  
  const creators = await prisma.user.findMany({
    where: { id: { in: creatorIds } },
  });

  return carpools.map(carpool => ({
    ...carpool,
    creator: creators.find(creator => creator.id === carpool.creatorId)!,
  }));
}

 