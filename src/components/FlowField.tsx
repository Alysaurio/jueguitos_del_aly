import { useEffect, useRef, type RefObject } from "react";

type Ripple = { x: number; y: number; born: number };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  seed: number;
};

type FlowFieldProps = {
  interactionRef: RefObject<HTMLElement | null>;
};

const PERM = (() => {
  const table = new Uint8Array(512);
  const source = new Uint8Array(256);
  for (let index = 0; index < 256; index += 1) source[index] = index;

  let seed = 1337;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 255; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const temp = source[index];
    source[index] = source[swap];
    source[swap] = temp;
  }

  for (let index = 0; index < 512; index += 1) table[index] = source[index & 255];
  return table;
})();

const GRADIENTS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const fade = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const x0 = xi & 255;
  const y0 = yi & 255;

  const dot = (hash: number, dx: number, dy: number) => {
    const gradient = GRADIENTS[hash & 7];
    return gradient[0] * dx + gradient[1] * dy;
  };

  const aa = PERM[PERM[x0] + y0];
  const ab = PERM[PERM[x0] + y0 + 1];
  const ba = PERM[PERM[x0 + 1] + y0];
  const bb = PERM[PERM[x0 + 1] + y0 + 1];

  const top = mix(dot(aa, xf, yf), dot(ba, xf - 1, yf), u);
  const bottom = mix(dot(ab, xf, yf - 1), dot(bb, xf - 1, yf - 1), u);
  return mix(top, bottom, v);
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SCALE = 0.0017;
const TRAIL = 0.3;
const MOUSE_RADIUS = 250;
const RIPPLE_LIFE = 2.6;
const RIPPLE_SPEED = 275;

export default function FlowField({ interactionRef }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = interactionRef.current;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = { x: 0, y: 0, active: false };
    const ripples: Ripple[] = [];
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = performance.now();
    let inView = true;

    const createParticle = (): Particle => ({
      x: Math.random() * Math.max(width, 1),
      y: Math.random() * Math.max(height, 1),
      vx: 0,
      vy: 0,
      speed: 20 + Math.random() * 30,
      seed: Math.random() * Math.PI * 2,
    });

    const syncCount = () => {
      const area = width * height;
      const compact = width < 760;
      const target = Math.round(
        clamp(compact ? area / 4300 : area / 3400, compact ? 120 : 240, compact ? 340 : 620),
      );

      while (particles.length < target) particles.push(createParticle());
      if (particles.length > target) particles.length = target;
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      const dark = new Path2D();
      const soft = new Path2D();
      const bright = new Path2D();

      particles.forEach((particle, index) => {
        const angle =
          noise2(particle.x * SCALE, particle.y * SCALE) * Math.PI * 2 + particle.seed * 0.15;
        const length = 5 + particle.speed * 0.26;
        const path = index % 9 === 0 ? bright : index % 3 === 0 ? soft : dark;
        path.moveTo(particle.x, particle.y);
        path.lineTo(
          particle.x + Math.cos(angle) * length,
          particle.y + Math.sin(angle) * length,
        );
      });

      context.lineWidth = 0.95;
      context.strokeStyle = "rgba(84, 102, 118, 0.38)";
      context.stroke(dark);
      context.strokeStyle = "rgba(126, 147, 165, 0.26)";
      context.stroke(soft);
      context.strokeStyle = "rgba(178, 199, 214, 0.34)";
      context.stroke(bright);
    };

    const step = (delta: number, now: number) => {
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      const time = now * 0.001;
      const drift = now * 0.00006;
      const dark = new Path2D();
      const soft = new Path2D();
      const bright = new Path2D();

      for (const ripple of ripples) {
        const age = (now - ripple.born) / 1000;
        if (age > RIPPLE_LIFE) continue;
        const radius = age * RIPPLE_SPEED;
        const fadeOut = 1 - age / RIPPLE_LIFE;
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(199, 243, 107, ${fadeOut * 0.14})`;
        context.lineWidth = 1;
        context.stroke();
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        if ((now - ripples[index].born) / 1000 > RIPPLE_LIFE) ripples.splice(index, 1);
      }

      if (mouse.active) {
        const halo = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        halo.addColorStop(0, "rgba(126, 147, 165, 0.055)");
        halo.addColorStop(1, "rgba(126, 147, 165, 0)");
        context.fillStyle = halo;
        context.beginPath();
        context.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        context.fill();
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const angle =
          noise2(particle.x * SCALE, particle.y * SCALE + drift) * Math.PI * 2 +
          Math.sin(time * 0.16 + particle.seed) * 0.32;

        let desiredX = Math.cos(angle) * particle.speed;
        let desiredY = Math.sin(angle) * particle.speed;

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < MOUSE_RADIUS && distance > 0.001) {
            const proximity = 1 - distance / MOUSE_RADIUS;
            const weight = proximity * proximity * (3 - 2 * proximity) * 0.9;
            const nx = dx / distance;
            const ny = dy / distance;

            const orbitX = -ny * particle.speed * 1.5 + nx * particle.speed * 0.12;
            const orbitY = nx * particle.speed * 1.5 + ny * particle.speed * 0.12;

            desiredX = mix(desiredX, orbitX, weight);
            desiredY = mix(desiredY, orbitY, weight);
          }
        }

        const steering = Math.min(1, delta * 3);
        particle.vx += (desiredX - particle.vx) * steering;
        particle.vy += (desiredY - particle.vy) * steering;

        for (const ripple of ripples) {
          const age = (now - ripple.born) / 1000;
          if (age > RIPPLE_LIFE) continue;

          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const distance = Math.hypot(dx, dy) || 0.001;
          const radius = age * RIPPLE_SPEED;
          const band = 58;
          const offset = Math.abs(distance - radius);

          if (offset < band) {
            const force =
              (1 - offset / band) * (1 - age / RIPPLE_LIFE) * 760 * delta;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        const velocity = Math.hypot(particle.vx, particle.vy);
        const maxSpeed = particle.speed * 2.5;
        if (velocity > maxSpeed) {
          particle.vx = (particle.vx / velocity) * maxSpeed;
          particle.vy = (particle.vy / velocity) * maxSpeed;
        }

        const nextX = particle.x + particle.vx * delta;
        const nextY = particle.y + particle.vy * delta;
        let wrapped = false;

        if (nextX < -8) {
          particle.x = width + 8;
          wrapped = true;
        } else if (nextX > width + 8) {
          particle.x = -8;
          wrapped = true;
        } else {
          particle.x = nextX;
        }

        if (nextY < -8) {
          particle.y = height + 8;
          wrapped = true;
        } else if (nextY > height + 8) {
          particle.y = -8;
          wrapped = true;
        } else {
          particle.y = nextY;
        }

        if (wrapped) continue;

        const startX = particle.x - particle.vx * TRAIL;
        const startY = particle.y - particle.vy * TRAIL;
        const path = index % 11 === 0 ? bright : index % 3 === 0 ? soft : dark;

        path.moveTo(startX, startY);
        path.lineTo(particle.x, particle.y);
      }

      context.lineWidth = 0.95;
      context.strokeStyle = "rgba(84, 102, 118, 0.38)";
      context.stroke(dark);
      context.strokeStyle = "rgba(126, 147, 165, 0.26)";
      context.stroke(soft);
      context.strokeStyle = "rgba(178, 199, 214, 0.34)";
      context.stroke(bright);
    };

    const loop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      step(delta, now);
      frame = requestAnimationFrame(loop);
    };

    const shouldRun = () =>
      !document.hidden && inView && !reducedQuery.matches;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      if (frame || !shouldRun()) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncCount();

      if (reducedQuery.matches) {
        stop();
        drawStatic();
      } else {
        start();
      }
    };

    const updateMouse = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.active = false;
        return;
      }

      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedQuery.matches) return;
      updateMouse(event);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedQuery.matches) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button")) return;

      updateMouse(event);
      if (!mouse.active) return;

      if (ripples.length > 3) ripples.shift();
      ripples.push({ x: mouse.x, y: mouse.y, born: performance.now() });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") mouse.active = false;
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onReducedChange = () => {
      stop();
      if (reducedQuery.matches) drawStatic();
      else start();
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerdown", onPointerDown, { passive: true });
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerLeave);
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onReducedChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerLeave);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
    };
  }, [interactionRef]);

  return <canvas ref={canvasRef} className="flow-field" aria-hidden="true" />;
}
