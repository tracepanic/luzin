"use client";

import { Loader } from "@/components/custom/loader";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AcademicYear } from "@/lib/types";
import { getAcademicYears, getCurrentAcademicYear } from "@/server/year";
import { handleAction } from "@repo/actionkit";
import { CalendarClock, PlusCircle } from "lucide-react";
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

  return (
    <div>
      <h1>Page</h1>
      <p>This is a page.</p>
    </div>
  );
}
