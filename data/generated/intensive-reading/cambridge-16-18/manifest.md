# Cambridge 16-18 Reading Intensive Reading Manifest

generated: 36
repairs: 4
skipped: 0

- Only `readingSections.kind === reading` with a standard question range was treated as a passage.
- `questions` sections were attached by numeric question ranges.
- Empty or missing standard passages were recovered into `recovered-sources/` from raw OCR markdown; original OCR files were not modified.
- Cambridge 17 includes OCR-noise reading sections without question ranges; these were ignored and recorded in `manifest.json`.

- cambridge-16-reading-test-1 Passage 2: data/generated/text-pages/cambridge-ielts-16.raw.md lines 753-826; evidence: The Step Pyramid of Djoser / revolutionary advance in architecture; recovered: data/generated/intensive-reading/cambridge-16-18/recovered-sources/recovered-16-test-1-passage-2.md
- cambridge-16-reading-test-4 Passage 3: data/generated/text-pages/cambridge-ielts-16.raw.md lines 3485-3568; evidence: Attitudes towards Artificial Intelligence / reluctant to trust AI; recovered: data/generated/intensive-reading/cambridge-16-18/recovered-sources/recovered-16-test-4-passage-3.md
- cambridge-18-reading-test-2 Passage 1: data/generated/text-pages/cambridge-ielts-18.raw.md lines 1566-1638; evidence: Stonehenge / Salisbury Plain / bluestones; recovered: data/generated/intensive-reading/cambridge-16-18/recovered-sources/recovered-18-test-2-passage-1.md
- cambridge-18-reading-test-3 Passage 2: data/generated/text-pages/cambridge-ielts-18.raw.md lines 2577-2655; evidence: The steam car / Doble brothers / rise again; recovered: data/generated/intensive-reading/cambridge-16-18/recovered-sources/recovered-18-test-3-passage-2.md

- none

- completed: template_reduction_expression_deepening_v2_2
- scope: all 36 Cambridge IELTS 16-18 Reading passage files
- paragraph notes were rewritten to avoid repeated template phrasing; ordinary paragraphs now use shorter function-based explanations and targeted IELTS risk reminders.
- each file now has a focused expression section with 3-5 A/B-layer items and refreshed Anki candidates.
- expression migration examples were polished to avoid generic ungrammatical frames.
- paragraph transition sentences were varied to avoid another fixed connector pattern.
