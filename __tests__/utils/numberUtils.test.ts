// Simple number utility functions
const isPositive = (num: number): boolean => num > 0;
const roundToDecimal = (num: number, decimals: number): number => Number(Math.round(Number(num + "e" + decimals)) + "e-" + decimals);
const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

describe("Number Utilities", () => {
  describe("isPositive", () => {
    test("should return true for positive numbers", () => {
      expect(isPositive(5)).toBe(true);
      expect(isPositive(0.1)).toBe(true);
    });

    test("should return false for zero and negative numbers", () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-5)).toBe(false);
    });
  });

  describe("roundToDecimal", () => {
    test("should round numbers to specified decimal places", () => {
      expect(roundToDecimal(3.14159, 2)).toBe(3.14);
      expect(roundToDecimal(10.999, 1)).toBe(11.0);
    });

    test("should handle zero decimal places", () => {
      expect(roundToDecimal(3.6, 0)).toBe(4);
    });
  });

  describe("clamp", () => {
    test("should keep number within specified range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    test("should handle equal min and max", () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });
  });
});
