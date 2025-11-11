import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CasinoLever.css';

const CasinoLever = ({ onPull, disabled, isSpinning }) => {
  const [isPulling, setIsPulling] = useState(false);

  const handlePull = () => {
    if (disabled || isSpinning || isPulling) return;

    setIsPulling(true);
    
    // Delay the onPull callback to sync with animation
    setTimeout(() => {
      onPull();
    }, 200);

    // Reset lever after full animation
    setTimeout(() => {
      setIsPulling(false);
    }, 800);
  };

  return (
    <div className="casino-lever-container">
      <div className="lever-base">
        {/* Indicator lights */}
        <div className="lever-lights">
          <div className={`lever-light ${isSpinning ? 'active' : ''}`}></div>
          <div className={`lever-light ${isSpinning ? 'active' : ''}`}></div>
          <div className={`lever-light ${isSpinning ? 'active' : ''}`}></div>
        </div>

        {/* Lever slot */}
        <div className="lever-slot">
          {/* Lever handle */}
          <motion.div
            className={`lever-handle ${disabled ? 'disabled' : ''}`}
            onClick={handlePull}
            animate={{
              top: isPulling ? '65%' : '5%'
            }}
            transition={{
              duration: isPulling ? 0.15 : 0.4,
              ease: isPulling ? [0.6, 0.01, 0.05, 0.95] : [0.34, 1.56, 0.64, 1]
            }}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: disabled || isSpinning ? 'not-allowed' : 'pointer'
            }}
          >
            {/* Red ball */}
            <div className="lever-ball"></div>
            {/* Chrome rod */}
            <div className="lever-rod"></div>
          </motion.div>
        </div>
      </div>

      {/* Label */}
      <div className="lever-label">
        {isSpinning ? 'SPINNING!' : disabled ? 'ADD ITEMS' : 'PULL'}
      </div>
    </div>
  );
};

export default CasinoLever;
