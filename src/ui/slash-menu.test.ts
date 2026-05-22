import { describe, expect, it } from "vitest";
import { filterSlashMenuItems, formatSlashMenuRow, SLASH_MENU_ITEMS } from "./slash-menu";

describe("filterSlashMenuItems", () => {
  it("finds the models command when searching with the full slash command", () => {
    expect(filterSlashMenuItems(SLASH_MENU_ITEMS, "/models")[0]?.id).toBe("models");
  });

  it("finds the models command from model and mode prefixes before description matches", () => {
    expect(filterSlashMenuItems(SLASH_MENU_ITEMS, "model")[0]?.id).toBe("models");
    expect(filterSlashMenuItems(SLASH_MENU_ITEMS, "mode")[0]?.id).toBe("models");
  });

  it("still includes description matches after stronger command matches", () => {
    const ids = filterSlashMenuItems(SLASH_MENU_ITEMS, "mode").map((item) => item.id);
    expect(ids).toContain("models");
    expect(ids).toContain("sandbox");
    expect(ids.indexOf("models")).toBeLessThan(ids.indexOf("sandbox"));
  });

  it("includes session commands", () => {
    expect(SLASH_MENU_ITEMS.map((item) => item.id)).toEqual(expect.arrayContaining(["sessions", "resume"]));
  });
});

describe("formatSlashMenuRow", () => {
  it("hides long descriptions when a narrow panel would collide with the command label", () => {
    const item = SLASH_MENU_ITEMS.find((candidate) => candidate.id === "btw");

    expect(item).toBeDefined();
    expect(formatSlashMenuRow(item!, 18)).toEqual({
      label: "/btw",
      description: "",
    });
  });

  it("keeps a row within the available panel width", () => {
    const item = SLASH_MENU_ITEMS.find((candidate) => candidate.id === "btw")!;
    const panelWidth = 32;
    const row = formatSlashMenuRow(item, panelWidth);

    expect(`${row.label} ${row.description}`.trim().length).toBeLessThanOrEqual(panelWidth - 4);
  });
});
