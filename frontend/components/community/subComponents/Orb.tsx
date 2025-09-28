"use client";
import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { useTheme } from "../ThemeProvider";

interface OrbProps {
  intensity?: number;
  speed?: number;
  complexity?: number;
  interactive?: boolean;
}

export default function EnhancedOrb({
  intensity = 1.0,
  speed = 1.0,
  complexity = 1.0,
  interactive = true,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const { colors } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const vertexShader = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float intensity;
    uniform float speed;
    uniform float complexity;
    uniform vec2 mouse;
    uniform float hover;
    varying vec2 vUv;

    // Noise functions
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    // HSV to RGB conversion
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // Multiple octaves of noise
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise3(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    float light(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    
    vec4 draw(vec2 uv) {
      // Mouse influence
      vec2 mouseInfluence = (mouse - 0.5) * 2.0 * hover * 0.3;
      uv += mouseInfluence;
      
      float len = length(uv);
      float angle = atan(uv.y, uv.x);
      
      // Dynamic noise with multiple octaves
      float timeOffset = iTime * speed;
      vec3 noisePos = vec3(uv * complexity, timeOffset);
      
      float noise1 = fbm(noisePos, 4);
      float noise2 = fbm(noisePos * 2.0 + vec3(100.0), 3);
      float noise3 = fbm(noisePos * 0.5 + vec3(200.0), 2);
      
      // Create dynamic radius
      float baseRadius = 0.4 + 0.2 * sin(timeOffset * 0.5);
      float dynamicRadius = baseRadius + 0.15 * noise1 + 0.1 * noise2;
      
      // Multiple energy sources
      vec2 pos1 = vec2(cos(timeOffset * 0.7), sin(timeOffset * 0.7)) * 0.3;
      vec2 pos2 = vec2(cos(timeOffset * -0.5 + 2.0), sin(timeOffset * -0.5 + 2.0)) * 0.2;
      vec2 pos3 = vec2(cos(timeOffset * 0.3 + 4.0), sin(timeOffset * 0.3 + 4.0)) * 0.4;
      
      float d1 = distance(uv, pos1);
      float d2 = distance(uv, pos2);
      float d3 = distance(uv, pos3);
      
      float energy1 = light(1.5 * intensity, 8.0, d1);
      float energy2 = light(1.2 * intensity, 6.0, d2);
      float energy3 = light(1.0 * intensity, 10.0, d3);
      
      // Main orb shape
      float orbMask = smoothstep(dynamicRadius * 1.2, dynamicRadius * 0.8, len);
      float glow = smoothstep(1.0, 0.3, len);
      
      // Color variations based on hue
      vec3 color1 = hsv2rgb(vec3(hue / 360.0, 0.8, 0.9));
      vec3 color2 = hsv2rgb(vec3((hue + 60.0) / 360.0, 0.7, 0.8));
      vec3 color3 = hsv2rgb(vec3((hue + 120.0) / 360.0, 0.6, 0.7));
      
      // Combine colors with noise
      vec3 finalColor = mix(color3, color1, orbMask);
      finalColor = mix(finalColor, color2, energy1 * 0.5);
      finalColor += color1 * energy2 * 0.3;
      finalColor += color3 * energy3 * 0.2;
      
      // Add noise variations
      finalColor += vec3(noise2 * 0.1, noise3 * 0.08, noise1 * 0.12);
      finalColor *= glow;
      
      // Interactive brightness boost
      finalColor *= 1.0 + hover * 0.3;
      
      finalColor = clamp(finalColor, 0.0, 1.0);
      
      return extractAlpha(finalColor);
    }
    
    void main() {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (vUv * iResolution.xy - center) / size * 2.0;
      
      vec4 col = draw(uv);
      gl_FragColor = vec4(col.rgb * col.a, col.a * 0.8);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        hue: { value: colors.orbHue },
        intensity: { value: intensity },
        speed: { value: speed },
        complexity: { value: complexity },
        mouse: { value: [0.5, 0.5] },
        hover: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + "px";
      gl.canvas.style.height = height + "px";
      program.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
      program.uniforms.mouse.value = [x, y];
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener("resize", resize);
    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    resize();

    let rafId: number;
    let lastTime = 0;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;
      lastTime = t;

      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.hue.value = colors.orbHue;
      program.uniforms.intensity.value = intensity;
      program.uniforms.speed.value = speed;
      program.uniforms.complexity.value = complexity;

      // Smooth hover transition
      const targetHover = isHovered ? 1 : 0;
      program.uniforms.hover.value +=
        (targetHover - program.uniforms.hover.value) * 0.05;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colors.orbHue, intensity, speed, complexity, interactive, isHovered]);

  return (
    <div
      ref={ctnDom}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}
