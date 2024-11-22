"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register, setAuthToken } from "@/utils/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      setAuthToken(response.data.jwt);
      toast({
        description: response.message || "Successfully registered!",
      });
      router.push("/");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      toast({
        variant: "destructive",
        description: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage || "Failed to register",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast({
        variant: "destructive",
        description: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    if (formData.username.length < 3) {
      toast({
        variant: "destructive",
        description: "Username must be at least 3 characters",
      });
      return;
    }

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
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput label="Email" name="email" type="email" placeholder="Enter your email" onChange={handleInputChange} value={formData.email} />
        <FormInput
          label="Username"
          name="username"
          type="text"
          placeholder="Choose a username"
          onChange={handleInputChange}
          value={formData.username}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Choose a password"
          onChange={handleInputChange}
          value={formData.password}
        />
        <FormInput
          label="Confirm Password"
          name="password2"
          type="password"
          placeholder="Confirm your password"
          onChange={handleInputChange}
          value={formData.password2}
        />
        <FormInput
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          onChange={handleInputChange}
          value={formData.firstName}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          onChange={handleInputChange}
          value={formData.lastName}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating account..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
