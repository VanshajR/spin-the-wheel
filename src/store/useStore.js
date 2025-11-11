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
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
      '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#E67E22'
    ];
    
    const items = get().items;
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      color: colors[items.length % colors.length]
    };
    
    set({ items: [...items, newItem] });
    return newItem;
  },
  
  // Add multiple items
  addItems: (names) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
      '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#E67E22'
    ];
    
    const items = get().items;
    const newItems = names.map((name, index) => ({
      id: Date.now().toString() + index,
      name: name.trim(),
      color: colors[(items.length + index) % colors.length]
    }));
    
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
    set({ items: get().items.filter(item => item.id !== id) });
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
      set({ items: items.filter(item => item.id !== winner.id) });
    }
  },
  
  // Redo last spin
  redoLastSpin: () => {
    const { lastWinner, items } = get();
    if (lastWinner && !items.find(item => item.id === lastWinner.id)) {
      set({ items: [...items, lastWinner] });
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
