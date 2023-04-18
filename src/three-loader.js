import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Create the scene, camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load the GLB file
    const loader = new GLTFLoader();
    loader.load('/test.glb', (gltf) => {
      // Add the loaded model to the scene
      const model = gltf.scene;
      scene.add(model);
    }, undefined, (error) => {
      console.error(error);
    });

    // Set up the camera position and update it on window resize
    camera.position.z = 5;
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
