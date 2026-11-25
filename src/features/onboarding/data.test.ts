import { describe, expect, it } from "vitest";

import {
  buildPlatformUrl,
  isValidWhatsAppInput,
  normalizeWhatsAppUrl,
} from "./data";

describe("WhatsApp phone links", () => {
  it("requires an international country code", () => {
    expect(isValidWhatsAppInput("08130291694")).toBe(false);
    expect(isValidWhatsAppInput("+2348130291694")).toBe(true);
    expect(isValidWhatsAppInput("0044 7700 900123")).toBe(true);
  });

  it("saves the full international number after wa.me/", () => {
    expect(buildPlatformUrl("whatsapp", "+234 813 029 1694")).toBe(
      "https://wa.me/2348130291694",
    );
    expect(buildPlatformUrl("whatsapp", "0044 7700 900123")).toBe(
      "https://wa.me/447700900123",
    );
  });

  it("normalizes existing wa.me links and pasted links", () => {
    expect(buildPlatformUrl("whatsapp", "https://wa.me/+2348130291694")).toBe(
      "https://wa.me/2348130291694",
    );
    expect(buildPlatformUrl("whatsapp", "wa.me/447700900123")).toBe(
      "https://wa.me/447700900123",
    );
  });

  it("migrates old Nigerian local WhatsApp numbers", () => {
    expect(normalizeWhatsAppUrl("https://wa.me/08130291694")).toBe(
      "https://wa.me/2348130291694",
    );
  });
});
