import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Trash } from 'lucide-react';
import useStore from '../store/useStore';
import ImageUpload from './ImageUpload';
import CSVImport from './CSVImport';
import ConfirmModal from './ConfirmModal';
import './ItemList.css';

const ItemList = () => {
  const { items, addItem, updateItem, deleteItem, clearItems, checkDuplicates } = useStore();
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });

  const handleAddItem = (e) => {
    e.preventDefault();
    const trimmedName = newItemName.trim();
    
    if (!trimmedName) {
      setConfirmModal({
        isOpen: true,
        message: 'Please enter an item name',
        onConfirm: () => {},
        type: 'alert'
      });
      return;
    }

    // Check for duplicates
    const duplicates = checkDuplicates([trimmedName]);
    if (duplicates.length > 0) {
      setConfirmModal({
        isOpen: true,
        message: `"${trimmedName}" already exists. Add it anyway?`,
        onConfirm: () => {
          addItem(trimmedName);
          setNewItemName('');
        }
      });
      return;
    }

    addItem(trimmedName);
    setNewItemName('');
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEdit = () => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setConfirmModal({
        isOpen: true,
        message: 'Item name cannot be empty',
        onConfirm: () => {},
        type: 'alert'
      });
      return;
    }

    updateItem(editingId, trimmedName);
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      message: 'Are you sure you want to delete this item?',
      onConfirm: () => {
        deleteItem(id);
      }
    });
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete all ${items.length} items?`,
      onConfirm: () => {
        clearItems();
      }
    });
  };

  return (
    <div className="item-list">
      <div className="list-header">
        <h2 className="item-list-title">Wheel Items ({items.length})</h2>
        {items.length > 0 && (
          <button onClick={handleClearAll} className="clear-all-button" title="Clear all items">
            <Trash size={18} />
          </button>
        )}
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter item name..."
          className="item-input"
          maxLength={50}
        />
        <button type="submit" className="add-button">
          <Plus size={20} />
        </button>
      </form>

      {/* Image Upload */}
      <ImageUpload
        onItemsExtracted={(items) => {
          // Show success message
          const message = `Added ${items.length} item(s) from image!`;
          setConfirmModal({
            isOpen: true,
            message: message,
            onConfirm: () => {},
            type: 'success'
          });
        }}
      />

      {/* CSV Import */}
      <CSVImport
        onItemsExtracted={(items) => {
          // Show success message
          const message = `Added ${items.length} item(s) from CSV!`;
          setConfirmModal({
            isOpen: true,
            message: message,
            onConfirm: () => {},
            type: 'success'
          });
        }}
      />

      {/* Items List */}
      <div className="items-container">
        {items.length === 0 ? (
          <p className="empty-message">No items yet. Add some items to get started!</p>
        ) : (
          <ul className="items">
            {items.map((item) => (
              <li key={item.id} className="item" style={{ borderLeftColor: item.color }}>
                {editingId === item.id ? (
                  <div className="item-edit">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="item-edit-input"
                      autoFocus
                      maxLength={50}
                    />
                    <div className="item-actions">
                      <button
                        onClick={handleSaveEdit}
                        className="action-button save"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="action-button cancel"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="item-view">
                    <span className="item-name">{item.name}</span>
                    <div className="item-actions">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="action-button edit"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="action-button delete"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })}
        title={confirmModal.type === 'alert' ? 'Notice' : confirmModal.type === 'success' ? 'Success' : 'Confirm'}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm?.();
          setConfirmModal({ isOpen: false, message: '', onConfirm: null });
        }}
        onCancel={() => {
          setConfirmModal({ isOpen: false, message: '', onConfirm: null });
        }}
        type={confirmModal.type}
      />
    </div>
  );
};

export default ItemList;
