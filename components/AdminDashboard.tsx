"use client";

import Image from "next/image";
import { useState } from "react";
import {
  logoutAction,
  updateMenuItemAction,
  updateOrderStatusAction,
} from "@/lib/actions";

type AdminItem = {
  id: string;
  name: string;
  description: string;
  priceBgn: number;
  category: string;
  imagePath: string;
  isActive: boolean;
};

type AdminOrder = {
  id: string;
  customer: string;
  status: string;
  totalBgn: number;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
};

export function AdminDashboard({
  username,
  items,
  orders,
}: {
  username: string;
  items: AdminItem[];
  orders: AdminOrder[];
}) {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-ticket)] text-xs tracking-[0.24em] text-mustard">
            SIGNED IN AS {username.toUpperCase()}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-cream">
            Kitchen board
          </h1>
        </div>
        <form action={logoutAction}>
          <button className="border border-mustard/40 px-4 py-2 text-mustard">
            Log out
          </button>
        </form>
      </div>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-mustard">
          Incoming tickets
        </h2>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-cream/70">No orders yet.</p>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-mustard">
          Menu
        </h2>
        <div className="grid gap-4">
          {items.map((item) => (
            <MenuEditor key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <article className="ticket rounded-sm p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-ticket)] text-xs text-smoke">
            {new Date(order.createdAt).toLocaleString("bg-BG")}
          </p>
          <h3 className="text-lg font-semibold">{order.customer}</h3>
        </div>
        <span className="stamp px-2 py-1 font-[family-name:var(--font-ticket)] text-sm text-ember">
          {order.status} · {order.totalBgn.toFixed(2)} BGN
        </span>
      </div>
      <ul className="mt-3 text-sm text-smoke">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.name}`}>
            {item.quantity} × {item.name} ({item.unitPrice.toFixed(2)} BGN)
          </li>
        ))}
      </ul>
      <form
        action={async (formData) => {
          await updateOrderStatusAction(formData);
        }}
        className="mt-3 flex flex-wrap gap-2"
      >
        <input type="hidden" name="id" value={order.id} />
        <button name="status" value="ACCEPTED" className="bg-ink px-3 py-1.5 text-cream">
          Accept
        </button>
        <button name="status" value="REJECTED" className="bg-ember px-3 py-1.5 text-cream">
          Reject
        </button>
        <button name="status" value="PENDING" className="border border-ink/30 px-3 py-1.5">
          Hold
        </button>
      </form>
    </article>
  );
}

function MenuEditor({ item }: { item: AdminItem }) {
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const result = await updateMenuItemAction(formData);
    setNotice(result?.error ?? "Saved.");
  }

  return (
    <form
      action={onSubmit}
      className="grid gap-3 rounded-sm border border-mustard/20 bg-black/20 p-4 md:grid-cols-[96px_1fr_auto]"
    >
      <input type="hidden" name="id" value={item.id} />
      <div className="relative h-24 w-24 overflow-hidden bg-ink">
        <Image src={item.imagePath} alt={item.name} fill className="object-cover" />
      </div>
      <div>
        <p className="font-[family-name:var(--font-ticket)] text-xs text-mustard">
          {item.category}
        </p>
        <h3 className="font-semibold text-cream">{item.name}</h3>
        <textarea
          name="description"
          defaultValue={item.description}
          rows={3}
          className="mt-2 w-full bg-cream px-2 py-1 text-sm text-ink"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-cream">
          Price BGN
          <input
            name="priceBgn"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={item.priceBgn}
            className="mt-1 w-full bg-cream px-2 py-1 text-ink"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-cream">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={item.isActive}
          />
          On the board
        </label>
        <button className="bg-mustard py-2 font-semibold text-ink">Save</button>
        {notice ? (
          <p className="font-[family-name:var(--font-ticket)] text-xs text-cream/80">
            {notice}
          </p>
        ) : null}
      </div>
    </form>
  );
}
