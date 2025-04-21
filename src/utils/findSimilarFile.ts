import fs from "fs";
import path from "path";

/**
 * Menghitung Levenshtein Distance antara dua string
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Hapus
        matrix[i][j - 1] + 1, // Tambah
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Ganti
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Menghapus bagian "-XXX.belamodel" dari nama file
 */
function cleanFileName(fileName: string): string {
  return fileName.replace(/-\d+\.belamodel$/, ""); // Hilangkan "-XXX.belamodel"
}

/**
 * Mencari file yang paling mirip di folder tertentu
 */
export function findSimilarFile(folder: string, inputName: string): string | null {
  const files = fs.readdirSync(folder);
  let bestMatch = { file: null as string | null, distance: Infinity };

  // Bersihkan inputName juga
  const cleanedInput = cleanFileName(inputName);
  
  const maxDistance = Math.max(1, Math.min(5, Math.floor(cleanedInput.length * 0.2)));

  for (const file of files) {
    const cleanedFile = cleanFileName(file); // Hilangkan bagian "-XXX.belamodel"

    // **Prioritas pertama**: Jika ada file yang mengandung `inputName`, langsung return
    if (cleanedFile.includes(cleanedInput)) {
      return file;
    }

    // Hitung Levenshtein Distance
    const distance = levenshtein(cleanedInput, cleanedFile);

    // **Batas toleransi**: Jika jaraknya terlalu besar, abaikan
    if (distance < bestMatch.distance && distance <= maxDistance) {
      bestMatch = { file, distance };
    }
  }

  return bestMatch.file;
}