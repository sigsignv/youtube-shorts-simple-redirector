const shortsPattern = new URLPattern("https://www.youtube.com/shorts/:id{/}?");

export function extractShortsId(url: string): string {
  return shortsPattern.exec(url)?.pathname.groups.id ?? "";
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("extractShortsId", () => {
    const shortsId = "SK06wn1A7m4";

    it("extracts the ID from a Shorts URL", () => {
      const url = `https://www.youtube.com/shorts/${shortsId}`;
      expect(extractShortsId(url)).toBe(shortsId);
    });

    it("extracts the ID from a Shorts URL with a trailing slash", () => {
      const url = `https://www.youtube.com/shorts/${shortsId}/`;
      expect(extractShortsId(url)).toBe(shortsId);
    });

    it("extracts the ID from a Shorts URL with a query string", () => {
      const url = `https://www.youtube.com/shorts/${shortsId}?themeRefresh=1`;
      expect(extractShortsId(url)).toBe(shortsId);
    });

    it("extracts the ID from a Shorts URL ignoring hostname case", () => {
      const url = `https://www.YoUtUbE.COM/shorts/${shortsId}`;
      expect(extractShortsId(url)).toBe(shortsId);
    });

    it("returns an empty string for a YouTube channel URL", () => {
      const url = "https://www.youtube.com/channel/UCD-miitqNY3nyukJ4Fnf4_A";
      expect(extractShortsId(url)).toBe("");
    });

    it("returns an empty string for a YouTube subscriptions feed URL", () => {
      const url = "https://www.youtube.com/feed/subscriptions";
      expect(extractShortsId(url)).toBe("");
    });

    it("returns an empty string for a YouTube watch URL", () => {
      const url = `https://www.youtube.com/watch?v=${shortsId}`;
      expect(extractShortsId(url)).toBe("");
    });

    it.each([
      "https://www.youtube.com/shorts",
      "https://www.youtube.com/shorts/",
    ])("returns an empty string for a Shorts URL with no ID", (url) => {
      expect(extractShortsId(url)).toBe("");
    });

    it("returns an empty string for a Shorts URL with extra path segments", () => {
      const url = `https://www.youtube.com/shorts/${shortsId}/extra`;
      expect(extractShortsId(url)).toBe("");
    });

    it.each([
      `https://example.com/shorts/${shortsId}`,
      `https://www.youtube.com.example.com/shorts/${shortsId}`,
    ])(
      "returns an empty string when the hostname is not www.youtube.com",
      (url) => {
        expect(extractShortsId(url)).toBe("");
      },
    );

    it("returns an empty string for a relative URL", () => {
      const url = `/shorts/${shortsId}`;
      expect(extractShortsId(url)).toBe("");
    });
  });
}
