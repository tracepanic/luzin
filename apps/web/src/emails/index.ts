import { VerificationEmailTemplate } from "@/emails/templates/verification-email";
import { env as envClient } from "@/env/client";
import { env as envServer } from "@/env/server";
import { Resend } from "resend";

const resend = new Resend(envServer.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    to: [email],
    from: `Luzin Team <auth@${envClient.NEXT_PUBLIC_EMAIL_DOMAIN}>`,
    subject: "Verify Your Email Address",
    react: VerificationEmailTemplate({ url }),
  });

  // Look into the resend errors and give a meaningful error message
}
