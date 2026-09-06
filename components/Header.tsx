import Link from "next/link";

export function Header({
  adminName,
}: {
  adminName?: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-mustard/25 bg-walnut/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="min-w-0">
          <p className="font-[family-name:var(--font-ticket)] text-xs tracking-[0.28em] text-mustard">
            OPEN LATE · SOFIA
          </p>
          <h1 className="truncate font-[family-name:var(--font-display)] text-xl text-cream sm:text-2xl">
            BurgerMasters
          </h1>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/#burgers"
            className="hidden text-cream/80 hover:text-mustard sm:inline"
          >
            Menu
          </Link>
          {adminName ? (
            <Link
              href="/admin"
              className="rounded-full bg-mustard px-3 py-1.5 font-semibold text-ink"
            >
              Kitchen
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-mustard/50 px-3 py-1.5 text-mustard hover:bg-mustard hover:text-ink"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
