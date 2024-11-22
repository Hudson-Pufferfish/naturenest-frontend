"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn, setAuthToken } from "@/utils/auth";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      setAuthToken(response.data.jwt);
      toast({
        description: response.message || "Successfully signed in!",
      });
      router.push("/");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to sign in",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput label="Email" name="email" type="email" placeholder="Enter your email" onChange={handleInputChange} value={formData.email} />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleInputChange}
          value={formData.password}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
