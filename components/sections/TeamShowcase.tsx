"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CustomCursor from "@/components/shared/CustomCursor";

interface SocialLink {
  platform: "instagram" | "strava" | "linkedin" | "website" | "linktree";
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: SocialLink[];
}

const TEAM: TeamMember[] = [
  {
    id: "patrick",
    name: "Patrick Wingert",
    role: "Adaptive Athlete",
    bio: "Patrick lost his right leg below the knee on November 1, 2020, and rebuilt his life through endurance sport and relentless forward motion. In 2022, he became the first American and first below-knee amputee to complete the Trans Bhutan Trail, 403 kilometers across 12 Himalayan mountain passes. Today, he races triathlon as a member of the Dare2Tri Elite Development Team, chasing podium finishes and the next hard thing. When he's not training, he leads management teams across a portfolio of restaurants, chasing long miles on a motorcycle, or hitting golf balls.",
    image: "/team/pat_team.webp",
    social: [
      { platform: "linktree", url: "https://linktr.ee/patrickwingert" },
    ],
  },
  {
    id: "halee",
    name: "Halee Raff",
    role: "Social Media Manager",
    bio: "The one behind the lens documenting this whole ride. She captures the miles, the chaos, the training, and the races exactly as they are. No filters, no bullshit, just the reality behind the work. She's also Patrick's wife, his biggest supporter, and the only reason half of this story gets told at all.",
    image: "/team/Halee&Pat.webp",
  },
  {
    id: "kayla",
    name: "Kayla Wingert",
    role: "Fundraising & Sponsorship Coordinator",
    bio: "The strategist building Patrick's brand beyond the finish line. Kayla shapes the narrative, manages partnerships, and makes sure the mission reaches the people who need to hear it.",
    image: "/team/Kayla.webp",
  },
  {
    id: "nathaniel",
    name: "Nathaniel Daniels",
    role: "Developer & Designer",
    bio: "The architect behind everything you're looking at. Designed and built this site from scratch with every animation, every data integration, and every pixel of the experience.",
    image: "/team/Nathaniel.jpg",
    social: [
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/nathanieldaniels",
      },
    ],
  },
  {
    id: "david",
    name: "David Rotter",
    role: "Prosthetist / Jedi Master",
    bio: "The engineer behind the leg. David designs and builds the prosthetics that let Patrick live life his way, trek, and push beyond what anyone thought possible. Every stride starts with Dave's work.",
    image: "/team/Dave.jpg",
    social: [{ platform: "website", url: "https://www.rotterprosthetics.com/" }, { platform: "instagram", url: "https://www.instagram.com/davidrotterprosthetics/?hl=en" }],
  },
  {
    id: "keri",
    name: "Keri Serota",
    role: "Executive Director & Co-Founder of Dare2Tri",
    bio: "The friend who changed the trajectory. Keri introduced Patrick to Dare2Tri long before he lost his leg and became adaptive himself. After a 4 AM email from a hospital bed at Northwestern, Keri connected Patrick and Dave. Constant, gentle pressure from Keri opened the door to the world of paratriathlon, and one that Patrick didn't know existed for him. Without that push, none of this would have happened.",
    image: "/team/Keri.webp",
    social: [{ platform: "website", url: "https://www.dare2tri.org" }],
  },
];

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "instagram":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "strava":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "website":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "linktree":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.435 5.589c-.198-.444-.619-.444-.817 0l-3.376 7.552h-2.93l4.632-6.525c.29-.408.29-1.07 0-1.478l-3.793-5.342h9.529l-3.794 5.342c-.29.408-.29 1.07 0 1.478l4.632 6.525h-2.93l-3.376-7.552z" />
          <path d="M12.026 15.65c-.482 0-.872.417-.872.932v7.418h1.745v-7.418c0-.515-.39-.932-.873-.932z" />
        </svg>
      );
  }
}


const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const COLUMN_CONFIG = [
  { offset: "mt-0", photoClass: "w-full aspect-[3/4]" },
  { offset: "mt-[68px]", photoClass: "w-full aspect-[4/5]" },
  { offset: "mt-[32px]", photoClass: "w-full aspect-[3/4]" },
];

export default function TeamShowcase() {
  const [lockedId, setLockedId] = useState<string | null>("patrick");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId ?? lockedId;
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHoverEnter = useCallback((id: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredId(id);
  }, []);

  const handleHoverLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredId(null);
      hoverTimeout.current = null;
    }, 80);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const handleTap = (id: string) => {
    setLockedId((prev) => (prev === id ? null : id));
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-member="${id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const columns = [
    TEAM.filter((_, i) => i % 3 === 0),
    TEAM.filter((_, i) => i % 3 === 1),
    TEAM.filter((_, i) => i % 3 === 2),
  ];

  return (
    <div className="min-h-screen bg-[#050505] cursor-crosshair relative">
      <CustomCursor themeColor="#f97316" />

      <div className="max-w-[1400px] mx-auto px-6 py-24 lg:py-32">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-24"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-4">
            Built by those who believe
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.9] uppercase tracking-tight text-white">
            The Team Behind
            <br />
            <span className="text-orange-500">The Mission.</span>
          </h1>
        </motion.div>

        {/* ── Mobile: full-bleed stacked portraits ─────────────────────── */}
        <div className="flex flex-col gap-2 lg:hidden">
          {TEAM.map((member) => {
            const isActive = activeId === member.id;

            return (
              <div
                key={member.id}
                data-member={member.id}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                onClick={() => handleTap(member.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTap(member.id);
                  }
                }}
                className="relative aspect-[3/4] overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-500 ease-out"
                    style={{
                      filter: isActive
                        ? "grayscale(0) brightness(1)"
                        : "grayscale(1) brightness(0.7)",
                      opacity: isActive ? 1 : 0.7,
                    }}
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-zinc-900 to-black" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-3xl text-white/[0.07] text-center px-4 uppercase">
                        {member.name}
                      </span>
                    </div>
                  </>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 via-60% to-transparent px-5 pb-5 pt-24">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      animate={{
                        scale: isActive ? 1 : 0.8,
                        backgroundColor: isActive
                          ? "rgb(249, 115, 22)"
                          : "rgba(249, 115, 22, 0.3)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span
                      className="font-display text-lg uppercase tracking-wide transition-colors duration-300"
                      style={{
                        color: isActive ? "#f97316" : "rgba(255,255,255,0.8)",
                      }}
                    >
                      {member.name}
                    </span>

                    {isActive && member.social && member.social.length > 0 && (
                      <div className="flex items-center gap-1.5 ml-1">
                        {member.social.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded text-white/40 hover:text-orange-500 transition-colors duration-200"
                          >
                            <SocialIcon platform={link.platform} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="mt-1 pl-[14px] font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                    {member.role}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 pl-[14px] border-l-2 border-orange-500 ml-[2px] text-sm text-white/40 leading-relaxed">
                          {member.bio}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop: main layout ─────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-row items-start gap-12 lg:gap-16">
          <div className="flex flex-col flex-shrink-0 w-full lg:w-[60%]">
          <div className="flex gap-4 lg:gap-5">
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className={`flex flex-col gap-4 lg:gap-5 flex-1 ${COLUMN_CONFIG[colIdx].offset}`}
              >
                {col.map((member, rowIdx) => {
                  const globalIdx = rowIdx * 3 + colIdx;
                  const isActive = activeId === member.id;
                  const isDimmed = activeId !== null && !isActive;

                  return (
                    <div
                      key={member.id}
                      tabIndex={0}
                      role="button"
                      aria-label={member.name}
                      className={`relative ${COLUMN_CONFIG[colIdx].photoClass} overflow-hidden rounded-xl cursor-pointer transition-opacity duration-[400ms] outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50`}
                      style={{ opacity: isDimmed ? 0.6 : 1 }}
                      onMouseEnter={() => handleHoverEnter(member.id)}
                      onMouseLeave={handleHoverLeave}
                      onFocus={() => handleHoverEnter(member.id)}
                      onBlur={handleHoverLeave}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setLockedId((prev) =>
                            prev === member.id ? null : member.id,
                          );
                        }
                      }}
                    >
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-[filter] duration-500"
                          style={{
                            filter: isActive
                              ? "grayscale(0) brightness(1)"
                              : "grayscale(1) brightness(0.77)",
                          }}
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-zinc-900 to-black" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-xl lg:text-2xl text-white/[0.07] text-center px-2 uppercase">
                              {member.name}
                            </span>
                          </div>
                        </>
                      )}

                      <div
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-orange-500/25 to-transparent transition-opacity duration-500"
                        style={{ opacity: isActive ? 1 : 0 }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-24"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-display text-lg tracking-wide text-white/60 hover:text-white transition-colors duration-300 uppercase group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Main Site
            </Link>
          </motion.div>
          </div>

          <div className="flex flex-col flex-1 w-full lg:pt-1">
            {TEAM.map((member, i) => {
              const isActive = activeId === member.id;
              const isDimmed = activeId !== null && !isActive;

              return (
                <motion.div
                  key={member.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  tabIndex={0}
                  role="button"
                  aria-label={member.name}
                  className="cursor-pointer transition-opacity duration-300 py-3 lg:py-4 outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-lg"
                  style={{ opacity: isDimmed ? 0.5 : 1 }}
                  onMouseEnter={() => handleHoverEnter(member.id)}
                  onMouseLeave={handleHoverLeave}
                  onFocus={() => handleHoverEnter(member.id)}
                  onBlur={handleHoverLeave}
                  onClick={() =>
                    setLockedId((prev) =>
                      prev === member.id ? null : member.id,
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLockedId((prev) =>
                        prev === member.id ? null : member.id,
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="h-2.5 rounded-full flex-shrink-0"
                      animate={{
                        width: isActive ? 24 : 14,
                        backgroundColor: isActive
                          ? "rgb(249, 115, 22)"
                          : "rgba(249, 115, 22, 0.25)",
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />

                    <span
                      className="font-display text-2xl lg:text-3xl uppercase tracking-wide transition-colors duration-300"
                      style={{
                        color: isActive ? "#f97316" : "rgba(255,255,255,0.8)",
                      }}
                    >
                      {member.name}
                    </span>

                    {member.social && member.social.length > 0 && (
                      <div
                        className="flex items-center gap-1.5 ml-1 transition-all duration-300"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateX(0)"
                            : "translateX(-8px)",
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        {member.social.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded text-white/40 hover:text-orange-500 transition-colors duration-200"
                          >
                            <SocialIcon platform={link.platform} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="mt-1.5 pl-[30px] lg:pl-[38px] font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-white/30">
                    {member.role}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="pl-[30px] lg:pl-[38px] text-sm text-white/40 leading-relaxed overflow-hidden"
                      >
                        <span className="block pt-2">{member.bio}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Back navigation ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-24 lg:mt-32 lg:hidden"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-display text-lg tracking-wide text-white/60 hover:text-white transition-colors duration-300 uppercase group"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Main Site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
