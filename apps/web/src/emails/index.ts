import {
  InviteEmailTemplate,
  VerificationEmailTemplate,
} from "@/emails/templates/verification-email";
import { env as envClient } from "@/env/client";
import { env as envServer } from "@/env/server";
import { Invite } from "@/lib/types";
import { Resend } from "resend";

const resend = new Resend(envServer.RESEND_API_KEY);

// Look into the resend errors and give a meaningful error message

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    to: [email],
    from: `Luzin Team <auth@${envClient.NEXT_PUBLIC_EMAIL_DOMAIN}>`,
    subject: "Verify Your Email Address",
    react: VerificationEmailTemplate({ url }),
  });
}

export async function sendInviteEmail(invite: Invite) {
  await resend.emails.send({
    to: [invite.email],
    from: `Luzin Team <auth@${envClient.NEXT_PUBLIC_EMAIL_DOMAIN}>`,
    subject: "Invitation to Join a School",
    react: InviteEmailTemplate({ invite }),
  });
}
