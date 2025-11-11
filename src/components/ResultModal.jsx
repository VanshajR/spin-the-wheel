import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, X as XIcon, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';
import './ResultModal.css';

const ResultModal = ({ winner, onClose, onRedo, isEliminationWinner = false }) => {
  const { gameMode, items } = useStore();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (!winner) return null;

  const isLastItem = items.length === 0 || isEliminationWinner;
  const isRewardMode = gameMode === 'reward';
  const isEliminationMode = gameMode === 'elimination';

  return (
    <AnimatePresence>
      <motion.div
        className="result-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Confetti for reward mode or final winner */}
        {showConfetti && (isRewardMode || isLastItem) && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={!isLastItem}
            numberOfPieces={isLastItem ? 500 : 200}
            gravity={0.3}
          />
        )}

        <motion.div
          className={`result-modal ${isLastItem ? 'winner' : ''}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            <XIcon size={24} />
          </button>

          <div className="result-content">
            {/* Icon/Animation */}
            <motion.div
              className="result-icon"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: isLastItem ? Infinity : 3,
                repeatDelay: 0.5,
              }}
            >
              {isLastItem ? (
                <Trophy size={80} className="trophy-icon" />
              ) : isRewardMode ? (
                <div className="reward-icon">🎁</div>
              ) : (
                <div className="elimination-icon">❌</div>
              )}
            </motion.div>

            {/* Title */}
            <h2 className="result-title">
              {isLastItem
                ? '🎉 WINNER! 🎉'
                : isRewardMode
                ? '🎊 Congratulations! 🎊'
                : '💥 Eliminated! 💥'}
            </h2>

            {/* Winner name */}
            <motion.div
              className="winner-name"
              style={{ backgroundColor: winner.color }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {winner.name}
            </motion.div>

            {/* Message */}
            <p className="result-message">
              {isLastItem
                ? 'The final victor has been chosen!'
                : isRewardMode
                ? 'You won this item!'
                : `This item has been eliminated!${items.length > 0 ? ` ${items.length} remaining.` : ''}`}
            </p>

            {/* Balloons animation for reward mode */}
            {isRewardMode && !isLastItem && (
              <div className="balloons">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="balloon"
                    style={{
                      left: `${20 + i * 15}%`,
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i],
                    }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: -100, opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Redo button */}
            {!isLastItem && onRedo && (
              <button className="redo-button" onClick={onRedo}>
                <RotateCcw size={20} />
                Undo & Spin Again
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultModal;
