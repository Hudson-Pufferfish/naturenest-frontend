// Simple array utility functions to test
const removeDuplicates = <T>(arr: T[]): T[] => [...new Set(arr)];
const getFirstItem = <T>(arr: T[]): T | undefined => arr[0];
const getLastItem = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

describe("Array Utilities", () => {
  describe("removeDuplicates", () => {
    test("should remove duplicate values from array", () => {
      const input = [1, 2, 2, 3, 3, 4];
      const expected = [1, 2, 3, 4];
      expect(removeDuplicates(input)).toEqual(expected);
    });

    test("should handle empty array", () => {
      expect(removeDuplicates([])).toEqual([]);
    });
  });

  describe("getFirstItem", () => {
    test("should return first item of array", () => {
      expect(getFirstItem([1, 2, 3])).toBe(1);
    });

    test("should return undefined for empty array", () => {
      expect(getFirstItem([])).toBeUndefined();
    });
  });

  describe("getLastItem", () => {
    test("should return last item of array", () => {
      expect(getLastItem([1, 2, 3])).toBe(3);
    });

    test("should return undefined for empty array", () => {
      expect(getLastItem([])).toBeUndefined();
    });
  });
});
