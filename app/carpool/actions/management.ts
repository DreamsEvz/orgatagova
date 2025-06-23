"use server";

import { prisma } from "@/src/lib/prisma/prisma";
import { getCurrentUserId } from "@/src/lib/serverUtils";
import { CarpoolActionResult } from "./types";
import { validateCarpoolId } from "./validation";
import { createErrorResult, createSuccessResult } from "./helpers";

/**
 * Finishes a carpool, marking it as completed
 * @param carpoolId The carpool ID to finish
 * @returns Promise<CarpoolActionResult>
 */
export async function finishCarpoolAction(carpoolId: string): Promise<CarpoolActionResult> {
  const validation = validateCarpoolId(carpoolId);
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

    if (carpool.isFinished) {
      return createErrorResult("Carpool is already finished");
    }

    if (carpool.isArchived) {
      return createErrorResult("Cannot finish an archived carpool");
    }

    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { isFinished: true },
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error finishing carpool:", error);
    return createErrorResult("Failed to finish carpool");
  }
}

/**
 * Archives a carpool, removing it from active listings
 * @param carpoolId The carpool ID to archive
 * @param currentUserId The current user ID (must be creator)
 * @returns Promise<CarpoolActionResult>
 */
export async function archiveCarpoolAction(
  carpoolId: string,
  currentUserId?: string
): Promise<CarpoolActionResult> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const userId = currentUserId || await getCurrentUserId();
    if (!userId) {
      return createErrorResult("User not authenticated");
    }

    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check if user is the creator
    if (carpool.creatorId !== userId) {
      return createErrorResult("Only the creator can archive a carpool");
    }

    if (carpool.isArchived) {
      return createErrorResult("Carpool is already archived");
    }

    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { isArchived: true },
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error archiving carpool:", error);
    return createErrorResult("Failed to archive carpool");
  }
}

/**
 * Unarchives a carpool, making it active again
 * @param carpoolId The carpool ID to unarchive
 * @param currentUserId The current user ID (must be creator)
 * @returns Promise<CarpoolActionResult>
 */
export async function unarchiveCarpoolAction(
  carpoolId: string,
  currentUserId?: string
): Promise<CarpoolActionResult> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const userId = currentUserId || await getCurrentUserId();
    if (!userId) {
      return createErrorResult("User not authenticated");
    }

    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check if user is the creator
    if (carpool.creatorId !== userId) {
      return createErrorResult("Only the creator can unarchive a carpool");
    }

    if (!carpool.isArchived) {
      return createErrorResult("Carpool is not archived");
    }

    if (carpool.isFinished) {
      return createErrorResult("Cannot unarchive a finished carpool");
    }

    await prisma.carpool.update({
      where: { id: carpoolId },
      data: { isArchived: false },
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error unarchiving carpool:", error);
    return createErrorResult("Failed to unarchive carpool");
  }
}

/**
 * Deletes a carpool permanently (only if no participants except creator)
 * @param carpoolId The carpool ID to delete
 * @param currentUserId The current user ID (must be creator)
 * @returns Promise<CarpoolActionResult>
 */
export async function deleteCarpoolAction(
  carpoolId: string,
  currentUserId?: string
): Promise<CarpoolActionResult> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const userId = currentUserId || await getCurrentUserId();
    if (!userId) {
      return createErrorResult("User not authenticated");
    }

    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
      include: { participants: true },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check if user is the creator
    if (carpool.creatorId !== userId) {
      return createErrorResult("Only the creator can delete a carpool");
    }

    // Check if there are other participants besides the creator
    const otherParticipants = carpool.participants.filter(p => p.userId !== userId);
    if (otherParticipants.length > 0) {
      return createErrorResult("Cannot delete carpool with other participants");
    }

    // Delete in transaction
    await prisma.$transaction(async (tx) => {
      // Delete all participants (should only be the creator)
      await tx.carpoolParticipants.deleteMany({
        where: { carpoolId },
      });

      // Delete the carpool
      await tx.carpool.delete({
        where: { id: carpoolId },
      });
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error deleting carpool:", error);
    return createErrorResult("Failed to delete carpool");
  }
}

/**
 * Updates carpool details (only basic information)
 * @param carpoolId The carpool ID to update
 * @param updateData The data to update
 * @param currentUserId The current user ID (must be creator)
 * @returns Promise<CarpoolActionResult>
 */
export async function updateCarpoolAction(
  carpoolId: string,
  updateData: {
    description?: string;
    departureTime?: string;
    isPrivate?: boolean;
  },
  currentUserId?: string
): Promise<CarpoolActionResult> {
  const validation = validateCarpoolId(carpoolId);
  if (!validation.isValid) {
    return createErrorResult(validation.error!);
  }

  try {
    const userId = currentUserId || await getCurrentUserId();
    if (!userId) {
      return createErrorResult("User not authenticated");
    }

    const carpool = await prisma.carpool.findUnique({
      where: { id: carpoolId },
    });

    if (!carpool) {
      return createErrorResult("Carpool not found");
    }

    // Check if user is the creator
    if (carpool.creatorId !== userId) {
      return createErrorResult("Only the creator can update a carpool");
    }

    // Cannot update finished or archived carpools
    if (carpool.isFinished || carpool.isArchived) {
      return createErrorResult("Cannot update finished or archived carpool");
    }

    // Validate update data
    if (updateData.description && updateData.description.length > 500) {
      return createErrorResult("Description cannot exceed 500 characters");
    }

    // Build update object
    const dataToUpdate: any = {};
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description.trim();
    }
    if (updateData.departureTime !== undefined) {
      dataToUpdate.departureTime = updateData.departureTime;
    }
    if (updateData.isPrivate !== undefined) {
      dataToUpdate.isPrivate = updateData.isPrivate;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return createErrorResult("No valid fields to update");
    }

    await prisma.carpool.update({
      where: { id: carpoolId },
      data: dataToUpdate,
    });

    return createSuccessResult();
  } catch (error) {
    console.error("Error updating carpool:", error);
    return createErrorResult("Failed to update carpool");
  }
} 