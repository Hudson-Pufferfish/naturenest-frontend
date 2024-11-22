"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>

      <form className="space-y-4">
        <FormInput label="Email" name="email" type="email" placeholder="Enter your email" />
        <FormInput label="Password" name="password" type="password" placeholder="Enter your password" />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
