"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { SortGame } from "@/hooks/use-sort-game";

type TowerState = "default" | "selected" | "hint" | "sorted";

function Tower({
  value,
  maxValue,
  x,
  color,
  state,
  onSelect,
}: {
  value: number;
  maxValue: number;
  x: number;
  color: string;
  state: TowerState;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const height = 0.6 + (value / maxValue) * 3.6;
  const lift = state === "selected" ? 0.5 : hover ? 0.18 : 0;

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    m.scale.y = THREE.MathUtils.damp(m.scale.y || height, height, 7, dt);
    m.position.y = THREE.MathUtils.damp(m.position.y, m.scale.y / 2 + lift, 9, dt);
    const targetRot = state === "selected" ? 0.35 : 0;
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, targetRot, 6, dt);
  });

  const faceColor =
    state === "sorted" ? "#34d399" : state === "selected" ? "#ffffff" : state === "hint" ? "#fbbf24" : color;

  return (
    <group position={[x, 0, 0]}>
      <mesh
        ref={ref}
        position={[0, height / 2, 0]}
        castShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[0.82, 1, 0.82]} />
        <meshStandardMaterial
          color={faceColor}
          emissive={faceColor}
          emissiveIntensity={state === "default" ? 0.18 : 0.55}
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>
      <Html position={[0, height + 0.45, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
        <span className="select-none rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
          {value}
        </span>
      </Html>
    </group>
  );
}

function Scene({ game, color, reducedMotion }: { game: SortGame; color: string; reducedMotion: boolean }) {
  const max = Math.max(...game.values, 1);
  const spacing = 1.2;
  const offset = ((game.values.length - 1) * spacing) / 2;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 4, 4]} intensity={14} color={color} distance={16} />

      {game.values.map((v, i) => {
        const state: TowerState = game.isSorted
          ? "sorted"
          : game.selected === i
            ? "selected"
            : game.hintPair?.includes(i)
              ? "hint"
              : "default";
        return (
          <Tower
            key={i}
            value={v}
            maxValue={max}
            x={i * spacing - offset}
            color={color}
            state={state}
            onSelect={() => game.select(i)}
          />
        );
      })}

      {/* Platform */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 56]} />
        <meshStandardMaterial color="#0d1220" metalness={0.2} roughness={0.85} />
      </mesh>
      <gridHelper args={[16, 16, "#26314d", "#1a2234"]} position={[0, 0.01, 0]} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={18} blur={2.6} far={6} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={15}
        minPolarAngle={0.5}
        maxPolarAngle={1.45}
        autoRotate={!reducedMotion && game.isSorted}
        autoRotateSpeed={1.4}
      />
    </>
  );
}

export function SortTowers3D({
  game,
  color,
  reducedMotion,
}: {
  game: SortGame;
  color: string;
  reducedMotion: boolean;
}) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 11], fov: 45 }}>
      <color attach="background" args={["#080b12"]} />
      <fog attach="fog" args={["#080b12", 14, 26]} />
      <Scene game={game} color={color} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
