import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js";

// Set up three Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Set up three orthographic Camera
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2, // left
  window.innerWidth / 2, // right
  window.innerHeight / 2, // top
  window.innerHeight / -2, // bottom
  1, // near
  1000 // far
);

// Set up three Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up stats box
const stats = new Stats();
document.body.appendChild(stats.dom);

// Load an image texture
const textureLoader = new THREE.TextureLoader();
const imageTexture = textureLoader.load("public/sample.jpg");

// Set up plane and add its texture
const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const material = new THREE.MeshBasicMaterial({ map: imageTexture });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Add random black pixels
// Default values
let numPixels = 1000;
let pixelSize = 5;
let blackPixels;

// Function to create or update black pixels on top of the plane
function createOrUpdateBlackPixels() {
  if (blackPixels) {
    scene.remove(blackPixels);
  }

  // Choose random position and store it in a 1D array
  const positions = new Float32Array(numPixels * 3);
  for (let i = 0; i < numPixels; i++) {
    const xPos = (Math.random() - 0.5) * window.innerWidth;
    const yPos = (Math.random() - 0.5) * window.innerHeight;

    positions[i * 3] = xPos;
    positions[i * 3 + 1] = yPos;
    positions[i * 3 + 2] = 0;
  }

  // Construct pixel geometry
  const pixelGeometry = new THREE.BufferGeometry();
  pixelGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Construct pixel material (black for now)
  const pixelMaterial = new THREE.PointsMaterial({
    size: pixelSize,
    color: 0x000000,
  });

  // Create and add the black pixels to the scene
  blackPixels = new THREE.Points(pixelGeometry, pixelMaterial);
  scene.add(blackPixels);
}

// Initial creation of black pixels
createOrUpdateBlackPixels();

// Set camera position
camera.position.z = 100;

// Function to update pixel count
function updatePixelCount(value) {
  numPixels = value;
  createOrUpdateBlackPixels();
}

// Function to update pixel size
function updatePixelSize(value) {
  pixelSize = value;
  if (blackPixels) {
    blackPixels.material.size = pixelSize;
    blackPixels.material.needsUpdate = true;
  }
}

// Setup event listeners for sliders
const pixelCountSlider = document.getElementById("pixelCount");
pixelCountSlider.addEventListener("input", (event) => {
  updatePixelCount(parseInt(event.target.value));
});
const pixelSizeSlider = document.getElementById("pixelSize");
pixelSizeSlider.addEventListener("input", (event) => {
  updatePixelSize(parseInt(event.target.value));
});

// Render / Animate loop
function animate() {
  requestAnimationFrame(animate);

  // Update positions in the GPU buffer for animation
  if (blackPixels) {
    // Update positions in the GPU buffer for animation
    const positionsArray = blackPixels.geometry.attributes.position.array;
    for (let i = 0; i < numPixels; i++) {
      positionsArray[i * 3] = (Math.random() - 0.5) * window.innerWidth;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
    }

    blackPixels.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
  stats.update();
}

// Call loop
animate();
