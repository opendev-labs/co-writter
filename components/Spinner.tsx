import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; 
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'bg-white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <div className={`${sizeClasses[size]} ${color} opacity-20 animate-[pulse-square_1s_ease-in-out_infinite] rounded-sm`}></div>
      <div className={`${sizeClasses[size]} ${color} opacity-60 animate-[pulse-square_1s_ease-in-out_0.2s_infinite] rounded-sm`}></div>
      <div className={`${sizeClasses[size]} ${color} animate-[pulse-square_1s_ease-in-out_0.4s_infinite] rounded-sm`}></div>
    </div>
  );
};

export default Spinner;