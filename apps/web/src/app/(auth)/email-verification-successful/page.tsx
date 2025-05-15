"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending && (!data || error || !data.user)) {
      toast.error("Login to access this page");
      router.push("/login");
    }
  }, [data, error, isPending, router]);

  useEffect(() => {
    if (!isPending && !data?.user!.emailVerified) {
      toast.error("Email not verified yet");
      router.push("/verify-email");
    }
  }, [data, isPending, router]);

  return (
    <Card className="max-w-lg mx-auto px-4 mt-10">
      <CardHeader className="pb-0">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/15 p-3">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 text-center">
        <h1 className="text-2xl font-bold text-primary">
          Verification Successful
        </h1>
        <div className="space-y-2 text-slate-700">
          <p className="text-lg">
            Your email address has been successfully verified.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/login">Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
