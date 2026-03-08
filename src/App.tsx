import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import Preloader from './Preloader';
import { TextRoll } from '@/src/components/ui/text-roll';
import Lenis from 'lenis';

// ════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════

const HERO_TEXT = "ATWO STUDIOS.";
const LETTER_STAGGER = 0.04;
const HERO_START = 0.5;
const NAV_START = 1.2;
const TAGLINE_START = 1.8;
const CTA_START = 2.2;
const PARTICLE_COUNT = 35;

// ════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ════════════════════════════════════════════════════════

function CustomCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 800, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 800, damping: 35 });
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-hover]')) setExpanded(true);
    };
    const out = () => setExpanded(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout', out);
    };
  }, []);

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: springX, y: springY }} />
      <motion.div className={`cursor-ring ${expanded ? 'expanded' : ''}`} style={{ x: ringX, y: ringY }} />
    </>
  );
}

// ════════════════════════════════════════════════════════
// FLOATING PARTICLES
// ════════════════════════════════════════════════════════

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function FloatingParticles() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, -160, -80, 0],
            x: [0, 30, -20, 40, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay + 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MAGNETIC ELEMENT
// ════════════════════════════════════════════════════════

function MagneticLink({ children, className }: { children: string; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <a
      href="#"
      className={`nav-magnetic ${className || ''}`}
      onMouseEnter={() => { setIsHovered(true); setKey(k => k + 1); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <TextRoll key={key} duration={0.25}>
          {children}
        </TextRoll>
      ) : (
        <span>{children}</span>
      )}
    </a>
  );
}

// ════════════════════════════════════════════════════════
// MAGNETIC BUTTON
// ════════════════════════════════════════════════════════

function MagneticButton({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <button
      className="bg-[#050304] text-white px-8 py-3 rounded-[25px] text-xl tracking-wider transition-colors duration-500 hover:bg-[#D60000] pointer-events-auto overflow-hidden min-w-[200px]"
      onMouseEnter={() => { setIsHovered(true); setKey(k => k + 1); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <TextRoll key={key} duration={0.25} transition={{ ease: [0.32, 0.72, 0, 1] }} exitClassName="text-white">
          {children}
        </TextRoll>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}

// ════════════════════════════════════════════════════════
// WORD-BY-WORD REVEAL
// ════════════════════════════════════════════════════════

function WordReveal({
  text,
  baseDelay,
  className,
}: {
  text: string;
  baseDelay: number;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className={`word-clip inline-block overflow-hidden align-top ${i !== words.length - 1 ? 'mr-[0.3em]' : ''}`}>
          <motion.span
            className="word-clip-inner inline-block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: 0.8,
              delay: baseDelay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function StaticWordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className={`word-clip inline-block overflow-hidden align-top ${i !== words.length - 1 ? 'mr-[0.3em]' : ''}`}>
          <span className="word-clip-inner inline-block">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════

export default function App() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollY, scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  // --- Option 3: Focus Pull Transforms ---
  // Dark overlay fades in over the background (GPU-accelerated, no blur for performance)
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 0.85]);

  // Title scales UP (towards user) and fades out
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 2]);
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  // Lower elements fade out immediately
  const lowerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Parallax transforms for background image
  const rawBgX = useTransform(mouseX, [0, 1], [15, -15]);
  const rawBgY = useTransform(mouseY, [0, 1], [10, -10]);
  const bgX = useSpring(rawBgX, { stiffness: 50, damping: 30 });
  const bgY = useSpring(rawBgY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Split hero text into letters
  const heroLetters = HERO_TEXT.split('');

  return (
    <>
      {/* ═══ PRELOADER ═══ */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <CustomCursor />
      <div className="grain-overlay" />

      <div
        ref={containerRef}
        className="relative w-full min-h-[200vh] bg-white overflow-x-hidden font-coolvetica-condensed selection:bg-[#D60000] selection:text-white"
      >
        {/* ═══ FIXED NAVIGATION ═══ */}
        <motion.nav
          className={`fixed z-[100] flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] top-[30px] md:top-[50px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] md:w-[calc(100%-122px)] max-w-[1318px] ${isScrolled
            ? 'bg-white/70 backdrop-blur-md px-6 py-4 md:px-10 md:py-5 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/5'
            : 'bg-transparent px-0 py-0 rounded-none shadow-none border-transparent'
            }`}
          initial={{ y: -100, opacity: 0 }}
          animate={!loading ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: NAV_START, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center w-full justify-between transition-all duration-500">
            {/* Logo */}
            <img
              src="https://framerusercontent.com/images/Acq7WjpojV3uh5WEQ5E3oSKxo.png"
              alt="Logo"
              className="w-[22px] h-[18px] object-fill shrink-0"
              referrerPolicy="no-referrer"
            />

            {/* Links Container (Middle) */}
            <div className={`hidden md:flex flex-grow items-center transition-all duration-500 ${isScrolled ? 'justify-evenly px-4 xl:px-8' : 'justify-start'}`}>
              <div className={`hidden md:block text-black text-xl tracking-wide transition-all duration-500 ${isScrolled ? '' : 'ml-6 md:ml-12'}`}>
                <MagneticLink>ABOUT US</MagneticLink>
              </div>

              <div className={`hidden md:block text-black text-xl tracking-wide transition-all duration-500 ${isScrolled ? '' : 'ml-8'}`}>
                <MagneticLink>WORK</MagneticLink>
              </div>

              {/* Spacer visible ONLY when NOT scrolled to push Services to the right */}
              <div className={`transition-all duration-500 ${isScrolled ? 'hidden' : 'flex-grow'}`} />

              <div className="hidden md:block text-black text-xl tracking-wide transition-all duration-500">
                <MagneticLink>SERVICES</MagneticLink>
              </div>
            </div>

            {/* Contact Us (Far Right) */}
            <div className={`hidden md:flex items-center shrink-0 text-black text-xl tracking-wide transition-all duration-500 ${isScrolled ? '' : 'ml-8'}`}>
              <MagneticLink>CONTACT US</MagneticLink>
            </div>
          </div>
        </motion.nav>

        {/* ═══ HERO SECTION ═══ */}
        <div className="relative w-full h-screen overflow-hidden">
          {/* MAIN CONTENT WRAPPER */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] md:w-[calc(100%-122px)] max-w-[1318px]">

            {/* ═══ BACKGROUND IMAGE with PARALLAX and BLUR ═══ */}
            <motion.div
              className="absolute inset-[-30px]"
              style={{ x: bgX, y: bgY }}
            >
              <motion.img
                src="https://framerusercontent.com/images/6URZ2O5PrmrxCXsXMCBs11izxU.jpg?width=4096&height=2286"
                alt="Background"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
                initial={{ scale: 1.3, opacity: 0 }}
                animate={!loading ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: 2,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              {/* Dark overlay that fades in on scroll */}
              <motion.div
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: darkOverlayOpacity }}
              />
            </motion.div>

            {/* ═══ FLOATING PARTICLES ═══ */}
            <FloatingParticles />



            {/* ═══ HERO TITLE — LETTER-BY-LETTER STAGGER ═══ */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 mix-blend-difference pointer-events-none w-full text-center flex justify-center items-center"
              style={{ scale: titleScale, opacity: titleOpacity }}
            >
              <h1 className="font-coolvetica-heavy text-[22vw] md:text-[280px] lg:text-[367px] leading-[0.8] text-white tracking-normal whitespace-nowrap select-none">
                {heroLetters.map((letter, i) => (
                  <span key={i} className="letter-mask">
                    <motion.span
                      className="letter-inner"
                      initial={{
                        y: '120%',
                        rotate: 8,
                        opacity: 0,
                      }}
                      animate={!loading ? {
                        y: '0%',
                        rotate: 0,
                        opacity: 1,
                      } : {}}
                      transition={{
                        duration: 0.7,
                        delay: HERO_START + i * LETTER_STAGGER,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </motion.div>

            {/* ═══ BOTTOM LEFT — TAGLINES ═══ */}
            <div className="absolute bottom-[30px] left-0 w-full pointer-events-none">
              {/* Difference Layer */}
              <motion.div
                className="mix-blend-difference text-white"
                style={{ opacity: lowerOpacity }}
              >
                <p className="text-[clamp(16px,2vw,20px)] tracking-wider leading-tight">
                  <WordReveal text="NO CAMERA, NO CREW." baseDelay={TAGLINE_START} />
                  <br />
                  <WordReveal text="JUST CREATIVE DIRECTION." baseDelay={TAGLINE_START + 0.25} />
                </p>
                <p className="text-[clamp(18px,2.5vw,24px)] tracking-wider leading-tight mt-4 md:mt-6">
                  <WordReveal text="STAND OUT," baseDelay={TAGLINE_START + 0.5} />
                  {' '}
                  <span className="relative inline-block">
                    <WordReveal text="DONT BLEND IN" baseDelay={TAGLINE_START + 0.65} />
                  </span>
                  <span className="word-clip inline-block overflow-hidden align-top">
                    <motion.span
                      className="word-clip-inner inline-block"
                      initial={{ y: '110%' }}
                      animate={!loading ? { y: '0%' } : {}}
                      transition={{
                        duration: 0.8,
                        delay: TAGLINE_START + 0.65 + 2 * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      .
                    </motion.span>
                  </span>
                </p>
              </motion.div>

              {/* Red Strikethrough Layer */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ opacity: lowerOpacity }}
              >
                <p className="text-[clamp(16px,2vw,20px)] tracking-wider leading-tight opacity-0 select-none">
                  <StaticWordReveal text="NO CAMERA, NO CREW." />
                  <br />
                  <StaticWordReveal text="JUST CREATIVE DIRECTION." />
                </p>
                <p className="text-[clamp(18px,2.5vw,24px)] tracking-wider leading-tight mt-4 md:mt-6">
                  <span className="opacity-0 select-none"><StaticWordReveal text="STAND OUT," /></span>
                  {' '}
                  <span className="relative inline-block">
                    <span className="opacity-0 select-none"><StaticWordReveal text="DONT BLEND IN" /></span>
                    <motion.span
                      className="strike-line"
                      initial={{ width: '0%' }}
                      animate={!loading ? { width: '100%' } : {}}
                      transition={{
                        duration: 0.6,
                        delay: TAGLINE_START - 0.9, // 2s earlier than previous TAGLINE_START + 1.1
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </span>
                  <span className="opacity-0 select-none">.</span>
                </p>
              </motion.div>
            </div>

            {/* ═══ BOTTOM RIGHT — CTA BUTTON ═══ */}
            <motion.div
              className="absolute bottom-[30px] right-0 z-20 flex items-end overflow-hidden pb-1"
              style={{ opacity: lowerOpacity }}
            >
              <motion.div
                initial={{ y: '110%' }}
                animate={!loading ? { y: '0%' } : {}}
                transition={{
                  duration: 0.8,
                  delay: NAV_START, // Same time as navbar
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <MagneticButton>VIEW OUR WORK</MagneticButton>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* ═══ DUMMY CONTENT FOR SCROLLING DEMO ═══ */}
        <div className="w-full h-screen bg-[#FDFDFD] flex items-center justify-center relative border-t border-black/5">
          <h2 className="text-4xl text-black font-coolvetica-heavy tracking-wider opacity-30">SCROLL DOWN MORE</h2>
          <FloatingParticles />
        </div>
      </div >
    </>
  );
}
