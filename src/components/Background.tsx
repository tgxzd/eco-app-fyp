'use client';

import { useEffect, useRef } from 'react';

interface BackgroundProps {
  variant?: 'minimal' | 'dark-minimal' | 'web3-emerald';
  className?: string;
}

export default function Background({ variant = 'web3-emerald', className = '' }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Minimal floating particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const getColors = () => {
      switch (variant) {
        case 'web3-emerald':
          return ['#10b981', '#059669', '#047857', '#065f46'];
        case 'dark-minimal':
          return ['#10b981', '#6b7280'];
        default:
          return ['#e5e7eb', '#9ca3af'];
      }
    };

    const colors = getColors();

    // Create fewer particles for minimal look
    const particleCount = variant === 'web3-emerald' ? 15 : 15;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.25 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Simple animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw simple dots
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variant]);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'web3-emerald':
        return 'bg-black';
      case 'dark-minimal':
        return 'bg-gradient-to-b from-slate-900 to-gray-900';
      default:
        return 'bg-gradient-to-b from-white to-gray-50';
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundClass()} ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Web3-style geometric elements */}
      {variant === 'web3-emerald' && (
        <>
          {/* No grid overlay */}
          
          {/* No glow effects */}

        </>
      )}
    </div>
  );
} 