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
import { CreateClassInstanceSchema } from "@/schemas/classes";
import { createClassInstance, getClasses } from "@/server/classes";
import { getAcademicYears } from "@/server/year";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  const results = useQueries({
    queries: [
      {
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        meta: { showError: true },
      },
      {
        queryKey: ["class-templates"],
        queryFn: getClasses,
        meta: { showError: true },
      },
    ],
  });

  const [yearsResult, classesResult] = results;

  const years = yearsResult.data ?? [];
  const classes = classesResult.data ?? [];
  const isInitialPending = results.some((r) => r.isPending);

  const { mutate, isPending } = useMutation({
    mutationFn: createClassInstance,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Class instance created successfully");
      router.push("/admin/classes/instances");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to create class instance");
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof CreateClassInstanceSchema>>({
    resolver: zodResolver(CreateClassInstanceSchema),
    defaultValues: {
      name: "",
      classId: undefined,
      academicYearId: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateClassInstanceSchema>) => {
    mutate(values);
    toast.loading("Creating class instance...");
  };

  if (isInitialPending) {
    return <Loader />;
  }

  return (
    <Card className="max-w-lg mb-32 container mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Create New Class Instance
        </CardTitle>
        <CardDescription>
          Set up a new class instance for your institution
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
                  <FormLabel>Class Instance Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Grade 1 - 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academicYearId"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Academic Year</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Class Template</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select class template" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full mt-5">
              Create Class
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
