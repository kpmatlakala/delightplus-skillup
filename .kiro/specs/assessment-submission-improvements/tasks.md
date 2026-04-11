# Implementation Plan

- [x] 1. Create centralized phone validation utility


  - Create `src/utils/phoneValidation.ts` with PhoneValidator class
  - Implement South African phone number validation logic
  - Add phone number formatting functionality
  - Write unit tests for phone validation edge cases
  - _Requirements: 3.3, 3.4_

- [x] 2. Create enhanced error handling system


  - Create `src/services/uploadErrorHandler.ts` with error classification
  - Implement user-friendly error message mapping
  - Add error logging functionality with context capture
  - Create error UI components for different error types
  - _Requirements: 1.1, 1.2, 1.3, 1.4_




- [x] 3. Implement secure file upload service

  - Create `src/services/fileUploadService.ts` with path validation
  - Implement filename sanitization to remove forbidden characters
  - Add UUID validation for user and module IDs
  - Create secure path generation with proper structure
  - _Requirements: 1.5, 1.6, 2.1, 2.2, 2.5_


- [x] 4. Update Supabase storage policies for security



  - Create RLS policies for assessment-submissions bucket
  - Implement user-specific folder access controls
  - Add storage policies to prevent cross-user access
  - Test storage security with different user scenarios
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Refactor AssessmentForm profile data handling



  - Remove all fallbacks to user_metadata in AssessmentForm component
  - Implement proper loading states with spinner/skeleton UI
  - Add error handling for profile fetch failures with retry options



  - Integrate centralized phone validation utility
  - _Requirements: 3.1, 3.2, 3.5, 3.6_

- [x] 6. Create draft management system

  - Create `src/services/draftManager.ts` with local storage implementation

  - Implement auto-save functionality for assessment answers
  - Add draft recovery on page load with age validation
  - Create UI indicators for draft status and recovery
  - _Requirements: 4.2, 4.3_




- [x] 7. Implement navigation protection



  - Create `src/hooks/useNavigationGuard.ts` hook
  - Add beforeunload event handling for unsaved changes
  - Implement warning dialog for navigation attempts



  - Integrate navigation guard into assessment forms



  - _Requirements: 4.1_

- [x] 8. Enhance submission success flow



  - Create submission success UI with clear confirmation message
  - Implement download link generation for submitted files
  - Add optional email receipt functionality


  - Create submission status tracking and display
  - _Requirements: 4.4, 4.5, 4.6_

- [x] 9. Implement accessibility improvements




  - Add keyboard navigation support to all form elements
  - Implement screen reader compatibility with ARIA labels
  - Add focus management for error states and success flows
  - Test accessibility with keyboard-only navigation
  - _Requirements: 4.7_

- [ ] 10. Create database audit system
  - Create `cet.assessment_submissions_audit` table with proper schema
  - Implement submission logging RPC function
  - Add audit trail for all assessment submissions
  - Create admin interface for viewing audit logs
  - _Requirements: 5.3, 5.4_

- [ ] 11. Add database constraints and cleanup
  - Add CHECK constraint for phone number validation in cet.learners
  - Create cleanup function for invalid phone numbers
  - Implement orphaned file cleanup for assessment submissions
  - Add database maintenance procedures
  - _Requirements: 5.1, 5.2_

- [ ] 12. Create comprehensive test suite
  - Write unit tests for phone validation utility
  - Create integration tests for file upload flow
  - Add end-to-end tests for complete assessment submission
  - Implement error scenario testing (network failures, permissions)
  - _Requirements: 6.1, 6.5_

- [ ] 13. Implement monitoring and alerting
  - Create upload success rate tracking
  - Add error frequency monitoring by type


  - Implement storage usage alerts
  - Create admin dashboard for submission metrics
  - _Requirements: 6.2, 6.3, 6.4_



- [x] 14. Update existing assessment components


  - Refactor ModuleDetailPage assessment upload logic
  - Update BlockAssessmentPage with new error handling
  - Modify UnitAssessmentPage to use enhanced upload service
  - Ensure consistent error handling across all assessment forms
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.5_

- [ ] 15. Create admin tools for assessment management
  - Build admin interface for viewing submission audit logs
  - Create tools for managing storage cleanup
  - Add admin alerts for upload failures and permission errors
  - Implement admin dashboard for assessment submission metrics
  - _Requirements: 5.4, 6.2, 6.3_

- [x] 16. Implement mobile-responsive navigation system
  - Remove rigid progress tracking (intro->sessions->quiz) flow
  - Create flexible navigation menu for mobile devices
  - Allow direct access to any session or section without sequential requirements
  - Implement touch-friendly navigation elements with proper sizing
  - _Requirements: 7.1, 7.2, 7.6_

- [x] 17. Enhance mobile navigation UI components
  - Create responsive navigation sidebar that works on mobile
  - Implement collapsible section navigation similar to "Your Progress" sidebar
  - Add clear visual indicators for current location and available options
  - Ensure all navigation elements meet touch target size requirements (44px minimum)
  - _Requirements: 7.3, 7.4, 7.5_

- [x] 18. Optimize mobile content display and navigation
  - Prioritize content readability over rigid progress tracking on mobile
  - Implement responsive breakpoints for different screen sizes
  - Create mobile-first navigation patterns that adapt to small screens
  - Test navigation flow on various mobile devices and screen sizes
  - _Requirements: 7.3, 7.7_