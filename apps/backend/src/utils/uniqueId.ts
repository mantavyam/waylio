import { customAlphabet } from 'nanoid';

// Create a custom alphabet without ambiguous characters (0, O, I, l, 1)
const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 5);

export const uniqueIdUtils = {
  /**
   * Generate a unique ID for doctors
   * Format: HOS-DOC-XXXXX
   */
  generateDoctorId(): string {
    return `HOS-DOC-${nanoid()}`;
  },

  /**
   * Generate a unique ID for staff
   * Format: HOS-STF-XXXXX
   */
  generateStaffId(): string {
    return `HOS-STF-${nanoid()}`;
  },

  /**
   * Validate unique ID format
   */
  validateUniqueId(uniqueId: string): boolean {
    const doctorPattern = /^HOS-DOC-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/;
    const staffPattern = /^HOS-STF-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/;
    return doctorPattern.test(uniqueId) || staffPattern.test(uniqueId);
  },

  /**
   * Get role from unique ID
   */
  getRoleFromUniqueId(uniqueId: string): 'DOCTOR' | 'RECEPTION' | null {
    if (uniqueId.startsWith('HOS-DOC-')) {
      return 'DOCTOR';
    }
    if (uniqueId.startsWith('HOS-STF-')) {
      return 'RECEPTION';
    }
    return null;
  },
};

