import React, { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useBooks } from "../../contexts/BookContext";
import { useLoans } from "../../contexts/LoanContext";
import { useAdmin } from "../../contexts/AdminContext";
import { useToast } from "../../contexts/ToastContext";

const EditBookModal = ({ isOpen, onClose, book }) => {
    const { user } = useAuth();
    const { updateBook } = useBooks();
    const { success, error } = useToast();
    const { categories } = useAdmin();

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        total_copies: 1,
        available_copies: 1,
        category_id: "",
        description: "",
    });

    // Charger les données du livre quand la modale s’ouvre
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || "",
                author: book.author || "",
                total_copies: book.total_copies || 1,
                available_copies: book.available_copies || 1,
                category_id: book.category_id || "",
                description: book.description || "",
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!book?.id) return;

        try {
            const result = await updateBook(book.id, formData);
            if (result.success) {
                success("Book updated successfully");
                onClose();
            } else {
                error(result.error || "Failed to update book");
            }
        } catch (err) {
            error("An unexpected error occurred");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary-600" />
                        Edit Book
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Copies</label>
                            <input
                                type="number"
                                name="total_copies"
                                value={formData.total_copies}
                                onChange={handleChange}
                                min="1"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Available Copies</label>
                            <input
                                type="number"
                                name="available_copies"
                                value={formData.available_copies}
                                onChange={handleChange}
                                min="0"
                                max={formData.total_copies}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;
