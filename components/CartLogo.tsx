import Image from "next/image";

export function CartLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="CartPilot"
      width={40}
      height={40}
      priority
      className={["h-10 w-10 rounded-2xl ring-1 ring-black/10 bg-white", className].filter(Boolean).join(" ")}
    />
  );
}
