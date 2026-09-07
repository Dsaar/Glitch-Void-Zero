export const terrainVertex = /* glsl */ `
uniform float uTime;
uniform float uOffset;

varying float vElevation;
varying vec2 vUv;


// ------------------------------------------------------
// 3D simplex noise
// ------------------------------------------------------

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(
    1.0 / 6.0,
    1.0 / 3.0
  );

  const vec4 D = vec4(
    0.0,
    0.5,
    1.0,
    2.0
  );

  vec3 i = floor(
    v + dot(v, C.yyy)
  );

  vec3 x0 =
    v -
    i +
    dot(i, C.xxx);

  vec3 g =
    step(x0.yzx, x0.xyz);

  vec3 l =
    1.0 - g;

  vec3 i1 =
    min(g.xyz, l.zxy);

  vec3 i2 =
    max(g.xyz, l.zxy);

  vec3 x1 =
    x0 -
    i1 +
    C.xxx;

  vec3 x2 =
    x0 -
    i2 +
    2.0 * C.xxx;

  vec3 x3 =
    x0 -
    1.0 +
    3.0 * C.xxx;

  i = mod(i, 289.0);

  vec4 p =
    permute(
      permute(
        permute(
          i.z +
          vec4(
            0.0,
            i1.z,
            i2.z,
            1.0
          )
        ) +
        i.y +
        vec4(
          0.0,
          i1.y,
          i2.y,
          1.0
        )
      ) +
      i.x +
      vec4(
        0.0,
        i1.x,
        i2.x,
        1.0
      )
    );

  float n_ =
    1.0 / 7.0;

  vec3 ns =
    n_ * D.wyz -
    D.xzx;

  vec4 j =
    p -
    49.0 *
    floor(
      p *
      ns.z *
      ns.z
    );

  vec4 x_ =
    floor(j * ns.z);

  vec4 y_ =
    floor(
      j -
      7.0 * x_
    );

  vec4 x =
    x_ * ns.x +
    ns.yyyy;

  vec4 y =
    y_ * ns.x +
    ns.yyyy;

  vec4 h =
    1.0 -
    abs(x) -
    abs(y);

  vec4 b0 =
    vec4(
      x.xy,
      y.xy
    );

  vec4 b1 =
    vec4(
      x.zw,
      y.zw
    );

  vec4 s0 =
    floor(b0) * 2.0 +
    1.0;

  vec4 s1 =
    floor(b1) * 2.0 +
    1.0;

  vec4 sh =
    -step(
      h,
      vec4(0.0)
    );

  vec4 a0 =
    b0.xzyw +
    s0.xzyw *
    sh.xxyy;

  vec4 a1 =
    b1.xzyw +
    s1.xzyw *
    sh.zzww;

  vec3 p0 =
    vec3(a0.xy, h.x);

  vec3 p1 =
    vec3(a0.zw, h.y);

  vec3 p2 =
    vec3(a1.xy, h.z);

  vec3 p3 =
    vec3(a1.zw, h.w);

  vec4 norm =
    taylorInvSqrt(
      vec4(
        dot(p0, p0),
        dot(p1, p1),
        dot(p2, p2),
        dot(p3, p3)
      )
    );

  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m =
    max(
      0.6 -
      vec4(
        dot(x0, x0),
        dot(x1, x1),
        dot(x2, x2),
        dot(x3, x3)
      ),
      0.0
    );

  m = m * m;

  return 42.0 *
    dot(
      m * m,
      vec4(
        dot(p0, x0),
        dot(p1, x1),
        dot(p2, x2),
        dot(p3, x3)
      )
    );
}


// ------------------------------------------------------
// Terrain
// ------------------------------------------------------

void main() {
  vUv = uv;

  vec3 pos = position;

  // Makes the terrain effectively endless.
  float worldY =
    pos.y + uOffset;


  // ----------------------------------------------------
  // Layer several noise frequencies
  // ----------------------------------------------------

  float amplitude = 1.0;
  float frequency = 0.035;
  float noiseValue = 0.0;

  for (int i = 0; i < 5; i++) {
    noiseValue +=
      amplitude *
      snoise(
        vec3(
          pos.x * frequency,
          worldY * frequency,
          uTime * 0.005
        )
      );

    amplitude *= 0.5;
    frequency *= 2.15;
  }


  // ----------------------------------------------------
  // Turn noise into sharper mountain ridges
  // ----------------------------------------------------

  float ridged =
    1.0 -
    abs(noiseValue);

  float elevation =
    pow(ridged, 2.0) *
    22.0 -
    6.0;


  // ----------------------------------------------------
  // Carve a winding valley down the center
  // ----------------------------------------------------

  float valley =
    smoothstep(
      4.0,
      26.0,
      abs(
        pos.x +
        sin(worldY * 0.05) *
        8.0
      )
    );

  elevation =
    mix(
      -4.0,
      elevation,
      valley
    );


  // PlaneGeometry starts flat.
  // Displace its Z axis to create mountains.
  pos.z += elevation;


  // Send normalized height to the fragment shader.
  vElevation =
    clamp(
      (elevation + 6.0) / 24.0,
      0.0,
      1.0
    );


  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(pos, 1.0);
}
`;

export const terrainFragment = /* glsl */ `
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
`;