"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MailWarning } from "lucide-react";

import { Loader } from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const [cooldown, setCooldown] = useState(60);
  const [isSending, setIsSending] = useState(false);

  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending && (!data || error)) {
      toast.error("Login to access this page");
      router.push("/login");
    }
  }, [data, error, isPending, router]);

  useEffect(() => {
    if (!isPending && data?.user.emailVerified) {
      toast.error("Email already verified");
      router.push("/email-verification-successful");
    }
  }, [data, isPending, router]);

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  if (isPending || !data || error || data.user.emailVerified) {
    return <Loader />;
  }

  const handleSendEmail = async () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown}s to resend`);
      return;
    }

    setIsSending(true);
    await authClient.sendVerificationEmail({
      email: data.user.email,
      callbackURL: "/email-verification-successful",
    });

    toast.success("Verification email sent");
    setCooldown(60);
    setIsSending(false);
  };

  return (
    <Card className="max-w-lg mx-auto px-4 mt-10">
      <CardHeader className="pb-0">
        <div className="flex justify-center">
          <div className="rounded-full bg-warning/15 p-3">
            <MailWarning className="h-12 w-12 text-warning" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 text-center">
        <h1 className="text-2xl font-bold text-warning">Verify Your Email</h1>
        <div className="space-y-2 text-slate-700">
          <p className="text-lg">
            We&apos;ve sent a verification link to your email address (
            <span className="underline">{data.user.email}</span>). Please check
            your inbox and click on the verification link to activate your
            account.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleSendEmail}
          disabled={cooldown > 0 || isSending}
        >
          Resend Email ({cooldown})
        </Button>
        <Button asChild className="w-full">
          <Link href="/login">Already Verified? Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
