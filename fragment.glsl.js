export default `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_origins[5];

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution * 2.0 - 1.0;
  vec2 center = vec2(0.0, 0.0);
  
  //template
  //for loop
  //   for loop
  //       calculations
  //normalize
  //calculations
  fragColor = vec4(vec3(wave), 1.0);
}
`;