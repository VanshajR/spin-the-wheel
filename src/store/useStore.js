import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Wheel items - start empty
  items: [],
  
  // Game mode: 'reward' or 'elimination'
  gameMode: 'reward',
  
  // Settings
  removeAfterSpin: false,
  soundEnabled: true,
  
  // Wheel state
  isSpinning: false,
  selectedItem: null,
  lastWinner: null,
  
  // History
  spinHistory: [],
  
  // Add item
  addItem: (name) => {
    const items = get().items;
    // Alternating red/black pattern for roulette wheel
    const colors = ['#D32F2F', '#1a1a1a']; // Red, Black
    const color = colors[items.length % 2];
    
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color
    };
    
    set({ items: [...items, newItem] });
    return newItem;
  },
  
  // Add multiple items
  addItems: (names) => {
    const items = get().items;
    const colors = ['#D32F2F', '#1a1a1a']; // Red, Black
    const newItems = names.map((name, index) => {
      const color = colors[(items.length + index) % 2];
      return {
        id: Date.now().toString() + index,
        name: name.trim(),
        color: color
      };
    });
    
    set({ items: [...items, ...newItems] });
    return newItems;
  },
  
  // Update item
  updateItem: (id, name) => {
    set({
      items: get().items.map(item =>
        item.id === id ? { ...item, name: name.trim() } : item
      )
    });
  },
  
  // Delete item
  deleteItem: (id) => {
    // Filter out the item and reassign colors to maintain alternation
    const colors = ['#D32F2F', '#1a1a1a']; // Red, Black
    const filteredItems = get().items.filter(item => item.id !== id);
    const recoloredItems = filteredItems.map((item, index) => ({
      ...item,
      color: colors[index % 2]
    }));
    
    set({ items: recoloredItems });
  },
  
  // Clear all items
  clearItems: () => {
    set({ items: [] });
  },
  
  // Set items (replace all)
  setItems: (items) => {
    set({ items });
  },
  
  // Check for duplicates
  checkDuplicates: (newNames) => {
    const existingNames = get().items.map(item => item.name.toLowerCase());
    const duplicates = newNames.filter(name => 
      existingNames.includes(name.toLowerCase())
    );
    return duplicates;
  },
  
  // Game mode
  setGameMode: (mode) => {
    set({ gameMode: mode });
  },
  
  // Settings
  setRemoveAfterSpin: (value) => {
    set({ removeAfterSpin: value });
  },
  
  setSoundEnabled: (value) => {
    set({ soundEnabled: value });
  },
  
  // Spinning
  setIsSpinning: (value) => {
    set({ isSpinning: value });
  },
  
  setSelectedItem: (item) => {
    set({ selectedItem: item });
  },
  
  // Handle spin result
  handleSpinResult: (winner) => {
    const { items, removeAfterSpin, gameMode, spinHistory } = get();
    
    set({ 
      lastWinner: winner,
      spinHistory: [...spinHistory, { item: winner, timestamp: Date.now() }]
    });
    
    // Remove item if setting is enabled or in elimination mode
    if (removeAfterSpin || gameMode === 'elimination') {
      const filteredItems = items.filter(item => item.id !== winner.id);
      // Reassign colors to maintain proper alternation
      const recoloredItems = filteredItems.map((item, index) => ({
        ...item,
        color: index % 2 === 0 ? '#D32F2F' : '#1a1a1a'
      }));
      set({ items: recoloredItems });
    }
  },
  
  // Redo last spin
  redoLastSpin: () => {
    const { lastWinner, items } = get();
    if (lastWinner && !items.find(item => item.id === lastWinner.id)) {
      // Add back the item and reassign all colors
      const newItems = [...items, lastWinner];
      const recoloredItems = newItems.map((item, index) => ({
        ...item,
        color: index % 2 === 0 ? '#D32F2F' : '#1a1a1a'
      }));
      set({ items: recoloredItems });
    }
  },
  
  // Reset game
  resetGame: () => {
    set({
      spinHistory: [],
      lastWinner: null,
      selectedItem: null
    });
  }
}));

export default useStore;
