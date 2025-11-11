import React, { useState, useRef } from 'react';
import { Upload, Loader, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import useStore from '../store/useStore';
import ConfirmModal from './ConfirmModal';
import './ImageUpload.css';

const ImageUpload = ({ onItemsExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [clearWheel, setClearWheel] = useState(false);
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });
  const fileInputRef = useRef(null);
  const { addItems, checkDuplicates, clearItems } = useStore();

  const handleUploadClick = () => {
    // Show options modal FIRST
    setShowOptions(true);
  };

  const processImage = async (file) => {
    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Extract items from text
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.length < 100);

      return lines;
    } catch (error) {
      console.error('OCR Error:', error);
      return null;
    }
  };

  const processAllImages = async (files) => {
    setIsProcessing(true);
    setProgress(0);
    
    // Clear wheel if option is selected
    if (clearWheel) {
      clearItems();
    }
    
    let allItems = [];
    
    for (const file of files) {
      const items = await processImage(file);
      console.log('OCR extracted items from image:', items); // Debug log
      if (items && items.length > 0) {
        allItems = [...allItems, ...items];
      }
    }
    
    setIsProcessing(false);
    setProgress(0);
    
    console.log('Total OCR items:', allItems); // Debug log
    
    if (allItems.length === 0) {
      setConfirmModal({
        isOpen: true,
        message: 'No text found in the selected images. Please try again with clearer images.',
        onConfirm: () => {},
        type: 'alert'
      });
      return;
    }
    
    // Check for duplicates if option is not selected
    if (!includeDuplicates) {
      const duplicates = checkDuplicates(allItems);
      
      if (duplicates.length > 0) {
        const uniqueItems = allItems.filter(item => !duplicates.includes(item));
        setConfirmModal({
          isOpen: true,
          message: `Found ${duplicates.length} duplicate item(s):\n${duplicates.slice(0, 5).join(', ')}${duplicates.length > 5 ? '...' : ''}`,
          onConfirm: () => {
            // Add all items (including duplicates)
            console.log('Adding all items (including duplicates):', allItems); // Debug log
            addItems(allItems);
            onItemsExtracted?.(allItems);
          },
          onCancel: () => {
            // Add only unique items
            if (uniqueItems.length > 0) {
              console.log('Adding unique items only:', uniqueItems); // Debug log
              addItems(uniqueItems);
              onItemsExtracted?.(uniqueItems);
            }
          },
          onThirdButton: () => {
            // Add only duplicates
            const duplicateItems = allItems.filter(item => duplicates.includes(item));
            if (duplicateItems.length > 0) {
              console.log('Adding duplicate items only:', duplicateItems); // Debug log
              addItems(duplicateItems);
              onItemsExtracted?.(duplicateItems);
            }
          },
          type: 'duplicate',
          confirmText: 'Add All',
          cancelText: 'Add Unique Only',
          thirdButtonText: 'Add Duplicates Only'
        });
        return;
      }
    }
    
    console.log('Adding items to wheel:', allItems); // Debug log
    addItems(allItems);
    onItemsExtracted?.(allItems);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validate all are images
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setConfirmModal({
        isOpen: true,
        message: 'No valid image files selected. Please select image files (PNG, JPG, etc.)',
        onConfirm: () => {},
        type: 'alert'
      });
      return;
    }
    
    processAllImages(validFiles);
    
    // Reset input
    e.target.value = '';
  };

  const handleProceedWithUpload = () => {
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
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload-input"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleUploadClick}
        className={`image-upload-button ${isProcessing ? 'processing' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader className="icon spin" size={20} />
            <span>Processing... {progress}%</span>
          </>
        ) : (
          <>
            <Upload className="icon" size={20} />
            <span>Upload Images (OCR)</span>
          </>
        )}
      </button>
      
      {/* Options Modal */}
      {showOptions && (
        <div className="upload-options-modal">
          <div className="modal-overlay" onClick={handleCancelOptions}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Options</h3>
              <button onClick={handleCancelOptions} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Configure your upload preferences
              </p>
              
              <label className="option-toggle">
                <input
                  type="checkbox"
                  checked={clearWheel}
                  onChange={(e) => setClearWheel(e.target.checked)}
                />
                <span className="option-label">Clear existing wheel items</span>
              </label>
              
              <label className="option-toggle">
                <input
                  type="checkbox"
                  checked={includeDuplicates}
                  onChange={(e) => setIncludeDuplicates(e.target.checked)}
                />
                <span className="option-label">Include duplicate items</span>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={handleCancelOptions} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleProceedWithUpload} className="btn-upload">
                Select Images
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        onThirdButton={confirmModal.onThirdButton}
        title={confirmModal.type === 'alert' ? 'Notice' : confirmModal.type === 'duplicate' ? 'Duplicates Detected' : 'Confirm'}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        thirdButtonText={confirmModal.thirdButtonText}
        type={confirmModal.type || 'confirm'}
      />
    </div>
  );
};

export default ImageUpload;
