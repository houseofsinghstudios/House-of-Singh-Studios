export const grainVertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

export const grainFragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollVelocity;
uniform float uGrainIntensity;
uniform float uColorTemp;

varying vec2 vUv;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Animated grain
  float grain = noise(uv * 800.0 + uTime * 0.5);

  // Grain intensity increases near mouse and with scroll velocity
  float mouseDist = distance(uv, uMouse);
  float mouseInfluence = smoothstep(0.3, 0.0, mouseDist) * 0.03;
  float velocityInfluence = abs(uScrollVelocity) * 0.02;

  float intensity = uGrainIntensity + mouseInfluence + velocityInfluence;

  // Color temperature shift (warm = positive, cool = negative)
  vec3 warmTint = vec3(1.01, 1.005, 0.99);
  vec3 coolTint = vec3(0.99, 1.0, 1.01);
  vec3 tint = mix(warmTint, coolTint, clamp(uColorTemp, 0.0, 1.0));

  // Apply grain with color tint
  vec3 grainColor = vec3(grain) * tint;

  gl_FragColor = vec4(grainColor, intensity);
}
`;
