"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const handleSignIn = async (data: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,      // NextAuth handles redirect automatically
      callbackUrl: "/",    // home page
    });

    // If redirect: true, this code is usually never reached
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