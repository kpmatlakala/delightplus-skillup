/**
 * Mobile-Optimized Submission Success Component
 * Designed for mature learners using phones with clear, large interface elements
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Phone, 
  Mail, 
  ArrowRight, 
  Clock,
  FileText,
  Home,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface MobileSubmissionSuccessProps {
  submission: {
    submissionId: string;
    filePath: string;
    fileName: string;
    timestamp: Date;
    moduleId: string;
    moduleTitle?: string;
  };
  learnerName?: string;
  facilitatorPhone?: string;
  onDownloadSubmission?: () => void;
  onNavigateToPortal?: () => void;
  onNavigateToModule?: () => void;
}

export const MobileSubmissionSuccess: React.FC<MobileSubmissionSuccessProps> = ({
  submission,
  learnerName,
  facilitatorPhone = "012 345 6789",
  onDownloadSubmission,
  onNavigateToPortal,
  onNavigateToModule
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Johannesburg'
    });
  };

  const shareSubmissionDetails = async () => {
    const shareText = `Assessment Submitted Successfully!
Module: ${submission.moduleTitle || submission.moduleId}
Submitted: ${formatTimestamp(submission.timestamp)}
Reference: ${submission.submissionId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Assessment Submitted',
          text: shareText
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard?.writeText(shareText);
        alert('Submission details copied to clipboard');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard?.writeText(shareText);
      alert('Submission details copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-8">
      {/* Success Header */}
      <div className="text-center py-8 px-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Assessment Submitted!
        </h1>
        
        <p className="text-lg text-green-700 mb-4">
          Well done, {learnerName || 'Student'}!
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mx-auto max-w-sm">
          <p className="text-sm text-gray-600 mb-1">Submitted on</p>
          <p className="font-semibold text-gray-900">
            {formatTimestamp(submission.timestamp)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {/* Status Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Assessment is Being Reviewed</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Your facilitator will review your work and provide feedback. 
                This usually takes 2-3 business days.
              </p>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Assessment Submitted ✓</p>
                <p className="text-xs text-gray-600">Just completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Under Review</p>
                <p className="text-xs text-gray-600">2-3 business days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Results Available</p>
                <p className="text-xs text-gray-600">You'll be notified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-1 gap-3">
            {onDownloadSubmission && (
              <Button
                onClick={onDownloadSubmission}
                className="h-14 text-base bg-blue-600 hover:bg-blue-700"
              >
                <Download size={20} className="mr-3" />
                <div className="text-left">
                  <div>Download My Submission</div>
                  <div className="text-xs opacity-90">Save a copy to your phone</div>
                </div>
              </Button>
            )}

            <Button
              onClick={shareSubmissionDetails}
              variant="outline"
              className="h-14 text-base"
            >
              <Share2 size={20} className="mr-3" />
              <div className="text-left">
                <div>Share Confirmation</div>
                <div className="text-xs text-gray-600">Send details to someone</div>
              </div>
            </Button>
          </div>

          {/* Contact Facilitator */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Phone size={18} />
                Need Help?
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                If you have questions about your submission, contact your facilitator:
              </p>
              <Button
                variant="outline"
                className="w-full h-12 text-base border-orange-300 text-orange-800 hover:bg-orange-100"
                onClick={() => window.open(`tel:${facilitatorPhone}`)}
              >
                <Phone size={18} className="mr-2" />
                Call {facilitatorPhone}
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-3">
            {onNavigateToModule && (
              <Button
                variant="outline"
                onClick={onNavigateToModule}
                className="h-12 text-sm"
              >
                <FileText size={16} className="mr-2" />
                Back to Module
              </Button>
            )}
            
            {onNavigateToPortal && (
              <Button
                variant="outline"
                onClick={onNavigateToPortal}
                className="h-12 text-sm"
              >
                <Home size={16} className="mr-2" />
                Home
              </Button>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left"
            >
              <CardTitle className="text-base flex items-center justify-between">
                Submission Details
                <ArrowRight 
                  size={16} 
                  className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`} 
                />
              </CardTitle>
            </button>
          </CardHeader>
          
          {showDetails && (
            <CardContent className="pt-0 space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Reference Number:</span>
                  <span className="text-sm font-mono text-gray-900">{submission.submissionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Module:</span>
                  <span className="text-sm text-gray-900">{submission.moduleTitle || submission.moduleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">File Name:</span>
                  <span className="text-sm text-gray-900">{submission.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Submitted:</span>
                  <span className="text-sm text-gray-900">{formatTimestamp(submission.timestamp)}</span>
                </div>
              </div>
              
              <Alert>
                <AlertDescription className="text-sm">
                  Keep this reference number: <strong>{submission.submissionId}</strong>
                  <br />
                  You can use it to track your submission or when contacting your facilitator.
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>

        {/* Important Notice */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-sm text-yellow-800">
            <strong>Important:</strong> You will receive a notification when your assessment has been graded. 
            Make sure your phone notifications are turned on for this app.
          </AlertDescription>
        </Alert>

        {/* Tips for Mobile Users */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Tips for Next Time:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Your work is automatically saved as you type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>You can take breaks and come back to finish later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Make sure you have good internet when submitting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Contact your facilitator if you need help</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};