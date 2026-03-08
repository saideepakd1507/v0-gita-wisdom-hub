'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function DivineParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 2 + Math.random() * 4,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="divine-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingLotus() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating lotus petals */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 30}%`,
            transform: `rotate(${i * 72}deg)`,
            animation: `float ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path
              d="M30 5C30 5 15 20 15 35C15 50 30 55 30 55C30 55 45 50 45 35C45 20 30 5 30 5Z"
              fill="url(#lotus-gradient)"
            />
            <defs>
              <linearGradient id="lotus-gradient" x1="30" y1="5" x2="30" y2="55" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD700" stopOpacity="0.6" />
                <stop offset="1" stopColor="#FF8C00" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
