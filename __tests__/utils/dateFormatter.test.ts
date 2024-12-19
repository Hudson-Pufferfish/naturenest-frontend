/**
 * @jest-environment jsdom
 */

import { format, parseISO } from "date-fns";

describe("Date Formatting", () => {
  it("formats date correctly", () => {
    const testDate = parseISO("2024-03-15");
    const formatted = format(testDate, "yyyy-MM-dd");
    expect(formatted).toBe("2024-03-15");
  });

  it("handles current date", () => {
    const today = new Date();
    const formatted = format(today, "yyyy-MM-dd");
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats date with time", () => {
    const testDate = parseISO("2024-03-15T14:30:00");
    const formatted = format(testDate, "yyyy-MM-dd HH:mm");
    expect(formatted).toBe("2024-03-15 14:30");
  });
});
