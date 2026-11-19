import type { CSSProperties } from "react";
import { assetUrl, type Project } from "../data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const positions = [
  { px: "26%", py: "18%" },
  { px: "72%", py: "30%" },
  { px: "34%", py: "74%" },
  { px: "78%", py: "68%" },
];

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const position = positions[index % positions.length];
  const style = {
    "--thumb-x": position.px,
    "--thumb-y": position.py,
    transitionDelay: `${index * 90}ms`,
  } as CSSProperties;

  return (
    <article className="project-card" data-reveal style={style}>
      <div className="card-media">
        {project.image ? (
          <img
            src={assetUrl(project.image)}
            alt={project.imageAlt ?? project.title}
            loading="lazy"
            width={1280}
            height={720}
          />
        ) : (
          <div className="thumb" aria-hidden="true">
            <span className="thumb-grid" />
            <span className="thumb-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="thumb-label">CAPTURA DEL JUEGO · 16:9</span>
            <span className="thumb-badge">EJEMPLO</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-top">
          <h3 className="card-title">{project.title}</h3>
          <span className="unity-tag">
            <span aria-hidden="true" />
            UNITY
          </span>
        </div>

        <p className="card-desc">{project.description}</p>

        <dl className="card-meta">
          <div>
            <dt>Género</dt>
            <dd>{project.genre}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.technologies.join(" · ")}</dd>
          </div>
        </dl>

        <div className="card-actions">
          {project.projectUrl ? (
            <a
              className="card-link"
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ver proyecto
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span
              className="card-link is-disabled"
              aria-disabled="true"
              title="Añade projectUrl en src/data/projects.ts"
            >
              Ver proyecto
              <span aria-hidden="true">↗</span>
            </span>
          )}

          {project.playUrl && (
            <a
              className="card-link"
              href={project.playUrl}
              target="_blank"
              rel="noreferrer"
            >
              Jugar
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
