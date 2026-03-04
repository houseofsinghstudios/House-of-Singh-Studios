export const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

export const fragmentShader = `
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform vec2 uResolution;
uniform float uScrollProgress;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Depth parallax on scroll
  float parallaxStrength = 0.03;
  uv.y += uScrollProgress * parallaxStrength;

  // Fluid displacement on hover
  vec2 mouse = uMouse;
  float dist = distance(uv, mouse);

  float radius = 0.25;
  float strength = 0.06 * uHover;
  float displacement = smoothstep(radius, 0.0, dist) * strength;

  vec2 dir = normalize(uv - mouse);
  uv += dir * displacement;

  // Subtle time-based ripple in displacement area
  float ripple = sin(dist * 30.0 - uTime * 2.0) * 0.003 * uHover;
  uv += dir * ripple * smoothstep(radius, 0.0, dist);

  // Clamp UVs
  uv = clamp(uv, 0.0, 1.0);

  vec4 color = texture2D(uTexture, uv);
  gl_FragColor = color;
}
`;
