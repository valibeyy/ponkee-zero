import type { CategoryDef, CategoryId } from "@/context/CartContext";

export const DEFAULT_CATEGORY_ID: CategoryId = "cat_produce";

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    id: "cat_produce",
    glyph: "produce",
    nameEn: "Produce",
    nameTr: "Sebze & Meyve",
    sort: 0,
  },
  {
    id: "cat_dairy",
    glyph: "dairy",
    nameEn: "Dairy",
    nameTr: "Süt Ürünleri",
    sort: 1,
  },
  {
    id: "cat_meat",
    glyph: "meat_poultry",
    nameEn: "Meat & Poultry",
    nameTr: "Et & Tavuk",
    sort: 2,
  },
  {
    id: "cat_snacks",
    glyph: "snacks",
    nameEn: "Snacks",
    nameTr: "Atıştırmalık",
    sort: 3,
  },
  {
    id: "cat_frozen",
    glyph: "frozen",
    nameEn: "Frozen",
    nameTr: "Dondurulmuş",
    sort: 4,
  },
  {
    id: "cat_beverages",
    glyph: "beverages",
    nameEn: "Beverages",
    nameTr: "İçecekler",
    sort: 5,
  },
  {
    id: "cat_bakery",
    glyph: "bakery",
    nameEn: "Bakery",
    nameTr: "Fırın",
    sort: 6,
  },
  {
    id: "cat_household",
    glyph: "household",
    nameEn: "Household",
    nameTr: "Ev Gereçleri",
    sort: 7,
  },
  {
    id: "cat_personal",
    glyph: "personal_care",
    nameEn: "Personal Care",
    nameTr: "Kişisel Bakım",
    sort: 8,
  },
  {
    id: "cat_pets",
    glyph: "pets",
    nameEn: "Pets",
    nameTr: "Evcil Hayvan",
    sort: 9,
  },
];

export function sortCategories(cats: CategoryDef[]) {
  return [...cats].sort((a, b) => a.sort - b.sort);
}

export function categoryLabel(locale: "en" | "tr", c: CategoryDef) {
  return locale === "tr" ? c.nameTr : c.nameEn;
}
