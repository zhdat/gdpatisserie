import { expect, test } from "vitest";
import { formatPrice } from "./format-price";

test("Formate correctement le prix en euros", () => {
  expect(formatPrice(10)).toBe("10,00 €");
  expect(formatPrice(15.5)).toBe("15,50 €");
  expect(formatPrice(0)).toBe("0,00 €");
});
