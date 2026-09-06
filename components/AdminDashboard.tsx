"use client";

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
    <>
      <section id="orders-container">
        <div className="admin-top">
          <h1 className="admin-heading">Orders — {username}</h1>
          <form action={logoutAction}>
            <button className="logout-btn" type="submit">
              Logout <i className="fa-solid fa-right-from-bracket" />
            </button>
          </form>
        </div>

        <div className="order-info-row">
          <p className="order-column-name">Id</p>
          <p className="order-column-name">Customer</p>
          <p className="order-column-name">Date</p>
          <p className="order-column-name">Price</p>
          <p className="order-column-name">Action</p>
        </div>

        {orders.length === 0 ? (
          <p className="admin-heading">No orders yet.</p>
        ) : (
          orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))
        )}
      </section>

      <h2 className="admin-heading">Menu</h2>
      <div className="menu-editor-list">
        {items.map((item) => (
          <MenuEditor key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

function OrderCard({ order, index }: { order: AdminOrder; index: number }) {
  return (
    <section
      className="order-info"
      style={{
        animationDelay: `${index * 0.2}s`,
        backgroundPosition: `50% ${30 + index * 10}%`,
      }}
    >
      <p className="order-id">{order.id.slice(-8)}</p>
      <p className="order-username">{order.customer}</p>
      <p className="order-date">
        {new Date(order.createdAt).toLocaleString("bg-BG")}
      </p>
      <p className="order-price">{order.totalBgn.toFixed(2)} lv.</p>
      <form
        action={async (formData) => {
          await updateOrderStatusAction(formData);
        }}
      >
        <input type="hidden" name="id" value={order.id} />
        <div className="order-btns">
          {order.status === "PENDING" ? (
            <>
              <button className="accept" name="status" value="ACCEPTED">
                Accept
              </button>
              <button className="decline" name="status" value="REJECTED">
                Decline
              </button>
            </>
          ) : (
            <button className="ordered" type="button">
              {order.status}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function MenuEditor({ item }: { item: AdminItem }) {
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const result = await updateMenuItemAction(formData);
    setNotice(result?.error ?? "Saved.");
  }

  return (
    <form action={onSubmit} className="menu-editor">
      <input type="hidden" name="id" value={item.id} />
      <img src={item.imagePath} alt={item.name} />
      <div>
        <p className="label">
          {item.category} — {item.name}
        </p>
        <label className="label">
          Description
          <textarea name="description" defaultValue={item.description} rows={4} />
        </label>
        {notice ? <p className="err-msg">{notice}</p> : null}
      </div>
      <div>
        <label className="label">
          Price
          <input
            name="priceBgn"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={item.priceBgn}
          />
        </label>
        <label className="active-row">
          <input name="isActive" type="checkbox" defaultChecked={item.isActive} />
          On the board
        </label>
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
