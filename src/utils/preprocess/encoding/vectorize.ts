export function vectorize(binary: string): number[] {
  if (typeof binary === "string") {
    //console.log("bn: ", typeof binary);
    // Biarin string-nya dipotong atau dipadding dulu ke 128 panjangnya
    const padded = binary.length > 128
      ? binary.slice(0, 128)
      : binary.padStart(128, "0"); // padding 0 di depan
  
    return padded.split("").map(bit => (bit === "1" ? 1 : 0));
  }
  return [];
}