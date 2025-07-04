/**
 * DEPRECATED: This file now acts as a compatibility layer.
 * Please use imports from './actions' directly for new code.
 * 
 * This file re-exports all functions from the new modular structure
 * to maintain backward compatibility with existing imports.
 * 
 * Note: No "use server" directive here as this file only re-exports.
 * The actual server actions are marked in their respective modules.
 */

// Re-export all types with proper syntax for isolatedModules
export type { 
  CreateCarpoolData,
  CarpoolActionResult,
  CarpoolStatus,
  CarpoolWithCreator,
  CarpoolWithParticipants,
  CarpoolDetailed,
  ValidationResult,
  ParticipantOperationResult
} from "./actions/types";

// Re-export creation actions
export {
  createCarpoolAction,
  createCarpoolTemplate
} from "./actions/creation";

// Re-export query actions
export {
  getCarpoolsAndParticipants,
  getCarpoolsWhereUserBelongs,
  getFinishedCarpools,
  getUserUnFinishedCarpools,
  findUniqueCarpool,
  getCarpoolStatus,
  getCarpoolParticipants,
  getCarpoolSoberDriver,
  searchCarpools
} from "./actions/queries";

// Re-export participant actions
export {
  joinCarpoolAction,
  joinCarpoolWithCodeAction,
  joinCarpoolAsSoberAction,
  deleteParticipantAction,
  swapSoberDriverAction
} from "./actions/participants";

// Re-export management actions
export {
  finishCarpoolAction,
  archiveCarpoolAction,
  unarchiveCarpoolAction,
  deleteCarpoolAction,
  updateCarpoolAction
} from "./actions/management";

// Re-export validation utilities
export {
  validateCarpoolData,
  validateInvitationCode,
  validateUserId,
  validateCarpoolId,
  validateMultipleIds
} from "./actions/validation";

// Re-export async utility functions
export {
  enrichCarpoolsWithCreators,
  addParticipantAndUpdateSeats,
  removeParticipantAndUpdateSeats
} from "./actions/utils";

// Re-export sync utility functions
export {
  createErrorResult,
  createSuccessResult,
  canManageParticipant,
  validateCarpoolActive
} from "./actions/helpers"; 