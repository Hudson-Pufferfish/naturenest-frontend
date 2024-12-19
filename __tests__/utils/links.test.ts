import { links } from "@/utils/links";

describe("Navigation Links", () => {
  test("links array should not be empty", () => {
    expect(links.length).toBeGreaterThan(0);
  });

  test("each link should have required properties", () => {
    links.forEach((link) => {
      expect(link).toHaveProperty("href");
      expect(link).toHaveProperty("label");
      expect(typeof link.href).toBe("string");
      expect(typeof link.label).toBe("string");
    });
  });

  test("home link should be first in the array", () => {
    expect(links[0]).toEqual({
      href: "/",
      label: "home",
    });
  });
});
