/**
 * @jest-environment jsdom
 */

describe("String Utils", () => {
  describe("capitalize", () => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("handles already capitalized string", () => {
      expect(capitalize("World")).toBe("World");
    });
  });

  describe("truncate", () => {
    const truncate = (str: string, length: number) => (str.length > length ? `${str.slice(0, length)}...` : str);

    it("truncates long string", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("does not truncate short string", () => {
      expect(truncate("Hi", 5)).toBe("Hi");
    });

    it("handles exact length", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
    });
  });
});
