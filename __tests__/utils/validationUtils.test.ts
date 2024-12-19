// Simple validation utility functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    test("should return true for valid email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co")).toBe(true);
    });

    test("should return false for invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    test("should return true for passwords with 8 or more characters", () => {
      expect(isValidPassword("password123")).toBe(true);
      expect(isValidPassword("12345678")).toBe(true);
    });

    test("should return false for passwords with less than 8 characters", () => {
      expect(isValidPassword("short")).toBe(false);
      expect(isValidPassword("")).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    test("should return true for valid 10-digit phone numbers", () => {
      expect(isValidPhoneNumber("1234567890")).toBe(true);
      expect(isValidPhoneNumber("9876543210")).toBe(true);
    });

    test("should return false for invalid phone numbers", () => {
      expect(isValidPhoneNumber("123-456-7890")).toBe(false);
      expect(isValidPhoneNumber("12345")).toBe(false);
      expect(isValidPhoneNumber("")).toBe(false);
    });
  });
});
