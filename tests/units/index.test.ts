import { BELA } from "../../dist/index.min.mjs"; // pastiin ini gak pakai `.ts` di akhir
import { Type, Code } from "../../src/utils/message/belaMessage";

describe("BELA.train", () => {
  let model: BELA;

  beforeEach(() => {
    model = new BELA();
  });

  it("should throw error if dataset is empty", () => {
    const emptyDataset: any[] = [];
    const vocabs = ["hello", "world"];
    const maxTokenLength = 5;

    expect(() => {
      model.train(emptyDataset, vocabs, maxTokenLength);
    }).toThrow("Training dataset cannot be empty.");
  });

  it("should throw error if vocabs is empty", () => {
    const dataset = [{ input: "hi", output: "hello" }];
    const vocabs: string[] = [];
    const maxTokenLength = 5;

    expect(() => {
      model.train(dataset, vocabs, maxTokenLength);
    }).toThrow("Vocab training cannot be empty.");
  });

  it("should train without error if input valid", () => {
    const dataset = [{ input: "halo", output: "hai" }];
    const vocabs = ["halo", "hai"];
    const maxTokenLength = 5;

    expect(() => {
      model.train(dataset, vocabs, maxTokenLength);
    }).not.toThrow();

    // Optional: cek apakah model berhasil dilatih
    expect(model.isModel).toBe(true);
  });
});