'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface InstagramFeedProps {
  themeColor: string;
}

// Placeholder posts until Instagram API key is configured
const PLACEHOLDER_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    caption: 'Morning miles before the sun comes up.',
    timestamp: '2d',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    caption: 'Race day. Trust the process.',
    timestamp: '5d',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    caption: 'Transition zone. Where it starts.',
    timestamp: '1w',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    caption: 'Trail therapy.',
    timestamp: '1w',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    caption: '250 miles. 12 passes. One leg.',
    timestamp: '2w',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    caption: 'The view from the top hits different.',
    timestamp: '2w',
  },
];

// Skew uses vw so the angle scales proportionally across viewports
// 3vw ≈ 40px on 1366px desktop, ≈ 11px on 375px mobile
const SKEW = '3vw';

function getClipPath(index: number, total: number): string {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (isFirst) {
    return `polygon(0 0, 100% 0, calc(100% - ${SKEW}) 100%, 0 100%)`;
  }
  if (isLast) {
    return `polygon(${SKEW} 0, 100% 0, 100% 100%, 0 100%)`;
  }
  return `polygon(${SKEW} 0, 100% 0, calc(100% - ${SKEW}) 100%, 0 100%)`;
}

export default function InstagramFeed({ themeColor }: InstagramFeedProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const total = PLACEHOLDER_POSTS.length;

  return (
    <section className="relative py-32 md:py-40">
      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 px-6 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12" style={{ backgroundColor: themeColor }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: themeColor }}>
              Follow the Journey
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] text-white mb-4">
            ON THE GROUND
          </h2>

          <div className="flex items-center gap-6">
            <p className="font-mono text-sm tracking-[0.1em] text-white/40">
              Training. Racing. Living.
            </p>
            <a
              href="https://www.instagram.com/patwingzzz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm tracking-[0.1em] transition-colors duration-200 hover:opacity-80"
              style={{ color: themeColor }}
            >
              @patwingzzz
            </a>
          </div>
        </motion.div>

        {/* Angular Sliced Strip - full width, no container padding */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex w-full"
        >
          {PLACEHOLDER_POSTS.map((post, index) => {
            const isHovered = hoveredId === post.id;
            const hasHover = hoveredId !== null;

            return (
              <a
                key={post.id}
                href="https://www.instagram.com/patwingzzz"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[45vh] md:h-[55vh] lg:h-[65vh] overflow-visible group transition-[flex] duration-500 ease-out"
                style={{
                  clipPath: getClipPath(index, total),
                  marginLeft: index === 0 ? 0 : `calc(-1 * ${SKEW})`,
                  zIndex: isHovered ? 10 : 1,
                  flex: isHovered ? '1.6 1 0%' : hasHover ? '0.88 1 0%' : '1 1 0%',
                }}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className={`object-cover transition-all duration-700 ease-out ${
                      isHovered ? 'scale-105 brightness-110' : hasHover ? 'scale-100 brightness-50 grayscale-[30%]' : 'scale-100 brightness-75'
                    }`}
                  />
                </div>

                {/* Bottom gradient for caption readability */}
                <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)',
                }} />

                {/* Caption slides up on hover */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 lg:p-6 transition-all duration-500 ease-out ${
                  isHovered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}>
                  <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] mb-1.5" style={{ color: `${themeColor}bb` }}>
                    {post.timestamp}
                  </p>
                  <p className="text-white/90 text-[11px] md:text-sm leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                {/* Corner frame marks */}
                <div
                  className={`absolute top-4 right-4 md:top-5 md:right-5 w-4 h-4 md:w-6 md:h-6 border-t border-r transition-opacity duration-300 ${
                    isHovered ? 'opacity-50' : 'opacity-0'
                  }`}
                  style={{ borderColor: themeColor }}
                />
                <div
                  className={`absolute bottom-4 left-4 md:bottom-5 md:left-5 w-4 h-4 md:w-6 md:h-6 border-b border-l transition-opacity duration-300 ${
                    isHovered ? 'opacity-50' : 'opacity-0'
                  }`}
                  style={{ borderColor: themeColor }}
                />
              </a>
            );
          })}
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 flex justify-center px-6"
        >
          <a
            href="https://www.instagram.com/patwingzzz"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 border transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: `${themeColor}44` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors duration-300">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="font-mono text-xs tracking-[0.2em] text-white/50 group-hover:text-white/80 transition-colors duration-300">
              FOLLOW ON INSTAGRAM
            </span>
            <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
