import { describe, it, expect, vi, beforeAll, beforeEach, Mock } from "vitest";
import { getLinkHref } from "./getLinkHref";

import { getLocale } from "next-intl/server";

// 모듈 모킹
vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
}));

describe("getLinkHref", () => {
  describe("as is - not deployed (localhost)", () => {
    beforeAll(() => {
      (getLocale as Mock).mockResolvedValue("en");
    });

    it("to be - should return correct link for localhost environment", async () => {
      const result = await getLinkHref({ href: "/path", custom: false, subDomain: "app" });
      expect(result).toBe("http://localhost:3000/en/app/path");
    });

    it("to be - should use 'www' as default subdomain when subDomain is not provided", async () => {
      const result = await getLinkHref({ href: "/path", custom: false });
      expect(result).toBe("http://localhost:3000/en/www/path");
    });

    it("to be - should use custom href directly when custom is true", async () => {
      const result = await getLinkHref({ href: "/custom-path", custom: true });
      expect(result).toBe("/custom-path");
    });
  });
});
