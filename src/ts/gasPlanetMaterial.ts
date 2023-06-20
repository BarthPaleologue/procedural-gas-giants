import surfaceMaterialFragment from "../shaders/fragment.glsl";
import surfaceMaterialVertex from "../shaders/vertex.glsl";

import { normalRandom, randRange } from "extended-random";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Scene } from "@babylonjs/core/scene";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { seededSquirrelNoise } from "squirrel-noise";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Camera } from "@babylonjs/core/Cameras/camera";

const shaderName = "gazPlanetMaterial";
Effect.ShadersStore[`${shaderName}FragmentShader`] = surfaceMaterialFragment;
Effect.ShadersStore[`${shaderName}VertexShader`] = surfaceMaterialVertex;

export interface GazColorSettings {
    mainColor1: Color3;
    mainColor2: Color3;
    darkColor: Color3;
}

export class GasPlanetMaterial extends ShaderMaterial {
    readonly planet: Mesh;
    readonly colorSettings: GazColorSettings;

    constructor(planet: Mesh, seed: number, scene: Scene) {
        super(`${planet.name}SurfaceColor`, scene, shaderName, {
            attributes: ["position", "normal"],
            uniforms: ["world", "worldViewProjection", "seed", "planetPosition", "starPosition", "mainColor1", "mainColor2", "darkColor", "cameraPosition"]
        });

        const rng = seededSquirrelNoise(seed);

        this.planet = planet;

        const hue1 = normalRandom(240, 30, rng, 70);
        const hue2 = normalRandom(0, 180, rng, 72);

        const mainColor1 = Color3.FromHSV(hue1 % 360, randRange(0.4, 0.9, rng, 72), randRange(0.7, 0.9, rng, 73));
        const mainColor2 = Color3.FromHSV((hue1 + 180) % 360, randRange(0.4, 0.9, rng, 76), randRange(0.7, 0.9, rng, 77));
        const darkColor = Color3.FromHSV(hue2 % 360, randRange(0.6, 0.9, rng, 74), randRange(0.0, 0.3, rng, 75));

        this.colorSettings = {
            mainColor1: mainColor1,
            mainColor2: mainColor2,
            darkColor: darkColor
        };

        this.setFloat("seed", seed);

        this.setColor3("mainColor1", this.colorSettings.mainColor1);
        this.setColor3("mainColor2", this.colorSettings.mainColor2);
        this.setColor3("darkColor", this.colorSettings.darkColor);
    }

    public update(camera: Camera, light: PointLight) {
        this.setVector3("cameraPosition", camera.globalPosition);

        this.setVector3("starPosition", light.getAbsolutePosition());

        this.setVector3("planetPosition", this.planet.getAbsolutePosition());
    }
}
