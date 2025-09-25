"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip)

  if(!success) {
    return redirect('/too-fast')
  }

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityCard,
      universityId,
    });

    // Build robust base URL for workflow trigger
    const hdrs = await headers();
    const origin =
      hdrs.get("origin") ||
      config.env.apiEndpoint ||
      config.env.prodApiEndpoint ||
      "http://localhost:3000";

    // Trigger email workflow asynchronously - don't wait for it
    workflowClient
      .trigger({
        url: `${origin}/api/workflows`,
        body: {
          email,
          fullName,
        },
      })
      .catch((workflowError) => {
        console.error("Workflow trigger failed:", workflowError);
        // Don't fail the signup if email workflow fails
      });

    return { success: true, email, password }; // send back email/password to client
  } catch (error: any) {
    console.log(error, "Sign up Error");
    return { success: false, error: "Signup Error" };
  }
};
