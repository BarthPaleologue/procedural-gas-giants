import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Loading/loadingScreen";

import "../styles/index.scss";
import { GasPlanetMaterial } from "./gasPlanetMaterial";

const canvas = document.getElementById("renderer") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas);

const scene = new Scene(engine);
scene.clearColor.set(0, 0, 0, 1);

const camera = new ArcRotateCamera("camera", -1.5, 1.5, 2, new Vector3(0, 0, 0), scene);
camera.lowerRadiusLimit = 1.5;
camera.wheelDeltaPercentage = 0.01;
camera.attachControl();

const light = new PointLight("light", new Vector3(-5, 1, -5).scaleInPlace(100), scene);

const planet = MeshBuilder.CreateSphere("sphere", { segments: 64, diameter: 1 }, scene);
planet.position = new Vector3(0, 0, 0);

camera.setTarget(planet.position);

const material = new GasPlanetMaterial(planet, 25, scene);
planet.material = material;

function updateScene() {
    material.update(camera, light);
}

scene.executeWhenReady(() => {
    engine.loadingScreen.hideLoadingUI();
    scene.registerBeforeRender(() => updateScene());
    engine.runRenderLoop(() => scene.render());
});

window.addEventListener("resize", () => {
    engine.resize();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
