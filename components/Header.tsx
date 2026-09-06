import Link from "next/link";

const menuItems = [
  {
    name: "Burgers",
    href: "/#burgers",
    icon: "fa-solid fa-burger",
    color: "#995900",
  },
  {
    name: "Fries",
    href: "/#fries",
    icon: "fa-solid fa-utensils",
    color: "#b8b100",
  },
  {
    name: "Drinks",
    href: "/#drinks",
    icon: "fa-solid fa-glass-water",
    color: "#9d0101",
  },
];

export function Header({ adminName }: { adminName?: string | null }) {
  return (
    <header id="header">
      <nav className="nav">
        <Link href="/">
          <img
            className="logo"
            src="/images/logo/logo.png"
            alt="Burger logo"
          />
        </Link>

        <ul className="list">
          <li className="list-item">
            <Link href="/">
              Home <i className="fa-solid fa-house" />
            </Link>
          </li>

          <li className="list-item">
            <Link href="/#burgers">
              <div className="menu">
                <p className="menu-title">Menu</p>
                <i className="fa-solid fa-bars" />
              </div>
            </Link>
            <ul className="menu-dropdown">
              {menuItems.map((item) => (
                <li key={item.name} className="menu-item">
                  <Link href={item.href}>
                    {item.name}{" "}
                    <i className={item.icon} style={{ color: item.color }} />
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="list-item">
            <Link href="/#cart" className="cart-container">
              Cart{" "}
              <i
                className="fa-solid fa-cart-shopping"
                style={{ color: "#d5d9de" }}
              />
            </Link>
          </li>

          {adminName ? (
            <>
              <li className="list-item">
                <Link href="/admin" className="create">
                  Orders <i className="fa-solid fa-clipboard-list" />
                </Link>
              </li>
              <li className="list-item">
                <Link href="/admin">Hello, {adminName}!</Link>
              </li>
            </>
          ) : (
            <li className="list-item">
              <Link href="/login">
                Login <i className="fa-solid fa-right-to-bracket" />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
