export default function Background() {
  const dots = [
    { size: 6,  left: 5,  delay: 0,   duration: 14 },
    { size: 4,  left: 12, delay: 2,   duration: 18 },
    { size: 7,  left: 22, delay: 5,   duration: 12 },
    { size: 5,  left: 33, delay: 1,   duration: 20 },
    { size: 6,  left: 45, delay: 7,   duration: 15 },
    { size: 4,  left: 55, delay: 3,   duration: 22 },
    { size: 5,  left: 65, delay: 9,   duration: 13 },
    { size: 6,  left: 75, delay: 4,   duration: 17 },
    { size: 7,  left: 84, delay: 6,   duration: 11 },
    { size: 4,  left: 92, delay: 11,  duration: 19 },
    { size: 5,  left: 18, delay: 13,  duration: 16 },
    { size: 6,  left: 40, delay: 8,   duration: 21 },
    { size: 4,  left: 58, delay: 15,  duration: 14 },
    { size: 5,  left: 70, delay: 10,  duration: 18 },
    { size: 6,  left: 88, delay: 12,  duration: 13 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Белый фон */}
      <div className="absolute inset-0" style={{ background: '#ffffff' }} />

      {/* Левое пятно — верхняя треть */}
      <div
        className="absolute rounded-full animate-pulse-slow"
        style={{
          width: 500,
          height: 500,
          top: '5%',
          left: '-8%',
          background: 'radial-gradient(circle, rgba(0,180,220,0.18) 0%, rgba(0,180,220,0.06) 55%, transparent 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Правое пятно — нижняя треть */}
      <div
        className="absolute rounded-full animate-pulse-slow"
        style={{
          width: 500,
          height: 500,
          bottom: '10%',
          right: '-8%',
          background: 'radial-gradient(circle, rgba(0,200,240,0.18) 0%, rgba(0,200,240,0.06) 55%, transparent 75%)',
          filter: 'blur(60px)',
          animationDelay: '3s',
        }}
      />

      {/* Пузырьки-пятнышки */}
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            width: d.size,
            height: d.size,
            left: `${d.left}%`,
            animationName: 'bubbleRise',
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            animationTimingFunction: 'ease-in',
            animationIterationCount: 'infinite',
            background: 'rgba(0,180,220,0.3)',
          }}
        />
      ))}
    </div>
  );
}
