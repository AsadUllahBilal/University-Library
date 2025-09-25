"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callbackUrl") || "";
  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      // first hit limiter API
      const res = await fetch("/api/auth/limit-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        toast("Error", {
          description: "Too many sign-in attempts. Please try again later.",
        });
        window.location.href = "/too-fast";
        return { success: false };
      }

      if(!res.ok) {
        toast("Error", {
          description: "Sign-in failed. Please try again.",
        });
        window.location.href = "/too-fast";
        return { success: false };
      }

      // if allowed, actually sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast("Error", {
          description: "Invalid email or password.",
        });
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      toast("Error", {
        description: "An unexpected error occurred during sign in.",
      });
      return { success: false };
    }
  };

  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSignIn}
    />
  );
};

export default SignInPage;
