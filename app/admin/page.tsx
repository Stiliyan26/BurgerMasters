import { AdminDashboard } from "@/components/AdminDashboard";
import { getAdminSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login?next=/admin");
  }

  const prisma = getPrisma();
  const [items, orders] = await Promise.all([
    prisma.menuItem.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { menuItem: true } },
      },
    }),
  ]);

  return (
    <AdminDashboard
      username={session.username}
      items={items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        priceBgn: Number(item.priceBgn),
        category: item.category,
        imagePath: item.imagePath,
        isActive: item.isActive,
      }))}
      orders={orders.map((order) => ({
        id: order.id,
        customer: order.customer,
        status: order.status,
        totalBgn: Number(order.totalBgn),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((line) => ({
          name: line.menuItem.name,
          quantity: line.quantity,
          unitPrice: Number(line.unitPrice),
        })),
      }))}
    />
  );
}
