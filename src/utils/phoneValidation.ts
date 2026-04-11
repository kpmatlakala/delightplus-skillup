export interface PhoneValidationResult {
  isValid: boolean;
  formattedPhone?: string;
  error?: string;
  suggestion?: string;
}

export class PhoneValidator {
  static validate(phone: string): PhoneValidationResult {
    const trimmed = phone.trim();
    
    if (!trimmed) {
      return {
        isValid: false,
        error: 'Phone number is required',
        suggestion: 'Please enter your phone number'
      };
    }
    
    // Remove common formatting characters
    const digitsOnly = trimmed.replace(/[\s\-\(\)\+]/g, '');
    
    // South African phone number validation
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        isValid: false,
        error: 'Invalid phone number length',
        suggestion: 'Please enter a valid South African phone number (10-15 digits)'
      };
    }
    
    // Format for South African numbers
    const formatted = this.formatSouthAfricanNumber(digitsOnly);
    
    return {
      isValid: true,
      formattedPhone: formatted
    };
  }
  
  private static formatSouthAfricanNumber(digits: string): string {
    // Implementation for SA number formatting
    if (digits.startsWith('27')) {
      return `+${digits}`;
    } else if (digits.startsWith('0')) {
      return `+27${digits.substring(1)}`;
    }
    return `+27${digits}`;
  }
}