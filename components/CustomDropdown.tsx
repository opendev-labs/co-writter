
import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '../constants';

export interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  icon, 
  className = "",
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-full border transition-all duration-200 h-full ${
          isOpen 
            ? 'bg-white text-black border-white' 
            : 'bg-white/5 text-white border-transparent hover:bg-white/10 hover:border-white/10'
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
            {icon && <span className={isOpen ? 'text-black' : 'text-neutral-400'}>{icon}</span>}
            <span className="text-sm font-bold truncate">
                {selectedOption ? selectedOption.label : placeholder || 'Select'}
            </span>
        </div>
        <IconChevronDown className={`w-3 h-3 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-black' : 'text-neutral-500'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full min-w-[180px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[60] animate-slide-down origin-top p-1">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.map((option) => (
                <button
                key={option.value}
                onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all mb-0.5 last:mb-0 ${
                    value === option.value 
                    ? 'bg-white text-black font-bold' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white font-medium'
                }`}
                >
                {option.label}
                </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
