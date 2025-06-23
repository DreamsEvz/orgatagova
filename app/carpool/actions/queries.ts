"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { Carpool, User } from "@prisma/client";
import { 
  CarpoolWithCreator, 
  CarpoolStatus 
} from "./types";
import { enrichCarpoolsWithCreators } from "./utils";
import { validateCarpoolId, validateUserId } from "./validation";

/**
 * Gets all active carpools with their creators
 * @returns Promise<CarpoolWithCreator[]>
 */
export async function getCarpoolsAndParticipants(): Promise<CarpoolWithCreator[]> {
  try {
    const carpools = await prisma.carpool.findMany({
      where: {
        isFinished: false,
        isArchived: false,
        availableSeats: { gt: 0 },
      },
      orderBy: { departureDate: 'asc' },
    });

    return await enrichCarpoolsWithCreators(carpools);
  } catch (error) {
    console.error("Error fetching carpools:", error);
    return [];
  }
}

/**
 * Gets carpools where a specific user is a participant
 * @param userId The user ID to search for
 * @returns Promise<CarpoolWithCreator[]>
 */
export async function getCarpoolsWhereUserBelongs(
  userId: string
): Promise<CarpoolWithCreator[]> {
  const validation = validateUserId(userId);
  if (!validation.isValid) {
    console.error("Invalid user ID:", validation.error);
    return [];
  }

  try {
    const carpools = await prisma.carpool.findMany({
      where: {
        participants: { some: { userId } },
        isFinished: false,
        isArchived: false,
      },
      orderBy: { departureDate: 'asc' },
    });

    return await enrichCarpoolsWithCreators(carpools);
  } catch (error) {
    console.error("Error fetching user carpools:", error);
    return [];
  }
}

/**
 * Gets finished carpools for the current user
 * @returns Promise<CarpoolWithCreator[]>
 */
export async function getFinishedCarpools(): Promise<CarpoolWithCreator[]> {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return [];
  }

  try {
    const participants = await prisma.carpoolParticipants.findMany({
      where: { 
        userId: currentUserId, 
        carpool: { 
          isFinished: true, 
          isArchived: false 
        } 
      },
      include: { carpool: true },
    });

    const carpools = participants.map(p => p.carpool);
    return await enrichCarpoolsWithCreators(carpools);
  } catch (error) {
    console.error("Error fetching finished carpools:", error);
    return [];
  }
}

/**
 * Gets unfinished carpools created by the current user
 * @returns Promise<Carpool[]>
 */
export async function getUserUnFinishedCarpools(): Promise<Carpool[]> {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return [];
  }

  try {
    return await prisma.carpool.findMany({
      where: { 
        isFinished: false, 
        creatorId: currentUserId,
      },
      orderBy: { departureDate: 'asc' },
    });
  } catch (error) {
    console.error("Error getting user carpools:", error);
    return [];
  }
}

/**
 * Finds a unique carpool by ID
 * @param carpoolId The carpool ID to search for
 * @returns Promise<Carpool | null>
 */
export async function findUniqueCarpool(carpoolId: string): Promise<Carpool | null> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return null;
  }

  try {
    return await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });
  } catch (error) {
    console.error("Error finding carpool:", error);
    return null;
  }
}

/**
 * Gets carpool status (finished, archived, or ongoing)
 * @param carpoolId The carpool ID
 * @returns Promise<CarpoolStatus>
 */
export async function getCarpoolStatus(carpoolId: string): Promise<CarpoolStatus> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return "ongoing";
  }

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

/**
 * Gets all participants of a carpool
 * @param carpoolId The carpool ID
 * @returns Promise<User[]>
 */
export async function getCarpoolParticipants(carpoolId: string): Promise<User[]> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return [];
  }

  try {
    const participants = await prisma.carpoolParticipants.findMany({
      where: { carpoolId },
      include: { user: true },
      orderBy: { user: { name: 'asc' } },
    });

    return participants.map(p => p.user);
  } catch (error) {
    console.error("Error getting carpool participants:", error);
    return [];
  }
}

/**
 * Gets the sober driver ID for a carpool
 * @param carpoolId The carpool ID
 * @returns Promise<string | null>
 */
export async function getCarpoolSoberDriver(carpoolId: string): Promise<string | null> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return null;
  }

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

/**
 * Searches carpools by departure and arrival locations
 * @param departure Departure location to search for
 * @param arrival Arrival location to search for
 * @returns Promise<CarpoolWithCreator[]>
 */
export async function searchCarpools(
  departure?: string,
  arrival?: string
): Promise<CarpoolWithCreator[]> {
  try {
    const whereClause: any = {
      isFinished: false,
      isArchived: false,
      availableSeats: { gt: 0 },
    };

    if (departure) {
      whereClause.departure = {
        contains: departure,
        mode: 'insensitive',
      };
    }

    if (arrival) {
      whereClause.arrival = {
        contains: arrival,
        mode: 'insensitive',
      };
    }

    const carpools = await prisma.carpool.findMany({
      where: whereClause,
      orderBy: { departureDate: 'asc' },
    });

    return await enrichCarpoolsWithCreators(carpools);
  } catch (error) {
    console.error("Error searching carpools:", error);
    return [];
  }
} 