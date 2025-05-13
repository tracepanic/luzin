"use client";

import { Loader } from "@/components/custom/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AcademicYear } from "@/lib/types";
import { getAcademicYears, getCurrentAcademicYear } from "@/server/year";
import { handleAction } from "@repo/actionkit";
import {
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { CalendarClock, CalendarRange, Edit, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [current, setCurrent] = useState<AcademicYear | null>(null);

  useEffect(() => {
    (async function loadData() {
      const [years, current] = await Promise.all([
        handleAction(getAcademicYears),
        handleAction(getCurrentAcademicYear),
      ]);

      if (years.success) {
        setYears(years.data ?? []);
      }

      if (current.success && current.data) {
        setCurrent(current.data);
      }

      setLoading(false);
    })();
  }, []);

  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const now = new Date();

    if (isBefore(now, start)) return 0;

    if (isAfter(now, end)) return 100;

    const totalDays = differenceInCalendarDays(end, start);
    const elapsedDays = differenceInCalendarDays(now, start);

    return Math.round((elapsedDays / totalDays) * 100);
  };

  const getRemainingDays = (endDate: string): number => {
    const end = parseISO(endDate);
    const now = new Date();

    if (isAfter(now, end)) return 0;

    return differenceInCalendarDays(end, now);
  };

  const getElapsedDays = (startDate: string): number => {
    const start = parseISO(startDate);
    const now = new Date();

    if (isBefore(now, start)) return -differenceInCalendarDays(start, now);

    return differenceInCalendarDays(now, start);
  };

  if (loading) {
    return <Loader />;
  }

  if (!loading && !current && years.length < 1) {
    return (
      <div className="max-w-3xl mt-10 container">
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CalendarClock className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <CardTitle>No Academic Years Found</CardTitle>
            <CardDescription>
              You haven't created any academic years yet. Create your first
              academic year to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link
              href="/admin/academic-years/new"
              className={buttonVariants({ variant: "default" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Academic Year
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && !current && years.length >= 1) {
    return (
      <div className="max-w-3xl mt-10 container">
        <Alert className="bg-warning/10 border-warning">
          <CalendarClock className="size-5 text-warning" />
          <AlertTitle className="text-warning text-lg font-semibold tracking-wide">
            No Current Academic Year Set
          </AlertTitle>
          <AlertDescription className="text-warning">
            You have several academic years in the system, but none is set as
            current. Please set one as current or create a new academic year.
          </AlertDescription>
        </Alert>

        <div className="bg-muted p-4 rounded-md mt-10">
          <h3 className="font-medium mb-2">What is a current academic year?</h3>
          <p className="text-sm text-muted-foreground">
            The current academic year is used as the default for all new
            courses, enrollments, and other academic activities. Setting a
            current academic year helps streamline operations and ensures data
            consistency across your LMS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Academic Year ({current!.name})
      </h1>
      <p className="text-muted-foreground mt-1">
        <span className="inline-flex items-center">
          <CalendarRange className="mr-1 h-4 w-4" />
          {format(new Date(current!.startsAt), "MMMM d, yyyy")} -{" "}
          {format(new Date(current!.endsAt), "MMMM d, yyyy")}
        </span>
      </p>
      <div className="flex items-center gap-3 mt-5">
        <Badge className={buttonVariants({ variant: "default" })}>ACTIVE</Badge>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/admin/academic-years/edit/${current!.id}`}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateProgress(
                current!.startsAt.toISOString(),
                current!.endsAt.toISOString(),
              )}
              %
            </div>
            <Progress
              value={calculateProgress(
                current!.startsAt.toISOString(),
                current!.endsAt.toISOString(),
              )}
              className="h-2 mt-2 mb-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{format(current!.startsAt, "MMM d, yyyy")}</span>
              <span>{format(current!.endsAt, "MMM d, yyyy")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Elapsed</span>
              <span className="font-medium">
                {getElapsedDays(current!.startsAt.toISOString())} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Remaining</span>
              <span className="font-medium">
                {getRemainingDays(current!.endsAt.toISOString())} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Duration</span>
              <span className="font-medium">
                {differenceInCalendarDays(current!.endsAt, current!.startsAt)}{" "}
                days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
