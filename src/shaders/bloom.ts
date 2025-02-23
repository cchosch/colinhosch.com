import * as THREE from "three";
// Custom bloom shader
export const bloomShader = {
    uniforms: {
        tDiffuse: { value: null }, // Base texture from previous render
        resolution: { value: new THREE.Vector2(512, 512) },
        bloomStrength: { value: 1.5 }, // Bloom intensity
        bloomRadius: { value: 6.0 }, // Bloom spread in pixels
        bloomThreshold: { value: 0.5 }, // Brightness threshold (0.0-1.0)
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomThreshold;
varying vec2 vUv;

vec4 gaussianBlur(vec2 uv) {
  vec4 color = vec4(0.0);
  float totalWeight = 0.0;
  float blurSize = bloomRadius / resolution.x;

  // 5x5 kernel for bloom blur
  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      vec2 offset = vec2(x, y) * blurSize;
      float weight = exp(-(x * x + y * y) / (2.0 * blurSize * blurSize));
      vec4 texsample = texture2D(tDiffuse, uv + offset);
      color += texsample * weight;
      totalWeight += weight;
    }
  }
  return color / totalWeight;
}

void main() {
  vec4 baseColor = texture2D(tDiffuse, vUv);

  // Extract bright areas above threshold
  vec3 brightColor = max(vec3(0.0), baseColor.rgb - vec3(bloomThreshold));
  
  // Blur only the bright areas
  vec4 bloom = gaussianBlur(vUv);
  vec3 bloomColor = bloom.rgb * brightColor;

  // Add bloom to base color with strength
  vec3 finalColor = baseColor.rgb + bloomColor * bloomStrength;

  gl_FragColor = vec4(finalColor, 1.0);
}
    `,
};