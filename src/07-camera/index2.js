import * as THREE from 'three'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing"

function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({canvas});
  
	const fov = 75;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 2;
  
	const scene = new THREE.Scene();
  
	{
	  const color = 0xFFFFFF;
	  const intensity = 2;
	  const light = new THREE.DirectionalLight(color, intensity);
	  light.position.set(-1, 2, 4);
	  scene.add(light);
	}
  
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
	function makeInstance(geometry, color, x) {
	  const material = new THREE.MeshPhongMaterial({color});
  
	  const cube = new THREE.Mesh(geometry, material);
	  scene.add(cube);
  
	  cube.position.x = x;
  
	  return cube;
	}
  
	const cubes = [
	  makeInstance(geometry, 0x44aa88,  0),
	  makeInstance(geometry, 0x8844aa, -2),
	  makeInstance(geometry, 0xaa8844,  2),
	];
  
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
  
	const effectPass = new EffectPass(camera, new BloomEffect());
	composer.addPass(effectPass);
	effectPass.renderToScreen = true;
  
	function resizeRendererToDisplaySize(renderer) {
	  const canvas = renderer.domElement;
	  const width = canvas.clientWidth;
	  const height = canvas.clientHeight;
	  const needResize = canvas.width !== width || canvas.height !== height;
	  if (needResize) {
		renderer.setSize(width, height, false);
	  }
	  return needResize;
	}
  
	let then = 0;
	function render(now) {
	  now *= 0.001;  // convert to seconds
	  const deltaTime = now - then;
	  then = now;
  
	  if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
		composer.setSize(canvas.width, canvas.height);
	  }
  
	  cubes.forEach((cube, ndx) => {
		const speed = 1 + ndx * .1;
		const rot = now * speed;
		cube.rotation.x = rot;
		cube.rotation.y = rot;
	  });
  
	  composer.render(deltaTime);
  
	  requestAnimationFrame(render);
	}
  
	requestAnimationFrame(render);
  }
  
  main();
  