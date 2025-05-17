import { schools } from "@/db/schema/schools";
import { InferSelectModel } from "drizzle-orm";

export type School = InferSelectModel<typeof schools>;
