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

export type ProgramCategory =
  | "AI & Data Science"
  | "Software Development"
  | "Cyber Security"
  | "Cloud Computing"
  | "Emerging Technologies"
  | "Drone & Hardware Tech"
  | "Telecommunications";

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  "AI & Data Science",
  "Software Development",
  "Cyber Security",
  "Cloud Computing",
  "Emerging Technologies",
  "Drone & Hardware Tech",
];

export const CATEGORY_SLUGS: Record<ProgramCategory, string> = {
  "AI & Data Science": "ai-data-science",
  "Software Development": "software-development",
  "Cyber Security": "cyber-security",
  "Cloud Computing": "cloud-computing",
  "Emerging Technologies": "emerging-technologies",
  "Drone & Hardware Tech": "drone-hardware-tech",
  "Telecommunications": "telecommunications",
};

export const SLUG_TO_CATEGORY: Record<string, ProgramCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => [slug, cat as ProgramCategory])
);

export const CATEGORY_BLURB: Record<ProgramCategory, string> = {
  "AI & Data Science": "Machine learning, data engineering and AI software development pathways.",
  "Software Development": "Full-stack, systems and applications development qualifications — including our flagship FETC: IT Systems Development.",
  "Cyber Security": "Defensive, offensive and governance tracks aligned to MICT-SETA and QCTO standards.",
  "Cloud Computing": "Cloud administration and DevOps qualifications across AWS, Azure and hybrid environments.",
  "Emerging Technologies": "IoT, blockchain and 4IR-focused programmes shaping the next wave of innovation.",
  "Drone & Hardware Tech": "Drone piloting, embedded systems and hardware engineering programmes.",
  "Telecommunications": "Network operations and telecommunications infrastructure qualifications.",
};

export interface DsaProgram {
  id: string;
  title: string;
  type: "FET Certificate" | "Occupational Certificate" | "Short Course";
  qualificationType: QualificationType;
  category: ProgramCategory;
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
    qualificationType: "unit_standard",
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
    qualificationType: "unit_standard",
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
    qualificationType: "occupational_full",
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
    qualificationType: "occupational_full",
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
    qualificationType: "occupational_full",
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
    qualificationType: "occupational_full",
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
    qualificationType: "occupational_full",
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
    qualificationType: "skills_programme_occupational",
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
    qualificationType: "occupational_full",
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
