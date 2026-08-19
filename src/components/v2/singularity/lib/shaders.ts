import { DISK_INNER, DISK_OUTER } from './constants';

export const starVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float size;
  attribute float twinkle;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = color;
    vTwinkle = sin(uTime * 2.5 + twinkle) * 0.5 + 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= (0.25 + vTwinkle * 0.75);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const horizonVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const horizonFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCameraPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vWorldPos);
    float fresnel = 1.0 - abs(dot(vNormal, viewDirection));
    fresnel = pow(fresnel, 2.5);
    vec3 glowColor = vec3(1.0, 0.4, 0.1);
    float pulse = sin(uTime * 2.5) * 0.15 + 0.85;
    gl_FragColor = vec4(glowColor * fresnel * pulse, fresnel * 0.4);
  }
`;

export const diskVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vRadius;
  varying vec2 vPolar;
  void main() {
    vUv = uv;
    vRadius = length(position.xy);
    vPolar = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const diskFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorHot;
  uniform vec3 uColorMid;
  uniform vec3 uColorAccent;
  uniform vec3 uColorEmber;
  uniform vec3 uColorOuter;
  uniform float uNoiseScale;
  uniform float uFlowSpeed;
  uniform float uDensity;

  varying vec2 vUv;
  varying float vRadius;
  varying vec2 vPolar;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    float normalizedRadius = smoothstep(${DISK_INNER.toFixed(2)}, ${DISK_OUTER.toFixed(2)}, vRadius);
    vec2 dir = normalize(vPolar + 1e-6);
    float vAngle = atan(dir.y, dir.x);

    float spiral = vAngle * 3.0 - (1.0 / (normalizedRadius + 0.1)) * 2.0;
    float flow = uTime * uFlowSpeed * (2.0 / (vRadius * 0.3 + 1.0));
    float wrapR = uNoiseScale * 0.28;
    vec2 wrapped = vec2(
      dir.x * cos(flow) - dir.y * sin(flow),
      dir.x * sin(flow) + dir.y * cos(flow)
    );
    vec3 noiseP = vec3(
      wrapped.x * wrapR + sin(spiral) * 0.1,
      vUv.y * 0.8 * uNoiseScale + cos(spiral) * 0.1,
      wrapped.y * wrapR
    );

    float n1 = snoise(noiseP + vec3(0.0, 0.0, uTime * 0.15));
    float n2 = snoise(noiseP * 3.0 + vec3(0.8, 0.0, uTime * 0.22));
    float n3 = snoise(noiseP * 6.0 + vec3(1.5, 0.0, uTime * 0.3));
    float n4 = snoise(noiseP * 11.0 + vec3(2.2, 0.0, uTime * 0.38));
    float noiseVal = n1 * 0.38 + n2 * 0.3 + n3 * 0.2 + n4 * 0.12;
    noiseVal = (noiseVal + 1.0) * 0.5;

    vec3 color = uColorOuter;
    color = mix(color, uColorEmber, smoothstep(0.0, 0.35, normalizedRadius));
    color = mix(color, uColorAccent, smoothstep(0.25, 0.6, normalizedRadius));
    color = mix(color, uColorMid, smoothstep(0.5, 0.78, normalizedRadius));
    color = mix(color, uColorHot, smoothstep(0.72, 0.95, normalizedRadius));

    color *= (0.5 + noiseVal * 1.0);
    float brightness = pow(1.0 - normalizedRadius, 1.0) * 3.5 + 0.5;
    brightness *= (0.3 + noiseVal * 2.2);
    float pulse = sin(uTime * 1.8 + normalizedRadius * 12.0 + vAngle * 2.0) * 0.15 + 0.85;
    brightness *= pulse;

    float alpha = uDensity * (0.2 + noiseVal * 0.9);
    alpha *= smoothstep(0.0, 0.15, normalizedRadius);
    alpha *= (1.0 - smoothstep(0.85, 1.0, normalizedRadius));
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color * brightness, alpha);
  }
`;

export const lensingFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 holePos0;
  uniform vec2 holePos1;
  uniform float holeCount;
  uniform float lensingStrength;
  uniform float lensingRadius;
  uniform float aspectRatio;
  uniform float chromaticAberration;
  varying vec2 vUv;

  vec2 lensOffset(vec2 screenPos, vec2 holePos) {
    vec2 toCenter = screenPos - holePos;
    toCenter.x *= aspectRatio;
    float dist = length(toCenter);

    float distortionAmount = lensingStrength / (dist * dist + 0.003);
    distortionAmount = clamp(distortionAmount, 0.0, 0.7);
    float falloff = smoothstep(lensingRadius, lensingRadius * 0.3, dist);
    distortionAmount *= falloff;

    vec2 offset = normalize(toCenter + 1e-5) * distortionAmount;
    offset.x /= aspectRatio;
    return offset;
  }

  void main() {
    vec2 screenPos = vUv;
    vec2 offset = lensOffset(screenPos, holePos0);
    if (holeCount > 1.5) {
      offset += lensOffset(screenPos, holePos1);
    }

    float r = texture2D(tDiffuse, screenPos - offset * (1.0 + chromaticAberration)).r;
    float g = texture2D(tDiffuse, screenPos - offset).g;
    float b = texture2D(tDiffuse, screenPos - offset * (1.0 - chromaticAberration)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export const textPlaneVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const textPlaneFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float a = tex.a * uOpacity;
    if (a < 0.01) discard;
    // Non-premultiplied output for NormalBlending
    gl_FragColor = vec4(tex.rgb, a);
  }
`;
