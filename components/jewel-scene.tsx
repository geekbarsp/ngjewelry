"use client";

import { ContactShadows, Environment, Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type JewelSceneProps = {
  metal?: "yellow" | "white" | "rose";
  stone?: "diamond" | "sapphire" | "emerald";
  detail?: "full" | "compact";
};

const metalColors = { yellow: "#d9b65c", white: "#dededb", rose: "#c9947c" };
const stoneColors = { diamond: "#ffffff", sapphire: "#2456a0", emerald: "#237352" };

function FrameLimiter({ fps = 30 }: { fps?: number }) {
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const timer = window.setInterval(invalidate, 1000 / fps);
    return () => window.clearInterval(timer);
  }, [fps, invalidate]);
  return null;
}

function CutStone({ position, scale = .11, color = "#fff" }: { position: [number, number, number]; scale?: number; color?: string }) {
  return <mesh position={position} rotation={[0, 0, Math.PI / 4]} scale={scale}>
    <octahedronGeometry args={[1, 1]} />
    <meshPhysicalMaterial color={color} transmission={color === "#ffffff" ? .78 : .22} thickness={.35} roughness={.03} metalness={0} ior={2.35} clearcoat={1} />
  </mesh>;
}

function Ring({ metal, stone, detail }: Required<JewelSceneProps>) {
  const group = useRef<THREE.Group>(null);
  const gold = metalColors[metal];
  const gem = stoneColors[stone];
  const pave = useMemo(() => Array.from({ length: detail === "full" ? 8 : 6 }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const step = Math.floor(i / 2);
    const angle = Math.PI / 2 - .3 - step * .15;
    return [Math.cos(angle) * 1.26 * side, Math.sin(angle) * 1.26, .14] as [number, number, number];
  }), [detail]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * .16;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, .52 + state.pointer.y * .09, .035);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * -.11, .035);
  });

  return <Float speed={1.25} rotationIntensity={.08} floatIntensity={.18}>
    <group ref={group} position={[0, -.2, 0]} scale={detail === "full" ? .76 : .72} rotation={[.52, 0, 0]}>
      <mesh>
        <torusGeometry args={[1.25, .155, 20, 64]} />
        <meshStandardMaterial color={gold} metalness={1} roughness={.12} envMapIntensity={1.8} />
      </mesh>
      {pave.map((position, i) => <CutStone key={i} position={position} scale={.085} />)}
      <mesh position={[0, 1.14, 0]}>
        <cylinderGeometry args={[.29, .34, .26, 20]} />
        <meshStandardMaterial color={gold} metalness={1} roughness={.1} />
      </mesh>
      <CutStone position={[0, 1.49, .02]} scale={.47} color={gem} />
      {[0, 1, 2, 3].map(i => {
        const angle = i * Math.PI / 2 + Math.PI / 4;
        return <mesh key={i} position={[Math.cos(angle) * .37, 1.49 + Math.sin(angle) * .37, .04]} scale={.07}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color={gold} metalness={1} roughness={.1} />
        </mesh>;
      })}
    </group>
  </Float>;
}

export default function JewelScene({ metal = "yellow", stone = "diamond", detail = "full" }: JewelSceneProps) {
  const shell = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const element = shell.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "180px 0px" });
    const handleVisibility = () => setTabVisible(document.visibilityState === "visible");
    observer.observe(element);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", handleVisibility); };
  }, []);

  const active = nearViewport && tabVisible;
  return <div ref={shell} className="jewel-scene-shell">
    {active && <Canvas frameloop="demand" dpr={[1, 1.25]} camera={{ position: [0, .05, 5.3], fov: 37 }} gl={{ alpha: true, antialias: false, powerPreference: "default" }}>
      <Suspense fallback={null}>
        <FrameLimiter />
        <ambientLight intensity={.9} />
        <directionalLight position={[4, 5, 4]} intensity={2.5} color="#fff7df" />
        <directionalLight position={[-4, 1, 2]} intensity={1.5} color="#d9e7ff" />
        <Ring metal={metal} stone={stone} detail={detail} />
        <Sparkles count={detail === "full" ? 10 : 5} scale={3.8} size={2} speed={.2} color="#e3c76f" opacity={.45} />
        <ContactShadows frames={1} position={[0, -1.55, 0]} opacity={.15} scale={5} blur={2.5} far={4} resolution={256} />
        <Environment preset="studio" environmentIntensity={.8} />
      </Suspense>
    </Canvas>}
  </div>;
}
