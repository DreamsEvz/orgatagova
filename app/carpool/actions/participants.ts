"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { Carpool } from "@prisma/client";
import { 
  CarpoolActionResult 
} from "./types";
import { 
  validateMultipleIds, 
  validateInvitationCode, 
  validateUserId, 
  validateCarpoolId 
} from "./validation";
import { 
  addParticipantAndUpdateSeats,
  removeParticipantAndUpdateSeats
} from "./utils";
import {
  canManageParticipant,
  createErrorResult,
  createSuccessResult,
  validateCarpoolActive
} from "./helpers";

/**
 * Joins a carpool as a regular participant
 * @param carpoolId The carpool ID to join
 * @param userId The user ID joining
 * @returns Promise<CarpoolActionResult>
 */
export async function joinCarpoolAction(
  carpoolId: string, 
  userId: string
): Promise<CarpoolActionResult> {
  const validation = validateMultipleIds(carpoolId, userId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const result = await addParticipantAndUpdateSeats(userId, carpoolId);
    
    if (!result.success) {
      return createErrorResult(result.error!);
    }

    return createSuccessResult();
  } catch (error) {
    console.error("Error joining carpool:", error);
    return createErrorResult("Failed to join carpool");
  }
}

/**
 * Joins a carpool using an invitation code
 * @param code The invitation code
 * @param userId The user ID joining
 * @returns Promise<CarpoolActionResult<Carpool>>
 */
export async function joinCarpoolWithCodeAction(
  code: string, 
  userId: string
): Promise<CarpoolActionResult<Carpool>> {
  const codeValidation = validateInvitationCode(code);
  if (!codeValidation.isValid) {
    return createErrorResult(codeValidation.error!);
  }

  const userValidation = validateUserId(userId);
  if (!userValidation.isValid) {
    return createErrorResult(userValidation.error!);
  }

  try {
    // Find carpool by invitation code
    const carpool = await prisma.carpool.findUnique({
      where: { invitationCode: code.trim() },
      include: { participants: true },
    });

    if (!carpool) {
      return createErrorResult("Invalid invitation code");
    }

    // Validate carpool is active
    const activeValidation = validateCarpoolActive(carpool);
    if (!activeValidation.isValid) {
      return createErrorResult(activeValidation.error!);
    }

    // Add participant
    const result = await addParticipantAndUpdateSeats(userId, carpool.id);
    
    if (!result.success) {
      return createErrorResult(result.error!);
    }

    return createSuccessResult(carpool);
  } catch (error) {
    console.error("Error joining carpool with code:", error);
    return createErrorResult("Failed to join carpool");
  }
}

/**
 * Joins a carpool as a sober driver
 * @param carpoolId The carpool ID to join
 * @param userId The user ID joining as sober driver
 * @returns Promise<CarpoolActionResult<Carpool>>
 */
export async function joinCarpoolAsSoberAction(
  carpoolId: string, 
  userId: string
): Promise<CarpoolActionResult<Carpool>> {
  const validation = validateMultipleIds(carpoolId, userId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      include: { participants: true },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Validate carpool is active
    const activeValidation = validateCarpoolActive(carpool);
    if (!activeValidation.isValid) {
      return createErrorResult(activeValidation.error!);
    }

    // Check if sober driver is needed and not already assigned
    if (!carpool.isDriverSoberNeeded) {
      return createErrorResult("This carpool doesn't need a sober driver");
    }

    if (carpool.soberDriverId) {
      return createErrorResult("Sober driver already assigned");
    }

    // Use transaction to add participant and assign sober driver
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
    }, {
      timeout: 10000 // 10 seconds timeout
    });

    return createSuccessResult(result);
  } catch (error) {
    console.error("Error joining as sober driver:", error);
    return createErrorResult("Failed to join as sober driver");
  }
}

/**
 * Removes a participant from a carpool
 * @param carpoolId The carpool ID
 * @param participantId The participant ID to remove
 * @param currentUserId The current user making the request
 * @returns Promise<CarpoolActionResult>
 */
export async function deleteParticipantAction(
  carpoolId: string, 
  participantId: string, 
  currentUserId: string
): Promise<CarpoolActionResult> {
  const validation = validateMultipleIds(carpoolId, participantId, currentUserId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check authorization
    const authValidation = canManageParticipant(currentUserId, participantId, carpool.creatorId);
    if (!authValidation.isValid) {
      return createErrorResult(authValidation.error!);
    }

    // Remove participant and update seats
    const result = await removeParticipantAndUpdateSeats(participantId, carpoolId);
    
    if (!result.success) {
      return createErrorResult(result.error!);
    }

    // If the removed participant was the sober driver, reset sober driver status
    if (carpool.soberDriverId === participantId) {
      await prisma.carpool.update({
        where: { id: carpoolId },
        data: { 
          soberDriverId: null,
          soberDriverFound: false,
        },
      });
    }

    return createSuccessResult();
  } catch (error) {
    console.error("Error deleting participant:", error);
    return createErrorResult("Failed to remove participant");
  }
}

/**
 * Swaps the sober driver role between participants
 * @param carpoolId The carpool ID
 * @param newSoberDriverId The new sober driver user ID
 * @param currentUserId The current user making the request
 * @returns Promise<CarpoolActionResult>
 */
export async function swapSoberDriverAction(
  carpoolId: string,
  newSoberDriverId: string,
  currentUserId: string
): Promise<CarpoolActionResult> {
  const validation = validateMultipleIds(carpoolId, newSoberDriverId, currentUserId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      include: { participants: true },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check if carpool needs sober driver
    if (!carpool.isDriverSoberNeeded) {
      return createErrorResult("This carpool doesn't need a sober driver");
    }

    // Check if current user is authorized (creator or current sober driver)
    const isCreator = carpool.creatorId === currentUserId;
    const isCurrentSoberDriver = carpool.soberDriverId === currentUserId;
    
    if (!isCreator && !isCurrentSoberDriver) {
      return createErrorResult("You are not authorized to change the sober driver");
    }

    // Check if new sober driver is a participant
    const isParticipant = carpool.participants.some(p => p.userId === newSoberDriverId);
    if (!isParticipant) {
      return createErrorResult("New sober driver must be a participant");
    }

    // Update sober driver
    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { 
        soberDriverId: newSoberDriverId,
        soberDriverFound: true,
      },
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error swapping sober driver:", error);
    return createErrorResult("Failed to swap sober driver");
  }
}