"use client";

import { useEffect, useMemo, useState } from "react";
import { placeOrderAction } from "@/lib/actions";
import type { CartLine, PublicMenuItem } from "@/lib/types";

const sections: {
  key: PublicMenuItem["category"];
  label: string;
  id: string;
  image: string;
}[] = [
  { key: "BURGER", label: "Burgers", id: "burgers", image: "/images/menu/Burger.png" },
  { key: "FRIES", label: "Fries", id: "fries", image: "/images/menu/Fries.png" },
  { key: "DRINK", label: "Drinks", id: "drinks", image: "/images/menu/Drinks.png" },
];

const sortOptions = [
  { label: "Default", value: "Default" },
  { label: "Price Ascending", value: "PriceAscending" },
  { label: "Price Descending", value: "PriceDescending" },
  { label: "Portion size", value: "PortionSizeDescending" },
  { label: "Name", value: "Name" },
];

function money(value: number) {
  return `${value.toFixed(2)} lv.`;
}

function portionMeasure(category: PublicMenuItem["category"]) {
  return category === "DRINK" ? "ml" : "g";
}

export function MenuBoard({ items }: { items: PublicMenuItem[] }) {
  const [category, setCategory] = useState<PublicMenuItem["category"]>("BURGER");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState("Default");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = items.filter((item) => {
      if (item.category !== category) return false;
      if (!term) return true;
      return item.name.toLowerCase().includes(term);
    });

    const sorted = [...rows];
    switch (sorting) {
      case "PriceAscending":
        sorted.sort((a, b) => a.priceBgn - b.priceBgn);
        break;
      case "PriceDescending":
        sorted.sort((a, b) => b.priceBgn - a.priceBgn);
        break;
      case "PortionSizeDescending":
        sorted.sort((a, b) => b.portionGrams - a.portionGrams);
        break;
      case "Name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [items, category, search, sorting]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.priceBgn * line.quantity, 0),
    [cart],
  );

  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace("#", "");
      if (hash === "fries") {
        setCategory("FRIES");
        setPage(1);
      } else if (hash === "drinks") {
        setCategory("DRINK");
        setPage(1);
      } else if (hash === "burgers") {
        setCategory("BURGER");
        setPage(1);
      } else if (hash === "cart") {
        setCartOpen(true);
      }
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

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
    setCartOpen(true);
  }

  function changeQty(id: string, delta: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + delta } : line,
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
    setMessage("Order sent to the kitchen.");
  }

  return (
    <>
      <section id="filters">
        <section id="search">
          <input
            className="search--inp"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            type="search"
            placeholder="Search by name"
          />
          <i className="fa-solid fa-magnifying-glass" />
        </section>
        <div className={`sort-box${sortOpen ? " open" : ""}`}>
          <button
            type="button"
            className="sort-dropdown"
            onClick={() => setSortOpen((open) => !open)}
          >
            Sort by
          </button>
          <div className="sort-menu">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSorting(option.value);
                  setSortOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div id="grid-container">
        <aside id="sidebar">
          {sections.map((section) => (
            <div key={section.key}>
              <hr className="divider" />
              <button
                type="button"
                className={`sidebar--wrapper--link${category === section.key ? " active" : ""}`}
                onClick={() => {
                  setCategory(section.key);
                  setPage(1);
                  document.getElementById(section.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <img
                  className="sidebar--img"
                  src={section.image}
                  alt={section.label}
                />
                <p className="sidebar--subtitle">{section.label}</p>
              </button>
            </div>
          ))}
          <hr className="divider" />
        </aside>

        <section id="menu" className="grid">
          <span id="burgers" />
          <span id="fries" />
          <span id="drinks" />
          {pageItems.map((item) => (
            <section className="item-card" key={item.id}>
              <div className="img-container">
                <img src={item.imagePath} className="img" alt={item.name} />
              </div>
              <div className="item-info">
                <div className="wrap">
                  <h3 className="item--title">{item.name}</h3>
                  <p className="item--portion-size">
                    ({item.portionGrams}
                    {portionMeasure(item.category)})
                  </p>
                </div>
                <p className="item--price">Price: {money(item.priceBgn)}</p>
                <button
                  type="button"
                  className="item--add-to-cart-btn"
                  onClick={() => addItem(item)}
                >
                  <span className="btn--content">Add to cart</span>
                  <i className="fa-solid fa-cart-shopping" />
                </button>
              </div>
            </section>
          ))}
        </section>
      </div>

      {filtered.length > pageSize ? (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => {
                setPage(index + 1);
                window.scrollTo({ top: 420, behavior: "smooth" });
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      ) : (
        <div className="pagination" />
      )}

      {cartOpen ? (
        <aside id="cart" className="side-cart-container">
          <div className="closing-side-cart">
            <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
              ×
            </button>
          </div>
          <div className="side-cart-content">
            {cart.length === 0 ? (
              <p>Nothing in the cart yet.</p>
            ) : (
              cart.map((line) => (
                <div key={line.id} className="side-cart-item">
                  <img
                    className="side-cart-item-img"
                    src={line.imagePath}
                    alt={line.name}
                  />
                  <div>
                    <p className="side-cart-item-name">{line.name}</p>
                    <p className="side-cart-item-quantity">
                      {line.quantity} × {money(line.priceBgn)}
                    </p>
                  </div>
                  <div className="qty-btns">
                    <button type="button" onClick={() => changeQty(line.id, -1)}>
                      −
                    </button>
                    <button type="button" onClick={() => changeQty(line.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="side-cart-total">
            <p className="total-price">Total {money(total)}</p>
            <label className="ticket-name">
              Name
              <input
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Stiliyan"
              />
            </label>
            <button
              type="button"
              className="checkout-btn"
              disabled={pending || cart.length === 0}
              onClick={checkout}
            >
              {pending ? "Sending…" : "Checkout"}
            </button>
            {message ? <p className="cart-message">{message}</p> : null}
          </div>
        </aside>
      ) : null}
    </>
  );
}
