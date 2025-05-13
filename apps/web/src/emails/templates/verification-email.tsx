import { env } from "@/env/client";
import { Invite } from "@/lib/types";

function VerificationEmailTemplate({ url }: { url: string }) {
  return (
    <div>
      <p>Click the link below to verify your email addess.</p>
      <a href={url}>Verification Link</a>
    </div>
  );
}

function InviteEmailTemplate({ invite }: { invite: Invite }) {
  const url = `${env.NEXT_PUBLIC_BASE_URL}/signup/${invite.link}`;

  return (
    <div>
      <p>You have been invited to join a school on our platform.</p>
      <p>
        You have been invited with the role of <strong>{invite.role}</strong>
      </p>
      <p>Click the link below to accept the invitation:</p>
      <a href={url}>Accept Invitation</a>
      <p>This invitation will expire on {invite.expiresAt.toLocaleString()}.</p>
    </div>
  );
}

export { InviteEmailTemplate, VerificationEmailTemplate };
