precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 world;
uniform mat4 worldViewProjection;

varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vSphereNormalW;

varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 vUnitSamplePoint;

void main() {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;

    vPositionW = vec3(world * vec4(position, 1.0));
    vNormalW = vec3(world * vec4(normal, 0.0));

    vPosition = position;

    vUnitSamplePoint = normalize(vPosition);
    vSphereNormalW = vec3(world * vec4(vUnitSamplePoint, 0.0));
}