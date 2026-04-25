"use client";

import { use } from "react";
import MarketHeader from "@/components/MarketHeader";
import MarketItems from "@/components/MarketItems";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MarketPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto w-full max-w-[440px] px-4 pt-4 pb-10">
        <MarketHeader marketId={id} />
        <MarketItems marketId={id} />
      </div>
    </main>
  );
}
