export interface Module {
  id: string;
  code: string;
  title: string;
  type: "Knowledge" | "Practical";
  credits: number;
  duration: number;
  block: number;
  days: string;
  status: "Ready" | "In Progress" | "Not Started";
  objectives: string[];
  content: string[];
  activities: string[];
  resources: string[];
}

export interface Learner {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  progress: number;
}

export interface AttendanceRecord {
  date: string;
  moduleId: string;
  learnerId: string;
  present: boolean;
}

export interface Assessment {
  id: string;
  moduleId: string;
  title: string;
  type: "Formative" | "Summative";
  maxMarks: number;
  weight: number;
}

export interface Program {
  id: string;
  title: string;
  saqaId: string;
  nqfLevel: number;
  totalCredits: number;
  coveredCredits: number;
  duration: string;
  provider: string;
}
