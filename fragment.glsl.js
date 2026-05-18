// current heavy inspiration from https://www.shadertoy.com/view/ldfyzl
// aid from https://iquilezles.org/
export default `#version 300 es
precision mediump float;

#define CELL 2
#define HASHSCALE1 .1031
#define HASHSCALE3 vec3(.1031, .1030, .0973)

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * HASHSCALE1);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.xx + p3.yz) * p3.zy);
}

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

float smoothQuintic(float a, float b, float c) {
  float x = clamp((c - a) / (b - a), 0.0, 1.0); //between 0-1
  return x * x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.y * 6.0;
  // vec2 center = vec2(0.0, 0.0);
  vec2 p0 = floor(uv);  
  vec2 circles = vec2(0.0, 0.0);
  for (int y = -CELL; y <= CELL; y++){
    for (int x = -CELL; x <= CELL; x++){
      vec2 pi = p0 + vec2(x, y);         // neighbor cell
      vec2 p = pi + hash22(pi);           // random drop position in cell
      float t = fract(0.3 * u_time + hash12(pi)); // random lifecycle 0->1

      vec2 v = p - uv;                    // vector from drop to pixel
      float d = length(v) - float(CELL + 1) * t; // ring SDF

      float h = 1e-3;
      float d1 = d - h;
      float d2 = d + h;
      float p1 = sin(31.0 * d1) * smoothQuintic(-0.6, -0.3, d1) * smoothQuintic(0.0, -0.3, d1);
      float p2 = sin(31.0 * d2) * smoothQuintic(-0.6, -0.3, d2) * smoothQuintic(0.0, -0.3, d2);
      circles += 0.5 * normalize(v) * ((p2 - p1) / (2.0 * h) * (1.0 - t) * (1.0 - t));
    }
  }
  circles /= float((CELL*2+1)*(CELL*2+1));
  float z = 1.0 - dot(circles, circles);
  vec3 n = vec3(circles, sqrt(max(0.0, z)));
  float wave = dot(n, normalize(vec3(1.0, 0.7, 0.5)));
  fragColor = vec4(vec3(wave), 1.0);
}
`;