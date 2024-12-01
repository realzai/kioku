import {z} from "zod";

export const schema = z.object({
    groq_token: z.string().min(1, "Groq token is required"),
})

export type FormValues = z.infer<typeof schema>;