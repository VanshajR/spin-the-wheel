import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import './Wheel.css';

const Wheel = ({ onSpinComplete }) => {
  const { items, isSpinning, setIsSpinning } = useStore();
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);

    // Calculate random winner
    const randomIndex = Math.floor(Math.random() * items.length);
    const winner = items[randomIndex];

    // Calculate rotation
    const segmentAngle = 360 / items.length;
    const winnerAngle = segmentAngle * randomIndex;
    
    // Add multiple full rotations + land on winner (pointing up, so subtract from 270)
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation + (spins * 360) + (270 - winnerAngle);

    setRotation(finalRotation);

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(winner);
    }, 4000);
  };

  const renderWheel = () => {
    if (items.length === 0) {
      return (
        <div className="empty-wheel">
          <p>Add items to start spinning!</p>
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
          // Adjust text radius to keep text away from outer edge
          let textRadius = 60;
          if (items.length > 15) textRadius = 50;
          else if (items.length > 10) textRadius = 55;
          
          const textX = 100 + textRadius * Math.cos(textAngle);
          const textY = 100 + textRadius * Math.sin(textAngle);
          // Rotate text to point along radius (add 90 to make it perpendicular to radius)
          const textRotation = midAngle - 90;
          
          // Dynamic font size based on number of items
          let fontSize = 12;
          if (items.length > 20) fontSize = 7;
          else if (items.length > 15) fontSize = 8;
          else if (items.length > 12) fontSize = 9;
          else if (items.length > 8) fontSize = 10;
          else if (items.length > 5) fontSize = 11;
          
          // Dynamic text length - keep it shorter to fit within sectors
          let maxLength = 15;
          if (items.length > 20) maxLength = 7;
          else if (items.length > 15) maxLength = 9;
          else if (items.length > 12) maxLength = 11;
          else if (items.length > 8) maxLength = 13;

          return (
            <g key={item.id}>
              <path d={pathData} fill={item.color} stroke="#fff" strokeWidth="2" />
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
        {/* Center circle */}
        <circle cx="100" cy="100" r="15" fill="#fff" stroke="#333" strokeWidth="2" />
        <circle cx="100" cy="100" r="8" fill="#333" />
      </svg>
    );
  };

  return (
    <div className="wheel-container">
      {/* Pointer - Arrow pointing down */}
      <div className="wheel-pointer">
        <svg width="50" height="70" viewBox="0 0 50 70">
          <defs>
            <filter id="arrowShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ff4444', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path 
            d="M 25 70 L 5 45 L 18 45 L 18 0 L 32 0 L 32 45 L 45 45 Z" 
            fill="url(#arrowGradient)" 
            filter="url(#arrowShadow)"
          />
        </svg>
      </div>

      {/* Wheel */}
      <motion.div
        ref={wheelRef}
        className="wheel"
        animate={{ rotate: rotation }}
        transition={{
          duration: 4,
          ease: [0.17, 0.67, 0.35, 0.96]
        }}
      >
        {renderWheel()}
      </motion.div>
      
      {/* Spin button - positioned over the wheel */}
      <button
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        onClick={spinWheel}
        disabled={isSpinning || items.length === 0}
      >
        {isSpinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
};

export default Wheel;
