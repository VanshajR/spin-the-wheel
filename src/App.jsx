import React, { useState } from 'react';
import { Settings as SettingsIcon, RotateCcw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Wheel from './components/Wheel';
import ItemList from './components/ItemList';
import CoinToss from './components/CoinToss';
import Settings from './components/Settings';
import ResultModal from './components/ResultModal';
import useStore from './store/useStore';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentView, setCurrentView] = useState('wheel'); // 'wheel' or 'coin'
  const { handleSpinResult, redoLastSpin, soundEnabled, items } = useStore();

  const handleSpinComplete = (selectedItem) => {
    setWinner(selectedItem);
    handleSpinResult(selectedItem);
    
    // Play sound if enabled
    if (soundEnabled) {
      playSound('win');
    }
  };

  const handleRedo = () => {
    redoLastSpin();
    setWinner(null);
    toast.info('Item restored! Spin again.', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const playSound = (type) => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'win') {
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log('Audio playback not supported');
    }
  };

  return (
    <div className="app">
      <ToastContainer />
      
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">🎡</span>
            Spin the Wheel
          </h1>
          
          {/* Navigation */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${currentView === 'wheel' ? 'active' : ''}`}
              onClick={() => setCurrentView('wheel')}
            >
              🎡 Spin Wheel
            </button>
            <button
              className={`nav-tab ${currentView === 'coin' ? 'active' : ''}`}
              onClick={() => setCurrentView('coin')}
            >
              🪙 Coin Toss
            </button>
          </nav>
          
          <button
            className="settings-button"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'wheel' ? (
          <div className="main-content">
            {/* Sidebar */}
            <aside className="sidebar">
              <ItemList />
            </aside>

            {/* Wheel Section */}
            <section className="wheel-section">
              <Wheel onSpinComplete={handleSpinComplete} />
              
              {items.length > 0 && (
                <div className="wheel-info">
                  <p className="item-count">
                    {items.length} {items.length === 1 ? 'item' : 'items'} on the wheel
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="coin-view">
            <CoinToss />
          </div>
        )}
      </main>

      {/* Settings Panel */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Result Modal */}
      <ResultModal
        winner={winner}
        onClose={() => setWinner(null)}
        onRedo={handleRedo}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>Made with ❤️ using React</p>
      </footer>
    </div>
  );
}

export default App;
