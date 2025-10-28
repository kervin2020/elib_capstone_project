import React, { useEffect, useState } from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onClose }) => {
    const [visibleToasts, setVisibleToasts] = useState([]);

    useEffect(() => {
        setVisibleToasts(toasts);
    }, [toasts]);

    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col items-end space-y-3 w-full max-w-xs sm:max-w-sm">
            {visibleToasts.map((toast) => (
                <div
                    key={toast.id}
                    className="transform transition-all duration-300 ease-out opacity-0 translate-x-8 animate-slide-in"
                >
                    <Toast {...toast} onClose={onClose} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
