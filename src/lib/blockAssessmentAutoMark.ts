export interface AutoMarkItem {
  key: string;
  label: string;
  learnerAnswer: string;
  expected: string;
  awarded: number;
  maxMarks: number;
  correct: boolean;
  note?: string;
}

export interface AutoMarkResult {
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  results: AutoMarkItem[];
  summary: string;
}

type AnswersMap = Record<string, string>;

const normalize = (value: string | undefined | null) =>
  (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");

const sameAsAny = (answer: string, accepted: string[]) =>
  accepted.some((item) => normalize(answer) === normalize(item));

function addExact(
  results: AutoMarkItem[],
  key: string,
  label: string,
  learnerAnswer: string,
  accepted: string[],
  marks: number,
  note?: string,
) {
  const correct = sameAsAny(learnerAnswer, accepted);
  results.push({
    key,
    label,
    learnerAnswer: learnerAnswer || "(blank)",
    expected: accepted.join(" / "),
    awarded: correct ? marks : 0,
    maxMarks: marks,
    correct,
    note,
  });
}

function parseEmbeddedAnswers(submissionText: string): AnswersMap {
  const embedded = submissionText.match(/AUTO_MARK_DATA_START\s*([\s\S]*?)\s*AUTO_MARK_DATA_END/);
  if (embedded?.[1]) {
    try {
      const parsed = JSON.parse(embedded[1]);
      if (parsed && typeof parsed === "object" && parsed.responses) {
        return parsed.responses as AnswersMap;
      }
    } catch {
      // ignore and fall back
    }
  }

  const answers: AnswersMap = {};
  const getMatch = (pattern: RegExp) => submissionText.match(pattern)?.[1]?.trim() ?? "";

  answers["s1-a1"] = getMatch(/1A1 \(2 marks\)[\s\S]*?Answer:\s*(.+)/);
  answers["s1-a2"] = getMatch(/1A2 \(2 marks\)[\s\S]*?Answer:\s*(.+)/);
  answers["s1-a3"] = getMatch(/1A3 \(2 marks\)[\s\S]*?Answer:\s*(.+)/);
  answers["s1-a4"] = getMatch(/1A4 \(2 marks\)[\s\S]*?Answer:\s*(.+)/);
  answers["s1-a5"] = getMatch(/1A5 \(2 marks\)[\s\S]*?Answer:\s*(.+)/);
  answers["s3-b1"] = getMatch(/3B1 \(4 marks\)[\s\S]*?Answer:\s*(.+?)(?:\n\n|Section 4)/s);

  const lineMap: Array<[string, RegExp]> = [
    ["s1-b1::sub::0", /Systems Analysis — Point 1:\s*(.+)/],
    ["s1-b1::sub::1", /Systems Analysis — Point 2:\s*(.+)/],
    ["s1-b1::sub::2", /Requirements Analysis — Point 1:\s*(.+)/],
    ["s1-b1::sub::3", /Requirements Analysis — Point 2:\s*(.+)/],
    ["s2-b2::sub::0", /Way 1:\s*(.+)/],
    ["s2-b2::sub::1", /Way 2:\s*(.+)/],
    ["s4-b1::sub::0", /Identify:\s*(.+)/],
    ["s4-b1::sub::1", /Analyse:\s*(.+)/],
    ["s4-b1::sub::2", /Plan:\s*(.+)/],
    ["s4-b1::sub::3", /Implement:\s*(.+)/],
    ["s4-b1::sub::4", /Review:\s*(.+)/],
    ["s4-b2::sub::0", /Root Cause 1:\s*(.+)/],
    ["s4-b2::sub::1", /Root Cause 2:\s*(.+)/],
    ["s4-b2::sub::2", /Root Cause 3:\s*(.+)/],
    ["s4-b2::sub::3", /Evaluation Way 1:\s*(.+)/],
    ["s4-b2::sub::4", /Evaluation Way 2:\s*(.+)/],
    ["s5-b1::sub::0", /Benefit 1:\s*(.+)/],
    ["s5-b1::sub::1", /Benefit 2:\s*(.+)/],
  ];

  lineMap.forEach(([key, pattern]) => {
    answers[key] = getMatch(pattern);
  });

  return answers;
}

export function autoMarkBlock1Submission(submissionText: string): AutoMarkResult {
  const answers = parseEmbeddedAnswers(submissionText);
  const results: AutoMarkItem[] = [];

  // Section 1 A
  addExact(results, "s1-a1", "1A1", answers["s1-a1"], ["Systems Analysis"], 2);
  addExact(results, "s1-a2", "1A2", answers["s1-a2"], ["Observation"], 2);
  addExact(results, "s1-a3", "1A3", answers["s1-a3"], ["Two parallel lines / open rectangle", "Two parallel lines (open rectangle)"], 2);
  addExact(results, "s1-a4", "1A4", answers["s1-a4"], ["Feasibility Study"], 2);
  addExact(results, "s1-a5", "1A5", answers["s1-a5"], ["Agile"], 2);

  // Section 1 B
  addExact(results, "s1-b1::sub::0", "1B1 Systems Analysis — Point 1", answers["s1-b1::sub::0"], [
    "Looks at the whole current system and how parts work together",
    "Finds problems in workflows, data flow, and process gaps",
  ], 1);
  addExact(results, "s1-b1::sub::1", "1B1 Systems Analysis — Point 2", answers["s1-b1::sub::1"], [
    "Maps existing inputs, outputs, and processing steps",
    "Identifies system weaknesses before redesign",
  ], 1);
  addExact(results, "s1-b1::sub::2", "1B1 Requirements Analysis — Point 1", answers["s1-b1::sub::2"], [
    "Defines what users need the new system to do",
    "Captures functional and non-functional requirements",
  ], 1);
  addExact(results, "s1-b1::sub::3", "1B1 Requirements Analysis — Point 2", answers["s1-b1::sub::3"], [
    "Specifies business rules, constraints, and expected outputs",
    "Documents user needs before design and development",
  ], 1);

  const validTechniques = ["Observation", "Interview", "Questionnaire", "Document review", "Check existing records"];
  const validReasons = [
    "See real current process and bottlenecks",
    "Get detailed needs directly from users",
    "Collect feedback quickly from many users",
    "Understand existing forms, rules, and data fields",
    "Verify what data is already captured and missing",
  ];
  for (let row = 0; row < 3; row += 1) {
    addExact(results, `s1-b2::${row}::0`, `1B2 Row ${row + 1} — Technique`, answers[`s1-b2::${row}::0`], validTechniques, 1);
    addExact(results, `s1-b2::${row}::1`, `1B2 Row ${row + 1} — Reason`, answers[`s1-b2::${row}::1`], validReasons, 1);
  }
  addExact(results, "s1-b3a", "1B3a", answers["s1-b3a"], ["Data Flow Diagram (DFD)"], 2);
  addExact(results, "s1-b3b-1", "1B3b Marker 1", answers["s1-b3b-1"], ["External Entity"], 1);
  addExact(results, "s1-b3b-2", "1B3b Marker 2", answers["s1-b3b-2"], ["Process"], 1);
  addExact(results, "s1-b3b-3", "1B3b Marker 3", answers["s1-b3b-3"], ["Data Flow"], 1);
  addExact(results, "s1-b3b-4", "1B3b Marker 4", answers["s1-b3b-4"], ["Data Store"], 1);

  // Section 2 A
  addExact(results, "s2-a1", "2A1", answers["s2-a1"], ["A team shares a common goal and mutual accountability"], 2);
  addExact(results, "s2-a2", "2A2", answers["s2-a2"], ["Define and agree on the problem"], 2);
  addExact(results, "s2-a3", "2A3", answers["s2-a3"], ["Nominal Group Technique (NGT)"], 2);
  addExact(results, "s2-a4", "2A4", answers["s2-a4"], ["Trust, open communication, and shared accountability"], 2);
  addExact(results, "s2-a5", "2A5", answers["s2-a5"], ["Accountability"], 2);

  const validChallenges = ["Poor communication", "Conflict in the team", "Missed deadlines", "Unclear roles", "Low participation"];
  const validResponses = ["Hold a team discussion", "Set clear roles", "Agree on deadlines", "Improve communication", "Ask the facilitator for support"];
  for (let row = 0; row < 3; row += 1) {
    addExact(results, `s2-b1::${row}::0`, `2B1 Row ${row + 1} — Challenge`, answers[`s2-b1::${row}::0`], validChallenges, 1);
    addExact(results, `s2-b1::${row}::1`, `2B1 Row ${row + 1} — Response`, answers[`s2-b1::${row}::1`], validResponses, 1);
  }

  const teamWays = ["Share ideas", "Help complete tasks", "Communicate clearly", "Take responsibility", "Support other team members"];
  const teamWaySeen = new Set<string>();
  ["s2-b2::sub::0", "s2-b2::sub::1"].forEach((key, idx) => {
    const answer = answers[key] || "";
    const normalized = normalize(answer);
    const duplicate = teamWaySeen.has(normalized);
    const correct = sameAsAny(answer, teamWays) && !duplicate;
    if (normalized) teamWaySeen.add(normalized);
    results.push({
      key,
      label: `2B2 Way ${idx + 1}`,
      learnerAnswer: answer || "(blank)",
      expected: teamWays.join(" / "),
      awarded: correct ? 2 : 0,
      maxMarks: 2,
      correct,
      note: duplicate ? "Duplicate response chosen" : undefined,
    });
  });

  addExact(results, "s2-b3a", "2B3a", answers["s2-b3a"], ["Team collaboration diagram"], 2);
  addExact(results, "s2-b3b-1", "2B3b Marker 1", answers["s2-b3b-1"], ["Team Leader"], 1);
  addExact(results, "s2-b3b-2", "2B3b Marker 2", answers["s2-b3b-2"], ["Team Member A / Team Member B"], 1);
  addExact(results, "s2-b3b-3", "2B3b Marker 3", answers["s2-b3b-3"], ["Task — Prepare lab booking plan", "Task - Prepare lab booking plan"], 1);
  addExact(results, "s2-b3b-4", "2B3b Marker 4", answers["s2-b3b-4"], ["Communication"], 1);

  // Section 3 A
  addExact(results, "s3-a1", "3A1", answers["s3-a1"], ["Iteration (Loop)"], 2);
  addExact(results, "s3-a2", "3A2", answers["s3-a2"], ["Pseudocode"], 2);
  addExact(results, "s3-a3", "3A3", answers["s3-a3"], ["Validation checks format/range; verification checks accurate entry"], 2);
  addExact(results, "s3-a4", "3A4", answers["s3-a4"], ["They help developers understand and maintain code"], 2);
  addExact(results, "s3-a5", "3A5", answers["s3-a5"], ["Logic error"], 2);

  // 3B1 heuristic
  const pseudo = answers["s3-b1"] || "";
  let pseudoMarks = 0;
  if (/(input|read)/i.test(pseudo)) pseudoMarks += 1;
  if (/(>=\s*50|>\s*49|50\s*or\s*above)/i.test(pseudo)) pseudoMarks += 1;
  if (/pass/i.test(pseudo)) pseudoMarks += 1;
  if (/fail/i.test(pseudo)) pseudoMarks += 1;
  results.push({
    key: "s3-b1",
    label: "3B1 Pseudocode",
    learnerAnswer: pseudo || "(blank)",
    expected: "Input mark, test >= 50, print Pass else Fail",
    awarded: pseudoMarks,
    maxMarks: 4,
    correct: pseudoMarks === 4,
    note: "Heuristic auto-mark — assessor should verify logic if needed.",
  });

  addExact(results, "s3-b2::0::0", "3B2 Sequence — Meaning", answers["s3-b2::0::0"], ["Do steps in order"], 1);
  addExact(results, "s3-b2::0::1", "3B2 Sequence — Example", answers["s3-b2::0::1"], ["Read name, then print greeting"], 1);
  addExact(results, "s3-b2::1::0", "3B2 Selection — Meaning", answers["s3-b2::1::0"], ["Choose between options"], 1);
  addExact(results, "s3-b2::1::1", "3B2 Selection — Example", answers["s3-b2::1::1"], ["IF mark >= 50 THEN print 'Pass' ELSE print 'Fail'"], 1);
  addExact(results, "s3-b2::2::0", "3B2 Iteration — Meaning", answers["s3-b2::2::0"], ["Repeat steps"], 1);
  addExact(results, "s3-b2::2::1", "3B2 Iteration — Example", answers["s3-b2::2::1"], ["WHILE attempts < 3 repeat input"], 1);

  addExact(results, "s3-b3a", "3B3a", answers["s3-b3a"], ["Flowchart"], 2);
  addExact(results, "s3-b3b-1", "3B3b Marker 1", answers["s3-b3b-1"], ["Enter student mark"], 1);
  addExact(results, "s3-b3b-2", "3B3b Marker 2", answers["s3-b3b-2"], ["Compare", "IF mark >= 50"], 1);
  addExact(results, "s3-b3b-3", "3B3b Marker 3", answers["s3-b3b-3"], ["Yes"], 1);
  addExact(results, "s3-b3b-4", "3B3b Marker 4", answers["s3-b3b-4"], ["Print FAIL"], 1);

  // Section 4 A
  addExact(results, "s4-a1", "4A1", answers["s4-a1"], ["Can realistically be implemented with available resources"], 2);
  addExact(results, "s4-a2", "4A2", answers["s4-a2"], ["Fishbone (Ishikawa) diagram"], 2);
  addExact(results, "s4-a3", "4A3", answers["s4-a3"], ["Identify and define the problem"], 2);
  addExact(results, "s4-a4", "4A4", answers["s4-a4"], ["Review"], 2);
  addExact(results, "s4-a5", "4A5", answers["s4-a5"], ["People, Process, Environment, and Equipment"], 2);

  addExact(results, "s4-b1::sub::0", "4B1 Identify", answers["s4-b1::sub::0"], ["Define the real problem clearly"], 1);
  addExact(results, "s4-b1::sub::1", "4B1 Analyse", answers["s4-b1::sub::1"], ["List likely causes and evidence"], 1);
  addExact(results, "s4-b1::sub::2", "4B1 Plan", answers["s4-b1::sub::2"], ["Choose resources and timeline"], 1);
  addExact(results, "s4-b1::sub::3", "4B1 Implement", answers["s4-b1::sub::3"], ["Carry out solution tasks"], 1);
  addExact(results, "s4-b1::sub::4", "4B1 Review", answers["s4-b1::sub::4"], ["Check if solution worked"], 1);

  const rootCauseOptions = ["Poor communication", "Unclear roles", "Lack of training", "No clear process", "Limited resources"];
  const rootSeen = new Set<string>();
  ["s4-b2::sub::0", "s4-b2::sub::1", "s4-b2::sub::2"].forEach((key, idx) => {
    const answer = answers[key] || "";
    const normalized = normalize(answer);
    const duplicate = rootSeen.has(normalized);
    const correct = sameAsAny(answer, rootCauseOptions) && !duplicate;
    if (normalized) rootSeen.add(normalized);
    results.push({
      key,
      label: `4B2 Root Cause ${idx + 1}`,
      learnerAnswer: answer || "(blank)",
      expected: rootCauseOptions.join(" / "),
      awarded: correct ? 1 : 0,
      maxMarks: 1,
      correct,
      note: duplicate ? "Duplicate root cause chosen" : undefined,
    });
  });

  const evaluationOptions = ["Compare pros and cons", "Use SFF checks", "Ask team feedback", "Pilot test the solution", "Check cost and time"];
  const evalSeen = new Set<string>();
  ["s4-b2::sub::3", "s4-b2::sub::4"].forEach((key, idx) => {
    const answer = answers[key] || "";
    const normalized = normalize(answer);
    const duplicate = evalSeen.has(normalized);
    const correct = sameAsAny(answer, evaluationOptions) && !duplicate;
    if (normalized) evalSeen.add(normalized);
    results.push({
      key,
      label: `4B2 Evaluation Way ${idx + 1}`,
      learnerAnswer: answer || "(blank)",
      expected: evaluationOptions.join(" / "),
      awarded: correct ? 1 : 0,
      maxMarks: 1,
      correct,
      note: duplicate ? "Duplicate evaluation method chosen" : undefined,
    });
  });

  addExact(results, "s4-b3a", "4B3a", answers["s4-b3a"], ["Fishbone (Ishikawa) diagram"], 2);
  addExact(results, "s4-b3b-1", "4B3b Marker 1", answers["s4-b3b-1"], ["People"], 1);
  addExact(results, "s4-b3b-2", "4B3b Marker 2", answers["s4-b3b-2"], ["Process"], 1);
  addExact(results, "s4-b3b-3", "4B3b Marker 3", answers["s4-b3b-3"], ["Equipment"], 1);
  addExact(results, "s4-b3b-4", "4B3b Marker 4", answers["s4-b3b-4"], ["Problem / Effect", "Effect"], 1);

  // Section 5 A
  addExact(results, "s5-a1", "5A1", answers["s5-a1"], ["Desk-checking"], 2);
  addExact(results, "s5-a2", "5A2", answers["s5-a2"], ["Decision tree"], 2);
  addExact(results, "s5-a3", "5A3", answers["s5-a3"], ["Batch groups transactions together; online handles them immediately"], 2);
  addExact(results, "s5-a4", "5A4", answers["s5-a4"], ["A function created by the programmer for a reusable task"], 2);
  addExact(results, "s5-a5", "5A5", answers["s5-a5"], ["Maintain"], 2);

  const benefitOptions = [
    "Find logic errors early before coding",
    "Improve understanding of algorithm flow",
    "Reduce rework during testing",
  ];
  const benefitSeen = new Set<string>();
  ["s5-b1::sub::0", "s5-b1::sub::1"].forEach((key, idx) => {
    const answer = answers[key] || "";
    const normalized = normalize(answer);
    const duplicate = benefitSeen.has(normalized);
    const correct = sameAsAny(answer, benefitOptions) && !duplicate;
    if (normalized) benefitSeen.add(normalized);
    results.push({
      key,
      label: `5B1 Benefit ${idx + 1}`,
      learnerAnswer: answer || "(blank)",
      expected: benefitOptions.join(" / "),
      awarded: correct ? 2 : 0,
      maxMarks: 2,
      correct,
      note: duplicate ? "Duplicate benefit chosen" : undefined,
    });
  });

  addExact(results, "s5-b2::0::0", "5B2 Corrective", answers["s5-b2::0::0"], ["Fix defects found after release"], 2);
  addExact(results, "s5-b2::1::0", "5B2 Adaptive", answers["s5-b2::1::0"], ["Adjust system for new environment or rules"], 2);
  addExact(results, "s5-b2::2::0", "5B2 Perfective", answers["s5-b2::2::0"], ["Improve performance/usability or add enhancements"], 2);

  addExact(results, "s5-b3a", "5B3a", answers["s5-b3a"], ["Structure diagram"], 2);
  addExact(results, "s5-b3b-1", "5B3b Marker 1", answers["s5-b3b-1"], ["Main Program", "Main"], 1);
  addExact(results, "s5-b3b-2", "5B3b Marker 2", answers["s5-b3b-2"], ["Validate Input", "Input Validation"], 1);
  addExact(results, "s5-b3b-3", "5B3b Marker 3", answers["s5-b3b-3"], ["Calculate Result", "Processing", "Calculate"], 1);
  addExact(results, "s5-b3b-4", "5B3b Marker 4", answers["s5-b3b-4"], ["Output Result", "Output"], 1);

  const score = results.reduce((sum, item) => sum + item.awarded, 0);
  const maxScore = results.reduce((sum, item) => sum + item.maxMarks, 0);
  const correctCount = results.filter((item) => item.correct).length;
  const wrongCount = results.filter((item) => !item.correct).length;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    score,
    maxScore,
    percentage,
    correctCount,
    wrongCount,
    results,
    summary: `Auto-marked ${score}/${maxScore} marks (${percentage}%). ${correctCount} checks correct, ${wrongCount} need review or were incorrect.`,
  };
}
