import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { resizeCanvasToDisplaySize } from "twgl.js"

export const showDecimalPoints = (n: number, d: number = 2) => ((Math.round(n * 10**(d)) / 10**(d)).toFixed(d));

const scene = new Scene();

const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);

// Create a renderer
const app = document.querySelector<HTMLDivElement>("#mainCanvas")!;
const mainCanvas = document.querySelector<HTMLCanvasElement>("#mainCanvas")!;
resizeCanvasToDisplaySize(mainCanvas);
const timeScaleElem = document.querySelector<HTMLParagraphElement>("#timeScale");
const renderer = new WebGLRenderer({canvas: mainCanvas});

// Create a cube
const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshPhongMaterial({color: 0xff8800});
const cube = new Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// create ambient light
const ambientLight = new AmbientLight(0xffffff);
scene.add(ambientLight);

// set up directional light from the top right corner of the screen
const directionalLight = new DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

camera.position.set(0, 0, 2);

// keep track current, elapsed, and previous time
let startTime: number | null = null;
let previousTime: number;
let elapsedTime: number = 0;
let timeScale = 1.0;
let shrinkTimeScale = true;

// render/animate the cube inside a scene
function animate() {
  if (!startTime) {
    previousTime = startTime = performance.now();
  }

  const currentTime = performance.now();
  elapsedTime += ((currentTime - previousTime) / 1000.0) * timeScale; // Convert to seconds
  previousTime = currentTime;
  if (timeScaleElem)
    timeScaleElem.textContent = `
      Time scale = ${showDecimalPoints(timeScale)} |
      Current time = ${showDecimalPoints((currentTime - startTime) / 1000.0)}
    `;

  // scale time
  if (timeScale < 2 / 10 || timeScale > 10 / 2)
    shrinkTimeScale = !shrinkTimeScale;

  if (shrinkTimeScale)
    timeScale *= 99 / 100;
  else
    timeScale *= 100 / 99;

  cube.rotation.x += 0.01 * timeScale;
  cube.rotation.y += 0.01 * timeScale;
  renderer.render(scene, camera);
  requestAnimationFrame(animate)
}

animate();