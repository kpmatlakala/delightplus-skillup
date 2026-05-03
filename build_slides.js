const fs = require('fs');
const path = require('path');

function slide(n, id, title, type, content, notes, duration, cards, phaseCards) {
  return { slideNumber: n, id, title, type, content, notes, duration, ...(cards ? {cards} : {}), ...(phaseCards ? {phaseCards} : {}) };
}

const slides14908 = [
  slide(1,'14908-title','Testing IT Systems Against Given Specifications','title',
    'SAQA 14908  Block 3  Day 11  6 Credits\nSessions: Select a test procedure - Apply the test procedure - Collect and record data - Prepare tests against specifications',
    'Opening question: How many of you have used software that crashed or gave a wrong result? What caused it?\n\nMost errors trace to insufficient or poorly structured testing. Today we learn to test properly.\n\nTwo fundamental purposes of testing (from the learner guide): (1) verifying that what was specified is what was delivered, and (2) managing risk for both the acquiring agency and the developer.\n\nConnect to Block 2: the programs you built are your test subjects today.',
    5, undefined, ['Select','Apply','Collect','Record','Prepare']),

  slide(2,'14908-outcomes','Unit Outcomes and Assessment Tasks','content',
    'People credited with this unit standard are able to:\n- Select an appropriate test procedure for hardware and software\n- Apply the test procedure to hardware and software\n- Collect and record data from tests\n\nPractical assessment tasks (85% competence required in every task):\n- Task 1: Select an appropriate test procedure\n- Task 2: Apply the test procedure\n- Task 3: Collect and record data\n- Task 4: Prepare testing to ensure given specifications are addressed\n\nSummative assessment: written/verbal questioning and product sample',
    'Walk through all outcomes and practical tasks.\n\nKey summative questions to prepare for:\n- Activity 1 (5 marks): What is the purpose of testing?\n- Activity 2 (6 marks): Discuss resource types with their allocation process\n- Activity 3 (5 marks): State the types of testing listed in SIT1 and SIT2\n- Activity 5 (8 marks): Discuss the Testing Type Descriptions for SIT1 and SIT2\n\nAsk: Is it possible to test a program completely? (No - you cannot test every possible input combination. This is why structured test procedures exist.)',
    6, ['Select','Apply','Collect','Prepare']),
];

const type14908 = export type Module14908SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary";
  content: string;
  notes: string;
  duration: number;
  cards?: string[];
  phaseCards?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const module14908SlideList: Module14908SlideListItem[] = \;
;

fs.writeFileSync('src/data/block3/module14908Presentation.ts', type14908, 'utf8');
console.log('14908 written, slides: ' + slides14908.length);
