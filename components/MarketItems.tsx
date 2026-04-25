"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { AddCategoryBlock, DeleteCategoryPanel, EditCategoryForm } from "@/components/CategoryManagePanels";
import { useCart } from "@/context/CartContext";
import type { CategoryGlyph } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { CategoryBadge } from "@/components/CategoryIcon";
import { publishQuickAdd } from "@/lib/quickAddBus";
import { categoryLabel, sortCategories } from "@/lib/defaultCategories";

export default function MarketItems({ marketId }: { marketId: string }) {
  const { state, actions } = useCart();
  const items = state.itemsByMarket[marketId] ?? [];
  const categories = sortCategories(state.categories);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameTr, setEditNameTr] = useState("");
  const [editGlyph, setEditGlyph] = useState<CategoryGlyph>("custom");

  const [showAddForm, setShowAddForm] = useState(false);
  const [addNameEn, setAddNameEn] = useState("");
  const [addNameTr, setAddNameTr] = useState("");
  const [addGlyph, setAddGlyph] = useState<CategoryGlyph>("custom");

  useEffect(() => {
    if (!editingId) return;
    const cat = state.categories.find((c) => c.id === editingId);
    if (cat) {
      setEditNameEn(cat.nameEn);
      setEditNameTr(cat.nameTr);
      setEditGlyph(cat.glyph);
    }
  }, [editingId, state.categories]);

  const locale = state.locale;

  return (
    <section className="mt-5 space-y-4">
      <div className="rounded-2xl bg-black/[0.04] ring-1 ring-black/10 px-3 py-2.5">
        <p className="text-xs font-semibold text-black/65 leading-relaxed">{t(locale, "marketCategoriesHint")}</p>
        <button
          type="button"
          className="mt-2 w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2.5 text-sm font-semibold text-black active:scale-[0.99] transition-transform"
          aria-expanded={showAddForm}
          aria-label={t(locale, "toggleAddCategoryForm")}
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? t(locale, "cancel") : `+ ${t(locale, "addCategory")}`}
        </button>
        {showAddForm && (
          <AddCategoryBlock
            locale={locale}
            nameEn={addNameEn}
            setNameEn={setAddNameEn}
            nameTr={addNameTr}
            setNameTr={setAddNameTr}
            glyph={addGlyph}
            setGlyph={setAddGlyph}
            showHeading={false}
            className="mt-3 space-y-2 rounded-xl bg-white p-3 ring-1 ring-black/10"
            onAdd={() => {
              actions.addCategory(addNameEn, addNameTr, addGlyph);
              setAddNameEn("");
              setAddNameTr("");
              setAddGlyph("custom");
              setShowAddForm(false);
            }}
          />
        )}
      </div>

      {categories.map((cat, idx) => {
        const list = items.filter((i) => i.category === cat.id);
        return (
          <div key={cat.id} className="rounded-[22px] ring-1 ring-black/10 bg-white overflow-hidden shadow-soft">
            <div className="flex items-stretch gap-0">
              <button
                type="button"
                onClick={() => publishQuickAdd({ marketId, category: cat.id })}
                className="min-w-0 flex-1 flex items-center gap-3 px-3 py-3 text-left active:bg-black/[0.03] transition-colors"
              >
                <CategoryBadge glyph={cat.glyph} size="md" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-black/55 uppercase">{categoryLabel(locale, cat)}</p>
                  <p className="mt-0.5 text-sm font-semibold text-black/70 truncate">{t(locale, "addInCategory")}</p>
                </div>
              </button>

              <div className="flex flex-col justify-center gap-1 border-l border-black/10 py-2 pl-2 pr-1 shrink-0 w-[52px]">
                <button
                  type="button"
                  disabled={idx === 0}
                  title={t(locale, "moveUp")}
                  className="flex flex-col items-center justify-center rounded-xl py-1 text-black/75 hover:bg-black/5 disabled:opacity-25 disabled:pointer-events-none"
                  onClick={() => actions.moveCategory(cat.id, -1)}
                >
                  <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
                  <span className="text-[9px] font-bold leading-none text-black/45">{t(locale, "moveUp")}</span>
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  title={t(locale, "moveDown")}
                  className="flex flex-col items-center justify-center rounded-xl py-1 text-black/75 hover:bg-black/5 disabled:opacity-25 disabled:pointer-events-none"
                  onClick={() => actions.moveCategory(cat.id, 1)}
                >
                  <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                  <span className="text-[9px] font-bold leading-none text-black/45">{t(locale, "moveDown")}</span>
                </button>
              </div>

              <div className="flex flex-col justify-center gap-1 border-l border-black/10 py-2 pr-2 pl-1 shrink-0">
                <button
                  type="button"
                  className="rounded-xl p-2 text-black/70 hover:bg-black/5"
                  aria-label={t(locale, "editCategory")}
                  onClick={() => {
                    setPendingDeleteId(null);
                    setEditingId((cur) => (cur === cat.id ? null : cat.id));
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-xl p-2 text-brand-primary hover:bg-red-50 disabled:opacity-30"
                  disabled={categories.length <= 1}
                  aria-label={t(locale, "deleteCategory")}
                  onClick={() => {
                    if (categories.length <= 1) return;
                    setEditingId(null);
                    setPendingDeleteId((cur) => (cur === cat.id ? null : cat.id));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => publishQuickAdd({ marketId, category: cat.id })}
                className="shrink-0 flex items-center justify-center w-14 border-l border-black/10 bg-brand-primary text-white active:opacity-95"
                aria-label={t(locale, "addInCategory")}
              >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </div>

            {pendingDeleteId === cat.id && (
              <DeleteCategoryPanel
                locale={locale}
                onMoveItems={() => {
                  actions.deleteCategory(cat.id, true);
                  setPendingDeleteId(null);
                }}
                onRemoveItems={() => {
                  if (window.confirm(t(locale, "deleteCategoryRemoveItemsConfirm"))) {
                    actions.deleteCategory(cat.id, false);
                    setPendingDeleteId(null);
                  }
                }}
                onCancel={() => setPendingDeleteId(null)}
              />
            )}

            {editingId === cat.id && (
              <EditCategoryForm
                locale={locale}
                nameEn={editNameEn}
                setNameEn={setEditNameEn}
                nameTr={editNameTr}
                setNameTr={setEditNameTr}
                glyph={editGlyph}
                setGlyph={setEditGlyph}
                onSave={() => {
                  actions.updateCategory(cat.id, { nameEn: editNameEn, nameTr: editNameTr, glyph: editGlyph });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            )}

            <div className="px-3 pb-3 space-y-2">
              {list.length === 0 ? (
                <button
                  type="button"
                  onClick={() => publishQuickAdd({ marketId, category: cat.id })}
                  className="w-full text-left rounded-[18px] bg-black/[0.03] ring-1 ring-black/10 p-4 text-sm font-semibold text-black/60 active:scale-[0.99] transition-transform"
                >
                  {t(locale, "noItemsYet")}
                </button>
              ) : (
                list.map((it) => <ItemRow key={it.id} item={it} />)
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
