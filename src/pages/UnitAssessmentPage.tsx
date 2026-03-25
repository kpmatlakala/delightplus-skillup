import AppLayout from "@/components/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentForm } from "@/components/AssessmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, FileText, CheckCircle2 } from "lucide-react";

export default function UnitAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const { role, user } = useAuth();
  const { progressMap, updateProgress } = useModuleProgress();
  const navigate = useNavigate();

  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const moduleProgress = id ? progressMap[id] : null;
  const assessmentUnlocked = moduleProgress?.assessment_unlocked ?? false;
  const assessmentSubmitted = moduleProgress?.assessment_submitted ?? false;

  useEffect(() => {
    if (!assessmentUnlocked) {
      navigate(`/learner/modules/${id}`);
    }
  }, [id, assessmentUnlocked, navigate]);

  if (!id || !user) {
    return (
      <AppLayout title="Assessment">
        <div className="p-8 text-center text-muted-foreground">
          Loading assessment...
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = async (payload: { submissionText: string }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Mark as submitted in progress
      await updateProgress(id, { assessment_submitted: true, assessment_submitted_at: new Date().toISOString() });

      // Upload to storage
      const path = `learner-${user.id}/assessments/unit-${id}/${Date.now()}-submission.txt`;
      const { error } = await supabase.storage
        .from("assessment-submissions")
        .upload(path, new Blob([payload.submissionText], { type: "text/plain" }), {
          upsert: true,
        });

      if (error) throw error;

      setSubmissionText(payload.submissionText);
      setSubmitted(true);
    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title={`Unit Assessment — ${id}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/learner/modules/${id}`)}>
            ← Back to Module
          </Button>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <span className="font-semibold">Unit Summative Assessment</span>
          </div>
        </div>

        {assessmentSubmitted && !submitted && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Assessment already submitted. Use "View Submission" or submit new version.
            </AlertDescription>
          </Alert>
        )}

        {/* Assessment Form */}
        <AssessmentForm
          moduleId={id}
          answers={{}}
          onAnswerChange={() => {}}
          learnerName={user.user_metadata?.full_name || "Learner"}
          profile={{
            id_number: "",
            phone: user.user_metadata?.phone_number || "",
            department: "",
            school: "",
          }}
          onRequestSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />

        {submitted && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Complete</CardTitle>
              <CardDescription>
                Your assessment has been saved and marked as submitted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate("/poe")} className="w-full">
                Add to Portfolio of Evidence
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Version
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

