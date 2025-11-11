import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onCancel,
  title, 
  message, 
  confirmText = 'OK', 
  cancelText = 'Cancel',
  thirdButtonText,
  onThirdButton,
  type = 'confirm' // 'confirm', 'alert', 'success', 'duplicate'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleThirdButton = () => {
    onThirdButton?.();
    onClose?.();
  };

  return (
    <AnimatePresence>
      <div className="confirm-modal-overlay">
        <motion.div
          className="confirm-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={type !== 'alert' ? handleCancel : onClose}
        />
        <motion.div
          className="confirm-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
        >
          <button className="confirm-modal-close" onClick={type !== 'alert' ? handleCancel : onClose}>
            <X size={20} />
          </button>
          
          <div className="confirm-modal-icon">
            {type === 'success' && <CheckCircle size={48} className="icon-success" />}
            {type === 'alert' && <AlertCircle size={48} className="icon-alert" />}
            {(type === 'confirm' || type === 'duplicate') && <AlertCircle size={48} className="icon-confirm" />}
          </div>
          
          <h3 className="confirm-modal-title">{title}</h3>
          <p className="confirm-modal-message">{message}</p>
          
          <div className="confirm-modal-actions">
            {type === 'duplicate' && thirdButtonText && (
              <button className="btn-modal-third" onClick={handleThirdButton}>
                {thirdButtonText}
              </button>
            )}
            {type !== 'alert' && (
              <button className="btn-modal-cancel" onClick={handleCancel}>
                {cancelText}
              </button>
            )}
            <button className="btn-modal-confirm" onClick={handleConfirm}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
