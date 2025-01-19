import { ContextNode } from 'three/webgpu';
import './main.css'

import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementsByClassName('game')[0],
});

const page = document.getElementById('page');

// todo: wtf. there has to be a better way
// maybe doing this with a promise or something?
if (page === null) stop();

//renderer.setPixelRatio(window.devicePixelRatio)

//renderer.setSize( window.innerWidth, window.innerHeight );

const ASPECT = 2/1;

function calcRendererSizes(container: HTMLElement) : THREE.Vector2 {
	const width = container.offsetWidth;
	const height = width / ASPECT;

	return new THREE.Vector2(width, height);
}

let rendererSizes = calcRendererSizes(page);

function resize() {
    // Update sizes
    rendererSizes = calcRendererSizes(page)

    // Update camera
    camera.aspect = rendererSizes.width / rendererSizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(rendererSizes.width, rendererSizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', resize)


function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}
renderer.setAnimationLoop( animate );



// SET UP SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

resize();