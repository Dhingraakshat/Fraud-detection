
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', action }) => {
  return (
    <div className={`bg-[#101A2E] border border-[#1D2B45] rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-[#25D0C5]/20 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>}
            {subtitle && <p className="text-xs text-[#A9B6D1] mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
