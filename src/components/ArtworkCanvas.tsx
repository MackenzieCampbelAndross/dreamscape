import React, { useEffect, useRef } from 'react';
import { DreamMood, SymbolicEntity } from '../types';
import { PromptGenerator } from '../core/prompt_generator';

interface ArtworkCanvasProps {
  seed: number;
  mood: DreamMood;
  symbols: SymbolicEntity[];
  className?: string;
  width?: number;
  height?: number;
}

export const ArtworkCanvas: React.FC<ArtworkCanvasProps> = ({
  seed,
  mood,
  symbols,
  className = '',
  width = 400,
  height = 240
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = PromptGenerator.getProceduralPalette(mood);
    
    // Pseudo-random generator based on seed
    let s = seed % 2147483647;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, palette.background);
    bgGradient.addColorStop(1, '#05050e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw ethereal glow circles / orbs
    const numOrbs = 6 + Math.floor(rnd() * 6);
    for (let i = 0; i < numOrbs; i++) {
      const x = rnd() * width;
      const y = rnd() * height;
      const radius = 30 + rnd() * 80;
      const color = palette.colors[Math.floor(rnd() * palette.colors.length)];

      const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGrad.addColorStop(0, color + 'aa');
      radialGrad.addColorStop(0.7, color + '22');
      radialGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw celestial dream waves
    ctx.strokeStyle = palette.accent + '44';
    ctx.lineWidth = 2;
    for (let layer = 0; layer < 4; layer++) {
      ctx.beginPath();
      const waveOffset = rnd() * 100;
      const freq = 0.01 + rnd() * 0.015;
      for (let x = 0; x <= width; x += 10) {
        const y = height * 0.5 + Math.sin(x * freq + waveOffset + layer) * (30 + layer * 15);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw constellation points / stars
    const numStars = 40 + Math.floor(rnd() * 30);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < numStars; i++) {
      const sx = rnd() * width;
      const sy = rnd() * height;
      const sr = 0.5 + rnd() * 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw symbolic glyph / emblem in center if archetype or symbol exists
    if (symbols.length > 0) {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.strokeStyle = palette.accent + 'bb';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [seed, mood, symbols, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-xl shadow-inner w-full object-cover ${className}`}
    />
  );
};
