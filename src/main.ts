// import { ContextNode } from "three/webgpu";
import "./fran.css";
import "./main.css";

import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementsByClassName("game")[0],
});

// todo: is ther a better practice here?
// we know page is non-null bc this module gets loaded after the DOM
const page = document.getElementById("page")!

//renderer.setPixelRatio(window.devicePixelRatio)

//renderer.setSize( window.innerWidth, window.innerHeight );

const ASPECT = 2 / 1

interface Sizes {
  width: number;
  height: number;
}

let sizes : Sizes = {
  width: 0,
  height: 0,
}

function calcSizes(container: HTMLElement): Sizes {
  const width = container.offsetWidth;
  const height = width / ASPECT;

  return { width, height };
}

function resize() {
  // Update sizes
  sizes = calcSizes(page);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener("resize", resize);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// SET UP SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

resize();
