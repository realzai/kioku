import { z } from "zod";

export const schema = z.object({
  groq_token: z.string().min(1, "Groq token is required"),
  query: z.string().min(1, "Query is required"),
  model: z.string().min(1)
});

export type FormValues = z.infer<typeof schema>;

export const modelOptions = [
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "mistral-saba-24b",
]