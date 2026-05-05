import Link from "next/link";
import { GoldStarIcon } from "@/components/GoldStarIcon";

export function GoldStarHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/65">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="group flex items-center gap-4">
          <GoldStarIcon
            size="xl"
            priority
            className="transition group-hover:[filter:drop-shadow(0_0_14px_rgba(232,200,117,0.6))]"
            alt="Gold Star Market"
          />
          <span className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Gold Star Market
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/cards">Cards</NavLink>
          <NavLink href="/population">Pop Reports</NavLink>
          <NavLink href="/history">History</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-ink/80 transition hover:bg-white/5 hover:text-ink"
    >
      {children}
    </Link>
  );
}
