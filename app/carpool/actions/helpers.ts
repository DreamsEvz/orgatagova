import { Carpool } from "@prisma/client";
import { ValidationResult } from "./types";

// Common validation utilities
export function validateIds(ids: string[]): ValidationResult {
  const invalidIds = ids.filter(id => !id || typeof id !== 'string' || id.trim() === '');
  
  if (invalidIds.length > 0) {
    return { isValid: false, error: "One or more IDs are invalid" };
  }
  
  return { isValid: true };
}

export function validateCarpoolActive(carpool: Carpool | null): ValidationResult {
  if (!carpool) {
    return { isValid: false, error: "Carpool not found" };
  }

  if (carpool.isFinished) {
    return { isValid: false, error: "Carpool is finished" };
  }

  if (carpool.isArchived) {
    return { isValid: false, error: "Carpool is archived" };
  }

  return { isValid: true };
}

// Authorization utilities
export function canManageParticipant(
  currentUserId: string,
  participantId: string,
  creatorId: string
): ValidationResult {
  const isCreator = creatorId === currentUserId;
  const isParticipantCreator = creatorId === participantId;
  const isCurrentUserParticipant = currentUserId === participantId;

  // Rule 1: Creator cannot remove themselves
  if (isParticipantCreator && isCurrentUserParticipant) {
    return { 
      isValid: false, 
      error: "Le créateur ne peut pas se retirer lui-même" 
    };
  }

  // Rule 2: Creator can remove anyone except themselves
  if (isCreator && !isParticipantCreator) {
    return { isValid: true };
  }

  // Rule 3: Participants can only remove themselves
  if (isCurrentUserParticipant && !isParticipantCreator) {
    return { isValid: true };
  }

  // If none of the above conditions are met, the action is not authorized
  return { 
    isValid: false, 
    error: "Vous n'êtes pas autorisé à effectuer cette action" 
  };
}

// Error handling utilities
export function createErrorResult<T = any>(error: string): { success: false; error: string; data?: T } {
  return { success: false, error };
}

export function createSuccessResult<T>(data?: T): { success: true; data?: T; error?: never } {
  return { success: true, data };
} 