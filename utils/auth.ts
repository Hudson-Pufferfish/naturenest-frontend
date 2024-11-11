import { cookies } from "next/headers";

export const getAuthToken = () => {
  return cookies().get("token")?.value;
};

export const getUser = () => {
  const userCookie = cookies().get("user")?.value;
  if (userCookie) {
    return JSON.parse(userCookie);
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
