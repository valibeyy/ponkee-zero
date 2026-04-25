import type { Locale } from "@/context/CartContext";

export type TranslationKey =
  | "appName"
  | "welcomeTitle"
  | "welcomeSubtitle"
  | "thisMonthsBudget"
  | "spent"
  | "remaining"
  | "overBy"
  | "budgetExceededBy"
  | "myShoppingRoutes"
  | "listsTitle"
  | "listsSubtitle"
  | "settingsTitle"
  | "settingsSubtitle"
  | "navHome"
  | "navLists"
  | "navSettings"
  | "dashboard"
  | "marketSpent"
  | "estTotal"
  | "tapToBuyHint"
  | "noItemsYet"
  | "newMarket"
  | "newItem"
  | "marketNamePlaceholder"
  | "addMarket"
  | "itemNamePlaceholder"
  | "estimatedShort"
  | "addItem"
  | "deleteMarketConfirm"
  | "deleteItem"
  | "deleteMarket"
  | "budgetEditTitle"
  | "budgetEditSubtitle"
  | "cancel"
  | "save"
  | "quickBuy"
  | "tapToBuy"
  | "paid"
  | "estimatedLabel"
  | "statusActive"
  | "statusCompleted"
  | "language"
  | "languageEnglish"
  | "languageTurkish"
  | "resetData"
  | "resetDataConfirm"
  | "done"
  | "itemSingular"
  | "itemPlural"
  | "checkItem"
  | "uncheckItem"
  | "budgetRemainingShort"
  | "addInCategory"
  | "emptyMarketsTitle"
  | "emptyMarketsSubtitle"
  | "categoriesTitle"
  | "categoriesSubtitle"
  | "categoryNameEn"
  | "categoryNameTr"
  | "categoryIconStyle"
  | "addCategory"
  | "deleteCategory"
  | "editCategory"
  | "deleteCategoryWhatAboutItems"
  | "deleteCategoryMoveItems"
  | "deleteCategoryRemoveItems"
  | "deleteCategoryRemoveItemsConfirm"
  | "moveUp"
  | "moveDown"
  | "resetCategories"
  | "resetCategoriesConfirm"
  | "marketCategoriesHint"
  | "toggleAddCategoryForm";

type Dict = Record<TranslationKey, string>;

const en: Dict = {
  appName: "CartPilot",
  welcomeTitle: "Welcome",
  welcomeSubtitle: "Stay inside budget with market lists built for real shopping trips.",
  thisMonthsBudget: "This Month’s Budget",
  spent: "Spent",
  remaining: "Remaining",
  overBy: "Over by",
  budgetExceededBy: "Budget exceeded by",
  myShoppingRoutes: "My Shopping Routes",
  listsTitle: "Lists",
  listsSubtitle: "Pick a market and start checking items off.",
  settingsTitle: "Settings",
  settingsSubtitle: "Language and data controls.",
  navHome: "Home",
  navLists: "Lists",
  navSettings: "Settings",
  dashboard: "Dashboard",
  marketSpent: "Market spent",
  estTotal: "Est. total",
  tapToBuyHint: "Tap an item to buy. Enter price inline or Quick Buy.",
  noItemsYet: "No items yet.",
  newMarket: "New Market",
  newItem: "New Item",
  marketNamePlaceholder: "Market name (e.g. Trader Joe’s)",
  addMarket: "Add market",
  itemNamePlaceholder: "Item name",
  estimatedShort: "Est",
  addItem: "Add item",
  deleteMarketConfirm: "Delete this market and its items?",
  deleteItem: "Delete item",
  deleteMarket: "Delete market",
  budgetEditTitle: "Edit monthly budget",
  budgetEditSubtitle: "Set a new budget amount for this month.",
  cancel: "Cancel",
  save: "Save",
  quickBuy: "Quick Buy",
  tapToBuy: "Tap to buy",
  paid: "Paid",
  estimatedLabel: "Est.",
  statusActive: "Active",
  statusCompleted: "Completed",
  language: "Language",
  languageEnglish: "English",
  languageTurkish: "Turkish",
  resetData: "Reset all data",
  resetDataConfirm: "Reset CartPilot to defaults? This cannot be undone.",
  done: "Done",
  itemSingular: "item",
  itemPlural: "items",
  checkItem: "Mark purchased",
  uncheckItem: "Undo purchase",
  budgetRemainingShort: "Budget left",
  addInCategory: "Add",
  emptyMarketsTitle: "No markets yet",
  emptyMarketsSubtitle: "Tap + to create your first market list.",
  categoriesTitle: "Categories",
  categoriesSubtitle: "Reorder, edit names, delete, or add categories. When deleting, choose whether items move to another category or are removed.",
  categoryNameEn: "Name (English)",
  categoryNameTr: "Name (Turkish)",
  categoryIconStyle: "Icon style",
  addCategory: "Add category",
  deleteCategory: "Delete",
  editCategory: "Edit",
  deleteCategoryWhatAboutItems: "What should happen to items in this category?",
  deleteCategoryMoveItems: "Move items to another category",
  deleteCategoryRemoveItems: "Delete those items",
  deleteCategoryRemoveItemsConfirm: "Permanently delete all items in this category? This cannot be undone.",
  moveUp: "Move up",
  moveDown: "Move down",
  resetCategories: "Reset categories to defaults",
  resetCategoriesConfirm: "Restore the default category list? Custom categories will be removed and item categories remapped.",
  marketCategoriesHint:
    "Use the arrows to change order. Add your own categories (for example makeup). Pencil renames any category; trash removes it (you choose what happens to list items).",
  toggleAddCategoryForm: "Show / hide new category form",
};

const tr: Dict = {
  appName: "CartPilot",
  welcomeTitle: "Hoş geldin",
  welcomeSubtitle: "Gerçek market alışverişine uygun listelerle bütçende kal.",
  thisMonthsBudget: "Bu Ayın Bütçesi",
  spent: "Harcanan",
  remaining: "Kalan",
  overBy: "Aşıldı",
  budgetExceededBy: "Bütçe aşıldı",
  myShoppingRoutes: "Market Listelerim",
  listsTitle: "Listeler",
  listsSubtitle: "Bir market seç ve ürünleri işaretlemeye başla.",
  settingsTitle: "Ayarlar",
  settingsSubtitle: "Dil ve veri kontrolleri.",
  navHome: "Ana Sayfa",
  navLists: "Listeler",
  navSettings: "Ayarlar",
  dashboard: "Ana Sayfa",
  marketSpent: "Market harcaması",
  estTotal: "Tahmini toplam",
  tapToBuyHint: "Ürüne dokunup satın al. Fiyatı satır içinde gir veya Hızlı Al kullan.",
  noItemsYet: "Henüz ürün yok.",
  newMarket: "Yeni Market",
  newItem: "Yeni Ürün",
  marketNamePlaceholder: "Market adı (örn. Migros)",
  addMarket: "Market ekle",
  itemNamePlaceholder: "Ürün adı",
  estimatedShort: "Tahmini",
  addItem: "Ürün ekle",
  deleteMarketConfirm: "Bu marketi ve içindeki ürünleri silmek istiyor musun?",
  deleteItem: "Ürünü sil",
  deleteMarket: "Marketi sil",
  budgetEditTitle: "Aylık bütçeyi düzenle",
  budgetEditSubtitle: "Bu ay için yeni bir bütçe belirle.",
  cancel: "Vazgeç",
  save: "Kaydet",
  quickBuy: "Hızlı Al",
  tapToBuy: "Almak için dokun",
  paid: "Ödenen",
  estimatedLabel: "Tahmini",
  statusActive: "Aktif",
  statusCompleted: "Tamamlandı",
  language: "Dil",
  languageEnglish: "İngilizce",
  languageTurkish: "Türkçe",
  resetData: "Tüm verileri sıfırla",
  resetDataConfirm: "CartPilot’u varsayılana döndürmek istiyor musun? Bu geri alınamaz.",
  done: "Tamam",
  itemSingular: "ürün",
  itemPlural: "ürün",
  checkItem: "Satın alındı işaretle",
  uncheckItem: "Satın almayı geri al",
  budgetRemainingShort: "Kalan bütçe",
  addInCategory: "Ekle",
  emptyMarketsTitle: "Henüz market yok",
  emptyMarketsSubtitle: "İlk market listeni oluşturmak için +’a dokun.",
  categoriesTitle: "Kategoriler",
  categoriesSubtitle: "Sırala, adları düzenle, sil veya yeni kategori ekle. Silerken ürünleri taşıyabilir veya silebilirsin.",
  categoryNameEn: "Ad (İngilizce)",
  categoryNameTr: "Ad (Türkçe)",
  categoryIconStyle: "Simge stili",
  addCategory: "Kategori ekle",
  deleteCategory: "Sil",
  editCategory: "Düzenle",
  deleteCategoryWhatAboutItems: "Bu kategorideki ürünler ne olsun?",
  deleteCategoryMoveItems: "Ürünleri başka kategoriye taşı",
  deleteCategoryRemoveItems: "Bu ürünleri sil",
  deleteCategoryRemoveItemsConfirm: "Bu kategorideki tüm ürünler kalıcı olarak silinsin mi? Bu geri alınamaz.",
  moveUp: "Yukarı",
  moveDown: "Aşağı",
  resetCategories: "Kategorileri varsayılana döndür",
  resetCategoriesConfirm: "Varsayılan kategori listesine dönülsün mü? Özel kategoriler kaldırılır ve ürün eşlemesi güncellenir.",
  marketCategoriesHint:
    "Sırayı oklarla değiştir. İstediğin isimde yeni kategori ekle (ör. makyaj malzemeleri). Kalemle her kategoriyi yeniden adlandırabilir; çöple silebilirsin (ürünler için seçenek çıkar).",
  toggleAddCategoryForm: "Yeni kategori formunu aç / kapat",
};

export function t(locale: Locale, key: TranslationKey) {
  return (locale === "tr" ? tr : en)[key];
}

export function itemsCountLabel(locale: Locale, count: number) {
  const n = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (locale === "tr") {
    return `${n} ürün`;
  }
  const word = n === 1 ? t(locale, "itemSingular") : t(locale, "itemPlural");
  return `${n} ${word}`;
}
