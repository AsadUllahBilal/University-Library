"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth"; // server action for DB insert
import { signIn } from "next-auth/react";

const Page = () => {
  const signUpAndSignIn = async (data: any) => {
    try {
      // Call server action to create user
      const result = await signUp(data);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Client-side signIn after successful signup
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Don't redirect automatically, we'll handle it
        callbackUrl: "/",
      });

      if (signInResult?.error) {
        return { success: false, error: "Failed to sign in after signup" };
      }

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An unexpected error occurred during signup" };
    }
  };

  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        fullName: "",
        email: "",
        universityId: "",
        password: "",
        universityCard: "",
      }}
      onSubmit={signUpAndSignIn}
    />
  );
};

export default Page;