import { PhoneValidator } from '../phoneValidation';

describe('PhoneValidator', () => {
  describe('validate', () => {
    it('should validate empty phone numbers', () => {
      const result = PhoneValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    it('should validate South African mobile numbers', () => {
      const testCases = [
        '0812345678',
        '+27812345678',
        '27812345678',
        '081 234 5678',
        '081-234-5678',
        '(081) 234-5678'
      ];

      testCases.forEach(phone => {
        const result = PhoneValidator.validate(phone);
        expect(result.isValid).toBe(true);
        expect(result.formattedPhone).toBe('+27812345678');
      });
    });

    it('should validate South African landline numbers', () => {
      const testCases = [
        '0112345678',
        '+27112345678',
        '27112345678',
        '011 234 5678',
        '011-234-5678'
      ];

      testCases.forEach(phone => {
        const result = PhoneValidator.validate(phone);
        expect(result.isValid).toBe(true);
        expect(result.formattedPhone).toBe('+27112345678');
      });
    });

    it('should reject invalid phone numbers', () => {
      const testCases = [
        '123', // too short
        '12345678901234567890', // too long
        'abc123def', // contains letters
        '081234567', // too short for mobile
        '08123456789' // too long for standard format
      ];

      testCases.forEach(phone => {
        const result = PhoneValidator.validate(phone);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('isMobileNumber', () => {
    it('should identify mobile numbers correctly', () => {
      const mobileNumbers = [
        '0812345678',
        '0723456789',
        '0634567890',
        '+27812345678'
      ];

      mobileNumbers.forEach(phone => {
        expect(PhoneValidator.isMobileNumber(phone)).toBe(true);
      });
    });

    it('should reject landline numbers', () => {
      const landlineNumbers = [
        '0112345678',
        '0214567890',
        '+27112345678'
      ];

      landlineNumbers.forEach(phone => {
        expect(PhoneValidator.isMobileNumber(phone)).toBe(false);
      });
    });
  });

  describe('isLandlineNumber', () => {
    it('should identify landline numbers correctly', () => {
      const landlineNumbers = [
        '0112345678',
        '0214567890',
        '0317654321',
        '+27112345678'
      ];

      landlineNumbers.forEach(phone => {
        expect(PhoneValidator.isLandlineNumber(phone)).toBe(true);
      });
    });

    it('should reject mobile numbers', () => {
      const mobileNumbers = [
        '0812345678',
        '0723456789',
        '+27812345678'
      ];

      mobileNumbers.forEach(phone => {
        expect(PhoneValidator.isLandlineNumber(phone)).toBe(false);
      });
    });
  });

  describe('getPhoneType', () => {
    it('should return correct phone types', () => {
      expect(PhoneValidator.getPhoneType('0812345678')).toBe('mobile');
      expect(PhoneValidator.getPhoneType('0112345678')).toBe('landline');
      expect(PhoneValidator.getPhoneType('invalid')).toBe('unknown');
    });
  });

  describe('formatForDisplay', () => {
    it('should format mobile numbers for display', () => {
      expect(PhoneValidator.formatForDisplay('0812345678')).toBe('+27 81 234 5678');
      expect(PhoneValidator.formatForDisplay('+27812345678')).toBe('+27 81 234 5678');
    });

    it('should format landline numbers for display', () => {
      expect(PhoneValidator.formatForDisplay('0112345678')).toBe('+27 11 234 5678');
      expect(PhoneValidator.formatForDisplay('+27112345678')).toBe('+27 11 234 5678');
    });

    it('should return original for invalid numbers', () => {
      expect(PhoneValidator.formatForDisplay('invalid')).toBe('invalid');
    });
  });

  describe('sanitizeForStorage', () => {
    it('should return formatted phone for valid numbers', () => {
      expect(PhoneValidator.sanitizeForStorage('0812345678')).toBe('+27812345678');
      expect(PhoneValidator.sanitizeForStorage('0112345678')).toBe('+27112345678');
    });

    it('should return null for invalid numbers', () => {
      expect(PhoneValidator.sanitizeForStorage('invalid')).toBe(null);
      expect(PhoneValidator.sanitizeForStorage('')).toBe(null);
    });
  });
});