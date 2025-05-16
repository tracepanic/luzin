"use server";

import { db } from "@/db";
import { events } from "@/db/schema/events";
import { schools } from "@/db/schema/schools";
import { CreateEventSchema, Event } from "@/schemas/events";
import { validateUserIsAdmin } from "@/server/common";
import { queryClient } from "@/utils/provider";
import { rrulestr } from "rrule";
import { z } from "zod";

export async function adminCreateNewEvent(
  values: z.infer<typeof CreateEventSchema>,
) {
  try {
    const data = CreateEventSchema.parse(values);

    try {
      const rule = rrulestr(data.rrule);

      if (!rule) {
        throw new Error("Failed to parse rrule");
      }
    } catch {
      throw new Error("Failed to parse rrule");
    }

    const user = await queryClient.fetchQuery({
      queryKey: ["is-user-an-admin"],
      queryFn: validateUserIsAdmin,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const school = await db.select().from(schools).limit(1);

    if (school.length !== 1 || !school[0]?.id) {
      throw new Error("School not found");
    }

    const res = await db
      .insert(events)
      .values({
        title: data.title,
        scope: data.scope,
        type: data.type,
        schoolId: school[0].id,
        hostId: user.id,
        rrule: data.rrule,
        duration: data.duration,
        academicYearId:
          data.scope === "academic_year" ? data.academicYearId : undefined,
        classInstanceId:
          data.scope === "class_instance" ? data.classInstanceId : undefined,
      })
      .returning({ id: events.id });

    if (res.length !== 1 || !res[0]?.id) {
      throw new Error("Failed to create event");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create event");
  }
}

export async function adminGetEvents(): Promise<Event[]> {
  try {
    return db.select().from(events);
  } catch {
    throw new Error("Failed get events");
  }
}
