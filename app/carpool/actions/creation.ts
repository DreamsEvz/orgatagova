"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { generatePrivateCode } from "@/src/lib/utils";
import { Carpool } from "@prisma/client";
import { 
  CreateCarpoolData, 
  CarpoolActionResult 
} from "./types";
import { validateCarpoolData } from "./validation";
import { createErrorResult, createSuccessResult } from "./helpers";

/**
 * Creates a new carpool with the provided data
 * @param data Carpool creation data
 * @returns Promise<CarpoolActionResult<Carpool>>
 */
export async function createCarpoolAction(
  data: CreateCarpoolData
): Promise<CarpoolActionResult<Carpool>> {
  // Get current user
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return createErrorResult("User not authenticated");
  }

  // Validate input data
  const validation = validateCarpoolData(data);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true }
    });

    if (!userExists) {
      console.error(`User ${currentUserId} not found in database`);
      return createErrorResult("User account not found. Please log in again.");
    }

    // Generate invitation code and parse data
    const invitationCode = generatePrivateCode();
    const availableSeats = parseInt(data.availableSeats);
    const isDriverSoberNeeded = Boolean(data.isDriverSoberNeeded);
    const soberDriverFound = !isDriverSoberNeeded;

    // Create carpool with initial participant in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the carpool
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

      // Add creator as initial participant
      await tx.carpoolParticipants.create({
        data: {
          userId: currentUserId,
          carpoolId: carpool.id,
        },
      });

      return carpool;
    }, {
      timeout: 10000 // 10 seconds timeout
    });

    return createSuccessResult(result);
  } catch (error) {
    console.error("Error creating carpool:", error);
    
    // Check if it's a foreign key constraint error
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return createErrorResult("Invalid user reference. Please log in again.");
      }
    }
    
    return createErrorResult("Failed to create carpool");
  }
}

/**
 * Creates a carpool template for quick creation
 * @param templateData Partial carpool data for template
 * @returns CreateCarpoolData with default values
 */
export async function createCarpoolTemplate(
  templateData: Partial<CreateCarpoolData> = {}
): Promise<CreateCarpoolData> {
  const now = new Date();
  const defaultDepartureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
  const defaultDepartureTime = "08:00";

  return {
    departure: templateData.departure || "",
    arrival: templateData.arrival || "",
    description: templateData.description || "",
    departureDate: templateData.departureDate || defaultDepartureDate.toISOString().split('T')[0],
    departureTime: templateData.departureTime || defaultDepartureTime,
    availableSeats: templateData.availableSeats || "4",
    isDriverSoberNeeded: templateData.isDriverSoberNeeded ?? false,
    isPrivate: templateData.isPrivate ?? false,
  };
} 