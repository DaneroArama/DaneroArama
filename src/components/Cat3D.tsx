'use client';
import { Suspense, useEffect, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import catGLB from '../assets/the_cat_with_bones_animation.glb';

function CatModel() {
  const gltf = useGLTF(catGLB) as any;
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);

  useLayoutEffect(() => {
    const scene = gltf.scene as THREE.Object3D;
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      scene.scale.setScalar(2.4 / maxDim);
    }
  }, [gltf]);

  useEffect(() => {
    const animName = names.find((n) => /take\s*001/i.test(n)) ?? names[0];
    const action = animName ? actions[animName] : undefined;
    if (!action) return;
    action.reset().fadeIn(0.4).play();
    return () => {
      action.fadeOut(0.4);
    };
  }, [actions, names]);

  return <primitive object={gltf.scene} />;
}

export default function Cat3D({ size = 150 }: { size?: number }) {
  return (
    <div className="pointer-events-none" style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [-8, 0, 8], fov: 40 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#8ab4ff" />
        <pointLight position={[0, 3, 2]} intensity={0.6} />
        <Suspense fallback={null}>
          <CatModel />
        </Suspense>
      </Canvas>
    </div>
  );
}