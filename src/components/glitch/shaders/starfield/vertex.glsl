
uniform float uTime;

attribute float aSeed;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;


float hash(float n) {
  return fract(
    sin(n) *
    43758.5453123
  );
}


void main() {
  vColor = aColor;


  // ----------------------------------------------------
  // Gentle twinkle
  // ----------------------------------------------------

  float twinkle =
    0.55 +
    0.45 *
    sin(
      uTime *
      (
        1.2 +
        aSeed * 2.0
      ) +
      aSeed * 40.0
    );


  // ----------------------------------------------------
  // Digital glitch flicker
  // ----------------------------------------------------

  float slot =
    floor(
      uTime * 3.0 +
      aSeed * 90.0
    );

  float randomValue =
    hash(
      slot +
      aSeed * 17.0
    );

  float flicker = 1.0;

  if (randomValue > 0.96) {
    flicker = 2.2;
  }

  if (randomValue < 0.03) {
    flicker = 0.0;
  }


  vAlpha =
    twinkle *
    flicker;


  // ----------------------------------------------------
  // Position and apparent star size
  // ----------------------------------------------------

  vec4 modelViewPosition =
    modelViewMatrix *
    vec4(
      position,
      1.0
    );

  gl_PointSize =
    (
      1.4 +
      aSeed * 2.4
    ) *
    (
      280.0 /
      -modelViewPosition.z
    );


  gl_Position =
    projectionMatrix *
    modelViewPosition;
}
