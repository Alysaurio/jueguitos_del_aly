import { useRef } from "react";
import FlowField from "./FlowField";
import { siteConfig } from "../data/siteConfig";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { hero } = siteConfig;

  return (
    <section
      className="hero"
      id="inicio"
      ref={sectionRef}
      aria-labelledby="hero-title"
    >
      <div className="hero-canvas">
        <FlowField interactionRef={sectionRef} />
      </div>
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <p
            className="eyebrow"
            data-reveal
            style={{ transitionDelay: "60ms" }}
          >
            <span className="eyebrow-dot" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1
            className="hero-title"
            id="hero-title"
            data-reveal
            style={{ transitionDelay: "140ms" }}
          >
            {hero.title.before}
            <span className="hero-accent">{hero.title.highlight}</span>
            {hero.title.after}
          </h1>

          <p
            className="hero-text"
            data-reveal
            style={{ transitionDelay: "240ms" }}
          >
            {hero.description}
          </p>

          <div
            className="hero-actions"
            data-reveal
            style={{ transitionDelay: "340ms" }}
          >
            <a className="btn btn-primary" href="#proyectos">
              {hero.primaryCta}
              <span className="btn-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <a className="btn btn-ghost" href="#sobre-mi">
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <a
            className="scroll-hint"
            href="#proyectos"
            aria-label="Desplazarse a proyectos"
          >
            <span className="scroll-mouse" aria-hidden="true">
              <span />
            </span>
            <span>SCROLL</span>
          </a>

          <p className="interact-hint">
            <span className="hint-dot" aria-hidden="true" />
            <span className="hint-desktop">MUEVE EL CURSOR PARA INTERACTUAR</span>
            <span className="hint-touch">TOCA Y ARRASTRA PARA INTERACTUAR</span>
          </p>
        </div>
      </div>
    </section>
  );
}
