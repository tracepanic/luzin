"use client";

import { DatePicker } from "@/components/custom/date-time";
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
import { CreateAcademicYearSchema } from "@/lib/schema";
import { createAcademicYear } from "@/server/year";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Academic year created successfully");
      router.push("/admin/academic-years/all");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to create academic year");
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof CreateAcademicYearSchema>>({
    resolver: zodResolver(CreateAcademicYearSchema),
    defaultValues: {
      name: "",
      startsAt: new Date(),
      endsAt: new Date(),
      isCurrent: false,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateAcademicYearSchema>) => {
    mutate(values);
    toast.loading("Creating academic year...");
  };

  return (
    <Card className="max-w-lg mb-32 container mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Create New Academic Year
        </CardTitle>
        <CardDescription>
          Set up a new academic year for your institution
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
                  <FormLabel>Academic Year Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 2024-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="isCurrent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="isCurrent">
                    Set as current academic year
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full mt-5">
              Create Academic Year
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
