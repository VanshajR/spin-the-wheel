import React, { useState, useRef } from 'react';
import { FileText, Loader, X } from 'lucide-react';
import useStore from '../store/useStore';
import ConfirmModal from './ConfirmModal';
import './CSVImport.css';

const CSVImport = ({ onItemsExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [clearWheel, setClearWheel] = useState(false);
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });
  const fileInputRef = useRef(null);
  const { addItems, checkDuplicates, clearItems } = useStore();

  const handleImportClick = () => {
    // Show options modal FIRST
    setShowOptions(true);
  };

  const processCSV = (file) => {
    setIsProcessing(true);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        
        // Parse CSV - handle both comma and newline separated values
        let items = [];
        
        // Try to split by newlines first
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length > 1) {
          // Multiple lines - treat each line as an item
          items = lines.map(line => {
            // Take first column if comma-separated
            const firstColumn = line.split(',')[0].trim();
            return firstColumn.replace(/['"]/g, ''); // Remove quotes
          });
        } else {
          // Single line - split by comma
          items = text.split(',').map(item => item.trim().replace(/['"]/g, ''));
        }
        
        // Filter out empty items and items that are too long
        items = items.filter(item => item.length > 0 && item.length < 100);
        
        if (items.length === 0) {
          setConfirmModal({
            isOpen: true,
            message: 'No valid items found in CSV file. Please check the file format.',
            onConfirm: () => {},
            type: 'alert'
          });
          setIsProcessing(false);
          return;
        }
        
        // Clear wheel if option is selected
        if (clearWheel) {
          clearItems();
        }
        
        // Check for duplicates if option is not selected
        if (!includeDuplicates) {
          const duplicates = checkDuplicates(items);
          
          if (duplicates.length > 0) {
            const uniqueItems = items.filter(item => !duplicates.includes(item));
            setConfirmModal({
              isOpen: true,
              message: `Found ${duplicates.length} duplicate item(s):\n${duplicates.slice(0, 5).join(', ')}${duplicates.length > 5 ? '...' : ''}`,
              onConfirm: () => {
                // Add all items (including duplicates)
                addItems(items);
                onItemsExtracted?.(items);
              },
              onCancel: () => {
                // Add only unique items
                if (uniqueItems.length > 0) {
                  addItems(uniqueItems);
                  onItemsExtracted?.(uniqueItems);
                }
              },
              onThirdButton: () => {
                // Add only duplicates
                const duplicateItems = items.filter(item => duplicates.includes(item));
                if (duplicateItems.length > 0) {
                  addItems(duplicateItems);
                  onItemsExtracted?.(duplicateItems);
                }
              },
              type: 'duplicate',
              confirmText: 'Add All',
              cancelText: 'Add Unique Only',
              thirdButtonText: 'Add Duplicates Only'
            });
            setIsProcessing(false);
            return;
          }
        }
        
        addItems(items);
        onItemsExtracted?.(items);
        setIsProcessing(false);
      } catch (error) {
        console.error('CSV parsing error:', error);
        setConfirmModal({
          isOpen: true,
          message: 'Failed to parse CSV file. Please check the format and try again.',
          onConfirm: () => {},
          type: 'alert'
        });
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setConfirmModal({
        isOpen: true,
        message: 'Failed to read file. Please try again.',
        onConfirm: () => {},
        type: 'alert'
      });
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      setConfirmModal({
        isOpen: true,
        message: 'Please upload a CSV file.',
        onConfirm: () => {},
        type: 'alert'
      });
      return;
    }
    
    processCSV(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleProceedWithImport = () => {
    setShowOptions(false);
    // Trigger file input
    fileInputRef.current?.click();
  };

  const handleCancelOptions = () => {
    setShowOptions(false);
    setClearWheel(false);
    setIncludeDuplicates(false);
  };

  return (
    <>
      <div className="csv-import">
        <button 
          className={`csv-import-button ${isProcessing ? 'processing' : ''}`}
          onClick={handleImportClick}
          disabled={isProcessing}
          title="Import items from CSV"
        >
          {isProcessing ? (
            <>
              <Loader className="icon spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FileText className="icon" size={20} />
              <span>Import from CSV</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={isProcessing}
          style={{ display: 'none' }}
        />
      </div>

      {showOptions && (
        <div className="upload-modal-backdrop" onClick={handleCancelOptions}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <h3>CSV Import Options</h3>
              <button className="close-button" onClick={handleCancelOptions}>
                <X size={20} />
              </button>
            </div>
            <div className="upload-modal-content">
              <label className="option-toggle">
                <input
                  type="checkbox"
                  checked={clearWheel}
                  onChange={(e) => setClearWheel(e.target.checked)}
                />
                <span>Clear existing items from wheel</span>
              </label>
              <label className="option-toggle">
                <input
                  type="checkbox"
                  checked={includeDuplicates}
                  onChange={(e) => setIncludeDuplicates(e.target.checked)}
                />
                <span>Include duplicate items</span>
              </label>
            </div>
            <div className="upload-modal-actions">
              <button className="modal-button cancel" onClick={handleCancelOptions}>
                Cancel
              </button>
              <button className="modal-button proceed" onClick={handleProceedWithImport}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm?.();
          setConfirmModal({ isOpen: false, message: '', onConfirm: null });
        }}
        onCancel={() => {
          confirmModal.onCancel?.();
          setConfirmModal({ isOpen: false, message: '', onConfirm: null });
        }}
        onThirdButton={() => {
          confirmModal.onThirdButton?.();
          setConfirmModal({ isOpen: false, message: '', onConfirm: null });
        }}
        title={confirmModal.type === 'alert' ? 'Notice' : confirmModal.type === 'duplicate' ? 'Duplicates Detected' : 'Confirm'}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        thirdButtonText={confirmModal.thirdButtonText}
        type={confirmModal.type}
      />
    </>
  );
};

export default CSVImport;
