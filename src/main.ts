// import { ContextNode } from "three/webgpu";
import "./fran.css";
import "./main.css";

import * as coro from '@ajeeb/coroutines';

import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
import { MathUtils, Vector3 } from "three";
import { toneMapping } from "three/tsl";

const gui = new GUI();

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementsByClassName("game")[0],
});
renderer.setPixelRatio(window.devicePixelRatio)

//gui.addColor(renderer, 'clearColor', 255)


const ASPECT = 2 / 1;

interface Sizes {
  width: number;
  height: number;
}

let sizes: Sizes = {
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


// SET UP SCENE


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render);
//controls.maxPolarAngle = Math.PI / rendee2;
// controls.enableZoom = false;
// controls.enablePan = false;

// set up sky
const sky = new Sky();
sky.scale.setScalar(450000);

const phi = MathUtils.degToRad(-90);
const theta = MathUtils.degToRad(-90);
const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = 10;
uniforms['rayleigh'].value = 3;
uniforms['mieCoefficient'].value = 0.005;
uniforms['mieDirectionalG'].value = 0.7;

sky.material.uniforms.sunPosition.value = sunPosition;

scene.add(sky);



const textureLoader = new THREE.TextureLoader();
const threeTone = textureLoader.load('assets/threeTone.jpg');
threeTone.minFilter = THREE.NearestFilter;
threeTone.magFilter = THREE.NearestFilter;

const fiveTone = textureLoader.load('assets/fiveTone.jpg');
fiveTone.minFilter = THREE.NearestFilter;
fiveTone.magFilter = THREE.NearestFilter;


const toonMaterial = new THREE.MeshToonMaterial({ color: 0x00ffff, gradientMap: fiveTone });

const box_geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(box_geometry, toonMaterial)
cube.translateX(-3)
scene.add(cube)

const sphere_geo = new THREE.SphereGeometry(1)
const sphere = new THREE.Mesh(sphere_geo, toonMaterial);
sphere.translateX(3)
scene.add(sphere);

const loader = new GLTFLoader()

let litwick: THREE.Group | null = null;
// Load a glTF resource
loader.load(
  // resource URL
  'assets/litwick.glb',
  // called when the resource is loaded
  function (model) {

    litwick = model.scene;

    // toonify the material
    litwick.traverse(function (o) {
      if (o instanceof THREE.Mesh) {
        const toonifiedMat = new THREE.MeshToonMaterial(
          {
            map: o.material.map,
            gradientMap: fiveTone
          });

        o.material = toonifiedMat;
      }
    })


    scene.add(litwick);

    model.animations; // Array<THREE.AnimationClip>
    model.scene; // THREE.Group
    model.scenes; // Array<THREE.Group>
    model.cameras; // Array<THREE.Camera>
    model.asset; // Object

  },
  // called while loading is progressing
  function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // called when loading has errors
  function (error) {

    console.log(`Error loading model: ${error}`);

  }
);


// LIGHTS

const ambient_light = new THREE.AmbientLight('white', 0.1); // soft white light
scene.add(ambient_light);

// const point_light = new THREE.PointLight( 0xffffff, 2, 800);
// point_light.position.setZ(1);
// scene.add( point_light );

// gui.add(point_light.position, 'z')

const dirLight = new THREE.DirectionalLight('white', 2);
const dLphi = MathUtils.degToRad(-70);
const dLtheta = MathUtils.degToRad(-90);
const dirLightPosition = new Vector3().setFromSphericalCoords(1, dLphi, dLtheta);

dirLight.position.copy(dirLightPosition)
dirLight.castShadow = true
// dirLight.shadow.normalBias = 10
// dirLight.shadow.camera.left = -500
// dirLight.shadow.camera.right = 500
// dirLight.shadow.camera.top = -500
// dirLight.shadow.camera.bottom = 500
scene.add(dirLight);

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
scene.add(dirLightHelper);




camera.position.z = 2;

resize();

function render() {
  renderer.render(scene, camera);
}

const SCHED = new coro.Schedule()

function* slowRotate(obj: THREE.Object3D | null) {
  while (!obj)  {
  // hmmmmmmmmmmmm
  // what to do...
    console.log("litwick")
    yield
  }

  while (true) {
    obj.rotation.x += 0.01
    obj.rotation.y += 0.01
    yield
  }
}

SCHED.add(slowRotate(cube));
SCHED.add(slowRotate(sphere));
SCHED.add(slowRotate(litwick));

function tick() {
  SCHED.tick()

  render();

  requestAnimationFrame(tick)
}
tick()
