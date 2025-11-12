import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import CasinoLever from './CasinoLever';
import './Wheel.css';

const Wheel = forwardRef(({ onSpinComplete }, ref) => {
  const { items, isSpinning, setIsSpinning, soundEnabled } = useStore();
  const [rotation, setRotation] = useState(0);
  const [isSlowingDown, setIsSlowingDown] = useState(false);
  const wheelRef = useRef(null);
  const tickSoundIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    resetRotation: () => {
      console.log('Resetting wheel rotation to 0');
      setRotation(0);
    }
  }));

  // Initialize audio context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Tick sound (roulette ball clicking)
  const playTickSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Softer, lower pitched tick sound
      oscillator.frequency.value = 400 + Math.random() * 100; // Lower frequency
      oscillator.type = 'sine'; // Smoother sound
      
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime); // Quieter
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Win sound (casino jackpot celebration)
  const playWinSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      
      // Softer, more pleasant chord progression
      const chords = [
        [261.63, 329.63, 392.00], // C major (lower octave)
        [293.66, 369.99, 440.00], // D major
        [329.63, 415.30, 493.88]  // E major
      ];
      
      chords.forEach((chord, chordIndex) => {
        chord.forEach((freq) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = audioContext.currentTime + (chordIndex * 0.25);
          gainNode.gain.setValueAtTime(0.1, startTime); // Quieter
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.5);
        });
      });

      // Add a softer celebratory note
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 523.25; // Middle C (lower)
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime); // Quieter
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
      }, 750);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setIsSlowingDown(false);

    // Calculate random winner
    const randomIndex = Math.floor(Math.random() * items.length);
    const winner = items[randomIndex];

    // Calculate rotation
    const segmentAngle = 360 / items.length;
    const winnerAngle = segmentAngle * randomIndex;
    
    // Add multiple full rotations + land on winner
    const spins = 8 + Math.random() * 4; // 8-12 full rotations for more drama
    const finalRotation = rotation + (spins * 360) + (270 - winnerAngle);

    setRotation(finalRotation);

    // Start tick sounds
    let tickInterval = 50; // Start fast
    const startTickSound = () => {
      playTickSound();
      tickSoundIntervalRef.current = setTimeout(() => {
        tickInterval += 5; // Gradually slow down
        if (tickInterval < 300) {
          startTickSound();
        }
      }, tickInterval);
    };
    startTickSound();

    // Mark as slowing down at 70% of animation
    setTimeout(() => {
      setIsSlowingDown(true);
    }, 2800);

    // Stop tick sounds and play win sound
    setTimeout(() => {
      if (tickSoundIntervalRef.current) {
        clearTimeout(tickSoundIntervalRef.current);
      }
      playWinSound();
    }, 4000);

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setIsSlowingDown(false);
      onSpinComplete(winner);
    }, 4200);
  };

  const renderWheel = () => {
    if (items.length === 0) {
      return (
        <div className="empty-wheel">
          <div className="empty-wheel-content">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h3>Ready to Spin!</h3>
            <p>Add entries to get started</p>
          </div>
        </div>
      );
    }

    const segmentAngle = 360 / items.length;

    return (
      <svg className="wheel-svg" viewBox="0 0 200 200">
        {items.map((item, index) => {
          const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
          const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

          const x1 = 100 + 100 * Math.cos(startAngle);
          const y1 = 100 + 100 * Math.sin(startAngle);
          const x2 = 100 + 100 * Math.cos(endAngle);
          const y2 = 100 + 100 * Math.sin(endAngle);

          const largeArcFlag = segmentAngle > 180 ? 1 : 0;

          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          // Calculate text position and size based on number of items
          const midAngle = index * segmentAngle + segmentAngle / 2;
          const textAngle = (midAngle - 90) * (Math.PI / 180);
          // Position text in the middle area of each segment
          let textRadius = 65;
          if (items.length > 20) textRadius = 65;
          else if (items.length > 15) textRadius = 65;
          else if (items.length > 10) textRadius = 65;
          
          const textX = 100 + textRadius * Math.cos(textAngle);
          const textY = 100 + textRadius * Math.sin(textAngle);
          // Rotate text to be readable - perpendicular to radius pointing outward
          const textRotation = items.length === 1 ? 0 : midAngle + 90;
          
          // Dynamic font size based on number of items
          let fontSize = 10;
          if (items.length > 20) fontSize = 7;
          else if (items.length > 15) fontSize = 8;
          else if (items.length > 12) fontSize = 9;
          else if (items.length > 8) fontSize = 9.5;
          
          // Dynamic text length - be more generous
          let maxLength = 20;
          if (items.length > 20) maxLength = 8;
          else if (items.length > 15) maxLength = 10;
          else if (items.length > 12) maxLength = 12;
          else if (items.length > 8) maxLength = 15;

          return (
            <g key={item.id}>
              <defs>
                <linearGradient id={`gradient-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: item.color, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: item.color, stopOpacity: 0.85 }} />
                </linearGradient>
              </defs>
              <path 
                d={pathData} 
                fill={`url(#gradient-${item.id})`} 
                stroke="#fff" 
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
              <text
                x={textX}
                y={textY}
                fill="#fff"
                fontSize={fontSize}
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textRotation} ${textX} ${textY})`}
                style={{ 
                  pointerEvents: 'none', 
                  userSelect: 'none',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.3px'
                }}
              >
                {item.name.length > maxLength ? item.name.substring(0, maxLength - 2) + '..' : item.name}
              </text>
            </g>
          );
        })}
        {/* Center hub - Roulette style with brass/chrome finish - SMALLER */}
        <defs>
          <radialGradient id="centerGradient">
            <stop offset="0%" style={{ stopColor: '#e8d4a0', stopOpacity: 1 }} />
            <stop offset="30%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#8b7355', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </radialGradient>
          <radialGradient id="innerHub">
            <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0a0a0a', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        {/* Outer brass ring */}
        <circle cx="100" cy="100" r="12" fill="url(#centerGradient)" stroke="#FFD700" strokeWidth="1.5" />
        {/* Middle dark ring */}
        <circle cx="100" cy="100" r="8" fill="url(#innerHub)" stroke="#8b7355" strokeWidth="0.8" />
        {/* Inner brass detail */}
        <circle cx="100" cy="100" r="5" fill="#1a1a1a" stroke="#FFD700" strokeWidth="1" />
        {/* Center dot */}
        <circle cx="100" cy="100" r="2" fill="#FFD700" stroke="#0a0a0a" strokeWidth="0.3" />
      </svg>
    );
  };

  return (
    <div className="wheel-container">
      {/* Pointer - Arrow pointing down */}
      <motion.div 
        className="wheel-pointer"
        style={{ left: '50%', marginLeft: '-25px' }}
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="50" height="70" viewBox="0 0 50 70" style={{ display: 'block' }}>
          <defs>
            <filter id="arrowShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path 
            d="M 25 70 L 5 45 L 18 45 L 18 0 L 32 0 L 32 45 L 45 45 Z" 
            fill="url(#arrowGradient)" 
            filter="url(#arrowShadow)"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Wheel */}
      <motion.div
        ref={wheelRef}
        className={`wheel ${isSpinning ? 'spinning' : ''} ${isSlowingDown ? 'slowing-down' : ''}`}
        animate={{ rotate: rotation }}
        transition={{
          duration: 4,
          ease: [0.33, 1, 0.68, 1] // Smooth ease-out for better deceleration
        }}
      >
        {renderWheel()}
      </motion.div>

      {/* Light bulbs around the wheel */}
      <div className="wheel-lights">
        {Array.from({ length: 24 }).map((_, index) => {
          const angle = (index * 360 / 24) * (Math.PI / 180);
          const x = 290 + 280 * Math.cos(angle - Math.PI / 2);
          const y = 290 + 280 * Math.sin(angle - Math.PI / 2);
          
          return (
            <div
              key={index}
              className={`light-bulb ${isSpinning ? 'flashing' : ''}`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 0.05}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Casino Lever - replaces spin button */}
      <CasinoLever 
        onPull={spinWheel}
        disabled={items.length === 0}
        isSpinning={isSpinning}
      />
    </div>
  );
});

export default Wheel;
