import type { CategoryGlyph } from "@/context/CartContext";
import { Apple, Cat, Cherry, Croissant, CupSoda, Drumstick, Milk, Package, Popcorn, Snowflake, Sparkles } from "lucide-react";

export function categoryBadgeClass(glyph: CategoryGlyph) {
  switch (glyph) {
    case "produce":
      return "bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-200";
    case "dairy":
      return "bg-gradient-to-br from-sky-300 via-indigo-200 to-fuchsia-200";
    case "meat_poultry":
      return "bg-gradient-to-br from-rose-300 via-orange-200 to-amber-200";
    case "snacks":
      return "bg-gradient-to-br from-yellow-300 via-orange-200 to-pink-200";
    case "frozen":
      return "bg-gradient-to-br from-cyan-300 via-blue-200 to-indigo-200";
    case "beverages":
      return "bg-gradient-to-br from-violet-300 via-fuchsia-200 to-sky-200";
    case "bakery":
      return "bg-gradient-to-br from-amber-300 via-orange-200 to-yellow-200";
    case "household":
      return "bg-gradient-to-br from-slate-300 via-zinc-200 to-neutral-200";
    case "personal_care":
      return "bg-gradient-to-br from-pink-300 via-rose-200 to-purple-200";
    case "pets":
      return "bg-gradient-to-br from-lime-300 via-emerald-200 to-teal-200";
    case "custom":
    default:
      return "bg-gradient-to-br from-zinc-200 via-white to-zinc-200";
  }
}

function CategoryGlyphMark({ glyph }: { glyph: CategoryGlyph }) {
  const common = "h-5 w-5 text-white drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]";
  const stroke = 2.35;
  switch (glyph) {
    case "produce":
      return <Cherry className={common} strokeWidth={stroke} />;
    case "dairy":
      return <Milk className={common} strokeWidth={stroke} />;
    case "meat_poultry":
      return <Drumstick className={common} strokeWidth={stroke} />;
    case "snacks":
      return <Popcorn className={common} strokeWidth={stroke} />;
    case "frozen":
      return <Snowflake className={common} strokeWidth={stroke} />;
    case "beverages":
      return <CupSoda className={common} strokeWidth={stroke} />;
    case "bakery":
      return <Croissant className={common} strokeWidth={stroke} />;
    case "household":
      return <Package className={common} strokeWidth={stroke} />;
    case "personal_care":
      return <Sparkles className={common} strokeWidth={stroke} />;
    case "pets":
      return <Cat className={common} strokeWidth={stroke} />;
    case "custom":
    default:
      return <Apple className={common} strokeWidth={stroke} />;
  }
}

export function CategoryBadge({
  glyph,
  size = "md",
}: {
  glyph: CategoryGlyph;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "h-12 w-12 rounded-[18px]" : size === "sm" ? "h-9 w-9 rounded-2xl" : "h-10 w-10 rounded-[18px]";

  return (
    <span
      className={[
        "inline-flex items-center justify-center shadow-soft ring-1 ring-black/10",
        dim,
        categoryBadgeClass(glyph),
      ].join(" ")}
      aria-hidden
    >
      <CategoryGlyphMark glyph={glyph} />
    </span>
  );
}

/** @deprecated Prefer `CategoryGlyphMark` via `CategoryBadge`; kept for older call sites */
export function CategoryIcon({ glyph }: { glyph: CategoryGlyph }) {
  return <CategoryGlyphMark glyph={glyph} />;
}
