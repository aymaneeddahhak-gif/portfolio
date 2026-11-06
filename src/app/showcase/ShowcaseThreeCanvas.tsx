"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShowcaseThreeCanvasProps {
  accentColor: string;
  ambientColor: string;
  active: boolean;
}

// Helper to parse rgba safely without warning in THREE.Color
function parseColor(col?: string, fallback = "#6366f1"): string {
  if (!col) return fallback;
  if (col.startsWith("rgba")) {
    const match = col.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
    }
  }
  return col;
}

export function ShowcaseThreeCanvas({
  accentColor,
  ambientColor,
  active,
}: ShowcaseThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetColorsRef = useRef({
    accent: new THREE.Color(parseColor(accentColor, "#6366f1")),
    ambient: new THREE.Color(parseColor(ambientColor, "#ec4899")),
  });
  const currentColorsRef = useRef({
    accent: new THREE.Color(parseColor(accentColor, "#6366f1")),
    ambient: new THREE.Color(parseColor(ambientColor, "#ec4899")),
  });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update target colors when props change
  useEffect(() => {
    try {
      targetColorsRef.current.accent.set(parseColor(accentColor, "#6366f1"));
      targetColorsRef.current.ambient.set(parseColor(ambientColor, "#ec4899"));
    } catch {
      targetColorsRef.current.accent.set("#6366f1");
      targetColorsRef.current.ambient.set("#ec4899");
    }
  }, [accentColor, ambientColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 20;

    // Ambient Floating 3D Star/Light Dust Particles (Giant cubes removed)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: currentColorsRef.current.ambient,
      size: 0.28,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse tracking for subtle 3D depth parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 1.2;
      mouseRef.current.targetY = y * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId = 0;
    const clock = new THREE.Clock();
    let onScreen = false;

    const animate = () => {
      if (!onScreen || !active) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth color interpolation matching active showcase app
      currentColorsRef.current.accent.lerp(targetColorsRef.current.accent, 0.05);
      currentColorsRef.current.ambient.lerp(targetColorsRef.current.ambient, 0.05);
      particleMat.color.copy(currentColorsRef.current.ambient);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      camera.position.x = mouseRef.current.x * 2;
      camera.position.y = mouseRef.current.y * 1.2;
      camera.lookAt(0, 0, 0);

      // Particles gentle drift
      particles.rotation.y = elapsed * 0.025;

      renderer.render(scene, camera);
    };

    // Only run the render loop while the canvas is actually on screen.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
