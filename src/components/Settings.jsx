import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Trophy, Trash2, Volume2, VolumeX } from 'lucide-react';
import useStore from '../store/useStore';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const {
    gameMode,
    setGameMode,
    removeAfterSpin,
    setRemoveAfterSpin,
    soundEnabled,
    setSoundEnabled,
  } = useStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="settings-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="settings-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="settings-header">
            <div className="settings-title-group">
              <SettingsIcon size={24} />
              <h2>Settings</h2>
            </div>
            <button className="close-settings" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="settings-content">
            {/* Game Mode */}
            <div className="setting-section">
              <h3 className="section-title">Game Mode</h3>
              <div className="mode-selector">
                <button
                  className={`mode-option ${gameMode === 'reward' ? 'active' : ''}`}
                  onClick={() => setGameMode('reward')}
                >
                  <Trophy size={24} />
                  <div className="mode-info">
                    <span className="mode-name">Reward Mode</span>
                    <span className="mode-desc">Celebrate each selection with confetti!</span>
                  </div>
                </button>
                <button
                  className={`mode-option ${gameMode === 'elimination' ? 'active' : ''}`}
                  onClick={() => setGameMode('elimination')}
                >
                  <Trash2 size={24} />
                  <div className="mode-info">
                    <span className="mode-name">Elimination Mode</span>
                    <span className="mode-desc">Remove items until one remains</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Remove After Spin (only for reward mode) */}
            {gameMode === 'reward' && (
              <div className="setting-section">
                <h3 className="section-title">Spin Behavior</h3>
                <label className="toggle-option">
                  <div className="toggle-info">
                    <span className="toggle-name">Remove after spin</span>
                    <span className="toggle-desc">
                      Remove selected item from wheel after each spin
                    </span>
                  </div>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={removeAfterSpin}
                      onChange={(e) => setRemoveAfterSpin(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
            )}

            {/* Sound */}
            <div className="setting-section">
              <h3 className="section-title">Audio</h3>
              <label className="toggle-option">
                <div className="toggle-info">
                  <span className="toggle-name">
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    Sound Effects
                  </span>
                  <span className="toggle-desc">
                    Play sounds during spins and results
                  </span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </label>
            </div>

            {/* Info */}
            <div className="setting-section info-section">
              <h3 className="section-title">How to Use</h3>
              <ul className="info-list">
                <li>Add items manually or upload an image with text</li>
                <li>Choose your game mode</li>
                <li>Click SPIN to randomly select an item</li>
                <li>Use the Undo button to restore the last selection</li>
                <li>Try the Coin Toss for quick decisions!</li>
              </ul>
            </div>

            {/* Creator Credit */}
            <div className="setting-section creator-section">
              <a 
                href="https://github.com/VanshajR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="creator-link"
              >
                <img 
                  src="https://vanshajraghuvanshi.me/static/media/logo.8014969c3f3cf76ced02.png" 
                  alt="VanshajR Logo" 
                  className="creator-logo"
                />
                <span className="creator-name">VanshajR</span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Settings;
