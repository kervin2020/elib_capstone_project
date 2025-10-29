import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  User,
  PlusCircle,
  Edit,
  Trash2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBooks } from "../contexts/BookContext";
import { useAdmin } from "../contexts/AdminContext";

import AddBookModal from "../components/books/AddBookModal";
import EditBookModal from "../components/books/EditBookModal";
import AddCategoryModal from "../components/books/AddCategoryModal";
import EditCategoryModal from "../components/books/EditCategoryModal";

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { books, deleteBook } = useBooks();
  const {
    users,
    categories,
    fetchUsers,
    fetchCategories,
    deleteCategory,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("books");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, [fetchUsers, fetchCategories]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowEditBookModal(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce livre ?")) {
      await deleteBook(id);
    }
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
    setShowAddCategoryModal(false);
  };

  const tabs = [
    { id: "books", label: "Livres", icon: BookOpen },
    { id: "users", label: "Utilisateurs", icon: User },
    { id: "categories", label: "Catégories", icon: FolderTree },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-cyan-600 w-6 h-6" />
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition ${activeTab === tab.id
                ? "bg-cyan-100 text-cyan-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 w-64 bg-white border-r border-gray-200 h-full z-30 flex flex-col transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-cyan-600 w-6 h-6" />
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition ${activeTab === tab.id
                ? "bg-cyan-100 text-cyan-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>

        {/* BOOKS */}
        {activeTab === "books" && (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                Gestion des livres
              </h2>
              <button
                onClick={() => setShowAddBookModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Ajouter un livre
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">Titre</th>
                    <th className="py-2 px-4 text-left">Auteur</th>
                    <th className="py-2 px-4 text-center">Disponibles</th>
                    <th className="py-2 px-4 text-center">Total</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">
                        Aucun livre trouvé.
                      </td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr
                        key={book.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-4">{book.title}</td>
                        <td className="py-2 px-4">{book.author}</td>
                        <td className="py-2 px-4 text-center">{book.available_copies}</td>
                        <td className="py-2 px-4 text-center">{book.total_copies}</td>
                        <td className="py-2 px-4 flex justify-center gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Gestion des utilisateurs
            </h2>
            {users?.length > 0 ? (
              <ul className="space-y-2">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className="border p-3 rounded-md flex flex-col sm:flex-row sm:justify-between hover:bg-gray-50 transition"
                  >
                    <span className="font-medium">{u.username}</span>
                    <span className="text-sm text-gray-600">{u.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun utilisateur disponible</p>
            )}
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === "categories" && (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-cyan-600" />
                Gestion des catégories
              </h2>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Ajouter une catégorie
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="border p-4 rounded-lg bg-gray-50 flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">{cat.description || "Aucune description"}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowEditCategoryModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm transition"
                      >
                        <Edit className="w-4 h-4" /> Modifier
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                            const res = await deleteCategory(cat.id);
                            if (res.success) await fetchCategories();
                          }
                        }}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm transition"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">Aucune catégorie disponible</p>
              )}
            </div>

            {/* Modals */}
            {showAddCategoryModal && (
              <AddCategoryModal isOpen={showAddCategoryModal} onClose={handleCategoryAdded} />
            )}
            {showEditCategoryModal && (
              <EditCategoryModal
                category={selectedCategory}
                onClose={async () => {
                  setShowEditCategoryModal(false);
                  await fetchCategories();
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Book Modals */}
      {showAddBookModal && <AddBookModal isOpen={showAddBookModal} onClose={() => setShowAddBookModal(false)} />}
      {showEditBookModal && <EditBookModal isOpen={showEditBookModal} onClose={() => setShowEditBookModal(false)} book={selectedBook} />}
    </div>
  );
};

export default AdminPage;
