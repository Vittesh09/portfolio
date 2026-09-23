export const ARM_COUNT = 7;

/**
 * Organic but readable spiral: isotropic near the void, soft arms emerge outward.
 * Arms stay slightly uneven — not perfect pie-slice math.
 */
const spiralHelpers = /* glsl */ `
  const float ARM_COUNT = 7.0;
  // Arms start as a soft hint, then settle into silhouette farther out.
  const float ARM_BLEND_START = 1.85;
  const float ARM_BLEND_END = 6.2;

  float hash(vec2 value) {
    return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float armBaseAngle(float arm) {
    float equal = arm * (6.2831853 / ARM_COUNT);
    float drift = (hash(vec2(arm + 0.37, 17.3)) - 0.5) * 0.22;
    return equal + drift;
  }

  float armTwistRate(float arm) {
    return mix(1.42, 1.68, hash(vec2(arm + 0.11, 4.2)));
  }

  float armWidthScale(float arm) {
    return mix(0.88, 1.18, hash(vec2(arm + 0.55, 9.1)));
  }

  float spiralTargetAngle(float radius, float arm, float seed) {
    float twist = log(max(radius, 0.35)) * armTwistRate(arm);
    float span = clamp((radius - 0.8) / 8.0, 0.0, 1.0);
    float wiggle =
      sin(twist * 2.4 + arm * 1.7 + seed * 4.0) * mix(0.02, 0.12, span) +
      sin(twist * 5.1 + seed * 9.0) * mix(0.01, 0.05, span);
    return armBaseAngle(arm) + twist + wiggle;
  }

  // Mild density variation along arms — hint of filaments, not broken ribbons.
  float armFilament(float radius, float arm, float seed) {
    float twist = log(max(radius, 0.35)) * armTwistRate(arm);
    float clump = 0.5 + 0.5 * sin(twist * 3.1 + seed * 7.0 + arm);
    return mix(0.78, 1.0, clump);
  }
`;

export const positionComputeShader = /* glsl */ `
  uniform float uDelta;
  uniform float uTime;
  uniform float uHorizon;
  uniform float uOuterRadius;

  ${spiralHelpers}

  vec2 spawnPoint(float seed, float t, float cycle, vec2 uv) {
    float radius = mix(uHorizon + 0.14, uOuterRadius * 0.92, pow(t, mix(5.2, 2.8, seed)));

    float span = (radius - uHorizon) / max(0.001, uOuterRadius - uHorizon);
    float armBlend = smoothstep(uHorizon + ARM_BLEND_START, uHorizon + ARM_BLEND_END, radius);
    float arm = floor(seed * ARM_COUNT);
    float target = spiralTargetAngle(radius, arm, seed);
    float width = mix(0.06, 0.38, pow(span, 1.25)) * armWidthScale(arm);
    float scatter = (hash(uv + cycle + 2.7) - 0.5);
    float armAngle = target + scatter * width;
    float freeAngle = hash(uv + cycle + 1.7) * 6.2831853;
    float angle = mix(freeAngle, armAngle, armBlend);

    return vec2(cos(angle) * radius, sin(angle) * radius);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionData = texture2D(texturePosition, uv);
    vec4 velocityData = texture2D(textureVelocity, uv);
    vec3 nextPosition = positionData.xyz;
    float radius = length(nextPosition.xy);
    float stepDelta = uDelta;

    if (radius <= uHorizon + 0.04 || radius > uOuterRadius + 0.3) {
      float cycle = floor(uTime * 0.18);
      float seed = velocityData.w;
      float t = hash(uv.yx + cycle + 3.1);
      vec2 point = spawnPoint(seed, t, cycle, uv);
      float thickness = (hash(uv + cycle + 8.31) - 0.5) * mix(0.04, 0.18, seed);
      nextPosition = vec3(point, thickness);
      positionData.w = 1.0;
    } else {
      nextPosition += velocityData.xyz * stepDelta;
      positionData.w = 1.0;
    }

    gl_FragColor = vec4(nextPosition, positionData.w);
  }
`;

export const velocityComputeShader = /* glsl */ `
  uniform float uDelta;
  uniform float uTime;
  uniform float uHorizon;
  uniform float uOuterRadius;

  ${spiralHelpers}

  float gravityAt(float radius) {
    float gap = max(0.22, radius - uHorizon);
    return min(0.18, 0.042 / (gap * gap));
  }

  float wrapAngle(float angle) {
    return atan(sin(angle), cos(angle));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D(texturePosition, uv).xyz;
    vec4 velocityData = texture2D(textureVelocity, uv);
    vec3 velocity = velocityData.xyz;
    float radius = length(position.xy);
    float stepDelta = uDelta;
    float seed = velocityData.w;

    if (radius <= uHorizon + 0.04 || radius > uOuterRadius + 0.3) {
      float cycle = floor(uTime * 0.18);
      float t = hash(uv.yx + cycle + 3.1);
      float respawnRadius = mix(uHorizon + 0.14, uOuterRadius * 0.92, pow(t, 4.8));

      float span = (respawnRadius - uHorizon) / max(0.001, uOuterRadius - uHorizon);
      float armBlend = smoothstep(uHorizon + ARM_BLEND_START, uHorizon + ARM_BLEND_END, respawnRadius);
      float arm = floor(seed * ARM_COUNT);
      float target = spiralTargetAngle(respawnRadius, arm, seed);
      float width = mix(0.06, 0.38, pow(span, 1.25)) * armWidthScale(arm);
      float armAngle = target + (hash(uv + cycle + 2.7) - 0.5) * width;
      float freeAngle = hash(uv + cycle + 1.7) * 6.2831853;
      float angle = mix(freeAngle, armAngle, armBlend);

      float circularSpeed = min(0.38, sqrt(gravityAt(respawnRadius) * respawnRadius));
      circularSpeed *= mix(0.92, 1.05, hash(uv + cycle + 12.7));
      float radialDrift = (hash(uv + cycle + 19.4) - 0.7) * 0.003;
      velocity = vec3(
        -sin(angle) * circularSpeed + cos(angle) * radialDrift,
        cos(angle) * circularSpeed + sin(angle) * radialDrift,
        (hash(uv + cycle + 5.2) - 0.5) * 0.0012
      );
    } else {
      vec2 radial = position.xy / max(radius, 0.001);
      vec2 tangent = vec2(-radial.y, radial.x);
      float gravity = gravityAt(radius);
      float isco = uHorizon * 2.5;
      float plunge = radius < isco
        ? (isco - radius) / max(0.001, isco - uHorizon)
        : 0.0;
      float turbulence = sin(uTime * 0.12 + seed * 21.0 + radius * 0.5) * 0.00032;

      // Gradual arm suggestion — stronger farther out, never a hard lock.
      float armReveal = smoothstep(uHorizon + ARM_BLEND_START, uHorizon + ARM_BLEND_END, radius);
      armReveal = armReveal * armReveal * (3.0 - 2.0 * armReveal);
      if (armReveal > 0.01) {
        float arm = floor(seed * ARM_COUNT);
        float targetAngle = spiralTargetAngle(radius, arm, seed);
        float currentAngle = atan(position.y, position.x);
        float angleDiff = wrapAngle(currentAngle - targetAngle);
        float armPull = mix(0.02, 0.078, armReveal) * armReveal;
        velocity.xy -= tangent * angleDiff * (armPull + plunge * 0.025) * stepDelta;
      }

      velocity.xy += (-radial * gravity + tangent * turbulence) * stepDelta;

      float dragRate = 0.0018 + 0.004 / max(radius, 0.25) + plunge * plunge * 0.14;
      velocity *= max(0.0, 1.0 - dragRate * stepDelta);
      velocity.z *= max(0.0, 1.0 - uDelta * 0.35);

      float speed = length(velocity.xy);
      if (speed > 0.38) velocity.xy *= 0.38 / speed;
    }

    gl_FragColor = vec4(velocity, seed);
  }
`;

export const particleVertexShader = /* glsl */ `
  attribute vec2 aReference;
  attribute float aSize;
  attribute float aSeed;

  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHorizon;
  uniform float uOuterRadius;

  varying float vOpacity;
  varying float vAccent;
  varying float vTone;
  varying float vGlow;

  ${spiralHelpers}

  float wrapAngle(float angle) {
    return atan(sin(angle), cos(angle));
  }

  void main() {
    vec4 positionData = texture2D(uPositionTexture, aReference);
    vec3 velocity = texture2D(uVelocityTexture, aReference).xyz;
    vec3 pos = positionData.xyz;

    float radius = length(pos.xy);
    float angle = atan(pos.y, pos.x);
    float span = (radius - uHorizon) / max(0.001, uOuterRadius - uHorizon);

    float armReveal = smoothstep(uHorizon + ARM_BLEND_START, uHorizon + ARM_BLEND_END, radius);
    armReveal = armReveal * armReveal * (3.0 - 2.0 * armReveal);
    float arm = floor(aSeed * ARM_COUNT);
    float targetAngle = spiralTargetAngle(radius, arm, aSeed);
    float angleDiff = abs(wrapAngle(angle - targetAngle));
    float widthScale = armWidthScale(arm);
    float armInner = mix(0.1, 0.22, pow(clamp(span, 0.0, 1.0), 1.05)) * widthScale;
    float armOuter = mix(0.38, 0.95, pow(clamp(span, 0.0, 1.0), 1.0)) * widthScale;
    float armMask = 1.0 - smoothstep(armInner, armOuter, angleDiff);
    float filament = armFilament(radius, arm, aSeed);
    // Core stays full; arms emerge as a soft silhouette.
    float inArm = mix(1.0, armMask * filament, armReveal);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float perspective = clamp(15.0 / max(1.0, -mvPosition.z), 0.8, 2.4);

    float horizonFade = smoothstep(uHorizon + 0.04, uHorizon + 0.45, radius);
    float outerFade = 1.0 - smoothstep(uOuterRadius * 0.78, uOuterRadius, radius);
    float radialDensity = 1.0 - pow(clamp(span, 0.0, 1.0), 1.55);
    radialDensity = mix(0.08, 1.0, radialDensity);

    float nearGlow = 1.0 - smoothstep(uHorizon + 0.04, uHorizon + 3.4, radius);
    nearGlow *= nearGlow;

    vTone = mix(0.7, 1.0, aSeed);
    vAccent = mix(0.18, 0.7, nearGlow) * mix(0.42, 1.0, inArm) + nearGlow * 0.45;
    vGlow = nearGlow * mix(0.65, 1.0, aSeed);
    vOpacity =
      mix(0.26, 1.0, inArm) *
      horizonFade *
      outerFade *
      radialDensity *
      mix(0.55, 1.45, nearGlow);

    float speed = length(velocity.xy);
    float sizeBoost = 1.0 + nearGlow * 2.1 + clamp(speed * 0.5, 0.0, 0.28);
    gl_PointSize =
      aSize *
      sizeBoost *
      uPixelRatio *
      perspective *
      mix(0.68, 1.08, inArm) *
      mix(0.55, 1.0, radialDensity);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = /* glsl */ `
  precision highp float;

  varying float vOpacity;
  varying float vAccent;
  varying float vTone;
  varying float vGlow;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float distanceToCenter = length(centered);

    float coreWidth = mix(0.12, 0.24, vGlow);
    float edgeWidth = mix(0.38, 0.58, vGlow);
    float core = 1.0 - smoothstep(0.0, coreWidth, distanceToCenter);
    float edge = 1.0 - smoothstep(coreWidth * 0.55, edgeWidth, distanceToCenter);
    float alpha = (edge * mix(0.65, 0.88, vGlow) + core * mix(0.8, 1.1, vGlow)) * vOpacity;

    if (alpha < 0.025) discard;

    vec3 paper = vec3(vTone, vTone * 0.97, vTone * 0.92);
    vec3 ember = vec3(0.98, 0.28, 0.18);
    vec3 hot = vec3(1.0, 0.55, 0.32);
    vec3 accent = mix(ember, hot, vGlow);
    vec3 color = mix(paper, accent, clamp(vAccent + vGlow * 0.5, 0.0, 1.0));

    gl_FragColor = vec4(color, alpha);
  }
`;

export const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute float aTone;
  attribute float aDepth;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vOpacity;
  varying float vTone;
  varying float vWarm;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float perspective = clamp(22.0 / max(1.0, -mvPosition.z), 0.45, 2.6);
    float twinkle =
      0.78 +
      0.22 * sin(uTime * mix(0.28, 0.95, aSeed) + aSeed * 18.0);

    vTone = aTone;
    vWarm = step(0.86, aSeed) * 0.28;
    vOpacity = mix(0.35, 0.92, aSeed) * mix(1.0, 0.55, aDepth) * twinkle;

    gl_PointSize = aSize * uPixelRatio * perspective * mix(0.9, 1.35, aSeed);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragmentShader = /* glsl */ `
  precision highp float;

  varying float vOpacity;
  varying float vTone;
  varying float vWarm;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float distanceToCenter = length(centered);
    float core = 1.0 - smoothstep(0.0, 0.14, distanceToCenter);
    float edge = 1.0 - smoothstep(0.06, 0.48, distanceToCenter);
    float alpha = (edge * 0.75 + core * 1.0) * vOpacity;

    if (alpha < 0.02) discard;

    vec3 paper = vec3(vTone, vTone * 0.97, vTone * 0.93);
    vec3 ember = vec3(0.98, 0.42, 0.28);
    vec3 color = mix(paper, ember, vWarm * 0.45);

    gl_FragColor = vec4(color, alpha);
  }
`;
