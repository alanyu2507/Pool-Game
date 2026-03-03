import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151620);

// Camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.75;

// Append renderer to a container instead of directly to document (to be added in main.js)
const garageContainer = document.querySelector(".garage");
if (garageContainer) {
    garageContainer.appendChild(renderer.domElement);
}

// Lighting
const directionalLight = new THREE.DirectionalLight(0xcc8ee8, 2);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6,
    1,
    0.1
);
composer.addPass(bloomPass);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.5;
controls.maxDistance = 3;
controls.maxPolarAngle = Math.PI / 2;

// Function to create emissive material
const createEmissiveMaterial = (color, intensity = 2) => {
    return new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity, 
        toneMapped: false,
    });
};

// Load Pool Table
const loader = new GLTFLoader();
loader.load("./Assets/pooltable.glb", function (gltf) {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const topMiddle = new THREE.Vector3(center.x, box.max.y - 0.020, center.z);
    model.position.sub(topMiddle);
    scene.add(model);
});

// Export everything for use in main.js
export { scene, camera, renderer, controls, composer };
