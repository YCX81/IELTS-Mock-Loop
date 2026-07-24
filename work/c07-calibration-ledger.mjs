import fs from "node:fs";
import path from "node:path";

let cachedEntries;

function entries(repoRoot) {
  if (!cachedEntries) {
    const ledgerPath = path.join(
      repoRoot,
      "data",
      "generated",
      "reports",
      "cambridge-ocr-calibration.json",
    );
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
    cachedEntries = new Map(
      (ledger.entries ?? [])
        .filter((entry) => entry.book === "07")
        .map((entry) => [Number(entry.page), entry]),
    );
  }
  return cachedEntries;
}

function imageMarker(entry) {
  return `![Cambridge IELTS ${entry.book} page ${String(entry.page).padStart(3, "0")} figure](${entry.image})`;
}

export function applyC07CalibrationLedger(repoRoot, pageNumber, sourceText, fallbackCalibration) {
  const entry = entries(repoRoot).get(Number(pageNumber));
  if (!entry) {
    return {
      text: sourceText,
      calibration: { ...fallbackCalibration },
    };
  }

  let text = sourceText;
  if (entry.embeddedInText) {
    const marker = imageMarker(entry);
    if (!text.includes(marker)) {
      text = `${text.trimEnd()}\n\n${marker}`;
    }
  }

  const calibration = {
    status: entry.status,
    reason: entry.reason,
  };
  if (entry.image) calibration.image = entry.image;
  if (entry.embeddedInText) calibration.embeddedInText = true;

  return { text, calibration };
}
