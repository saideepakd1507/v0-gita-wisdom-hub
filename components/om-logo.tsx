'use client';

import { motion } from 'framer-motion';

interface OmLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-2xl w-8 h-8',
  md: 'text-4xl w-12 h-12',
  lg: 'text-6xl w-16 h-16',
  xl: 'text-8xl w-24 h-24',
};

export function OmLogo({ size = 'md', animated = true, className = '' }: OmLogoProps) {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    animate: {
      scale: [1, 1.05, 1],
      filter: [
        'drop-shadow(0 0 10px oklch(0.80 0.16 85 / 0.5))',
        'drop-shadow(0 0 20px oklch(0.80 0.16 85 / 0.8))',
        'drop-shadow(0 0 10px oklch(0.80 0.16 85 / 0.5))',
      ],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  } : {};

  return (
    <Component
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] via-[oklch(0.80_0.16_85)] to-[oklch(0.70_0.18_50)] ${sizeClasses[size]} ${className}`}
      {...animationProps}
    >
      <span className="text-[oklch(0.12_0.02_280)] font-bold" style={{ fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.5rem' : size === 'lg' ? '2.5rem' : '4rem' }}>
        ॐ
      </span>
    </Component>
  );
}

export function OmLogoText({ className = '' }: { className?: string }) {
  return (
    <motion.span
      className={`om-symbol text-4xl font-bold ${className}`}
      animate={{
        textShadow: [
          '0 0 10px oklch(0.80 0.16 85 / 0.5)',
          '0 0 20px oklch(0.80 0.16 85 / 0.8)',
          '0 0 10px oklch(0.80 0.16 85 / 0.5)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ॐ
    </motion.span>
  );
}
