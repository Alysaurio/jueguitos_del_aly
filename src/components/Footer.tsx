import { siteConfig } from "../data/siteConfig";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-note">
          {siteConfig.footer.note}{" "}
          <span className="footer-name">{siteConfig.name}</span>.
        </p>
        <div className="footer-right">
          <span className="footer-year">{new Date().getFullYear()}</span>
          <a className="footer-top" href="#inicio">
            Volver arriba
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
