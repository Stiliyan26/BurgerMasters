import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer">
      <div className="waves">
        <div className="wave" id="wave1" />
        <div className="wave" id="wave2" />
        <div className="wave" id="wave3" />
        <div className="wave" id="wave4" />
      </div>

      <ul className="social-icons">
        <li className="icon">
          <a aria-label="Facebook">
            <i className="fa-brands fa-facebook" />
          </a>
        </li>
        <li className="icon">
          <a aria-label="Twitter">
            <i className="fa-brands fa-twitter" />
          </a>
        </li>
        <li className="icon">
          <a
            href="https://www.linkedin.com/in/stiliyan-nikolov-36a0a8270/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin" />
          </a>
        </li>
        <li className="icon">
          <a aria-label="Instagram">
            <i className="fa-brands fa-instagram" />
          </a>
        </li>
      </ul>

      <ul className="menu">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/#burgers">Menu</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>

      <p>
        @{new Date().getFullYear()} BurgerMasters project | All Rights Reserved
      </p>
    </footer>
  );
}
