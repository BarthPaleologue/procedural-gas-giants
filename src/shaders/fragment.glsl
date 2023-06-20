precision highp float;

varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vUnitSamplePoint;
varying vec3 vSphereNormalW;

varying vec3 vPosition; // position of the vertex in sphere space

uniform vec3 cameraPosition;

uniform vec3 starPosition;

uniform vec3 mainColor1;
uniform vec3 mainColor2;
uniform vec3 darkColor;

uniform float seed;

#pragma glslify: fractalSimplex4 = require(./noise.glsl)

#pragma glslify: lerp = require(./lerp.glsl)

#pragma glslify: saturate = require(./saturate.glsl)

void main() {
    vec3 viewRayW = normalize(cameraPosition - vPositionW); // view direction in world space

    vec3 sphereNormalW = vSphereNormalW;
    vec3 normalW = vNormalW;
 
    vec3 starLightRayW = normalize(starPosition - vPositionW); // light ray direction in world space
    float ndl = max(0.0, dot(sphereNormalW, starLightRayW));

    vec3 angleW = normalize(viewRayW + starLightRayW);
    float specComp = max(0.0, dot(normalW, angleW));
    
    ndl = saturate(ndl);
    specComp = saturate(specComp);
    specComp = pow(specComp, 16.0) * 0.5;

    vec3 color = vec3(0.0);

    float seedImpact = mod(seed, 1e3);

    vec4 seededSamplePoint = vec4(vUnitSamplePoint * 2.0, seedImpact);
    seededSamplePoint.y *= 2.5;
    
    float latitude = seededSamplePoint.y;
    
    float warpingStrength = 2.0;
    float warping = fractalSimplex4(seededSamplePoint, 5, 2.0, 2.0) * warpingStrength;
    
    float colorDecision1 = fractalSimplex4(vec4(latitude + warping, seedImpact, -seedImpact, seedImpact), 3, 2.0, 2.0);
    float colorDecision2 = fractalSimplex4(vec4(latitude - warping, seedImpact, -seedImpact, seedImpact), 3, 2.0, 2.0);
    
    color = lerp(mainColor1, darkColor, smoothstep(0.4, 0.6, colorDecision1));
    color = lerp(color, mainColor2, smoothstep(0.2, 0.8, colorDecision2));

    vec3 screenColor = color.rgb * (ndl + specComp * ndl);

    gl_FragColor = vec4(screenColor, 1.0);
}