"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginResponse {
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

export const loginAction = async (prevState: any, formData: FormData) => {
  try {
    const loginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, loginData);

    if (response.data.status === 200) {
      // Store JWT in an HTTP-only cookie
      cookies().set("token", response.data.data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Store user data
      cookies().set("user", JSON.stringify(response.data.data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return {
        message: "Login successful! Redirecting...",
        success: true,
      };
    }

    return {
      message: "Something went wrong",
      success: false,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Invalid credentials",
      success: false,
    };
  }
};
