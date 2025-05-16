import { eventScope, eventType } from "@/db/schema/_enums";
import { events } from "@/db/schema/events";
import { InferSelectModel } from "drizzle-orm";
import { RRule, rrulestr } from "rrule";
import { z } from "zod";

export type Event = InferSelectModel<typeof events>;

export type CurrentCalendarViewType =
  | "timeGridDay"
  | "timeGridWeek"
  | "dayGridMonth";

export interface StoreEvent {
  id: string;
  title: string;
  rrule: RRule | null;
  duration: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export const CreateEventSchema = z
  .object({
    title: z.string().min(3).max(255),
    scope: z.enum(eventScope.enumValues),
    type: z.enum(eventType.enumValues),
    location: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().min(5),
    rrule: z
      .string()
      .min(1)
      .refine(
        (value) => {
          try {
            rrulestr(value);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid RRule string",
        },
      ),
    academicYearId: z.string().optional(),
    classInstanceId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope === "class_instance") {
      if (!data.classInstanceId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Class must be provided when scope is class",
          path: ["classInstanceId"],
        });
      }
    }

    if (data.scope === "academic_year") {
      if (!data.academicYearId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Academic year must be provided when scope is academic year",
          path: ["academicYearId"],
        });
      }
    }
  });
