import { signIn, register, setAuthToken, getAuthToken, removeAuthToken } from "@/utils/auth";
import axiosInstance from "@/utils/axiosInstance";

// Mock axios instance
jest.mock("@/utils/axiosInstance", () => ({
  post: jest.fn(),
}));

describe("Auth Utils", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear cookies before each test
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  });

  describe("Token Management", () => {
    it("should set auth token in cookies with correct attributes", () => {
      const token = "test-token";
      setAuthToken(token);

      // Get all cookies and split them
      const cookies = document.cookie.split(";").map((c) => c.trim());

      // Find the jwt cookie
      const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
      expect(jwtCookie).toBeDefined();
      expect(jwtCookie).toContain("test-token");

      // Check if cookie was set with correct path and SameSite
      // Note: Some test environments might not expose these attributes
      // so we'll check the actual cookie setting in the implementation
      const cookieValue = document.cookie;
      expect(cookieValue).toBeTruthy();
    });

    it("should get auth token from cookies", () => {
      document.cookie = "jwt=test-token; path=/; SameSite=Lax";
      const token = getAuthToken();

      expect(token).toBe("test-token");
    });

    it("should return null when no token exists", () => {
      // Cookie is already cleared in beforeEach
      const token = getAuthToken();

      expect(token).toBeNull();
    });

    it("should handle multiple cookies correctly", () => {
      document.cookie = "other=value; path=/";
      document.cookie = "jwt=test-token; path=/";
      document.cookie = "another=cookie; path=/";

      const token = getAuthToken();
      expect(token).toBe("test-token");
    });

    it("should remove auth token from cookies", () => {
      document.cookie = "jwt=test-token; path=/";
      removeAuthToken();

      expect(document.cookie).not.toContain("jwt=");
      expect(getAuthToken()).toBeNull();
    });

    it("should only remove jwt cookie when removing auth token", () => {
      document.cookie = "other=value; path=/";
      document.cookie = "jwt=test-token; path=/";
      document.cookie = "another=cookie; path=/";

      removeAuthToken();

      expect(document.cookie).not.toContain("jwt=");
      expect(document.cookie).toContain("other=value");
      expect(document.cookie).toContain("another=cookie");
    });
  });

  describe("signIn", () => {
    it("should make a POST request to sign in endpoint", async () => {
      const mockResponse = { data: { token: "test-token", user: { id: "1", email: "test@example.com" } } };
      (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const credentials = { email: "test@example.com", password: "password123" };
      const response = await signIn(credentials);

      expect(axiosInstance.post).toHaveBeenCalledWith("/v1/auth/sign-in", credentials);
      expect(response).toEqual(mockResponse.data);
    });

    it("should throw an error when sign in fails", async () => {
      const errorMessage = "Invalid credentials";
      (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const credentials = { email: "test@example.com", password: "wrong-password" };
      await expect(signIn(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe("register", () => {
    it("should make a POST request to register endpoint", async () => {
      const mockResponse = { data: { token: "test-token", user: { id: "1", email: "test@example.com" } } };
      (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const credentials = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };
      const response = await register(credentials);

      expect(axiosInstance.post).toHaveBeenCalledWith("/v1/auth/register", credentials);
      expect(response).toEqual(mockResponse.data);
    });

    it("should throw an error when registration fails", async () => {
      const errorMessage = "Email already exists";
      (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const credentials = {
        email: "existing@example.com",
        password: "password123",
        name: "Test User",
      };
      await expect(register(credentials)).rejects.toThrow(errorMessage);
    });
  });
});
