"use client";

import { Loader } from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupSchema } from "@/schemas/auth";
import { getInviteByLink } from "@/server/invites";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const link: string | undefined = Array.isArray(params.link)
    ? params.link[0] !== undefined
      ? params.link[0]
      : undefined
    : undefined;

  const { isPending: isInitialPending, data } = useQuery({
    queryKey: ["invite", link],
    queryFn: ({ queryKey }) => {
      const [, link] = queryKey;
      return getInviteByLink(link ?? "");
    },
    meta: { showError: true },
  });

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      password: "",
    },
  });

  useEffect(() => {
    if (!isInitialPending && data) {
      form.setValue("email", data.email);
      form.setValue("role", data.role);
    }
  }, [data, isInitialPending, form]);

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    toast.loading("Creating account...");
  };

  if (isInitialPending) {
    return <Loader />;
  }

  return (
    <Card className="max-w-lg mb-32 container mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
        <CardDescription>
          Enter your name and password to create account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              disabled
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>User Role</FormLabel>
                  <FormControl>
                    <Input className="capitalize" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mt-5"
            >
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
