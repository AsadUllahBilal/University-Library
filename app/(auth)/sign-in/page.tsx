"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callbackUrl") || "";
  const handleSignIn = async (data: { email: string; password: string }) => {
    // first hit limiter API
    const res = await fetch("/api/auth/limit-signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 429) {
      // show error or redirect to /too-fast
      window.location.href = "/too-fast";
      return { success: false };
    }

    if(!res.ok) {
      // show error or redirect to /too-fast
      window.location.href = "/too-fast";
      return { success: false };
    }

    // if allowed, actually sign in
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/",
    });

    return { success: true };
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
