// import { ContextNode } from "three/webgpu";
import "./fran.css";
import "./main.css";

import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui'; 

const gui = new GUI();

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementsByClassName("game")[0],
});

//renderer.setPixelRatio(window.devicePixelRatio)

const ASPECT = 2 / 1;

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

  // const width = window.innerWidth;
  // const height = window.innerHeight;

  return { width, height };
}

function resize() {
  // Update sizes
  sizes = calcSizes(renderer.domElement);

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

// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const material = new THREE.MeshToonMaterial({ color: 0x00ffff});


const box_geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(box_geometry, material)
cube.translateX(-3)
scene.add(cube)

const sphere_geo = new THREE.SphereGeometry(1)
const sphere = new THREE.Mesh(sphere_geo, material);
sphere.translateX(3)
scene.add(sphere);

const loader = new GLTFLoader()

// Load a glTF resource
loader.load(
	// resource URL
	'assets/litwick.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( `Error loading model: ${error}` );

	}
);


const light = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
scene.add( light );

const point_light = new THREE.PointLight( 0xffffff, 0.8);
scene.add( point_light );

gui.add(point_light.position, 'x')

camera.position.z = 5;

resize();
