import { HomeSlider } from "@/components/HomeSlider";
import { MenuBoard } from "@/components/MenuBoard";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getPrisma().menuItem.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <HomeSlider />
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
