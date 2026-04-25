import type { CategoryGlyph } from "@/context/CartContext";

export const CATEGORY_GLYPH_OPTIONS: CategoryGlyph[] = [
  "produce",
  "dairy",
  "meat_poultry",
  "snacks",
  "frozen",
  "beverages",
  "bakery",
  "household",
  "personal_care",
  "pets",
  "custom",
];

export function glyphOptionLabel(g: CategoryGlyph) {
  return g.replace(/_/g, " ");
}
