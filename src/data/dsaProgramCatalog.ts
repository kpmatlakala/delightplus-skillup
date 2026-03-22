/**
 * DSA LMS Program Catalog
 *
 * These qualifications are part of the broader Data Science Academy (DSA)
 * learning management scope. They are separate from the CET Connect schema
 * and will be served by a future `dsa` schema when ready.
 *
 * All are Occupational Certificates targeted for MICT SETA accreditation.
 */

export interface DsaProgram {
  id: string;
  title: string;
  type: "FET Certificate" | "Occupational Certificate";
  saqaId: string | null;
  nqfLevel: number | null;
  totalCredits: number | null;
  provider: string;
  status: "Active" | "Planned" | "Scoping";
  scope: "CET Connect" | "DSA LMS";
}

export const dsaProgramCatalog: DsaProgram[] = [
  {
    id: "saqa-78965",
    title: "FET Certificate: Information Technology — Systems Development",
    type: "FET Certificate",
    saqaId: "78965",
    nqfLevel: 4,
    totalCredits: 131,
    provider: "Data Science Academy",
    status: "Active",
    scope: "CET Connect",
  },
  {
    id: "oc-cloud-admin",
    title: "Occupational Certificate: Cloud Administrator",
    type: "Occupational Certificate",
    saqaId: "118…", // full SAQA ID TBC
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
  {
    id: "oc-ai-software-dev",
    title: "Occupational Certificate: Artificial Intelligence Software Developer",
    type: "Occupational Certificate",
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
    saqaId: null,
    nqfLevel: null,
    totalCredits: null,
    provider: "Data Science Academy",
    status: "Scoping",
    scope: "DSA LMS",
  },
];
