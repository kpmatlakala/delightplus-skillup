/**
 * DSA LMS Program Catalog
 *
 * Multi-program catalog for The Data Science Academy.
 * Includes FET Certificates, Occupational Certificates, and short courses.
 */

export type QualificationType =
  | "unit_standard"              // SAQA/SETA Fundamental/Core/Elective (e.g. 78965)
  | "occupational_full"          // QCTO KM/PM/WM + EISA
  | "skills_programme_occupational" // Subset of an OC, KM/PM/WM, no EISA (e.g. SP-230375)
  | "short_course";              // DSA internal CPD, flat module list

export interface DsaProgram {
  id: string;
  title: string;
  type: "FET Certificate" | "Occupational Certificate" | "Short Course";
  qualificationType: QualificationType;
  category: "AI & Data Science" | "Software Development" | "Cyber Security" | "Cloud Computing" | "Emerging Technologies" | "Telecommunications";
  saqaId: string | null;
  nqfLevel: number | null;
  totalCredits: number | null;
  provider: string;
  status: "Active" | "Planned" | "Scoping";
  scope: "DSA LMS";
}

export const dsaProgramCatalog: DsaProgram[] = [
  /* ── FET Certificates ──────────────────────────── */
  {
    id: "saqa-78965",
    title: "FET Certificate: IT Systems Development",
    type: "FET Certificate",
    category: "Software Development",
    saqaId: "78965",
    nqfLevel: 4,
    totalCredits: 131,
    provider: "Data Science Academy",
    status: "Active",
    scope: "DSA LMS",
  },
  {
    id: "saqa-telecom",
    title: "FET Certificate: Telecommunication Network Operations",
    type: "FET Certificate",
    category: "Telecommunications",
    saqaId: null,
    nqfLevel: 4,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },

  /* ── Occupational Certificates ─────────────────── */
  {
    id: "oc-cloud-admin",
    title: "Occupational Certificate: Cloud Administrator",
    type: "Occupational Certificate",
    category: "Cloud Computing",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "oc-ai-software-dev",
    title: "Occupational Certificate: AI Software Developer",
    type: "Occupational Certificate",
    category: "AI & Data Science",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "oc-cyber-security",
    title: "Occupational Certificate: Cyber Security Analyst",
    type: "Occupational Certificate",
    category: "Cyber Security",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "oc-iot-dev",
    title: "Occupational Certificate: Internet-of-Things Developer",
    type: "Occupational Certificate",
    category: "Emerging Technologies",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "oc-frontend-designer",
    title: "Occupational Certificate: Front-End Web Designer",
    type: "Occupational Certificate",
    category: "Software Development",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "sp-230375-python",
    title: "Occupational Certificate: Python Programmer",
    type: "Occupational Certificate",
    category: "Software Development",
    saqaId: "SP-230375",
    nqfLevel: 4,
    totalCredits: 60,
    provider: "Beyond Capital (SDP)",
    status: "Active",
    scope: "DSA LMS",
  },
  {
    id: "oc-systems-dev",
    title: "Occupational Certificate: Systems Developer",
    type: "Occupational Certificate",
    category: "Software Development",
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
];
