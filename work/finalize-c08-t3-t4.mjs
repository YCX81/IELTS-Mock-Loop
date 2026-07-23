import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(
  root,
  'data',
  'generated',
  'intensive-reading',
  'cambridge-07-09',
  'manifest-08.json',
);
const lessonRoot = 'data/generated/intensive-reading/cambridge-07-09';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

for (const test of [3, 4]) {
  for (const passage of [1, 2, 3]) {
    const calibrationPath = path.join(root, 'work', `c08-t${test}-p${passage}-calibration.json`);
    const calibration = JSON.parse(await readFile(calibrationPath, 'utf8'));
    const entry = manifest.files.find((item) => item.test === test && item.passage === passage);
    if (!entry) throw new Error(`Manifest entry missing for Test ${test} Passage ${passage}`);

    const paragraphCount = Array.isArray(calibration.bodyParagraphs)
      ? calibration.bodyParagraphs.length
      : (calibration.sections ?? []).reduce(
        (total, section) => total + (section.paragraphs?.length ?? 0),
        0,
      );
    Object.assign(entry, {
      file: `${lessonRoot}/Cambridge-IELTS-08-Test-${test}-Passage-${passage}-双语精读.md`,
      source: 'original_pdf_manually_calibrated',
      recoveredPath: '',
      paragraphCount,
      questionSectionCount: calibration.questionGroups.length,
      materialExtension: 'web_enriched',
      sentenceCount: (calibration.standfirstSentences?.length ?? 0) + calibration.sentences.length,
      sourcePages: calibration.sourcePages,
      answerKeyPage: calibration.answerKeyPage ?? calibration.answerPage,
      qualityRevision: 'calibrated_sentence_fidelity_cefr_questions_v3',
    });
    delete entry.bodySentenceCount;
    delete entry.standfirstSentenceCount;
  }
}

manifest.generatedCount = manifest.files.length;
manifest.recoveredCount = manifest.files.filter((item) => item.source === 'recovered').length;
manifest.skippedCount = manifest.skipped?.length ?? 0;
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  generatedCount: manifest.generatedCount,
  recoveredCount: manifest.recoveredCount,
  updated: manifest.files
    .filter((item) => item.test === 3 || item.test === 4)
    .map(({ test, passage, sentenceCount, sourcePages, answerKeyPage }) => ({
      test,
      passage,
      sentenceCount,
      sourcePages,
      answerKeyPage,
    })),
}, null, 2));
