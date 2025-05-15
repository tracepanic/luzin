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
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CreateEventSchema } from "@/schemas/events";
import { adminCreateNewEvent } from "@/server/events";
import { getAcademicYears } from "@/server/year";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { rrulestr } from "rrule";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const [activeTab, setActiveTab] = useState("info");

  const results = useQueries({
    queries: [
      {
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        meta: { showError: true },
      },
    ],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: adminCreateNewEvent,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Event created successfully");
      // Redirect
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to create event");
      // Reset form
    },
  });

  const [yearsResult] = results;

  const years = yearsResult.data ?? [];
  const isInitialPending = results.some((r) => r.isPending);

  const form = useForm<z.infer<typeof CreateEventSchema>>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: "",
      scope: "global",
      type: "holiday",
      location: "",
      description: "",
      academicYearId: undefined,
      classInstanceId: undefined,
      rrule: "",
      duration: "01:00", // a string in the format hh:mm:ss.sss, hh:mm:sss or hh:mm
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateEventSchema>) => {
    mutate(values);
    toast.loading("Creating event...");
  };

  function handleParseRrule() {
    const rrule = form.getValues("rrule");

    if (!rrule) {
      toast.error("Can't parse empty rule");
      return;
    }

    try {
      const rule = rrulestr(rrule);

      if (!rule) {
        toast.error("Invalid rrule");
        return;
      }
    } catch (error) {
      toast.error("Invalid rrule");
      return;
    }

    toast.success("Rule is valid");
  }

  if (isInitialPending) {
    return <Loader />;
  }

  return (
    <Card className="max-w-2xl mb-32 container mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Create New Event
        </CardTitle>
        <CardDescription>
          Create a new event in the calendar system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Basic Info</TabsTrigger>
                <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-10 space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input
                          className="max-w-lg"
                          placeholder="Enter event title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Scope</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full max-w-lg">
                            <SelectValue placeholder="Select event scope" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global</SelectItem>
                            <SelectItem value="targeted">Targeted</SelectItem>
                            <SelectItem value="class_instance">
                              Class
                            </SelectItem>
                            <SelectItem value="academic_year">
                              Academic Year
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full max-w-lg">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lesson">Lesson</SelectItem>
                            <SelectItem value="exam">Exam</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="school_schedule">
                              School Schedule
                            </SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("scope") === "academic_year" && (
                  <FormField
                    control={form.control}
                    name="academicYearId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel>Academic Year</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full max-w-lg">
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
                )}

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location (optional)</FormLabel>
                      <FormControl>
                        <Input
                          className="max-w-lg"
                          placeholder="Enter location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter event description"
                          className="max-w-lg"
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full max-w-lg mt-5"
                >
                  Continue
                </Button>
              </TabsContent>

              <TabsContent value="recurrence" className="mt-10 space-y-5">
                <FormField
                  control={form.control}
                  name="rrule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Rule (rrule)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR"
                            className="flex-1"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleParseRrule()}
                          >
                            Parse
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Duration</FormLabel>
                      <FormControl>
                        <Input
                          className="max-w-lg"
                          placeholder="Enter duration"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How long the event will take, in the format
                        hh:mm:ss.sss, hh:mm:sss or hh:mm. For example, '05:00'
                        signifies 5 hours.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
