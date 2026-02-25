
import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IconX } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when modal opens
  // Using useLayoutEffect to ensure it happens before paint
  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
        contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] h-[95vh]'
  };

  // Use Portal to render modal at document body level
  // This bypasses parent transforms (like animate-page-enter) that break fixed positioning
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out animate-fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`bg-black rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,1)] relative w-full ${sizeClasses[size]} border border-white/15 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up ring-1 ring-white/5`}
        onClick={e => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all hover:rotate-90 backdrop-blur-md"
          aria-label="Close modal"
        >
          <IconX className="w-5 h-5" />
        </button>

        {title && (
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            </div>
        )}
        
        <div ref={contentRef} className="p-0 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
