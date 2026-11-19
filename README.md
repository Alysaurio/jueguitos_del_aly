# Portafolio · Game Developer

Portafolio personal para mostrar videojuegos desarrollados con Unity. Construido con React, TypeScript, Vite y Canvas 2D.

## Desarrollo local

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Personalizar el contenido

Todos los datos editables están centralizados. No necesitas tocar los componentes para actualizar el contenido.

### Datos personales y textos

Edita `src/data/siteConfig.ts`:

- `name`: tu nombre o alias (header, footer y metadatos).
- `hero`: etiqueta, título, descripción y botones del Hero.
- `about`: título, párrafo y etiquetas de tecnologías.
- `socials`: GitHub, Itch.io y correo. Rellena `href` con la URL completa
  (por ejemplo `https://github.com/tu-usuario`) o con `mailto:tu@correo.com`.
  Mientras `href` sea `null`, el enlace se muestra desactivado.

### Proyectos

Edita `src/data/projects.ts`. Cada entrada admite:

| Campo | Descripción |
| --- | --- |
| `title` | Nombre del videojuego. |
| `description` | Descripción breve (2-3 líneas). |
| `genre` | Género o etiqueta descriptiva. |
| `technologies` | Lista de tecnologías mostradas en la tarjeta. |
| `image` | Ruta de la captura dentro de `public/`, por ejemplo `projects/mi-juego.jpg`. Usa `null` para mostrar el placeholder. |
| `imageAlt` | Texto alternativo de la imagen. |
| `projectUrl` | Enlace externo al proyecto. `null` para ocultarlo. |
| `playUrl` | Enlace a una versión jugable (por ejemplo Unity WebGL publicado en Itch.io). `null` para ocultar el botón "Jugar". |

Las capturas deben tener proporción 16:9 (recomendado 1280×720 o 1920×1080).
Colócalas en `public/projects/`. Vite copia `public/` a `dist/` y las rutas se
resuelven automáticamente mediante `assetUrl`.

Puedes añadir o eliminar proyectos libremente: la cuadrícula se adapta.

## Publicar en GitHub Pages

El proyecto ya incluye el workflow `.github/workflows/deploy.yml` y Vite usa
`base: './'`, por lo que los recursos funcionan dentro de la ruta de cualquier
repositorio.

1. Sube el proyecto a un repositorio de GitHub en la rama `main`.
2. En el repositorio, ve a **Settings → Pages**.
3. En **Source**, selecciona **GitHub Actions**.
4. Haz push a `main`. El workflow instala dependencias, ejecuta el build y publica `dist`.

La URL será `https://tu-usuario.github.io/tu-repositorio/`.

## Estructura

```text
src/
  components/    Header, Hero, FlowField, Projects, ProjectCard, About, Footer
  data/          projects.ts y siteConfig.ts (contenido editable)
  hooks/         useReveal (animaciones al entrar en pantalla)
  styles/        global.css y components.css
public/
  projects/      capturas de los videojuegos
```

## Interacción del Flow Field

El fondo del Hero usa un campo de flujo generado con ruido Perlin implementado
sin dependencias. Reacciona al cursor con una órbita suave y genera una onda al
hacer clic (o tocar en móvil). Se pausa con la pestaña oculta o fuera de
pantalla, limita el `devicePixelRatio`, adapta la cantidad de partículas al
tamaño de pantalla y respeta `prefers-reduced-motion` mostrando una composición
estática.
