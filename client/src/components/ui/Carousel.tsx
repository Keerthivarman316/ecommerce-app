'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface CarouselProps {
    children: React.ReactNode;
    title: string;
}

export function Carousel({ title, children }: CarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative py-8">
            <div className="flex items-center justify-between mb-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                    {title}
                    <div className="h-px bg-slate-800 flex-1 ml-4 hidden sm:block"></div>
                </h2>

                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={scrollLeft}
                        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white hover:border-neon-blue hover:text-neon-blue transition-colors focus:outline-none"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white hover:border-neon-purple hover:text-neon-purple transition-colors focus:outline-none"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Left/Right Fade Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block"></div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-8 pt-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {React.Children.map(children, (child) => (
                        <div className="snap-start shrink-0 w-80 md:w-96">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
