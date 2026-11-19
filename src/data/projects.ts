export type Project = {
  id: string;
  title: string;
  description: string;
  genre: string;
  technologies: string[];
  image: string | null;
  imageAlt: string | null;
  projectUrl: string | null;
  playUrl: string | null;
};

export const projects: Project[] = [
  {
    id: "proyecto-01",
    title: "[Título del juego 01]",
    description:
      "Sustituye este texto por un resumen breve: la idea central, el bucle de juego y aquello que hace especial al proyecto.",
    genre: "[Género]",
    technologies: ["Unity", "C#"],
    image: null,
    imageAlt: null,
    projectUrl: null,
    playUrl: null,
  },
  {
    id: "proyecto-02",
    title: "[Título del juego 02]",
    description:
      "Describe en dos o tres líneas la experiencia, sus mecánicas principales y el enfoque de diseño que seguiste.",
    genre: "[Género]",
    technologies: ["Unity", "C#"],
    image: null,
    imageAlt: null,
    projectUrl: null,
    playUrl: null,
  },
  {
    id: "proyecto-03",
    title: "[Título del juego 03]",
    description:
      "Añade aquí una descripción breve del proyecto. Mantén el texto directo y evita saturar la tarjeta.",
    genre: "[Género]",
    technologies: ["Unity", "C#"],
    image: null,
    imageAlt: null,
    projectUrl: null,
    playUrl: null,
  },
  {
    id: "proyecto-04",
    title: "[Título del juego 04]",
    description:
      "Usa este espacio para hablar del reto técnico o creativo más interesante que resolviste en el proyecto.",
    genre: "[Género]",
    technologies: ["Unity", "C#"],
    image: null,
    imageAlt: null,
    projectUrl: null,
    playUrl: null,
  },
];

export const assetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};
