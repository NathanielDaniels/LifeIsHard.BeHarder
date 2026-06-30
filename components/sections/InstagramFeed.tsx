'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { FeedPost } from '@/lib/instagram';

interface InstagramFeedProps {
  themeColor: string;
}

const PROFILE_URL = 'https://www.instagram.com/patwingit';

// Shown on first paint and whenever the live feed can't be reached, so the
// section never renders empty. Replaced by real posts once /api/instagram responds.
const PLACEHOLDER_POSTS: FeedPost[] = [
  { id: 'ph1', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', caption: 'Morning miles before the sun comes up.', permalink: PROFILE_URL, isVideo: false, timeLabel: '2d' },
  { id: 'ph2', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80', caption: 'Race day. Trust the process.', permalink: PROFILE_URL, isVideo: false, timeLabel: '5d' },
  { id: 'ph3', image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80', caption: 'Transition zone. Where it starts.', permalink: PROFILE_URL, isVideo: false, timeLabel: '1w' },
  { id: 'ph4', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80', caption: 'Trail therapy.', permalink: PROFILE_URL, isVideo: false, timeLabel: '1w' },
  { id: 'ph5', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', caption: '250 miles. 12 passes. One leg.', permalink: PROFILE_URL, isVideo: false, timeLabel: '2w' },
  { id: 'ph6', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', caption: 'The view from the top hits different.', permalink: PROFILE_URL, isVideo: false, timeLabel: '2w' },
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
  const [posts, setPosts] = useState<FeedPost[]>(PLACEHOLDER_POSTS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Track which card was revealed by touch so first tap reveals, second navigates
  const touchRevealedRef = useRef<string | null>(null);

  // Swap in the live feed on mount. On any failure the placeholders remain.
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/instagram?limit=6', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        // Replace on any valid array (incl. empty) so we never present the stock
        // placeholders as the real feed. A fetch/parse failure leaves placeholders.
        if (Array.isArray(data?.posts)) setPosts(data.posts);
      })
      .catch(() => {
        /* keep placeholders */
      });
    return () => controller.abort();
  }, []);

  const total = posts.length;

  const handleTouchStart = useCallback((e: React.TouchEvent, postId: string) => {
    if (touchRevealedRef.current === postId) return; // already revealed, let link navigate
    e.preventDefault();
    touchRevealedRef.current = postId;
    setHoveredId(postId);
  }, []);

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
            <p className="font-mono text-sm tracking-[0.1em] text-white/60">
              Training. Racing. Living.
            </p>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm tracking-[0.1em] transition-colors duration-200 hover:opacity-80"
              style={{ color: themeColor }}
            >
              @patwingit
            </a>
          </div>
        </motion.div>

        {/* DESKTOP: Angular sliced strip — full width, hover to expand + reveal caption.
            Hidden on mobile (md:flex) since it depends on hover. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="hidden md:flex w-full"
        >
          {posts.map((post, index) => {
            const isHovered = hoveredId === post.id;
            const hasHover = hoveredId !== null;

            return (
              <a
                key={post.id}
                href={post.permalink}
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
                onFocus={() => setHoveredId(post.id)}
                onBlur={() => setHoveredId(null)}
                onTouchStart={(e) => handleTouchStart(e, post.id)}
                aria-label={`Instagram post: ${post.caption || 'View on Instagram'}${post.timeLabel ? ` — ${post.timeLabel} ago` : ''}`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  {/* unoptimized on purpose: Instagram CDN URLs are signed + short-lived.
                      next/image caches optimized output by source URL, so it would serve or
                      re-fetch expired URLs and render broken tiles. Raw is the robust choice. */}
                  <Image
                    src={post.image}
                    alt={post.caption || 'Instagram post'}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className={`object-cover transition-all duration-700 ease-out ${
                      isHovered ? 'scale-105 brightness-110' : hasHover ? 'scale-100 brightness-50 grayscale-[30%]' : 'scale-100 brightness-75'
                    }`}
                  />
                </div>

                {/* Video indicator */}
                {post.isVideo && (
                  <div
                    className={`absolute top-4 left-4 md:top-5 md:left-5 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                      hasHover && !isHovered ? 'opacity-40' : 'opacity-90'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 md:w-3.5 md:h-3.5 translate-x-[1px]">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}

                {/* Bottom gradient for caption readability */}
                <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)',
                }} />

                {/* Caption slides up on hover.
                    Right padding clears the angular clip-path (SKEW) so text isn't
                    sliced by the diagonal edge; the bottom-right corner is the most inset. */}
                <div className={`absolute bottom-0 left-0 right-0 pt-4 pb-4 pl-4 pr-[6vw] md:pt-5 md:pb-5 md:pl-5 lg:pt-6 lg:pb-6 lg:pl-6 transition-all duration-500 ease-out ${
                  isHovered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}>
                  {post.timeLabel && (
                    <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] mb-1.5" style={{ color: `${themeColor}bb` }}>
                      {post.timeLabel}
                    </p>
                  )}
                  <p className="text-white/90 text-[11px] md:text-sm leading-relaxed line-clamp-2">
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

        {/* MOBILE: 2-col grid — touch-first, captions always visible (no hover dependency).
            Tapping a tile opens the post directly. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="md:hidden grid grid-cols-2 gap-1.5 px-4"
        >
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden"
              aria-label={`Instagram post: ${post.caption || 'View on Instagram'}${post.timeLabel ? ` — ${post.timeLabel} ago` : ''}`}
            >
              <Image
                src={post.image}
                alt={post.caption || 'Instagram post'}
                fill
                unoptimized
                sizes="50vw"
                className="object-cover"
              />

              {/* Video indicator */}
              {post.isVideo && (
                <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 translate-x-[1px]">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              {/* Always-on caption with bottom gradient for legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 38%, transparent 62%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {post.timeLabel && (
                  <p className="font-mono text-[8px] tracking-[0.2em] mb-1" style={{ color: `${themeColor}bb` }}>
                    {post.timeLabel}
                  </p>
                )}
                <p className="text-white/90 text-[10px] leading-snug line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
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
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 border transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: `${themeColor}44` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/70 group-hover:text-white/80 transition-colors duration-300">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="font-mono text-xs tracking-[0.2em] text-white/70 group-hover:text-white/80 transition-colors duration-300">
              FOLLOW ON INSTAGRAM
            </span>
            <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
