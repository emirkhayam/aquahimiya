import React from 'react';

interface DecorativeWavesProps {
  position?: 'top' | 'bottom' | 'both';
  variant?: 'subtle' | 'normal' | 'bold';
  animated?: boolean;
}

export const DecorativeWaves: React.FC<DecorativeWavesProps> = ({
  position = 'bottom',
  variant = 'normal',
  animated = true
}) => {
  const opacityMap = {
    subtle: 0.15,
    normal: 0.25,
    bold: 0.35
  };

  const opacity = opacityMap[variant];

  const WavesSVG = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#294D61" stopOpacity={opacity * 0.8} />
          <stop offset="50%" stopColor="#3a6a82" stopOpacity={opacity} />
          <stop offset="100%" stopColor="#5a8ba8" stopOpacity={opacity * 0.6} />
        </linearGradient>
        <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5a8ba8" stopOpacity={opacity * 0.5} />
          <stop offset="50%" stopColor="#3a6a82" stopOpacity={opacity * 0.7} />
          <stop offset="100%" stopColor="#294D61" stopOpacity={opacity * 0.4} />
        </linearGradient>
        <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a6a82" stopOpacity={opacity * 0.3} />
          <stop offset="50%" stopColor="#5a8ba8" stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor="#3a6a82" stopOpacity={opacity * 0.3} />
        </linearGradient>
      </defs>

      {/* Wave Layer 1 - Deep */}
      <path
        d="M0,60 C300,90 600,30 900,60 C1050,75 1200,45 1200,45 L1200,120 L0,120 Z"
        fill="url(#wave-grad-1)"
        className={animated ? 'animate-wave-layer-1' : ''}
      />

      {/* Wave Layer 2 - Mid */}
      <path
        d="M0,70 C200,40 400,90 600,70 C800,50 1000,90 1200,70 L1200,120 L0,120 Z"
        fill="url(#wave-grad-2)"
        className={animated ? 'animate-wave-layer-2' : ''}
      />

      {/* Wave Layer 3 - Surface */}
      <path
        d="M0,80 C150,100 350,60 600,80 C900,100 1050,70 1200,90 L1200,120 L0,120 Z"
        fill="url(#wave-grad-3)"
        className={animated ? 'animate-wave-layer-3' : ''}
      />
    </svg>
  );

  return (
    <>
      {(position === 'top' || position === 'both') && (
        <div className="absolute top-0 left-0 right-0 h-24 md:h-32 lg:h-40 pointer-events-none transform rotate-180">
          <WavesSVG />
        </div>
      )}

      {(position === 'bottom' || position === 'both') && (
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 lg:h-40 pointer-events-none">
          <WavesSVG />
        </div>
      )}
    </>
  );
};

// Water Droplet Decoration
export const WaterDroplets: React.FC<{ count?: number }> = ({ count = 15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 3;

        return (
          <div
            key={i}
            className="absolute opacity-40 animate-droplet-pulse"
            style={{
              width: `${size}px`,
              height: `${size * 1.4}px`,
              left: `${left}%`,
              top: `${top}%`,
              background: `linear-gradient(135deg, rgba(58, 106, 130, 0.6), rgba(41, 77, 97, 0.3))`,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Light Rays / Caustics Effect
export const WaterCaustics: React.FC<{ intensity?: 'low' | 'medium' | 'high' }> = ({
  intensity = 'medium'
}) => {
  const intensityMap = {
    low: 0.05,
    medium: 0.1,
    high: 0.15
  };

  const opacity = intensityMap[intensity];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="caustics-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.02"
              numOctaves="3"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02 0.02; 0.025 0.025; 0.02 0.02"
                dur="10s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.07
                      0 0 0 0 0.31
                      0 0 0 0 0.49
                      0 0 0 1 0"
            />
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#caustics-filter)"
          opacity={opacity}
        />
      </svg>
    </div>
  );
};
