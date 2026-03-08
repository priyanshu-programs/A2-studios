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
    const [phase, setPhase] = useState<'line' | 'expand' | 'done'>('line');

    useEffect(() => {
        // Phase 1: line stretches (0 → 1.1s)
        // Phase 2: line expands vertically (1.1s → 2.2s)
        const expandTimer = setTimeout(() => setPhase('expand'), 1100);
        const doneTimer = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 2200);

        return () => {
            clearTimeout(expandTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    if (phase === 'done') return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
            {/* THE LINE */}
            <motion.div
                className="bg-white"
                initial={{
                    width: 0,
                    height: 1,
                }}
                animate={
                    phase === 'expand'
                        ? {
                            width: '100vw',
                            height: '100vh',
                        }
                        : {
                            width: '60vw',
                            height: 1,
                        }
                }
                transition={
                    phase === 'expand'
                        ? {
                            duration: 0.9,
                            ease: [0.76, 0, 0.24, 1],
                        }
                        : {
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                        }
                }
            />
        </div>
    );
}
