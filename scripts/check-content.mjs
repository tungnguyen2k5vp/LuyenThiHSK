import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { CANDIDATE_EXAMS: MOCK_EXAMS } = await server.ssrLoadModule('/src/data/mockExams.ts');
  const { validateContent } = await server.ssrLoadModule('/src/data/contentValidation.ts');
  const { QUESTION_BANKS, FULL_EXAMS } = await server.ssrLoadModule('/src/data/examCatalog.ts');
  const errors = validateContent(MOCK_EXAMS, []);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('PASS content: ' + QUESTION_BANKS.length + ' original banks, ' + new Set(MOCK_EXAMS.flatMap((exam) => exam.questions.map((question) => question.id))).size + ' unique questions, ' + FULL_EXAMS.length + ' eligible full exams; legacy IDs retained for history.');
  }
} finally { await server.close(); }
