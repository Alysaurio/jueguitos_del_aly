export type SocialLink = {
  label: string;
  handle: string;
  href: string | null;
};

export const siteConfig = {
  name: "[TU NOMBRE]",
  role: "GAME DEVELOPER · UNITY",
  hero: {
    eyebrow: "GAME DEVELOPER · UNITY",
    title: {
      before: "Creando ",
      highlight: "mundos",
      after: ", una mecánica a la vez.",
    },
    description:
      "Desarrollo videojuegos y experiencias interactivas, explorando la programación, el diseño y la creatividad.",
    primaryCta: "Explorar proyectos",
    secondaryCta: "Conocer más",
  },
  about: {
    title: "Detrás de los proyectos.",
    text: "Soy desarrollador de videojuegos y me interesa crear experiencias interactivas, experimentar con mecánicas y explorar nuevas posibilidades mediante la programación y el diseño.",
    technologies: ["Unity", "C#", "[AÑADE OTRA TECNOLOGÍA]"],
    contactNote: "Puedes escribirme para colaborar o charlar sobre ideas.",
  },
  socials: [
    { label: "GitHub", handle: "tu-usuario", href: null },
    { label: "Itch.io", handle: "tu-usuario", href: null },
    { label: "Correo", handle: "tu@correo.com", href: null },
  ] as SocialLink[],
  footer: {
    note: "Diseñado y desarrollado por",
  },
};

export type SiteConfig = typeof siteConfig;
