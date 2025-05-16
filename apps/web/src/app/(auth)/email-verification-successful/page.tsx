import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { MailCheck } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
    return;
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
    return;
  }

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
