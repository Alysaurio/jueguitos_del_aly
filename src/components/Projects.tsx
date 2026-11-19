import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section
      className="section projects-section"
      id="proyectos"
      aria-labelledby="projects-title"
    >
      <div className="section-inner">
        <div className="section-head">
          <div className="section-head-copy">
            <p className="kicker" data-reveal>
              <span className="kicker-num">01</span>
              <span className="kicker-line" aria-hidden="true" />
              PROYECTOS
            </p>
            <h2
              className="section-title"
              id="projects-title"
              data-reveal
              style={{ transitionDelay: "70ms" }}
            >
              Proyectos seleccionados.
            </h2>
          </div>
          <p
            className="section-sub"
            data-reveal
            style={{ transitionDelay: "140ms" }}
          >
            Una pequeña colección de mundos e ideas que he desarrollado.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
