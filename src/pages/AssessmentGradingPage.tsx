import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Save, Eye, Clock, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAssessmentSubmissions } from "@/hooks/useAssessmentStatus";
import { modules } from "@/data/courseData";
import { fileUploadService } from "@/services/fileUploadService";

export default function AssessmentGradingPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { submissions, loading, gradeAssessment, refreshSubmissions } = useAssessmentSubmissions(id);
  
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGrading, setIsGrading] = useState(false);

  const module = modules.find(m => m.id === id);

  useEffect(() => {
    if (id) {
      refreshSubmissions();
    }
  }, [id, refreshSubmissions]);

  const openGradeDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || "");
    setFeedback(submission.feedback || "");
    setGradeDialogOpen(true);
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade) return;

    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast({
        title: "Invalid Grade",
        description: "Grade must be a number between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    setIsGrading(true);
    try {
      const success = await gradeAssessment(
        selectedSubmission.submission_id,
        gradeNum,
        feedback.trim() || undefined
      );

      if (success) {
        toast({
          title: "Assessment Graded",
          description: `Successfully graded ${selectedSubmission.learner_name}'s assessment.`
        });
        setGradeDialogOpen(false);
        setSelectedSubmission(null);
        setGrade("");
        setFeedback("");
      } else {
        toast({
          title: "Grading Failed",
          description: "Failed to save the grade. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Grading error:', error);
      toast({
        title: "Grading Error",
        description: "An error occurred while grading the assessment.",
        variant: "destructive"
      });
    } finally {
      setIsGrading(false);
    }
  };

  const downloadSubmission = async (submissionPath: string, learnerName: string) => {
    try {
      const downloadUrl = await fileUploadService.getDownloadUrl(submissionPath);
      if (downloadUrl) {
        // Create a temporary link to download with a proper filename
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${learnerName}_${module?.code || id}_assessment.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast({
          title: "Download Failed",
          description: "Unable to generate download link for this submission.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Error",
        description: "An error occurred while downloading the submission.",
        variant: "destructive"
      });
    }
  };

  if (!module) {
    return (
      <AppLayout title="Module Not Found" subtitle="">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Module not found.</p>
          <Button asChild className="mt-4">
            <Link to="/assessments">Return to Assessments</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`Grade Assessments - ${module.title}`}
      subtitle={`${module.code} • Block ${module.block} • ${module.credits} credits`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2"
          >
            <Link to="/assessments">
              <ArrowLeft size={16} />
              Back to Assessments
            </Link>
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <h1 className="text-xl font-bold">Assessment Submissions</h1>
                <p className="text-sm text-muted-foreground">
                  Review and grade learner submissions
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshSubmissions}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Submissions table */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
            <CardDescription>
              All assessment submissions for this module
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
                <p className="text-muted-foreground">
                  No learners have submitted assessments for this module yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={`${submission.learner_id}-${submission.unit_std_id}`}>
                        <TableCell className="font-medium">
                          {submission.learner_name}
                        </TableCell>
                        <TableCell>
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {submission.grade !== null ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 size={12} />
                              Graded
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <Clock size={12} />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {submission.grade !== null ? (
                            <Badge variant={submission.grade >= 50 ? "default" : "destructive"}>
                              {submission.grade}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadSubmission(submission.file_path, submission.learner_name)}
                              className="gap-1"
                            >
                              <Download size={12} />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openGradeDialog(submission)}
                              className="gap-1"
                            >
                              <Eye size={12} />
                              {submission.grade !== null ? "Edit Grade" : "Grade"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grading Dialog */}
        <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Grade Assessment</DialogTitle>
              <DialogDescription>
                Grade {selectedSubmission?.learner_name}'s assessment submission
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter grade..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the learner..."
                  rows={4}
                />
              </div>

              {selectedSubmission?.submitted_at && (
                <div className="text-sm text-muted-foreground">
                  <p><strong>Submitted:</strong> {new Date(selectedSubmission.submitted_at).toLocaleString()}</p>
                  {selectedSubmission.graded_at && (
                    <p><strong>Previously graded:</strong> {new Date(selectedSubmission.graded_at).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGradeDialogOpen(false)}
                disabled={isGrading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGradeSubmission}
                disabled={isGrading || !grade}
                className="gap-2"
              >
                {isGrading ? (
                  <>
                    <Clock size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Grade
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}