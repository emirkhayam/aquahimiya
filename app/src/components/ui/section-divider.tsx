import React from 'react';

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'slant' | 'triangle';
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  fromColor = '#FFFFFF',
  toColor = '#F8F9FA',
  flip = false,
  height = 'md'
}) => {
  const heightMap = {
    sm: 'h-16 md:h-20',
    md: 'h-24 md:h-32',
    lg: 'h-32 md:h-40',
    xl: 'h-40 md:h-48'
  };

  const heightClass = heightMap[height];

  const renderWaveDivider = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`wave-gradient-${fromColor}-${toColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <path
        d="M0,60 C300,100 600,20 900,60 C1050,80 1200,40 1200,40 L1200,120 L0,120 Z"
        fill={`url(#wave-gradient-${fromColor}-${toColor})`}
      />
    </svg>
  );

  const renderCurveDivider = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`curve-gradient-${fromColor}-${toColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <path
        d="M0,0 C0,0 300,120 600,120 C900,120 1200,0 1200,0 L1200,120 L0,120 Z"
        fill={`url(#curve-gradient-${fromColor}-${toColor})`}
      />
    </svg>
  );

  const renderSlantDivider = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`slant-gradient-${fromColor}-${toColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <polygon
        points="0,0 1200,80 1200,120 0,120"
        fill={`url(#slant-gradient-${fromColor}-${toColor})`}
      />
    </svg>
  );

  const renderTriangleDivider = () => (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`triangle-gradient-${fromColor}-${toColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <polygon
        points="600,0 0,120 1200,120"
        fill={`url(#triangle-gradient-${fromColor}-${toColor})`}
      />
    </svg>
  );

  const renderDivider = () => {
    switch (variant) {
      case 'wave':
        return renderWaveDivider();
      case 'curve':
        return renderCurveDivider();
      case 'slant':
        return renderSlantDivider();
      case 'triangle':
        return renderTriangleDivider();
      default:
        return renderWaveDivider();
    }
  };

  return (
    <div
      className={`relative ${heightClass} w-full pointer-events-none ${flip ? 'transform rotate-180' : ''}`}
      style={{ marginTop: '-1px', marginBottom: '-1px' }}
    >
      {renderDivider()}
    </div>
  );
};

// Gradient Overlay Component for smooth color transitions
interface GradientOverlayProps {
  from: string;
  to: string;
  direction?: 'to-bottom' | 'to-top' | 'to-right' | 'to-left';
  opacity?: number;
  height?: string;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  from,
  to,
  direction = 'to-bottom',
  opacity = 1,
  height = 'h-40'
}) => {
  return (
    <div
      className={`absolute left-0 right-0 ${height} pointer-events-none z-0`}
      style={{
        background: `linear-gradient(${direction}, ${from}, ${to})`,
        opacity: opacity
      }}
    />
  );
};

// Animated Wave Divider with flowing effect
export const AnimatedWaveDivider: React.FC<{
  fromColor?: string;
  toColor?: string;
  height?: 'sm' | 'md' | 'lg';
}> = ({
  fromColor = '#FFFFFF',
  toColor = '#F8F9FA',
  height = 'md'
}) => {
  const heightMap = {
    sm: 'h-16 md:h-20',
    md: 'h-24 md:h-32',
    lg: 'h-32 md:h-40'
  };

  return (
    <div className={`relative ${heightMap[height]} w-full overflow-hidden pointer-events-none`}>
      <svg
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`animated-gradient-${fromColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>

        {/* Layer 1 */}
        <path
          d="M0,60 C300,90 600,30 900,60 C1050,75 1200,45 1200,45 L1200,120 L0,120 Z"
          fill={`url(#animated-gradient-${fromColor})`}
          className="animate-wave-layer-1"
          opacity="0.5"
        />

        {/* Layer 2 */}
        <path
          d="M0,70 C200,40 400,90 600,70 C800,50 1000,90 1200,70 L1200,120 L0,120 Z"
          fill={toColor}
          className="animate-wave-layer-2"
          opacity="0.7"
        />

        {/* Layer 3 */}
        <path
          d="M0,80 C150,100 350,60 600,80 C900,100 1050,70 1200,90 L1200,120 L0,120 Z"
          fill={toColor}
          className="animate-wave-layer-3"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
