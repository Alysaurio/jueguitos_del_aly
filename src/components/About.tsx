import { siteConfig } from "../data/siteConfig";

export default function About() {
  const { about, socials } = siteConfig;

  return (
    <section
      className="section about-section"
      id="sobre-mi"
      aria-labelledby="about-title"
    >
      <div className="section-inner about-grid">
        <div className="about-copy">
          <p className="kicker" data-reveal>
            <span className="kicker-num">02</span>
            <span className="kicker-line" aria-hidden="true" />
            SOBRE MÍ
          </p>
          <h2
            className="section-title"
            id="about-title"
            data-reveal
            style={{ transitionDelay: "70ms" }}
          >
            {about.title}
          </h2>
          <p
            className="about-text"
            data-reveal
            style={{ transitionDelay: "140ms" }}
          >
            {about.text}
          </p>
          <ul
            className="tech-list"
            data-reveal
            style={{ transitionDelay: "200ms" }}
            aria-label="Tecnologías"
          >
            {about.technologies.map((technology) => (
              <li className="tech-tag" key={technology}>
                {technology}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="contact-panel"
          id="contacto"
          data-reveal
          style={{ transitionDelay: "120ms" }}
        >
          <div className="contact-head">
            <span className="contact-title">Enlaces</span>
            <span className="contact-index" aria-hidden="true">
              03 / CONTACTO
            </span>
          </div>

          <ul className="social-list">
            {socials.map((social) => {
              const content = (
                <>
                  <span className="social-label">{social.label}</span>
                  <span className="social-handle">{social.handle}</span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </>
              );

              return (
                <li key={social.label}>
                  {social.href ? (
                    <a
                      className="social-link"
                      href={social.href}
                      {...(social.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {content}
                    </a>
                  ) : (
                    <span
                      className="social-link is-placeholder"
                      aria-disabled="true"
                      title="Añade el enlace en src/data/siteConfig.ts"
                    >
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="contact-note">{about.contactNote}</p>
        </div>
      </div>
    </section>
  );
}
