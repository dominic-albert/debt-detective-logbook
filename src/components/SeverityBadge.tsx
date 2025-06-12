
import React from 'react';

interface SeverityBadgeProps {
  severity: 'High' | 'Medium' | 'Low';
  className?: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const getStyles = () => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()} ${className}`}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
