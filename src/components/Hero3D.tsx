import { Suspense, lazy, useEffect, useRef, useState } from "react";

const Hero3DScene = lazy(() => import("./Hero3DScene"));

type Props = { className?: string };

const Hero3D = ({ className = "" }: Props) => {
  const [enabled, setEnabled] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!query.matches);

    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  if (!enabled) return null;

  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <Suspense fallback={null}>
        <Hero3DScene pointer={pointer.current} />
      </Suspense>
    </div>
  );
};

export default Hero3D;
