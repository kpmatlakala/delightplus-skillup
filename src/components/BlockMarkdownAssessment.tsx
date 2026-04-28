import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, FileText, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentPayload } from "@/components/AssessmentForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { BlockAssessmentQuestion, BlockAssessmentSection } from "@/data/blockAssessmentQuestions";

interface BlockMarkdownAssessmentProps {
  title: string;
  blockNum: string;
  markdown?: string;
  sections: BlockAssessmentSection[];
  onRequestSubmit: (payload: AssessmentPayload) => void;
  isSubmitting?: boolean;
  submitError?: string;
  disabled?: boolean;
}

export default function BlockMarkdownAssessment({
  title,
  blockNum,
  sections,
  onRequestSubmit,
  isSubmitting,
  submitError,
  disabled = false,
}: BlockMarkdownAssessmentProps) {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [submissionMode, setSubmissionMode] = useState<"online" | "upload">("online");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [declarations, setDeclarations] = useState({ rules: false, integrity: false });
  const assessmentTopRef = useRef<HTMLDivElement | null>(null);
  const previousPageRef = useRef(0);
  const [learnerInfo, setLearnerInfo] = useState({
    name: "",
    idNumber: "",
    contactNumber: "",
    department: "",
    school: "",
    date: new Date().toLocaleDateString("en-ZA"),
    venue: "CET Connect Portal",
    assessor: "Kabelo Matlakala",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLearnerProfile = async () => {
      if (!user?.id) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setProfileError(null);

        const supabaseAny = supabase as unknown as {
          from: (table: string) => {
            select: (columns: string) => {
              eq: (column: string, value: string) => {
                single: () => Promise<{
                  data: {
                    full_name: string | null;
                    id_number: string | null;
                    phone: string | null;
                    department: string | null;
                    school: string | null;
                  } | null;
                  error: { message?: string } | null;
                }>;
              };
            };
          };
        };

        const { data, error } = await supabaseAny
          .from("learners")
          .select("full_name, id_number, phone, department, school")
          .eq("user_id", user.id)
          .single();

        if (error) {
          setProfileError("Your learner profile could not be loaded automatically. You can still type it in below.");
        }

        if (data) {
          setLearnerInfo((prev) => ({
            ...prev,
            name: data.full_name ?? prev.name,
            idNumber: data.id_number ?? prev.idNumber,
            contactNumber: data.phone ?? prev.contactNumber,
            department: data.department ?? prev.department,
            school: data.school ?? prev.school,
          }));
        }
      } catch (error) {
        console.error("[Block Assessment] Failed to load learner profile:", error);
        setProfileError("Your learner profile could not be loaded automatically. You can still type it in below.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchLearnerProfile();
  }, [user?.id]);

  useEffect(() => {
    if (previousPageRef.current !== page) {
      assessmentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      previousPageRef.current = page;
    }
  }, [page]);

  const totalQuestions = useMemo(
    () => sections.reduce((sum, section) => sum + section.questions.length, 0),
    [sections]
  );
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim().length > 0).length,
    [answers]
  );

  const updateAnswer = (questionId: string, value: string) => {
    setLocalError(null);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const updateLearnerField = (field: keyof typeof learnerInfo, value: string) => {
    setLocalError(null);
    setLearnerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const getQuestionFieldKeys = (question: BlockAssessmentQuestion) => {
    if (question.subFields?.length) {
      return question.subFields.map((_, fieldIndex) => `${question.id}::sub::${fieldIndex}`);
    }

    if (question.inputType === "table" && question.tableRows?.length && question.tableColumns?.length) {
      return question.tableRows.flatMap((_, rowIndex) =>
        question.tableColumns!.map((_, columnIndex) => `${question.id}::${rowIndex}::${columnIndex}`)
      );
    }

    return [question.id];
  };

  const isQuestionAnswered = (question: BlockAssessmentQuestion) =>
    getQuestionFieldKeys(question).every((key) => (answers[key] ?? "").trim().length > 0);

  const buildSubmissionText = () => {
    const lines: string[] = [
      "═══════════════════════════════════════════════════════════",
      `BLOCK ${blockNum} INTERACTIVE ASSESSMENT`,
      title,
      "═══════════════════════════════════════════════════════════",
      "",
      "LEARNER INFORMATION",
      `Full Name:      ${learnerInfo.name}`,
      `ID Number:      ${learnerInfo.idNumber}`,
      `Contact Number: ${learnerInfo.contactNumber}`,
      `Department:     ${learnerInfo.department}`,
      `School:         ${learnerInfo.school}`,
      `Date:           ${learnerInfo.date}`,
      `Venue:          ${learnerInfo.venue}`,
      `Assessor:       ${learnerInfo.assessor}`,
      `Submission:     ${submissionMode}`,
      `Submitted:      ${new Date().toISOString()}`,
      "",
    ];

    if (submissionMode === "upload") {
      lines.push("Learner chose to complete the paper offline and upload an answerbook.");
      lines.push(`Uploaded file: ${selectedFile?.name ?? "No file selected"}`);
      return lines.join("\n");
    }

    if (!sections.length) {
      lines.push("GENERAL RESPONSE");
      lines.push(answers["general-response"]?.trim() || "(no answer provided)");
      return lines.join("\n");
    }

    sections.forEach((section) => {
      lines.push(`${section.title} — ${section.module} [${section.totalMarks} marks]`);
      lines.push("-".repeat(59));
      section.questions.forEach((question) => {
        lines.push(`${question.label} (${question.marks} marks)`);
        lines.push(question.prompt);

        if (question.subFields?.length) {
          question.subFields.forEach((field, fieldIndex) => {
            const fieldKey = `${question.id}::sub::${fieldIndex}`;
            lines.push(`${field.label}: ${answers[fieldKey]?.trim() || "(blank)"}`);
          });
        } else if (question.inputType === "table" && question.tableRows?.length && question.tableColumns?.length) {
          question.tableRows.forEach((rowLabel, rowIndex) => {
            lines.push(`- ${rowLabel}`);
            question.tableColumns?.forEach((columnLabel, columnIndex) => {
              const cellKey = `${question.id}::${rowIndex}::${columnIndex}`;
              lines.push(`  ${columnLabel}: ${answers[cellKey]?.trim() || "(blank)"}`);
            });
          });
        } else {
          lines.push(`Answer: ${answers[question.id]?.trim() || "(no answer provided)"}`);
        }

        lines.push("");
      });
    });

    lines.push("AUTO_MARK_DATA_START");
    lines.push(JSON.stringify({
      blockNum,
      title,
      learnerInfo,
      responses: answers,
      generatedAt: new Date().toISOString(),
    }));
    lines.push("AUTO_MARK_DATA_END");

    return lines.join("\n");
  };

  const handleSubmit = () => {
    setLocalError(null);

    if (submissionMode === "upload") {
      if (!selectedFile) {
        setLocalError("Please select a PDF or Word document before submitting.");
        return;
      }

      onRequestSubmit({
        submissionText: buildSubmissionText(),
        uploadMode: "upload",
        uploadFile: selectedFile,
        fileName: selectedFile.name,
        metadata: {
          blockNum,
          learnerInfo,
          completedInPlatform: false,
        },
      });
      return;
    }

    onRequestSubmit({
      submissionText: buildSubmissionText(),
      uploadMode: "online",
      metadata: {
        blockNum,
        learnerInfo,
        responses: answers,
        answeredCount,
        totalQuestions,
        completedInPlatform: true,
      },
    });
  };

  const canStart =
    !disabled &&
    learnerInfo.name.trim().length > 0 &&
    declarations.rules &&
    declarations.integrity;

  const totalPages = submissionMode === "online"
    ? Math.max(2, sections.length + 1)
    : 2;

  const renderInput = (question: BlockAssessmentQuestion) => {
    if (question.inputType === "radio") {
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-start gap-2 text-sm text-foreground rounded-md border border-border px-3 py-2 hover:bg-background cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                disabled={disabled || isSubmitting}
                className="mt-1"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.inputType === "select") {
      return (
        <select
          value={answers[question.id] ?? ""}
          onChange={(e) => updateAnswer(question.id, e.target.value)}
          disabled={disabled || isSubmitting}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">Choose...</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (question.inputType === "table") {
      const rows = question.tableRows ?? [];
      const columns = question.tableColumns ?? [];

      const columnInputTypes = question.tableColumnInputTypes ?? columns.map((_, index) =>
        index === 0 && columns.length > 1 ? "text" : "textarea"
      );
      const columnOptions = question.tableColumnOptions ?? [];

      const renderTableCell = (cellKey: string, columnIndex: number, compact = false) => {
        const cellType = columnInputTypes[columnIndex] ?? "text";
        const options = columnOptions[columnIndex] ?? [];
        const baseClass = compact
          ? "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          : "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

        if (cellType === "select") {
          return (
            <select
              value={answers[cellKey] ?? ""}
              onChange={(e) => updateAnswer(cellKey, e.target.value)}
              disabled={disabled || isSubmitting}
              className={baseClass}
            >
              <option value="">Choose...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }

        if (cellType === "textarea") {
          return (
            <textarea
              value={answers[cellKey] ?? ""}
              onChange={(e) => updateAnswer(cellKey, e.target.value)}
              rows={2}
              disabled={disabled || isSubmitting}
              className={`${baseClass} resize-y`}
            />
          );
        }

        return (
          <input
            type="text"
            value={answers[cellKey] ?? ""}
            onChange={(e) => updateAnswer(cellKey, e.target.value)}
            disabled={disabled || isSubmitting}
            className={baseClass}
          />
        );
      };

      return (
        <div className="space-y-3">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted px-2 py-2 text-left font-semibold text-foreground">#</th>
                  {columns.map((column) => (
                    <th key={column} className="border border-border bg-muted px-2 py-2 text-left font-semibold text-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((rowLabel, rowIndex) => (
                  <tr key={rowLabel}>
                    <td className="border border-border bg-background px-2 py-2 font-medium text-foreground align-top">
                      {rowLabel}
                    </td>
                    {columns.map((columnLabel, columnIndex) => {
                      const cellKey = `${question.id}::${rowIndex}::${columnIndex}`;

                      return (
                        <td key={cellKey} className="border border-border px-2 py-2 align-top bg-background">
                          {renderTableCell(cellKey, columnIndex, true)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {rows.map((rowLabel, rowIndex) => (
              <div key={rowLabel} className="rounded-md border border-border bg-background p-3 space-y-2">
                <p className="text-xs font-semibold text-primary">{rowLabel}</p>
                {columns.map((columnLabel, columnIndex) => {
                  const cellKey = `${question.id}::${rowIndex}::${columnIndex}`;

                  return (
                    <div key={cellKey}>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{columnLabel}</label>
                      {renderTableCell(cellKey, columnIndex, false)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (question.inputType === "textarea") {
      if (question.subFields?.length) {
        const isPseudocodeBuilder = question.id === "b2-s1-b1";
        const previewLines = question.subFields
          .map((_, fieldIndex) => answers[`${question.id}::sub::${fieldIndex}`]?.trim() ?? "")
          .filter((line) => line.length > 0 && !line.toLowerCase().startsWith("select line"));

        return (
          <div className="space-y-3">
            {question.subFields.map((field, fieldIndex) => {
              const fieldKey = `${question.id}::sub::${fieldIndex}`;
              const fieldType = field.inputType ?? "textarea";

              return (
                <div key={fieldKey}>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{field.label}</label>

                  {fieldType === "select" ? (
                    <select
                      value={answers[fieldKey] ?? ""}
                      onChange={(e) => updateAnswer(fieldKey, e.target.value)}
                      disabled={disabled || isSubmitting}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="">Choose...</option>
                      {(field.options ?? []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : fieldType === "text" ? (
                    <input
                      type="text"
                      value={answers[fieldKey] ?? ""}
                      onChange={(e) => updateAnswer(fieldKey, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={disabled || isSubmitting}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  ) : (
                    <textarea
                      value={answers[fieldKey] ?? ""}
                      onChange={(e) => updateAnswer(fieldKey, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows ?? 3}
                      disabled={disabled || isSubmitting}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  )}
                </div>
              );
            })}

            {isPseudocodeBuilder ? (
              <div className="rounded-md border border-border bg-background p-3">
                <p className="mb-2 text-xs font-semibold text-foreground">Pseudocode Preview</p>
                <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
{previewLines.length ? previewLines.join("\n") : "Choose options above to build your pseudocode preview."}
                </pre>
              </div>
            ) : null}
          </div>
        );
      }

      return (
        <textarea
          value={answers[question.id] ?? ""}
          onChange={(e) => updateAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={question.rows ?? 4}
          disabled={disabled || isSubmitting}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      );
    }

    return (
      <input
        type="text"
        value={answers[question.id] ?? ""}
        onChange={(e) => updateAnswer(question.id, e.target.value)}
        placeholder={question.placeholder}
        disabled={disabled || isSubmitting}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    );
  };

  const renderQuestionCard = (question: BlockAssessmentQuestion, displayLabel?: string) => {
    const isDiagramLabelSelector = question.id.includes("-b3b-") && question.inputType === "select";

    if (isDiagramLabelSelector) {
      return (
        <div key={question.id} className="rounded-lg border border-border bg-muted/20 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {displayLabel ?? question.label}
            </span>
            <div className="flex-1">{renderInput(question)}</div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {question.marks} mark{question.marks === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div key={question.id} className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground mt-1 leading-relaxed">
              <span className="font-bold text-primary mr-1">{displayLabel ?? question.label}</span>
              <span dangerouslySetInnerHTML={{ __html: question.prompt }} />
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {question.marks} mark{question.marks === 1 ? "" : "s"}
          </span>
        </div>
        {renderInput(question)}
      </div>
    );
  };

  if (page === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Page 1 of {totalPages}</p>
            <p className="text-sm text-foreground">
              Complete your learner information, read the rules below, then choose how you want to complete the paper.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <UserRound size={16} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">Learner Information</p>
            </div>

            {profileError && (
              <p className="text-xs text-amber-700 dark:text-amber-300">{profileError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Full Name & Surname", "name"],
                ["ID Number", "idNumber"],
                ["Contact Number", "contactNumber"],
                ["Department", "department"],
                ["School / Institution", "school"],
                ["Date", "date"],
                ["Venue", "venue"],
                ["Assessor", "assessor"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={learnerInfo[key as keyof typeof learnerInfo]}
                    onChange={(e) => updateLearnerField(key as keyof typeof learnerInfo, e.target.value)}
                    disabled={disabled || isSubmitting || loadingProfile}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Rules & Instructions</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
              <li>Answer all questions in the relevant sections.</li>
              <li>For on-platform completion, use radio buttons, dropdowns, short inputs, and text areas directly in the paper.</li>
              <li>For offline completion, upload a <code>.pdf</code>, <code>.doc</code>, <code>.docx</code>, or <code>.txt</code> answerbook.</li>
              <li>Where a figure is provided, answer it inside the matching <strong>B3</strong> card on that section page.</li>
            </ol>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setSubmissionMode("online")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                submissionMode === "online"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/30"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">Complete on the platform</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use radio buttons, dropdowns, short inputs, and text areas directly in the paper.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSubmissionMode("upload")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                submissionMode === "upload"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/30"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">Upload PDF / Word instead</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Complete the paper offline, then upload a <code>.pdf</code>, <code>.doc</code>, <code>.docx</code>, or <code>.txt</code> file.
              </p>
            </button>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-4 space-y-2">
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={declarations.rules}
                onChange={(e) => setDeclarations((prev) => ({ ...prev, rules: e.target.checked }))}
                className="mt-0.5"
                disabled={disabled || isSubmitting}
              />
              I have read the rules and instructions for this assessment.
            </label>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={declarations.integrity}
                onChange={(e) => setDeclarations((prev) => ({ ...prev, integrity: e.target.checked }))}
                className="mt-0.5"
                disabled={disabled || isSubmitting}
              />
              I confirm that the work I submit is my own.
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              {submissionMode === "online"
                ? "After Start, Section 1 opens first and you continue section by section."
                : "After Continue, you can upload your completed answerbook."}
            </p>
            <Button onClick={() => setPage(1)} disabled={!canStart}>
              {submissionMode === "online" ? "Start" : "Continue"}
            </Button>
          </div>
        </div>

        {(submitError || localError) && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{submitError || localError}</span>
          </div>
        )}
      </div>
    );
  }

  if (submissionMode === "upload") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Page 2 of 2 · Offline upload option</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose your completed file below. Accepted formats: <code>PDF</code>, <code>DOC</code>, <code>DOCX</code>, or plain text.
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            disabled={disabled || isSubmitting}
            onChange={(e) => {
              setLocalError(null);
              setSelectedFile(e.target.files?.[0] ?? null);
            }}
            className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
          {selectedFile && (
            <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>
          )}
        </div>

        {(submitError || localError) && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{submitError || localError}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <Button variant="outline" onClick={() => setPage(0)}>
            <ChevronLeft size={14} className="mr-1" /> Previous
          </Button>
          <Button onClick={handleSubmit} disabled={disabled || isSubmitting || !selectedFile}>
            {isSubmitting ? "Submitting…" : "Upload & Submit"}
          </Button>
        </div>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Page 2 of 2 · Online response</p>
            <p className="text-xs text-muted-foreground mt-1">
              This block is still being prepared for full section-by-section interaction. You can still type a response here for testing.
            </p>
          </div>
          <textarea
            value={answers["general-response"] ?? ""}
            onChange={(e) => updateAnswer("general-response", e.target.value)}
            rows={14}
            disabled={disabled || isSubmitting}
            placeholder="Type your response here..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {(submitError || localError) && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{submitError || localError}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <Button variant="outline" onClick={() => setPage(0)}>
            <ChevronLeft size={14} className="mr-1" /> Previous
          </Button>
          <Button onClick={handleSubmit} disabled={disabled || isSubmitting || !(answers["general-response"] ?? "").trim()}>
            {isSubmitting ? "Submitting…" : "Review & Submit"}
          </Button>
        </div>
      </div>
    );
  }

  const currentSection = sections[page - 1];

  if (!currentSection) {
    return null;
  }

  const sectionAQuestions = currentSection.questions.filter((question) => question.label.includes("A"));
  const sectionBQuestions = currentSection.questions.filter(
    (question) => !question.id.includes("-b3") && question.label.includes("B")
  );
  const sectionB3Questions = currentSection.questions.filter((question) => question.id.includes("-b3"));
  const unansweredCurrentQuestions = currentSection.questions.filter((question) => !isQuestionAnswered(question));
  const canContinueFromCurrentPage = unansweredCurrentQuestions.length === 0;
  const isLastSection = page === sections.length;
  const progressPercent = Math.round((page / sections.length) * 100);

  const goToPreviousPage = () => {
    setLocalError(null);
    setPage(Math.max(0, page - 1));
  };

  const goToNextPage = () => {
    if (!canContinueFromCurrentPage) {
      setLocalError(
        `Please answer all questions on this page before continuing. ${unansweredCurrentQuestions.length} item(s) still need a response.`
      );
      assessmentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setLocalError(null);
    setPage(page + 1);
  };

  const submitCurrentPage = () => {
    if (!canContinueFromCurrentPage) {
      setLocalError(
        `Please answer all questions on this page before submitting. ${unansweredCurrentQuestions.length} item(s) still need a response.`
      );
      assessmentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    handleSubmit();
  };

  return (
    <div ref={assessmentTopRef} className="space-y-4">
      <div className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-foreground">
          Page {page + 1} of {totalPages} · {currentSection.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {answeredCount} of {totalQuestions} response fields completed · {progressPercent}% complete
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{currentSection.title}</p>
          <h4 className="text-base font-semibold text-foreground mt-1">{currentSection.module}</h4>
          <p className="text-xs text-muted-foreground mt-1">Total: {currentSection.totalMarks} marks</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Section A — Multiple Choice</p>
            {sectionAQuestions.map((question, index) => renderQuestionCard(question, `${index + 1}.`))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Section B — Written Responses</p>
            {sectionBQuestions.map((question) => renderQuestionCard(question))}
          </div>

          {sectionB3Questions.length > 0 && blockNum === "1" && (
            <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                  {currentSection.title.replace("Section ", "")}.B3
                </p>
                <p className="text-sm text-foreground mt-1">
                  Refer to Figure A below. First identify the diagram type, then complete markers 1–4 using the selectors below.
                </p>
              </div>

              {currentSection.figureSrc && (
                <div className="rounded-lg border border-border bg-white p-2">
                  <img
                    src={currentSection.figureSrc}
                    alt={currentSection.figureAlt || `${currentSection.title} figure`}
                    className="mx-auto w-full max-w-3xl rounded-md"
                  />
                </div>
              )}

              <div className="space-y-3">
                {sectionB3Questions.map((question) => renderQuestionCard(question))}
              </div>
            </div>
          )}

          {sectionB3Questions.length > 0 && blockNum !== "1" && (
            <div className="space-y-3">
              {sectionB3Questions.map((question) => renderQuestionCard(question))}
            </div>
          )}
        </div>
      </div>

      {(submitError || localError) && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{submitError || localError}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        {!canContinueFromCurrentPage && (
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Answer all questions on this page before continuing. Remaining: {unansweredCurrentQuestions.length}.
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={goToPreviousPage}>
            <ChevronLeft size={14} className="mr-1" /> Previous
          </Button>
          <Button onClick={isLastSection ? submitCurrentPage : goToNextPage} disabled={disabled || isSubmitting || !canContinueFromCurrentPage}>
            {isSubmitting ? "Submitting…" : isLastSection ? "Review & Submit" : "Next Section"}
            {!isLastSection && <ChevronRight size={14} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
