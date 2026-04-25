"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { CategoryBadge } from "@/components/CategoryIcon";
import { AddCategoryBlock, DeleteCategoryPanel, EditCategoryForm } from "@/components/CategoryManagePanels";
import { useCart } from "@/context/CartContext";
import type { CategoryGlyph } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { categoryLabel, sortCategories } from "@/lib/defaultCategories";

export default function SettingsPage() {
  const { state, actions } = useCart();
  const [nameEn, setNameEn] = useState("");
  const [nameTr, setNameTr] = useState("");
  const [glyph, setGlyph] = useState<CategoryGlyph>("custom");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameTr, setEditNameTr] = useState("");
  const [editGlyph, setEditGlyph] = useState<CategoryGlyph>("custom");

  const sorted = useMemo(() => sortCategories(state.categories), [state.categories]);

  useEffect(() => {
    if (!editingId) return;
    const cat = state.categories.find((c) => c.id === editingId);
    if (cat) {
      setEditNameEn(cat.nameEn);
      setEditNameTr(cat.nameTr);
      setEditGlyph(cat.glyph);
    }
  }, [editingId, state.categories]);

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-mesh-light" />
        <div className="relative mx-auto w-full max-w-[440px] px-4 pt-[max(14px,env(safe-area-inset-top))] pb-28">
          <ScreenHeader />

          <div className="mt-6">
            <p className="text-3xl font-semibold tracking-tight">{t(state.locale, "settingsTitle")}</p>
            <p className="mt-2 text-sm font-semibold text-black/65 max-w-[40ch]">{t(state.locale, "settingsSubtitle")}</p>
          </div>

          <section className="mt-7 rounded-[28px] bg-white shadow-card ring-1 ring-black/10 overflow-hidden">
            <div className="p-4 border-b border-black/10">
              <p className="text-sm font-semibold">{t(state.locale, "language")}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <LocaleButton active={state.locale === "en"} label={t(state.locale, "languageEnglish")} onClick={() => actions.setLocale("en")} />
                <LocaleButton active={state.locale === "tr"} label={t(state.locale, "languageTurkish")} onClick={() => actions.setLocale("tr")} />
              </div>
            </div>

            <div className="p-4 border-b border-black/10">
              <p className="text-sm font-semibold">{t(state.locale, "categoriesTitle")}</p>
              <p className="mt-1 text-xs font-semibold text-black/55 leading-relaxed">{t(state.locale, "categoriesSubtitle")}</p>

              <ul className="mt-4 space-y-2">
                {sorted.map((c, idx) => (
                  <li key={c.id} className="rounded-2xl ring-1 ring-black/10 bg-white overflow-hidden">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <CategoryBadge glyph={c.glyph} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{categoryLabel(state.locale, c)}</p>
                        <p className="text-[11px] font-semibold text-black/45 truncate">
                          {c.nameEn} · {c.nameTr}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-black/70 hover:bg-black/5 disabled:opacity-30"
                          disabled={idx === 0}
                          aria-label={t(state.locale, "moveUp")}
                          onClick={() => actions.moveCategory(c.id, -1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-black/70 hover:bg-black/5 disabled:opacity-30"
                          disabled={idx === sorted.length - 1}
                          aria-label={t(state.locale, "moveDown")}
                          onClick={() => actions.moveCategory(c.id, 1)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          className="rounded-xl p-2 text-black/70 hover:bg-black/5"
                          aria-label={t(state.locale, "editCategory")}
                          onClick={() => {
                            setPendingDeleteId(null);
                            setEditingId((cur) => (cur === c.id ? null : c.id));
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-xl p-2 text-brand-primary hover:bg-red-50 disabled:opacity-30"
                          disabled={sorted.length <= 1}
                          aria-label={t(state.locale, "deleteCategory")}
                          onClick={() => {
                            if (sorted.length <= 1) return;
                            setEditingId(null);
                            setPendingDeleteId((cur) => (cur === c.id ? null : c.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {pendingDeleteId === c.id && (
                      <DeleteCategoryPanel
                        locale={state.locale}
                        onMoveItems={() => {
                          actions.deleteCategory(c.id, true);
                          setPendingDeleteId(null);
                        }}
                        onRemoveItems={() => {
                          if (window.confirm(t(state.locale, "deleteCategoryRemoveItemsConfirm"))) {
                            actions.deleteCategory(c.id, false);
                            setPendingDeleteId(null);
                          }
                        }}
                        onCancel={() => setPendingDeleteId(null)}
                      />
                    )}

                    {editingId === c.id && (
                      <EditCategoryForm
                        locale={state.locale}
                        nameEn={editNameEn}
                        setNameEn={setEditNameEn}
                        nameTr={editNameTr}
                        setNameTr={setEditNameTr}
                        glyph={editGlyph}
                        setGlyph={setEditGlyph}
                        onSave={() => {
                          actions.updateCategory(c.id, { nameEn: editNameEn, nameTr: editNameTr, glyph: editGlyph });
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </li>
                ))}
              </ul>

              <AddCategoryBlock
                locale={state.locale}
                nameEn={nameEn}
                setNameEn={setNameEn}
                nameTr={nameTr}
                setNameTr={setNameTr}
                glyph={glyph}
                setGlyph={setGlyph}
                onAdd={() => {
                  actions.addCategory(nameEn, nameTr, glyph);
                  setNameEn("");
                  setNameTr("");
                  setGlyph("custom");
                }}
              />

              <button
                type="button"
                className="mt-3 w-full rounded-2xl ring-1 ring-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/80 active:scale-[0.99] transition-transform"
                onClick={() => {
                  if (window.confirm(t(state.locale, "resetCategoriesConfirm"))) actions.resetCategories();
                }}
              >
                {t(state.locale, "resetCategories")}
              </button>
            </div>

            <div className="p-4">
              <button
                className="w-full rounded-2xl bg-black text-white px-4 py-3 text-base font-semibold active:scale-[0.99] transition-transform"
                onClick={() => {
                  if (window.confirm(t(state.locale, "resetDataConfirm"))) actions.reset();
                }}
              >
                {t(state.locale, "resetData")}
              </button>
              <p className="mt-2 text-xs font-semibold text-black/55">LocalStorage • {state.locale.toUpperCase()}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LocaleButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition-transform active:scale-[0.99]",
        active ? "bg-brand-primary text-white ring-black/10" : "bg-white text-black ring-black/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
