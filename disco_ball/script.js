import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// light
const ambientLight = new THREE.HemisphereLight(0xdedede, 0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1.8);
pointLight1.position.set(8, 5, 1.5);
camera.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
pointLight2.position.set(-25, -20, 0.5);
camera.add(pointLight2);

//sphere
const geometry = new THREE.SphereGeometry(1.9, 25, 15);
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xf5f5f5);
material.flatShading = true;
material.roughness = 0.5;
material.metalness = 0.7;
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//camera position
camera.position.z = 5;
scene.add(camera);

//oribit controls
const controls = new OrbitControls(camera, canvas);

//for the line connecting to the sphere
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const points = [];
points.push(new THREE.Vector3(0, 40, 0));
points.push(new THREE.Vector3(0, 0, 0));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

//renderer function and re-rendering on resizing the screen
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//on mouse move
document.addEventListener("mousemove",onMouseOver)
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

function onMouseOver(event){
    mouseX = event.clientX - window.innerWidth;
    mouseY = event.clientY - window.innerHeight;
}

let color1, color2;

const clock = new THREE.Clock();

function animate() {
    controls.update();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = 0.5 * elapsedTime;

    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);

    renderer.render(scene, camera);

    color1 = Math.random() * 0xffffff;
    color2 = Math.random() * 0xffffff
    pointLight1.color.setHex(color1);
    pointLight2.color.setHex(color2);
    
    requestAnimationFrame(animate);
}
animate();

setInterval(function () {
    const background = `radial-gradient(
        farthest-side at bottom left,
        rgba(${pointLight2.color['r'] * 255}, 
        ${pointLight2.color['g'] * 255}, 
        ${pointLight2.color['b'] * 255},
        0.98),
        transparent 1100px
        ),
        radial-gradient(
        farthest-corner at bottom right,
        rgba(${pointLight1.color['r'] * 255}, 
        ${pointLight1.color['g'] * 255}, 
        ${pointLight1.color['b'] * 255},
        0.98),
        transparent 1100px
        )`;
    canvas.style.backgroundImage = background;
}, 400);

