import { useEffect, useState } from "react";
import { siteConfig } from "../data/siteConfig";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 841px)");
    const onChange = () => {
      if (query.matches) setOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
    >
      <div className="header-inner">
        <a className="brand" href="#inicio" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          <span>{siteConfig.name}</span>
        </a>

        <nav className="nav-desktop" aria-label="Navegación principal">
          {links.map((link, index) => (
            <a className="nav-link" href={link.href} key={link.href}>
              <span className="nav-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="mobile-nav" id="mobile-nav" aria-hidden={!open}>
        <nav aria-label="Navegación móvil">
          {links.map((link, index) => (
            <a
              className="mobile-nav-link"
              href={link.href}
              key={link.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span className="nav-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="mobile-nav-foot">{siteConfig.role}</p>
      </div>
    </header>
  );
}
