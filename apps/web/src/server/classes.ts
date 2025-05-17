"use server";

import { db } from "@/db";
import { classes, classInstances } from "@/db/schema/classes";
import { schools } from "@/db/schema/schools";
import {
  Class,
  ClassInstance,
  CreateClassInstanceSchema,
  CreateClassTemplateSchema,
} from "@/schemas/classes";
import { validateUserIsAdmin } from "@/server/common";
import { desc } from "drizzle-orm";
import { z } from "zod";

export async function createClassTemplate(
  values: z.infer<typeof CreateClassTemplateSchema>,
) {
  try {
    const data = CreateClassTemplateSchema.parse(values);

    await validateUserIsAdmin();

    const school = await db.select().from(schools).limit(1);

    if (school.length !== 1 || !school[0]?.id) {
      throw new Error("School not found");
    }

    const res = await db
      .insert(classes)
      .values({ ...data, schoolId: school[0].id })
      .returning({ id: classes.id });

    if (res.length !== 1 || !res[0]?.id) {
      throw new Error("Failed to create class template");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create class template");
  }
}

export async function createClassInstance(
  values: z.infer<typeof CreateClassInstanceSchema>,
) {
  try {
    const data = CreateClassInstanceSchema.parse(values);

    await validateUserIsAdmin();

    const res = await db
      .insert(classInstances)
      .values({ ...data })
      .returning({ id: classes.id });

    if (res.length !== 1 || !res[0]?.id) {
      throw new Error("Failed to create class instance");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create class instance");
  }
}

export async function getClasses(): Promise<Class[]> {
  try {
    return db.select().from(classes).orderBy(desc(classes.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get classes templates");
  }
}

export async function getClassInsances(): Promise<ClassInstance[]> {
  try {
    return db
      .select()
      .from(classInstances)
      .orderBy(desc(classInstances.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get class instances");
  }
}
