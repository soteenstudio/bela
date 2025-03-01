export function getDistribution(binary: string): { [key: string]: number } {
  return binary.split("").reduce((acc, bit) => ((acc[bit as "0" | "1"] = (acc[bit as "0" | "1"] || 0) + 1), acc), { "0": 0, "1": 0 });
}