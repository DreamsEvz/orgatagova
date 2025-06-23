import { CreateCarpoolData, ValidationResult } from "./types";

/**
 * Validates carpool creation data
 * @param data The carpool data to validate
 * @returns ValidationResult with isValid and potential error message
 */
export function validateCarpoolData(data: CreateCarpoolData): ValidationResult {
  // Required field validations
  if (!data.departure?.trim()) {
    return { isValid: false, error: "Departure location is required" };
  }

  if (!data.arrival?.trim()) {
    return { isValid: false, error: "Arrival location is required" };
  }

  if (!data.departureDate) {
    return { isValid: false, error: "Departure date is required" };
  }

  if (!data.departureTime) {
    return { isValid: false, error: "Departure time is required" };
  }

  // Seats validation
  const availableSeats = parseInt(data.availableSeats);
  if (!data.availableSeats || isNaN(availableSeats) || availableSeats <= 0) {
    return { isValid: false, error: "Available seats must be greater than 0" };
  }

  if (availableSeats > 20) {
    return { isValid: false, error: "Available seats cannot exceed 20" };
  }

  // Date validation
  const departureDateTime = new Date(`${data.departureDate}T${data.departureTime}`);
  const now = new Date();
  
  if (departureDateTime <= now) {
    return { isValid: false, error: "Departure date and time must be in the future" };
  }

  // Location validation (basic check for minimum length)
  if (data.departure.trim().length < 3) {
    return { isValid: false, error: "Departure location must be at least 3 characters long" };
  }

  if (data.arrival.trim().length < 3) {
    return { isValid: false, error: "Arrival location must be at least 3 characters long" };
  }

  // Description validation (optional but if provided, should have reasonable length)
  if (data.description && data.description.length > 500) {
    return { isValid: false, error: "Description cannot exceed 500 characters" };
  }

  return { isValid: true };
}

/**
 * Validates invitation code format
 * @param code The invitation code to validate
 * @returns ValidationResult
 */
export function validateInvitationCode(code: string): ValidationResult {
  if (!code?.trim()) {
    return { isValid: false, error: "Invitation code is required" };
  }

  const trimmedCode = code.trim();
  
  // Basic format validation (assuming codes are alphanumeric and have a specific length)
  if (trimmedCode.length < 6 || trimmedCode.length > 12) {
    return { isValid: false, error: "Invalid invitation code format" };
  }

  // Check for valid characters (alphanumeric)
  const validCodePattern = /^[A-Za-z0-9]+$/;
  if (!validCodePattern.test(trimmedCode)) {
    return { isValid: false, error: "Invitation code contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Validates user ID format
 * @param userId The user ID to validate
 * @returns ValidationResult
 */
export function validateUserId(userId: string): ValidationResult {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return { isValid: false, error: "Invalid user ID" };
  }

  return { isValid: true };
}

/**
 * Validates carpool ID format
 * @param carpoolId The carpool ID to validate
 * @returns ValidationResult
 */
export function validateCarpoolId(carpoolId: string): ValidationResult {
  if (!carpoolId || typeof carpoolId !== 'string' || carpoolId.trim() === '') {
    return { isValid: false, error: "Invalid carpool ID" };
  }

  return { isValid: true };
}

/**
 * Validates multiple IDs at once
 * @param ids Array of IDs to validate
 * @returns ValidationResult
 */
export function validateMultipleIds(...ids: string[]): ValidationResult {
  for (const id of ids) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return { isValid: false, error: "One or more IDs are invalid" };
    }
  }

  return { isValid: true };
} 