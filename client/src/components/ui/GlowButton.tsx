import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'blue' | 'purple' | 'red' | 'green';
    glowOnHoverOnly?: boolean;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ className, variant = 'blue', glowOnHoverOnly = false, children, ...props }, ref) => {

        const colorClasses = {
            blue: 'bg-neon-blue/20 text-blue-100 border-neon-blue',
            purple: 'bg-neon-purple/20 text-purple-100 border-neon-purple',
            red: 'bg-neon-red/20 text-red-100 border-neon-red',
            green: 'bg-neon-green/20 text-green-100 border-neon-green',
        };

        const glowColor = {
            blue: 'rgba(59, 130, 246, 0.6)',
            purple: 'rgba(139, 92, 246, 0.6)',
            red: 'rgba(239, 68, 68, 0.6)',
            green: 'rgba(16, 185, 129, 0.6)'
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 20px ${glowColor[variant]}, 0 0 40px ${glowColor[variant]}`,
                    backgroundColor: glowColor[variant].replace('0.6', '0.4'),
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                    boxShadow: !glowOnHoverOnly ? `0 0 10px ${glowColor[variant].replace('0.6', '0.3')}` : 'none',
                }}
                className={cn(
                    "relative px-6 py-2.5 rounded-lg border font-semibold tracking-wide transition-colors uppercase text-sm flex items-center justify-center gap-2 overflow-hidden",
                    colorClasses[variant],
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </motion.button>
        );
    }
);

GlowButton.displayName = "GlowButton";
