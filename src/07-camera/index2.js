import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

const composer = new EffectComposer(new WebGLRenderer());
const camera = new PerspectiveCamera();
const scene = new Scene();

const effectPass = new EffectPass(camera, new BloomEffect());
effectPass.renderToScreen = true;

composer.addPass(new RenderPass(scene, camera));
composer.addPass(effectPass);

const clock = new Clock();

(function render() {

	requestAnimationFrame(render);
	composer.render(clock.getDelta());

}());