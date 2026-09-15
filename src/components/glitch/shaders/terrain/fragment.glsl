
uniform float uTime;
uniform float uOffset;
uniform float uGlitchIntensity;
uniform float uWire;

varying float vElevation;
varying vec2 vUv;


float hash(float n) {
  return fract(
    sin(n) *
    43758.5453123
  );
}


float hash2(vec2 p) {
  return fract(
    sin(
      dot(
        p,
        vec2(
          127.1,
          311.7
        )
      )
    ) *
    43758.5453123
  );
}


void main() {
  vec2 uv = vUv;
  float elevation = vElevation;


  // ----------------------------------------------------
  // Horizontal glitch tearing
  // ----------------------------------------------------

  float bandCount = 60.0;

  float band =
    floor(
      (
        uv.y +
        uOffset / 320.0
      ) *
      bandCount +
      floor(uTime * 3.0) *
      7.0
    );

  float randomBand =
    hash(band);

  float threshold =
    1.0 -
    (
      0.18 +
      uGlitchIntensity *
      0.45
    );

  float tear =
    step(
      threshold,
      randomBand
    );

  float tearAmount =
    (
      hash(
        band + 13.7
      ) -
      0.5
    ) *
    tear *
    (
      0.25 +
      uGlitchIntensity *
      1.2
    );

  uv.x += tearAmount;

  elevation +=
    tearAmount *
    2.2;

  elevation =
    clamp(
      elevation,
      0.0,
      1.0
    );


  // ----------------------------------------------------
  // Neon terrain palette
  // ----------------------------------------------------

  vec3 deepBlue =
    vec3(
      0.02,
      0.05,
      0.25
    );

  vec3 cyan =
    vec3(
      0.0,
      0.75,
      0.95
    );

  vec3 magenta =
    vec3(
      1.0,
      0.12,
      0.55
    );

  vec3 orange =
    vec3(
      1.0,
      0.5,
      0.12
    );

  vec3 cream =
    vec3(
      1.0,
      0.88,
      0.62
    );


  vec3 color =
    deepBlue;

  color =
    mix(
      color,
      cyan,
      smoothstep(
        0.05,
        0.28,
        elevation
      )
    );

  color =
    mix(
      color,
      magenta,
      smoothstep(
        0.25,
        0.48,
        elevation
      )
    );

  color =
    mix(
      color,
      orange,
      smoothstep(
        0.45,
        0.68,
        elevation
      )
    );

  color =
    mix(
      color,
      cream,
      smoothstep(
        0.68,
        0.92,
        elevation
      )
    );


  // ----------------------------------------------------
  // RGB corruption inside glitch bands
  // ----------------------------------------------------

  float channelShift =
    tear *
    (
      0.15 +
      uGlitchIntensity *
      0.6
    );

  color.r =
    mix(
      color.r,
      color.b,
      channelShift *
      hash(
        band + 3.1
      )
    );

  color.g =
    mix(
      color.g,
      color.r,
      channelShift *
      hash(
        band + 5.9
      )
    );


  // ----------------------------------------------------
  // Fine digital grain
  // ----------------------------------------------------

  color +=
    (
      hash2(
        uv * 500.0 +
        uTime
      ) -
      0.5
    ) *
    0.06;


  // ----------------------------------------------------
  // Wireframe pass
  // ----------------------------------------------------

  if (uWire > 0.5) {
    vec3 wireColor =
      mix(
        vec3(
          0.1,
          0.9,
          0.4
        ),
        color,
        0.55
      );

    gl_FragColor =
      vec4(
        wireColor * 0.5,
        0.55
      );
  } else {
    gl_FragColor =
      vec4(
        color,
        1.0
      );
  }
}
