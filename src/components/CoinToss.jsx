import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CoinToss.css';

const CoinToss = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState('heads'); // Default showing heads
  const [rotations, setRotations] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [flipKey, setFlipKey] = useState(0); // Key to force re-render and reset animation

  const flipCoin = () => {
    if (isFlipping) return;

    // Reset animation by incrementing key
    setFlipKey(prev => prev + 1);
    setIsFlipping(true);
    setHasFlipped(false); // Hide result during flip

    // Random result
    const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Calculate rotations (multiple flips + final result)
    const baseRotations = 6 + Math.random() * 2; // 6-8 full flips
    // Heads = 0° or 360°, Tails = 180°
    // Make sure we end on the correct face
    const finalRotation = coinResult === 'heads' ? 360 : 180;
    const totalRotation = (baseRotations * 360) + finalRotation;

    setRotations(totalRotation);

    // Show result after animation - match the visual state
    setTimeout(() => {
      setResult(coinResult);
      setHasFlipped(true);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div className="coin-toss-container">
      <h3 className="coin-toss-title">🪙 Coin Toss</h3>
      
      <div className="coin-wrapper">
        <motion.div
          key={flipKey} // Force re-render to reset animation
          className="coin"
          initial={{ rotateX: 0 }}
          animate={{ 
            rotateX: rotations,
            scale: isFlipping ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotateX: {
              duration: 2,
              ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease out
            },
            scale: {
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeOut"
            }
          }}
        >
          <div className="coin-face heads">
            <div className="coin-content">H</div>
          </div>
          <div className="coin-face tails">
            <div className="coin-content">T</div>
          </div>
        </motion.div>
      </div>

      {hasFlipped && !isFlipping && (
        <motion.div
          className="coin-result"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200,
            damping: 15,
            duration: 0.6 
          }}
        >
          <span className="result-text">
            {result === 'heads' ? '👑 HEADS!' : '🎯 TAILS!'}
          </span>
        </motion.div>
      )}

      <button
        className={`flip-button ${isFlipping ? 'flipping' : ''}`}
        onClick={flipCoin}
        disabled={isFlipping}
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
    </div>
  );
};

export default CoinToss;
