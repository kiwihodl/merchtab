'use client';

import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../types/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function ToastItem({ id, type, message, action }: Toast) {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(id);
    }, 200); // Match transition duration
  };

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div
      role="alert"
      className={clsx(
        'transform transition-all duration-200 ease-in-out',
        bgColor,
        'rounded-lg shadow-lg p-4 text-white min-w-[300px] max-w-md flex items-center justify-between',
        'translate-x-0 opacity-100',
        isExiting && 'translate-x-full opacity-0'
      )}
    >
      <div className="flex-1 mr-2">{message}</div>
      <div className="flex items-center gap-2">
        {action && (
          <button
            onClick={action.onClick}
            className="px-2 py-1 text-sm bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
          >
            {action.label}
          </button>
        )}
        <button
          onClick={handleRemove}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 