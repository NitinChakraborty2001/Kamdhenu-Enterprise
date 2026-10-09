import { describe, expect, it } from "vitest";

import { buildOrderSummary, lineTotal, PACKS, packTotal } from "@/lib/catalog";

describe("catalog pricing", () => {
  it("calculates proportional prices", () => {
    expect(lineTotal(1400, 250)).toBe(350);
    expect(lineTotal(550, 100)).toBe(55);
  });

  it("derives pack totals from catalog prices", () => {
    expect(packTotal(PACKS.everyday)).toBe(305);
    expect(packTotal(PACKS.family)).toBe(870);
  });

  it("creates an itemized WhatsApp summary", () => {
    const summary = buildOrderSummary([{ productId: "cashew", grams: 100 }], "Call before pickup", false);
    expect(summary).toContain("Cashew (কাজুবাদাম)");
    expect(summary).toContain("₹140");
    expect(summary).toContain("Call before pickup");
  });
});