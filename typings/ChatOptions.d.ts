declare interface ChatOptions {
  history: {
    role: string;      // contoh: "user", "assistant", "system"
    messages: string;  // isi pesan chat
  }[];
}