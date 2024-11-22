"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <form className="space-y-4">
        <FormInput label="Email" name="email" type="email" placeholder="Enter your email" />
        <FormInput label="Username" name="username" type="text" placeholder="Choose a username" />
        <FormInput label="Password" name="password" type="password" placeholder="Choose a password" />
        <FormInput label="Confirm Password" name="password2" type="password" placeholder="Confirm your password" />
        <FormInput label="First Name" name="firstName" type="text" placeholder="Enter your first name" />
        <FormInput label="Last Name" name="lastName" type="text" placeholder="Enter your last name" />

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
