// import "./index.css";
import { createMask } from "./createMask";
import { bloomPassX, bloomPassY, imgPass } from "./bloom";
import projection from "./projection.js";

// import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const sizes = {
	width: window.innerHeight - 50,
	height: window.innerHeight - 50,
};

window.addEventListener("resize", () => {
	sizes.width = window.innerHeight - 50;
	sizes.height = window.innerHeight - 50;

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let canvasMask = null;
const geometry = new THREE.PlaneGeometry(2, 2, 1);

await loadJson().then((res) => {
	const linePoints = JSON.parse(res).features[0].geometry.coordinates[0][0];
	const points = [];
	const shape = new THREE.Shape();

	let MaxX = -Infinity;
	let MaxY = -Infinity;
	let MinX = Infinity;
	let MinY = Infinity;

	for (let i = 0; i < linePoints.length; i++) {
		let [x, y] = projection(linePoints[i]);
		points.push(x, -y);

		if (i === 0) {
			shape.moveTo(x, -y);
		}
		shape.lineTo(x, -y);

		MaxX = Math.max(MaxX, x);
		MaxY = Math.max(MaxY, -y);
		MinY = Math.min(MinY, -y);
		MinX = Math.min(MinX, x);
	}

	canvasMask = createMask(points, {
		maxX: MaxX,
		maxY: MaxY,
		minX: MinX,
		minY: MinY,
	});
});

console.log("canvasMask:", canvasMask);
const maskTexture = new THREE.CanvasTexture(canvasMask);

const materialBloomX = bloomPassX(maskTexture);

const mesh = new THREE.Mesh(geometry, materialBloomX);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});

const renderTargetX = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
renderTargetX.texture.name = "BloomPass.x";
const renderTargetY = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
renderTargetY.texture.name = "BloomPass.y";

const textureInput = renderTargetX.texture;
const textureOutput = renderTargetY.texture;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setRenderTarget(renderTargetX);
renderer.clear();
renderer.render(mesh, new THREE.Camera());

mesh.material = bloomPassY(maskTexture, textureInput);

renderer.setRenderTarget(null);
renderer.clear();

const tick = () => {
	// material.uniforms = {
	// 	textureSampler: { value: maskTexture },
	// };
	// renderer.setRenderTarget(renderTargetX);
	// renderer.clear();
	// renderer.render(mesh, new THREE.Camera());
	// mesh.material.uniforms = {
	// 	textureSampler: { value: textureInput },
	// };

	// renderer.setRenderTarget(renderTargetY);
	// renderer.clear();
	// renderer.render(mesh, new THREE.Camera());
	// mesh.material.uniforms = {
	// 	textureSampler: {
	// 		value: textureOutput,
	// 	},
	// };
	renderer.render(mesh, new THREE.Camera());
	window.requestAnimationFrame(tick);
};

async function loadTexture() {
	var textureLoader = new THREE.TextureLoader();

	try {
		var texture = await new Promise((resolve, reject) => {
			textureLoader.load("./843.png", resolve, undefined, reject);
		});
		return texture;
	} catch (error) {
		// 纹理加载出错时执行的操作
		console.log("纹理加载出错", error);
	}
}

async function loadJson() {
	const jsonLoader = new THREE.FileLoader();

	try {
		const jsonContent = await new Promise((resolve, reject) => {
			jsonLoader.load("./assets/a.json", resolve, undefined, reject);
		});
		return jsonContent;
	} catch (error) {
		// 纹理加载出错时执行的操作
		console.log("JSON加载出错", error);
	}
}

tick();
