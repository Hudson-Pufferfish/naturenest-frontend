"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface CreateProfileFormData {
  email: string;
  username: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  status: number;
  message: string;
  data: {
    jwt: string;
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}

export const createProfileAction = async (prevState: any, formData: FormData) => {
  try {
    const rawFormData = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      password2: formData.get("password2") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    if (rawFormData.password !== rawFormData.password2) {
      return { message: "Passwords do not match" };
    }

    const response = await axios.post<RegisterResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, rawFormData);

    if (response.data.status === 200) {
      cookies().set("token", response.data.data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      cookies().set("user", JSON.stringify(response.data.data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      redirect("/profile");
    }

    return { message: "Profile created successfully" };
  } catch (error: any) {
    if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
      return {
        message: error.response.data.message.join(", "),
      };
    }

    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      return {
        message: typeof errorMessage === "string" ? errorMessage : Object.values(errorMessage).join(", "),
      };
    }

    return {
      message: "Error creating profile",
    };
  }
};
