'use client';

import { useRef, Suspense, useEffect, useState, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

function ProstheticModel({
  scrollProgress,
  themeColor,
  onReady,
}: {
  scrollProgress: MotionValue<number>;
  themeColor: string;
  onReady: () => void;
}) {
  const { scene } = useGLTF('/prosthetic.glb');
  const spinRef = useRef<THREE.Group>(null);
  const orientRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const setupDone = useRef(false);
  const baseColor = useRef(new THREE.Color('#ffffff'));
  const targetColor = useRef(new THREE.Color(themeColor));
  const workColor = useRef(new THREE.Color());

  // setupDone guard prevents compounding transforms if useEffect re-runs
  useEffect(() => {
    if (setupDone.current || !orientRef.current) return;
    setupDone.current = true;

    // Box3.setFromObject uses world-space, so measure before any transforms
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;

    orientRef.current.scale.setScalar(scale);
    orientRef.current.position.set(-center.x * scale, -center.y * scale + 0.3, -center.z * scale);

    orientRef.current.rotation.z = -Math.PI / 2;

    // Clone materials so we don't mutate the cached GLTF
    const applyProps = (mat: THREE.Material) => {
      const std = mat as THREE.MeshStandardMaterial;
      if (std.metalness !== undefined) {
        std.metalness = 0.6;
        std.roughness = 0.35;
      }
    };

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => {
              const cloned = m.clone();
              applyProps(cloned);
              return cloned;
            });
          } else {
            mesh.material = mesh.material.clone();
            applyProps(mesh.material);
          }
        }
      }
    });

    onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Keep target color in sync with themeColor prop
  useEffect(() => {
    targetColor.current.set(themeColor);
  }, [themeColor]);

  useFrame(() => {
    if (!spinRef.current) return;
    const p = scrollProgress.get();

    // Offset so side profile faces camera at p ≈ 0.5
    spinRef.current.rotation.y = p * Math.PI * 3 + Math.PI / 2;

    if (spotRef.current) {
      const warmth = Math.min(1, p * 2);
      workColor.current.copy(baseColor.current).lerp(targetColor.current, warmth);
      spotRef.current.color.copy(workColor.current);
      spotRef.current.intensity = 1.5 + warmth * 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />

      <spotLight
        ref={spotRef}
        position={[5, 8, 5]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <pointLight position={[-4, 3, -5]} intensity={0.8} color="#88aaff" />
      <pointLight position={[0, -3, 2]} intensity={0.3} color="#ffffff" />

      {/* Outer: turntable spin | Inner: orientation + scale */}
      <group ref={spinRef}>
        <group ref={orientRef}>
          <primitive object={scene} />
        </group>
      </group>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        blur={2.5}
        far={6}
        resolution={256}
      />
    </>
  );
}

interface ProstheticSceneProps {
  scrollProgress: MotionValue<number>;
  themeColor: string;
}

export default function ProstheticScene({ scrollProgress, themeColor }: ProstheticSceneProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="font-mono text-xs tracking-[0.2em] text-white/50">
          PROSTHETIC SYSTEM // OFFLINE
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{
                borderColor: `${themeColor}33`,
                borderTopColor: themeColor,
              }}
            />
            <span
              className="font-mono text-xs tracking-[0.3em]"
              style={{ color: `${themeColor}88` }}
            >
              LOADING PROSTHETIC SYSTEM
            </span>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          <ErrorCatcher onError={() => setHasError(true)}>
            <ProstheticModel
              scrollProgress={scrollProgress}
              themeColor={themeColor}
              onReady={() => setIsLoaded(true)}
            />
          </ErrorCatcher>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface ErrorCatcherProps {
  onError: () => void;
  children: ReactNode;
}

interface ErrorCatcherState {
  hasError: boolean;
}

class ErrorCatcher extends Component<ErrorCatcherProps, ErrorCatcherState> {
  state: ErrorCatcherState = { hasError: false };

  static getDerivedStateFromError(): ErrorCatcherState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
