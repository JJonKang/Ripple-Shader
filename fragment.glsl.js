export default `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

void random(vec2 c) {
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 center = vec2(0.5, 0.5);
  
  vec2 diff = uv - center;
  diff.x *= u_resolution.x / u_resolution.y;

  float dist = length(diff);
  float wave = sin(dist * 40.0 - u_time * 5.0);
  fragColor = vec4(vec3(wave), 1.0);
}
`;