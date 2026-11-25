import { DreamMood, SymbolicEntity } from '../types';

export class PromptGenerator {
  static generateVisualPrompt(
    title: string,
    mood: DreamMood,
    symbols: SymbolicEntity[]
  ): string {
    const symbolKeywords = symbols.map((s) => s.symbol).join(', ');

    let styleDescriptor = 'surrealist oil painting, Salvador Dali meets Moebius, volumetric ethereal mist';
    let lighting = 'cinematic bioluminescent glow, celestial raymarching';
    let palette = 'violet, deep indigo, iridescent teal';

    switch (mood) {
      case 'EUPHORIC':
        styleDescriptor = 'luminescent utopian fantasy landscape, golden hour dreamscape';
        lighting = 'radiant solar volumetric god-rays, floating particles';
        palette = 'warm amber, pastel gold, rose quartz';
        break;
      case 'MYSTICAL':
        styleDescriptor = 'cosmic mystical realism, sacred geometry, astral plane vista';
        lighting = 'nebula starlight illumination, ethereal aura halos';
        palette = 'ultramarine, cosmic purple, luminous cyan';
        break;
      case 'ANXIOUS':
        styleDescriptor = 'expressionist psychological thriller, distorted perspective, noir surrealism';
        lighting = 'high-contrast chiaroscuro, flickering neon haze';
        palette = 'cold gunmetal, toxic emerald, obsidian black';
        break;
      case 'NIGHTMARISH':
        styleDescriptor = 'dark gothic surrealism, Zdzislaw Beksinski aesthetic, colossal monolithic architecture';
        lighting = 'smoky ember shadows, pale blood moon illumination';
        palette = 'crimson, burnt umber, charcoal gray';
        break;
      case 'PEACEFUL':
      default:
        styleDescriptor = 'calm impressionist serene dreamscape, soft watercolor textures';
        lighting = 'gentle morning ambient diffusion, shimmering water reflections';
        palette = 'azure blue, sage green, pearl white';
        break;
    }

    return `Masterpiece digital art depicting "${title.slice(0, 80)}". Dominant symbolic elements: ${symbolKeywords || 'ethereal horizons'}. Art direction: ${styleDescriptor}. Lighting ambiance: ${lighting}. Palette tones: ${palette}. Hyper-detailed, 8K resolution, transcendent metaphysical depth.`;
  }

  static getProceduralPalette(mood: DreamMood): { background: string; accent: string; colors: string[] } {
    switch (mood) {
      case 'EUPHORIC':
        return {
          background: '#2b1055',
          accent: '#f59e0b',
          colors: ['#fbbf24', '#f43f5e', '#ec4899', '#fef08a']
        };
      case 'MYSTICAL':
        return {
          background: '#090a1e',
          accent: '#a855f7',
          colors: ['#8b5cf6', '#06b6d4', '#6366f1', '#c084fc']
        };
      case 'ANXIOUS':
        return {
          background: '#021f18',
          accent: '#10b981',
          colors: ['#059669', '#34d399', '#1e293b', '#047857']
        };
      case 'NIGHTMARISH':
        return {
          background: '#1c0303',
          accent: '#ef4444',
          colors: ['#dc2626', '#7f1d1d', '#991b1b', '#f87171']
        };
      case 'CONFUSED':
        return {
          background: '#130c2a',
          accent: '#818cf8',
          colors: ['#a78bfa', '#38bdf8', '#c084fc', '#4f46e5']
        };
      case 'PEACEFUL':
      default:
        return {
          background: '#031726',
          accent: '#38bdf8',
          colors: ['#0ea5e9', '#14b8a6', '#67e8f9', '#a5f3fc']
        };
    }
  }

  static getProceduralArtColors(mood: DreamMood, seed: number): {
    bgFrom: string;
    bgTo: string;
    accent: string;
    shapes: Array<{ cx: number; cy: number; r: number; color: string; opacity: number }>;
  } {
    const pseudoRand = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    let bgFrom = '#0f172a';
    let bgTo = '#1e1b4b';
    let accent = '#38bdf8';

    switch (mood) {
      case 'EUPHORIC':
        bgFrom = '#1e1b4b';
        bgTo = '#4c0519';
        accent = '#f59e0b';
        break;
      case 'MYSTICAL':
        bgFrom = '#09090b';
        bgTo = '#2e1065';
        accent = '#a855f7';
        break;
      case 'NIGHTMARISH':
        bgFrom = '#0a0a0a';
        bgTo = '#450a0a';
        accent = '#ef4444';
        break;
      case 'ANXIOUS':
        bgFrom = '#022c22';
        bgTo = '#0f172a';
        accent = '#10b981';
        break;
      case 'PEACEFUL':
      default:
        bgFrom = '#082f49';
        bgTo = '#0f172a';
        accent = '#38bdf8';
        break;
    }

    const shapes = [];
    for (let i = 0; i < 5; i++) {
      shapes.push({
        cx: Math.round(pseudoRand(i * 3) * 300),
        cy: Math.round(pseudoRand(i * 3 + 1) * 200),
        r: Math.round(30 + pseudoRand(i * 3 + 2) * 60),
        color: accent,
        opacity: parseFloat((0.15 + pseudoRand(i) * 0.25).toFixed(2)),
      });
    }

    return { bgFrom, bgTo, accent, shapes };
  }
}
