"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateClassTemplateSchema } from "@/schemas/classes";
import { createClassTemplate } from "@/server/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createClassTemplate,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Class template created successfully");
      router.push("/admin/classes/templates");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to create class template");
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof CreateClassTemplateSchema>>({
    resolver: zodResolver(CreateClassTemplateSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateClassTemplateSchema>) => {
    mutate(values);
    toast.loading("Creating class template...");
  };

  return (
    <Card className="max-w-lg mb-32 container mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Create New Class Template
        </CardTitle>
        <CardDescription>
          Set up a new class template for your institution
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
                  <FormLabel>Class Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Grade 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full mt-5">
              Create Template
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
