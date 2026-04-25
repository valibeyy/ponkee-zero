"use client";

import type { CategoryGlyph, Locale } from "@/context/CartContext";
import { CATEGORY_GLYPH_OPTIONS, glyphOptionLabel } from "@/lib/categoryGlyphs";
import { t } from "@/lib/i18n";

export function DeleteCategoryPanel({
  locale,
  onMoveItems,
  onRemoveItems,
  onCancel,
}: {
  locale: Locale;
  onMoveItems: () => void;
  onRemoveItems: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="border-t border-black/10 px-3 py-3 bg-black/[0.02] space-y-2">
      <p className="text-xs font-semibold text-black/65 leading-snug">{t(locale, "deleteCategoryWhatAboutItems")}</p>
      <button
        type="button"
        className="w-full rounded-xl bg-brand-primary text-white px-3 py-2.5 text-sm font-semibold active:scale-[0.99] transition-transform"
        onClick={onMoveItems}
      >
        {t(locale, "deleteCategoryMoveItems")}
      </button>
      <button
        type="button"
        className="w-full rounded-xl ring-1 ring-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black/85 active:scale-[0.99] transition-transform"
        onClick={onRemoveItems}
      >
        {t(locale, "deleteCategoryRemoveItems")}
      </button>
      <button type="button" className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-black/55" onClick={onCancel}>
        {t(locale, "cancel")}
      </button>
    </div>
  );
}

export function EditCategoryForm({
  locale,
  nameEn,
  setNameEn,
  nameTr,
  setNameTr,
  glyph,
  setGlyph,
  onSave,
  onCancel,
}: {
  locale: Locale;
  nameEn: string;
  setNameEn: (v: string) => void;
  nameTr: string;
  setNameTr: (v: string) => void;
  glyph: CategoryGlyph;
  setGlyph: (g: CategoryGlyph) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="border-t border-black/10 px-3 py-3 bg-black/[0.02] space-y-2">
      <input
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        placeholder={t(locale, "categoryNameEn")}
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
      />
      <input
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        placeholder={t(locale, "categoryNameTr")}
        value={nameTr}
        onChange={(e) => setNameTr(e.target.value)}
      />
      <label className="block text-[11px] font-semibold text-black/50">{t(locale, "categoryIconStyle")}</label>
      <select
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        value={glyph}
        onChange={(e) => setGlyph(e.target.value as CategoryGlyph)}
      >
        {CATEGORY_GLYPH_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {glyphOptionLabel(g)}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button type="button" className="rounded-xl ring-1 ring-black/10 bg-white px-3 py-2.5 text-sm font-semibold" onClick={onCancel}>
          {t(locale, "cancel")}
        </button>
        <button
          type="button"
          className="rounded-xl bg-black text-white px-3 py-2.5 text-sm font-semibold active:scale-[0.99] transition-transform"
          onClick={onSave}
        >
          {t(locale, "save")}
        </button>
      </div>
    </div>
  );
}

export function AddCategoryBlock({
  locale,
  nameEn,
  setNameEn,
  nameTr,
  setNameTr,
  glyph,
  setGlyph,
  onAdd,
  className = "mt-4 space-y-2 rounded-2xl bg-black/[0.03] p-3 ring-1 ring-black/10",
  showHeading = true,
}: {
  locale: Locale;
  nameEn: string;
  setNameEn: (v: string) => void;
  nameTr: string;
  setNameTr: (v: string) => void;
  glyph: CategoryGlyph;
  setGlyph: (g: CategoryGlyph) => void;
  onAdd: () => void;
  className?: string;
  showHeading?: boolean;
}) {
  return (
    <div className={className}>
      {showHeading ? <p className="text-xs font-semibold text-black/60">{t(locale, "addCategory")}</p> : null}
      <input
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        placeholder={t(locale, "categoryNameEn")}
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
      />
      <input
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        placeholder={t(locale, "categoryNameTr")}
        value={nameTr}
        onChange={(e) => setNameTr(e.target.value)}
      />
      <label className="block text-[11px] font-semibold text-black/50">{t(locale, "categoryIconStyle")}</label>
      <select
        className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold outline-none bg-white"
        value={glyph}
        onChange={(e) => setGlyph(e.target.value as CategoryGlyph)}
      >
        {CATEGORY_GLYPH_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {glyphOptionLabel(g)}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="w-full rounded-xl bg-brand-primary text-white px-3 py-2.5 text-sm font-semibold active:scale-[0.99] transition-transform"
        onClick={onAdd}
      >
        {t(locale, "addCategory")}
      </button>
    </div>
  );
}
