import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto w-full max-w-[440px] px-4 pt-16">
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-sm font-semibold text-black/65">That page doesn’t exist.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-brand-primary text-white px-4 py-3 text-base font-semibold">
          Go home
        </Link>
      </div>
    </main>
  );
}
