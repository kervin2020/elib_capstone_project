import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true); // Start animation on mount

        let hideTimer;
        if (duration > 0) {
            hideTimer = setTimeout(() => {
                setShow(false);
                setTimeout(() => onClose(id), 300); // Wait for animation to finish
            }, duration);
        }

        return () => clearTimeout(hideTimer);
    }, [duration, id, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'error':
                return <XCircle className="h-6 w-6 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-6 w-6 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'error':
                return 'bg-red-50 border-l-4 border-red-500';
            case 'warning':
                return 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'info':
            default:
                return 'bg-blue-50 border-l-4 border-blue-500';
        }
    };

    return (
        <div
            className={`max-w-sm w-full ${getBackgroundColor()} rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 ease-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
      `}
        >
            <div className="p-4 flex items-start space-x-3">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
                    {message && <p className={`text-sm ${title ? 'mt-1' : ''} text-gray-700`}>{message}</p>}
                </div>
                <button
                    onClick={() => {
                        setShow(false);
                        setTimeout(() => onClose(id), 300);
                    }}
                    className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
