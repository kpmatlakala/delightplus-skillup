export type SessionQuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

// Sample quiz questions for testing - replace with actual content
export const sessionQuizBankByModule: Record<string, SessionQuizQuestion[]> = {
  "14924": [
    {
      id: 1,
      question: "What is the primary purpose of systems development?",
      options: [
        "To create entertainment software",
        "To solve business problems through technology solutions",
        "To replace all manual processes",
        "To increase computer sales"
      ],
      answer: "To solve business problems through technology solutions"
    },
    {
      id: 2,
      question: "Which phase comes first in the systems development lifecycle?",
      options: [
        "Implementation",
        "Testing",
        "Planning and Analysis",
        "Design"
      ],
      answer: "Planning and Analysis"
    },
    {
      id: 3,
      question: "What is the main benefit of user involvement in systems development?",
      options: [
        "Reduces development costs",
        "Ensures the system meets actual user needs",
        "Speeds up the development process",
        "Eliminates the need for testing"
      ],
      answer: "Ensures the system meets actual user needs"
    },
    {
      id: 4,
      question: "What does 'requirements gathering' involve?",
      options: [
        "Writing code for the system",
        "Testing the completed system",
        "Understanding what the system needs to do",
        "Installing hardware components"
      ],
      answer: "Understanding what the system needs to do"
    },
    {
      id: 5,
      question: "Why is documentation important in systems development?",
      options: [
        "It's required by law",
        "It helps with maintenance and future modifications",
        "It makes the system run faster",
        "It reduces the need for user training"
      ],
      answer: "It helps with maintenance and future modifications"
    }
  ],
  "14915": [
    {
      id: 1,
      question: "What is the main purpose of system design?",
      options: [
        "To write the final code",
        "To create a blueprint for how the system will work",
        "To test the system functionality",
        "To train end users"
      ],
      answer: "To create a blueprint for how the system will work"
    },
    {
      id: 2,
      question: "Which design principle focuses on breaking down complex systems into smaller parts?",
      options: [
        "Abstraction",
        "Modularity",
        "Encapsulation",
        "Inheritance"
      ],
      answer: "Modularity"
    },
    {
      id: 3,
      question: "What is a key benefit of modular design?",
      options: [
        "Faster processing speed",
        "Easier maintenance and updates",
        "Lower hardware requirements",
        "Automatic error correction"
      ],
      answer: "Easier maintenance and updates"
    }
  ]
};
