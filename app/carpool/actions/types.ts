import { Carpool, User } from "@prisma/client";

// Core data interfaces
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

// Generic action result type
export interface CarpoolActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Carpool status enumeration
export type CarpoolStatus = "finished" | "archived" | "ongoing";

// Extended carpool types
export type CarpoolWithCreator = Carpool & { 
  creator: User;
};

export type CarpoolWithParticipants = Carpool & {
  participants: User[];
};

export type CarpoolDetailed = Carpool & {
  creator: User;
  participants: User[];
  soberDriver?: User | null;
};

// Participant management types
export interface ParticipantOperationResult {
  success: boolean;
  updatedSeats?: number;
  error?: string;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Database operation types
export interface CarpoolQuery {
  isFinished?: boolean;
  isArchived?: boolean;
  availableSeats?: { gt?: number };
  participants?: { some: { userId: string } };
} 