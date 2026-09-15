
varying vec3 vColor;
varying float vAlpha;


void main() {
  vec2 center =
    gl_PointCoord -
    0.5;

  float distanceFromCenter =
    length(center);


  // Turn the square point into a soft circular star.
  float mask =
    smoothstep(
      0.5,
      0.15,
      distanceFromCenter
    );


  gl_FragColor =
    vec4(
      vColor,
      vAlpha * mask
    );
}
