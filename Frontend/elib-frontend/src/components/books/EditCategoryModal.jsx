// src/components/admin/EditCategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const EditCategoryModal = ({ category, onClose }) => {
    const { updateCategory } = useAdmin();
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
            });
        }
    }, [category]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const res = await updateCategory(category.id, formData);
        if (res.success) {
            setMessage('Catégorie mise à jour ✅');
            setTimeout(() => onClose(), 1000);
        } else {
            setMessage(res.error);
        }
        setLoading(false);
    };

    if (!category) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Modifier la catégorie</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Nom</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                    </div>

                    {message && <p className="text-sm text-green-600">{message}</p>}

                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 bg-gray-300 rounded-lg"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
