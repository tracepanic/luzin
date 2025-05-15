import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["student", "teacher", "admin"]);

export const eventType = pgEnum("event_type", [
  "lesson",
  "exam",
  "holiday",
  "meeting",
  "school_schedule",
  "custom",
]);

export const eventScope = pgEnum("event_scope", [
  "global",
  "targeted",
  "class_instance",
  "academic_year",
]);

export const attendeeStatus = pgEnum("attendee_status", [
  "invited",
  "accepted",
  "declined",
  "tentative",
]);

export const attendeeRole = pgEnum("attendee_role", [
  "participant",
  "organizer",
  "observer",
]);
