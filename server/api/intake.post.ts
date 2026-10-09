import { createError, defineEventHandler, readBody } from "h3";
import { z } from "zod";

const intakeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(160),
  preferredChannel: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(3000),
  website: z.string().max(0).optional(),
});

const attempts = new Map<string, number[]>();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 3;

export default defineEventHandler(async event => {
  const ip =
    event.node.req.headers["x-forwarded-for"]
      ?.toString()
      .split(",")[0]
      ?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter(
    timestamp => now - timestamp < windowMs
  );
  if (recent.length >= maxAttempts) {
    throw createError({ statusCode: 429, statusMessage: "Too many requests" });
  }
  recent.push(now);
  attempts.set(ip, recent);

  const parsed = intakeSchema.safeParse(await readBody(event));
  if (!parsed.success || parsed.data.website) {
    throw createError({ statusCode: 400, statusMessage: "Invalid inquiry" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL ?? "bmiranda@bmirandalaw.com";
  if (!apiKey || !from) {
    throw createError({ statusCode: 503, statusMessage: "Intake unavailable" });
  }

  const { name, contact, preferredChannel, message } = parsed.data;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(contact.includes("@") ? { reply_to: contact } : {}),
      subject: `Website inquiry from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\nPreferred reply method: ${preferredChannel}\n\nGeneral description:\n${message}`,
    }),
  });

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: "Intake delivery failed",
    });
  }

  return { ok: true };
});
