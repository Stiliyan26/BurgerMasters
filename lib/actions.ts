"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPrisma } from "./prisma";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "./auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!username || !password) {
    return { error: "Enter username and password." };
  }

  const ok = await verifyAdminCredentials(username, password);
  if (!ok) {
    return { error: "Wrong username or password." };
  }

  await createAdminSession(username);
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/login");
}

export async function placeOrderAction(input: {
  customer: string;
  items: { menuItemId: string; quantity: number }[];
}) {
  const customer = input.customer.trim();
  if (customer.length < 2) {
    return { error: "Write a name for the ticket." };
  }
  if (!input.items.length) {
    return { error: "Add at least one item." };
  }

  const prisma = getPrisma();
  const ids = input.items.map((item) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: ids }, isActive: true },
  });

  if (menuItems.length !== ids.length) {
    return { error: "One of the items is no longer on the board." };
  }

  const lines = input.items.map((item) => {
    const menuItem = menuItems.find((row) => row.id === item.menuItemId);
    if (!menuItem) {
      throw new Error("Missing menu item");
    }
    return {
      menuItemId: menuItem.id,
      quantity: Math.max(1, Math.min(20, item.quantity)),
      unitPrice: menuItem.priceBgn,
      lineTotal: Number(menuItem.priceBgn) * item.quantity,
    };
  });

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  await prisma.order.create({
    data: {
      customer,
      totalBgn: total,
      items: {
        create: lines.map(({ menuItemId, quantity, unitPrice }) => ({
          menuItemId,
          quantity,
          unitPrice,
        })),
      },
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function updateMenuItemAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Admin session required." };
  }

  const id = String(formData.get("id") ?? "");
  const priceBgn = Number(formData.get("priceBgn"));
  const description = String(formData.get("description") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!id || Number.isNaN(priceBgn) || priceBgn <= 0 || !description) {
    return { error: "Price and description are required." };
  }

  await getPrisma().menuItem.update({
    where: { id },
    data: { priceBgn, description, isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateOrderStatusAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Admin session required." };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
    return { error: "Invalid order update." };
  }

  await getPrisma().order.update({
    where: { id },
    data: { status: status as "PENDING" | "ACCEPTED" | "REJECTED" },
  });

  revalidatePath("/admin");
  return { ok: true };
}
