import * as THREE from "three";
// Create a Shader Material
export const pixelatedCRTShader = {
  uniforms: {
    tDiffuse: {value: null}, // Texture input
    resolution: {value: new THREE.Vector2(2000, 2000)}, // Controls pixel size
    pixelSize: {value: 2}, // Pixelation intensity
  },
  vertexShader: `
  varying vec2 vUv;
  uniform vec2 resolution;
  uniform float pixelSize;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  uniform float pixelSize;
  
  varying vec2 vUv;
  
  void main() {
    // Calculate pixelation effect
    vec2 pixelGridSize = pixelSize / resolution;
    vec2 pixelatedUV = (floor(vUv / pixelGridSize) + 0.5) * pixelGridSize;
    
    // Sample the texture at the pixelated coordinates
    vec4 color = texture2D(tDiffuse, pixelatedUV);
    
    // Add a simple scanline effect
    float scanline = sin(vUv.y * resolution.y * 3.1415) * 0.04;
    color.rgb -= scanline;

    gl_FragColor = color;
  }
  `
};