function VerificationEmailTemplate({ url }: { url: string }) {
  return (
    <div>
      <p>Click the link below to verify your email addess.</p>
      <a href={url}>Verification Link</a>
    </div>
  );
}

export { VerificationEmailTemplate };
