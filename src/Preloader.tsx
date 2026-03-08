import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

// ════════════════════════════════════════════════════════
// "THE LINE" — Minimal Preloader
//
// Black screen.
// A single horizontal line appears at dead center.
// It stretches to full width.
// Then it expands vertically — becoming the white
// background of the page, swallowing the black.
// Done. Nothing else.
// ════════════════════════════════════════════════════════

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'start' | 'loading' | 'expand' | 'done'>('start');

    useEffect(() => {
        // Phase 1: progress bar fills fluidly (0 → 2s)
        const loadTimer = setTimeout(() => setPhase('loading'), 100);
        // Phase 2: progress reaches 100% and then whole container expands vertically & horizontally (2.1s → 3.0s)
        const expandTimer = setTimeout(() => setPhase('expand'), 2100);
        // Phase 3: Transition done
        const doneTimer = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 3000);

        return () => {
            clearTimeout(loadTimer);
            clearTimeout(expandTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    if (phase === 'done') return null;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black gap-4">
            {/* BRAND TEXT */}
            <motion.h1
                className="text-white font-coolvetica-heavy text-4xl tracking-widest"
                animate={
                    phase === 'start' || phase === 'loading'
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 1.1 } // Fades out gently as bar expands
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                ATWO STUDIOS
            </motion.h1>

            {/* THE LOADING BAR CONTAINER (Outlined Box) */}
            <motion.div
                className="overflow-hidden flex items-center"
                initial={{
                    width: 300,
                    height: 40,
                    padding: 4,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                }}
                animate={
                    phase === 'start' || phase === 'loading'
                        ? {
                            width: 300,
                            height: 40,
                            padding: 4,
                            borderWidth: 2,
                            borderColor: 'rgba(255, 255, 255, 1)',
                            backgroundColor: 'rgba(0, 0, 0, 0)', // Keeps it transparent initially
                        }
                        : phase === 'expand'
                            ? {
                                width: '100vw',
                                height: '100vh',
                                padding: 0,
                                borderWidth: 0,
                                borderColor: 'rgba(255, 255, 255, 0)',
                                backgroundColor: 'rgba(255, 255, 255, 1)', // Expands to pure white background
                            }
                            : {}
                }
                transition={
                    phase === 'expand'
                        ? {
                            duration: 0.9,
                            ease: [0.76, 0, 0.24, 1], // Same snappy pop to rectangle
                        }
                        : { duration: 0.1 }
                }
            >
                {/* THE LOADING FILL */}
                <motion.div
                    className="h-full bg-white origin-left"
                    initial={{ width: '0%' }}
                    animate={
                        phase === 'start'
                            ? { width: '0%' }
                            : phase === 'expand'
                                ? { width: '100%' } // Immediately snap to 100% during expand phase
                                : { width: ['0%', '35%', '70%', '100%'] } // Fluid progress loading
                    }
                    transition={
                        phase === 'expand'
                            ? { duration: 0 } // Snap to full so parent handles the smooth scale
                            : phase === 'loading'
                                ? {
                                    duration: 1.8,
                                    times: [0, 0.35, 0.75, 1], // Realistic pauses in loading
                                    ease: "easeInOut",
                                }
                                : { duration: 0 }
                    }
                />
            </motion.div>
        </div>
    );
}
