"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { generatePrivateCode } from "@/src/lib/utils";
import { Carpool, User } from "@prisma/client";

// Type definitions
export interface CreateCarpoolData {
  departure: string;
  arrival: string;
  description: string;
  departureDate: string;
  departureTime: string;
  availableSeats: string;
  isDriverSoberNeeded: boolean;
  isPrivate: boolean;
}

export interface CarpoolActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type CarpoolStatus = "finished" | "archived" | "ongoing";

// Validation helpers
function validateCarpoolData(data: CreateCarpoolData): string | null {
  if (!data.departure?.trim()) return "Departure location is required";
  if (!data.arrival?.trim()) return "Arrival location is required";
  if (!data.departureDate) return "Departure date is required";
  if (!data.departureTime) return "Departure time is required";
  if (!data.availableSeats || parseInt(data.availableSeats) <= 0) return "Available seats must be greater than 0";
  return null;
}

// Carpool creation
export async function createCarpoolAction(data: CreateCarpoolData): Promise<CarpoolActionResult<Carpool>> {
  const currentUserId = await getCurrentUserId();

  console.log(currentUserId);
  
  if (!currentUserId) {
    return { success: false, error: "User not authenticated" };
  }

  const validationError = validateCarpoolData(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const invitationCode = generatePrivateCode();
    const availableSeats = parseInt(data.availableSeats);
    const isDriverSoberNeeded = Boolean(data.isDriverSoberNeeded);
    const soberDriverFound = !isDriverSoberNeeded;

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const carpool = await tx.carpool.create({
        data: {
          title: `${data.departure.trim()} → ${data.arrival.trim()}`,
          departure: data.departure.trim(),
          arrival: data.arrival.trim(),
          description: data.description?.trim() || "",
          departureDate: new Date(data.departureDate),
          departureTime: data.departureTime,
          availableSeats,
          totalSeats: availableSeats,
          isDriverSoberNeeded,
          soberDriverFound,
          isPrivate: Boolean(data.isPrivate),
          invitationCode,
          isArchived: false,
          isFinished: false,
          status: "ACTIVE",
          creatorId: currentUserId,
          soberDriverId: soberDriverFound ? currentUserId : null,
        },
      });

      await tx.carpoolParticipants.create({
        data: {
          userId: currentUserId,
          carpoolId: carpool.id,
        },
      });

      return carpool;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating carpool:", error);
    return { success: false, error: "Failed to create carpool" };
  }
}

// Carpool joining
export async function joinCarpoolAction(carpoolId: string, userId: string): Promise<CarpoolActionResult> {
  if (!carpoolId || !userId) {
    return { success: false, error: "Invalid carpool ID or user ID" };
  }

  try {
    // Check if user is already a participant
    const existingParticipant = await prisma.carpoolParticipants.findUnique({
      where: { userId_carpoolId: { userId, carpoolId } },
    });

    if (existingParticipant) {
      return { success: false, error: "User is already a participant" };
    }

    // Check if carpool exists and has available seats
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      include: { participants: true },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    if (carpool.isFinished || carpool.isArchived) {
      return { success: false, error: "Carpool is no longer active" };
    }

    const participantCount = await prisma.carpoolParticipants.count({
      where: { carpoolId }
    });

    if (participantCount >= carpool.availableSeats) {
      return { success: false, error: "Carpool is full" };
    }

    await prisma.carpoolParticipants.create({
      data: { userId, carpoolId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error joining carpool:", error);
    return { success: false, error: "Failed to join carpool" };
  }
}

export async function joinCarpoolWithCodeAction(code: string, userId: string): Promise<CarpoolActionResult<Carpool>> {
  if (!code?.trim() || !userId) {
    return { success: false, error: "Invalid invitation code or user ID" };
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { invitationCode: code.trim() },
      include: { participants: true },
    });

    if (!carpool) {
      return { success: false, error: "Invalid invitation code" };
    }

    if (carpool.isFinished || carpool.isArchived) {
      return { success: false, error: "Carpool is no longer active" };
    }

    if (carpool.participants.length >= carpool.availableSeats) {
      return { success: false, error: "Carpool is full" };
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.carpoolParticipants.findUnique({
      where: { userId_carpoolId: { userId, carpoolId: carpool.id } },
    });

    if (existingParticipant) {
      return { success: false, error: "User is already a participant" };
    }

    await prisma.carpoolParticipants.create({
      data: { userId, carpoolId: carpool.id },
    });

    return { success: true, data: carpool };
  } catch (error) {
    console.error("Error joining carpool with code:", error);
    return { success: false, error: "Failed to join carpool" };
  }
}

export async function joinCarpoolAsSoberAction(carpoolId: string, userId: string): Promise<CarpoolActionResult<Carpool>> {
  if (!carpoolId || !userId) {
    return { success: false, error: "Invalid carpool ID or user ID" };
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      include: { participants: true },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    if (carpool.isFinished || carpool.isArchived) {
      return { success: false, error: "Carpool is no longer active" };
    }

    if (carpool.soberDriverId) {
      return { success: false, error: "Sober driver already assigned" };
    }

    if (!carpool.isDriverSoberNeeded) {
      return { success: false, error: "This carpool doesn't need a sober driver" };
    }

    // Use transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Add user as participant if not already
      const existingParticipant = await tx.carpoolParticipants.findUnique({
        where: { userId_carpoolId: { userId, carpoolId } },
      });

      if (!existingParticipant) {
        await tx.carpoolParticipants.create({
          data: { userId, carpoolId },
        });
      }

      // Update carpool with sober driver
      const updatedCarpool = await tx.carpool.update({
        where: { id: carpoolId },
        data: { 
          soberDriverId: userId,
          soberDriverFound: true,
        },
      });

      return updatedCarpool;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error joining as sober driver:", error);
    return { success: false, error: "Failed to join as sober driver" };
  }
}

// Carpool management
export async function finishCarpoolAction(carpoolId: string): Promise<CarpoolActionResult> {
  if (!carpoolId) {
    return { success: false, error: "Invalid carpool ID" };
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    if (carpool.isFinished) {
      return { success: false, error: "Carpool is already finished" };
    }

    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { isFinished: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error finishing carpool:", error);
    return { success: false, error: "Failed to finish carpool" };
  }
}

export async function deleteParticipantAction(carpoolId: string, participantId: string): Promise<CarpoolActionResult> {
  if (!carpoolId || !participantId) {
    return { success: false, error: "Invalid carpool ID or participant ID" };
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return { success: false, error: "Carpool not found" };
    }

    // Prevent removing the creator
    if (carpool.creatorId === participantId) {
      return { success: false, error: "Cannot remove the carpool creator" };
    }

    await prisma.carpoolParticipants.delete({
      where: { userId_carpoolId: { userId: participantId, carpoolId } },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting participant:", error);
    return { success: false, error: "Failed to remove participant" };
  }
}

// Carpool queries
export async function getCarpoolSoberDriver(carpoolId: string): Promise<string | null> {
  if (!carpoolId) return null;

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      select: { soberDriverId: true },
    });
    return carpool?.soberDriverId || null;
  } catch (error) {
    console.error("Error getting sober driver:", error);
    return null;
  }
}

export async function getUserUnFinishedCarpools(): Promise<Carpool[]> {
  const currentUserId = await getCurrentUserId();
  
  if (!currentUserId) {
    return [];
  }

  try {
    return await prisma.carpool.findMany({
      where: { 
        isFinished: false, 
        participants: { some: { userId: currentUserId } } 
      },
      orderBy: { departureDate: 'asc' },
    });
  } catch (error) {
    console.error("Error getting user carpools:", error);
    return [];
  }
}

export async function findUniqueCarpool(carpoolId: string): Promise<Carpool | null> {
  if (!carpoolId) return null;

  try {
    return await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });
  } catch (error) {
    console.error("Error finding carpool:", error);
    return null;
  }
}

export async function getCarpoolStatus(carpoolId: string): Promise<CarpoolStatus> {
  if (!carpoolId) return "ongoing";

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      select: { isFinished: true, isArchived: true },
    });

    if (!carpool) return "ongoing";
    
    if (carpool.isFinished) return "finished";
    if (carpool.isArchived) return "archived";
    return "ongoing";
  } catch (error) {
    console.error("Error getting carpool status:", error);
    return "ongoing";
  }
}

export async function getCarpoolParticipants(carpoolId: string): Promise<User[]> {
  if (!carpoolId) return [];

  try {
    // Optimized query to get participants with user data in one go
    const participants = await prisma.carpoolParticipants.findMany({
      where: { carpoolId },
      include: {
        user: true,
      },
    });

    return participants.map(p => p.user);
  } catch (error) {
    console.error("Error getting carpool participants:", error);
    return [];
  }
}
