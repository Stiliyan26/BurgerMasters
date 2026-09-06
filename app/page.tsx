import { Header } from "@/components/Header";
import { MenuBoard } from "@/components/MenuBoard";
import { getAdminSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, items] = await Promise.all([
    getAdminSession(),
    getPrisma().menuItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <>
      <Header adminName={session?.username} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-[family-name:var(--font-ticket)] text-xs tracking-[0.32em] text-mustard">
          BLACK ANGUS · BRIoche · LATE COUNTER
        </p>
        <h2 className="mt-2 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-cream sm:text-6xl">
          The board is hot. Pick a burger, clip it to a ticket.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-cream/75">
          Original BurgerMasters seed — names, grams, and BGN prices from the
          C# menu configuration. Fries and fountain drinks ride along.
        </p>
      </section>
      <MenuBoard
        items={items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          priceBgn: Number(item.priceBgn),
          portionGrams: item.portionGrams,
          category: item.category,
          imagePath: item.imagePath,
        }))}
      />
    </>
  );
}
