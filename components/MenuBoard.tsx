"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { placeOrderAction } from "@/lib/actions";
import type { CartLine, PublicMenuItem } from "@/lib/types";

const sections: { key: PublicMenuItem["category"]; label: string; id: string }[] =
  [
    { key: "BURGER", label: "Burgers", id: "burgers" },
    { key: "FRIES", label: "Fries & sides", id: "fries" },
    { key: "DRINK", label: "Drinks", id: "drinks" },
  ];

function money(value: number) {
  return `${value.toFixed(2)} BGN`;
}

export function MenuBoard({ items }: { items: PublicMenuItem[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.priceBgn * line.quantity, 0),
    [cart],
  );

  function addItem(item: PublicMenuItem) {
    setMessage(null);
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.id === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [
        ...current,
        {
          id: item.id,
          name: item.name,
          priceBgn: item.priceBgn,
          imagePath: item.imagePath,
          quantity: 1,
        },
      ];
    });
  }

  function changeQty(id: string, delta: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.id === id
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  async function checkout() {
    setPending(true);
    setMessage(null);
    const result = await placeOrderAction({
      customer,
      items: cart.map((line) => ({
        menuItemId: line.id,
        quantity: line.quantity,
      })),
    });
    setPending(false);
    if (result && "error" in result && result.error) {
      setMessage(result.error);
      return;
    }
    setCart([]);
    setCustomer("");
    setMessage("Ticket sent to the kitchen.");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 lg:grid-cols-[1fr_320px]">
      <div className="space-y-12">
        {sections.map((section) => {
          const rows = items.filter((item) => item.category === section.key);
          if (!rows.length) return null;
          return (
            <section key={section.key} id={section.id}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-mustard">
                  {section.label}
                </h2>
                <span className="font-[family-name:var(--font-ticket)] text-xs text-cream/60">
                  {rows.length} on the board
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {rows.map((item, index) => (
                  <article
                    key={item.id}
                    className="ticket overflow-hidden rounded-sm shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                  >
                    <div className="ticket-perforation h-3" />
                    <div className="flex items-center justify-between px-4 pt-2 font-[family-name:var(--font-ticket)] text-xs text-smoke">
                      <span>#{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.portionGrams}g</span>
                    </div>
                    <div className="relative mx-4 mt-3 aspect-[4/3] overflow-hidden bg-ink">
                      <Image
                        src={item.imagePath}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                        priority={section.key === "BURGER" && index < 2}
                      />
                    </div>
                    <div className="space-y-3 px-4 py-4">
                      <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-smoke">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="stamp px-2 py-1 font-[family-name:var(--font-ticket)] text-sm text-ember">
                          {money(item.priceBgn)}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="rounded-sm bg-ink px-3 py-2 text-sm font-semibold text-cream hover:bg-ember"
                        >
                          Add to ticket
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="ticket rounded-sm p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="ticket-perforation -mx-4 -mt-4 mb-3 h-3" />
          <p className="font-[family-name:var(--font-ticket)] text-xs tracking-[0.2em] text-smoke">
            COUNTER TICKET
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl">
            Your order
          </h2>
          {cart.length === 0 ? (
            <p className="text-sm text-smoke">
              Nothing on the ticket yet. Add a burger from the board.
            </p>
          ) : (
            <ul className="space-y-3">
              {cart.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{line.name}</p>
                    <p className="font-[family-name:var(--font-ticket)] text-xs text-smoke">
                      {money(line.priceBgn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQty(line.id, -1)}
                      className="h-7 w-7 bg-ink text-cream"
                      aria-label={`Remove one ${line.name}`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(line.id, 1)}
                      className="h-7 w-7 bg-ink text-cream"
                      aria-label={`Add one ${line.name}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 font-[family-name:var(--font-ticket)] text-lg">
            Total {money(total)}
          </p>
          <label className="mt-3 block text-sm">
            Name on ticket
            <input
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              className="mt-1 w-full border border-ink/20 bg-cream px-3 py-2 text-ink outline-none focus:border-ember"
              placeholder="Stiliyan"
            />
          </label>
          <button
            type="button"
            disabled={pending || cart.length === 0}
            onClick={checkout}
            className="mt-3 w-full bg-ember py-3 font-semibold text-cream disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send to kitchen"}
          </button>
          {message ? (
            <p className="mt-3 font-[family-name:var(--font-ticket)] text-sm">
              {message}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
