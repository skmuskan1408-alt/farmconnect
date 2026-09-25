import React, { useMemo } from 'react';

interface ProduceItem {
  id: number;
  emoji: string;
  leftPercent: number;
  sizeRem: number;
  durationSec: number;
  delaySec: number;
  swayX: number;
  rotateMid: number;
  rotateEnd: number;
  opacity: number;
  blurPx: number;
}

const PRODUCE_EMOJIS = [
  '🍅', // Tomato
  '🥕', // Carrot
  '🥦', // Broccoli
  '🥬', // Cabbage / Leafy green
  '🌽', // Corn
  '🥔', // Potato
  '🍆', // Brinjal
  '🫑', // Capsicum
  '🍎', // Apple
  '🍊', // Orange
  '🍌', // Banana
  '🍇', // Grapes
  '🍉', // Watermelon
  '🥭', // Mango
  '🍓', // Strawberry
  '🍃', // Fresh Leaf
  '🌱', // Sprout
  '🌻', // Sunflower
];

export const AnimatedFarmBackground: React.FC = () => {
  // Generate 34 deterministic produce items for visual richness and zero hydration layout shifts
  const produceItems = useMemo<ProduceItem[]>(() => {
    const items: ProduceItem[] = [];
    const totalCount = 34;

    for (let i = 0; i < totalCount; i++) {
      const emojiIndex = i % PRODUCE_EMOJIS.length;
      // Evenly distribute horizontal positions with slight jitter
      const baseLeft = (i / totalCount) * 96;
      const jitter = ((i * 17) % 7) - 3;
      const leftPercent = Math.max(1, Math.min(97, baseLeft + jitter));

      // Vary duration (18s to 36s)
      const durationSec = 18 + ((i * 13) % 18);
      // Negative delay pre-populates screen on load
      const delaySec = -1 * ((i * 7.5) % durationSec);
      // Size between 1.2rem and 2.7rem
      const sizeRem = 1.2 + ((i * 9) % 15) * 0.1;
      // Sway X offset between 12px and 45px
      const swayX = 12 + ((i * 11) % 33);
      // Rotation angles
      const rotateMid = ((i * 47) % 180) - 90;
      const rotateEnd = 180 + ((i * 73) % 360);
      // Opacity between 0.14 and 0.38 for high readability
      const opacity = 0.14 + ((i * 5) % 10) * 0.024;
      // Depth blur for background elements
      const blurPx = i % 4 === 0 ? 1.5 : i % 7 === 0 ? 2 : 0;

      items.push({
        id: i,
        emoji: PRODUCE_EMOJIS[emojiIndex],
        leftPercent,
        sizeRem,
        durationSec,
        delaySec,
        swayX,
        rotateMid,
        rotateEnd,
        opacity,
        blurPx,
      });
    }
    return items;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{
        // Soft organic background glow behind all content
        background:
          'radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.04) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.03) 0%, transparent 45%)',
      }}
    >
      {/* Decorative subtle background organic shapes */}
      <div className="absolute top-10 left-[-5%] w-72 h-72 rounded-full bg-emerald-400/5 blur-3xl" />
      <div className="absolute bottom-20 right-[-5%] w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green-300/3 blur-[120px]" />

      {/* Showering Produce Items */}
      {produceItems.map((item) => (
        <span
          key={item.id}
          className="absolute top-0 animate-showering-produce transition-opacity duration-300"
          style={
            {
              left: `${item.leftPercent}%`,
              fontSize: `${item.sizeRem}rem`,
              filter: item.blurPx > 0 ? `blur(${item.blurPx}px)` : 'none',
              '--item-opacity': item.opacity,
              '--item-duration': `${item.durationSec}s`,
              '--item-delay': `${item.delaySec}s`,
              '--sway-x': `${item.swayX}px`,
              '--rotate-mid': `${item.rotateMid}deg`,
              '--rotate-end': `${item.rotateEnd}deg`,
            } as React.CSSProperties
          }
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
};
