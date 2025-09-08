
import React from 'react';
import { Modal } from './Modal';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-white text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold" id="modal-title">
          {title}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-slate-400">
            {message}
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2 font-semibold text-white rounded-lg shadow-md transition-all ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
