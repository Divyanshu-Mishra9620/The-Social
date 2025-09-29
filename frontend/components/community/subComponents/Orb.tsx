"use client";
import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { useTheme } from "../ThemeProvider";

interface OrbProps {
  intensity?: number;
  speed?: number;
  interactive?: boolean;
}

export default function EnhancedOrb({
  intensity,
  speed = 0.3,
  interactive = false,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const { colors } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Use theme-based intensity if not provided
  const effectiveIntensity = intensity ?? colors.orbIntensity;

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
    uniform vec2 mouse;
    uniform float hover;
    varying vec2 vUv;

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

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.8;
      
      for (int i = 0; i < 4; i++) {
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
      // Subtle mouse influence
      vec2 mouseInfluence = (mouse - 0.5) * hover * 0.15;
      uv += mouseInfluence;
      
      float len = length(uv);
      
      // Slow, subtle animation
      float timeOffset = iTime * speed;
      vec3 noisePos = vec3(uv * 0.8, timeOffset);
      
      float noise1 = fbm(noisePos, 3);
      float noise2 = fbm(noisePos * 1.5 + vec3(100.0), 2);
      
      // Gentle, organic radius
      float baseRadius = 0.5 + 0.12 * sin(timeOffset * 0.3);
      float dynamicRadius = baseRadius + 0.08 * noise1;
      
      // Multiple soft energy sources
      vec2 pos1 = vec2(cos(timeOffset * 0.4), sin(timeOffset * 0.4)) * 0.25;
      vec2 pos2 = vec2(cos(timeOffset * -0.3 + 2.0), sin(timeOffset * -0.3 + 2.0)) * 0.2;
      
      float d1 = distance(uv, pos1);
      float d2 = distance(uv, pos2);
      
      float energy1 = light(intensity * 1.2, 5.0, d1);
      float energy2 = light(intensity * 0.8, 6.0, d2);
      
      // Soft orb shape
      float orbMask = smoothstep(dynamicRadius * 1.4, dynamicRadius * 0.6, len);
      float glow = smoothstep(1.2, 0.0, len);
      
      // Subtle color variations
      vec3 color1 = hsv2rgb(vec3(hue / 360.0, 0.5, 0.6));
      vec3 color2 = hsv2rgb(vec3((hue + 40.0) / 360.0, 0.4, 0.5));
      
      // Blend colors gently
      vec3 finalColor = mix(color2, color1, orbMask * 0.7);
      finalColor += color1 * energy1 * 0.3;
      finalColor += color2 * energy2 * 0.2;
      
      // Subtle noise variations
      finalColor += vec3(noise2 * 0.05);
      finalColor *= glow;
      
      // Minimal interactive brightness
      finalColor *= 1.0 + hover * 0.15;
      
      finalColor = clamp(finalColor, 0.0, 1.0);
      
      return extractAlpha(finalColor);
    }
    
    void main() {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (vUv * iResolution.xy - center) / size * 2.2;
      
      vec4 col = draw(uv);
      // More transparent for subtlety
      gl_FragColor = vec4(col.rgb * col.a, col.a * 0.5);
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
        intensity: { value: effectiveIntensity },
        speed: { value: speed },
        mouse: { value: [0.5, 0.5] },
        hover: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
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

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

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
      program.uniforms.intensity.value = effectiveIntensity;
      program.uniforms.speed.value = speed;

      // Smooth hover transition
      const targetHover = isHovered ? 1 : 0;
      program.uniforms.hover.value +=
        (targetHover - program.uniforms.hover.value) * 0.03;

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
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colors.orbHue, effectiveIntensity, speed, interactive, isHovered]);

  return (
    <div
      ref={ctnDom}
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: 0,
        pointerEvents: interactive ? "auto" : "none",
      }}
    />
  );
}
