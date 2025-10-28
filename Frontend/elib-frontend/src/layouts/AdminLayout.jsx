import React from "react";
import { useToast } from "../contexts/ToastContext";
import ToastContainer from "../components/common/ToastContainer";

const AdminLayout = ({ children }) => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="min-h-screen flex bg-gray-100 relative">
            {/* Le layout admin n’affiche pas de header ni footer */}
            <main className="flex-1">{children}</main>
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
};

export default AdminLayout;
