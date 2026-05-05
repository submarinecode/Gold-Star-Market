import Link from "next/link";
import { GoldStarIcon } from "@/components/GoldStarIcon";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <GoldStarIcon size="xl" />
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-ink">
        Card not found
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        That ID isn&apos;t in the registry. Try the full card index.
      </p>
      <Link href="/cards" className="btn-gold mt-6">
        Browse all Gold Stars →
      </Link>
    </div>
  );
}
