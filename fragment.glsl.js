// aid from https://iquilezles.org/
export default `#version 300 es
precision mediump float;

#define CELL 2
#define numOctaves 1

float random1(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 random2(vec2 p) {
  return vec2(
    fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p, vec2(31.233, 56.9898))) * 43758.5453)
  );
}

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

float smoothQuintic(float a, float b, float c) {
  float x = clamp((c - a) / (b - a), 0.0, 1.0); //between 0-1
  float s = x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
  return pow(s, 1.2);
}

float noise(vec2 p) {
  vec2 i = floor(p); //current cell
  vec2 f = fract(p); //within curr cell
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(random1(i),             random1(i + vec2(1,0)), u.x),
    mix(random1(i + vec2(0,1)), random1(i + vec2(1,1)), u.x),
    u.y
  );
}

// fractional brownian motion
float fbm( in vec2 x, in float H ){
  float r = 0.0;
  float G = exp2(-H);
  float a = 1.0;
  float f = 1.0;
  for (int i = 0; i < numOctaves; i++){
    r += a * noise(f * x);
    f *= 2.0;
    a *= G;
  }
  return r;
}

// warping
float pattern( in vec2 p ){
  vec2 warp = vec2(
    fbm(p + vec2(0.0, 0.0), 0.5),
    fbm(p + vec2(5.2, 1.3), 0.5)
  );
  return fbm(p + 4.0 * warp, 0.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.y * 12.0;
  uv += pattern(uv + u_time * 0.1) * 0.0825;
  vec2 p0 = floor(uv);  
  vec2 circles = vec2(0.0, 0.0);
  for (int y = -CELL; y <= CELL; y++){
    for (int x = -CELL; x <= CELL; x++){
      vec2 pi = p0 + vec2(x, y); // neighbor cell

      // change value here for drop frequency
      if (random1(pi + 3.2) > 0.211) continue;

      vec2 p = pi + random2(pi); // random pos ripple start in a cell
      // also deals with speed of drop expansion and speed in general
      float speed = 0.456 + (random1(pi + 5.1) - 0.324) * 0.471;
      float expandT = fract(speed * u_time + random1(pi)); // random lifecycle 0->1

      vec2 v = p - uv; // vector from drop to pixel
      float d = length(v) - float(CELL + 1) * expandT; // ring SDF

      float h = 1e-3;
      float d1 = d - h;
      float d2 = d + h;
      float p1 = sin(25.0 * d1) * smoothQuintic(-0.6, -0.3, d1) * smoothQuintic(0.01, -0.3, d1);
      float p2 = sin(25.0 * d2) * smoothQuintic(-0.6, -0.3, d2) * smoothQuintic(0.01, -0.3, d2);
      circles += 0.5 * normalize(v) * ((p2 - p1) / (2.0 * h) * (1.0 - expandT) * (1.0 - expandT));
    }
  }
  circles /= float((CELL*2+1)*(CELL*2+1));
  float z = 1.0 - dot(circles, circles);
  vec3 n = vec3(circles, sqrt(max(0.0, z)));
  float wave = dot(n, normalize(vec3(0.9, 0.75, 0.45)));
  fragColor = vec4(vec3(wave), 1.0);
}
`;