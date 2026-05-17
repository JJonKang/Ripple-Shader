export default `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

void random(vec2 c) {
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution * 2.0 - 1.0;
  vec2 center = vec2(0.0, 0.0);
  
  vec2 diff = uv - center;
  diff.x *= u_resolution.x / u_resolution.y;

  float dist = length(diff);
  float wave = sin(dist * 50.0 - u_time * 10.0);
  fragColor = vec4(vec3(wave), 1.0);
}
`;