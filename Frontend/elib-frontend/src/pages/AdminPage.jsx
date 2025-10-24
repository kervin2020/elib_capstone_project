import React, {
 useState, useEffect 
}
 from 'react';
 
import {
 Users, BookOpen, TrendingUp, AlertTriangle, Plus, Edit, Trash2, Ban, CheckCircle, Eye, BarChart3 
}
 from 'lucide-react';
 
import {
 useAuth 
}
 from '../contexts/AuthContext';
 
import {
 useBooks 
}
 from '../contexts/BookContext';
 
import {
 useLoans 
}
 from '../contexts/LoanContext';
 
import {
 useAdmin 
}
 from '../contexts/AdminContext';
 
import {
 useToast 
}
 from '../contexts/ToastContext';
 
import LoadingSpinner from '../components/common/LoadingSpinner';
 
import ConfirmModal from '../components/common/ConfirmModal';
 
import AddBookModal from '../components/books/AddBookModal';
 
const AdminPage = ()
 => {
 
const {
 user 
}
 = useAuth()
;
 
const {
 books, deleteBook 
}
 = useBooks()
;
 
const {
 loans, stats: loanStats 
}
 = useLoans()
;
 
const {
 users, categories, stats, isLoading, fetchUsers, fetchCategories, fetchStats, updateUser, deleteUser, toggleUserBan, addCategory, updateCategory, deleteCategory 
}
 = useAdmin()
;
 
const {
 success, error 
}
 = useToast()
;
 
const [activeTab, setActiveTab] = useState('dashboard')
;
 
const [selectedUser, setSelectedUser] = useState(null)
;
 
const [selectedBook, setSelectedBook] = useState(null)
;
 
const [showAddBookModal, setShowAddBookModal] = useState(false)
;
 
const [showConfirmModal, setShowConfirmModal] = useState(false)
;
 
const [confirmAction, setConfirmAction] = useState(null)
;
 useEffect(()
 => {
 fetchUsers()
;
 fetchCategories()
;
 fetchStats()
;
 
}
, [fetchUsers, fetchCategories, fetchStats])
;
 
// Redirect if not admin if (!user?.is_admin)
 {
 return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <div className="text-center"> <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" /> <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2> <p className="text-gray-600">You don't have permission to access this page.</p> </div> </div> )
;
 
}
 
const handleBanUser = (userId, isBanned)
 => {
 setConfirmAction({
 type: 'ban', userId, isBanned, message: `Are you sure you want to ${
isBanned ? 'unban' : 'ban'
}
 this user?` 
}
)
;
 setShowConfirmModal(true)
;
 
}
;
 
const handleDeleteUser = (userId)
 => {
 setConfirmAction({
 type: 'deleteUser', userId, message: 'Are you sure you want to delete this user? This action cannot be undone.' 
}
)
;
 setShowConfirmModal(true)
;
 
}
;
 
const handleDeleteBook = (bookId)
 => {
 setConfirmAction({
 type: 'deleteBook', bookId, message: 'Are you sure you want to delete this book? This action cannot be undone.' 
}
)
;
 setShowConfirmModal(true)
;
 
}
;
 
const handleDeleteCategory = (categoryId)
 => {
 setConfirmAction({
 type: 'deleteCategory', categoryId, message: 'Are you sure you want to delete this category?' 
}
)
;
 setShowConfirmModal(true)
;
 
}
;
 
const confirmAction = async ()
 => {
 if (!confirmAction)
 return;
 try {
 let result;
 switch (confirmAction.type)
 {
 case 'ban': result = await toggleUserBan(confirmAction.userId, confirmAction.isBanned)
;
 if (result.success)
 {
 success(`User ${
confirmAction.isBanned ? 'unbanned' : 'banned'
}
 successfully`)
;
 
}
 break;
 case 'deleteUser': result = await deleteUser(confirmAction.userId)
;
 if (result.success)
 {
 success('User deleted successfully')
;
 
}
 break;
 case 'deleteBook': result = await deleteBook(confirmAction.bookId)
;
 if (result.success)
 {
 success('Book deleted successfully')
;
 
}
 break;
 case 'deleteCategory': result = await deleteCategory(confirmAction.categoryId)
;
 if (result.success)
 {
 success('Category deleted successfully')
;
 
}
 break;
 
}
 if (result && !result.success)
 {
 error(result.error || 'Action failed')
;
 
}
 
}
 catch (err)
 {
 error('An error occurred')
;
 
}
 finally {
 setShowConfirmModal(false)
;
 setConfirmAction(null)
;
 
}
 
}
;
 
const DashboardTab = ()
 => ( <div className="space-y-8"> {

/* Stats Overview */

}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-blue-100 rounded-lg"> <Users className="h-6 w-6 text-blue-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Total Users</p> <p className="text-2xl font-bold text-gray-900">{
stats.totalUsers
}
</p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-green-100 rounded-lg"> <BookOpen className="h-6 w-6 text-green-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Total Books</p> <p className="text-2xl font-bold text-gray-900">{
stats.totalBooks
}
</p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-purple-100 rounded-lg"> <TrendingUp className="h-6 w-6 text-purple-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Active Loans</p> <p className="text-2xl font-bold text-gray-900">{
stats.activeLoans
}
</p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-red-100 rounded-lg"> <AlertTriangle className="h-6 w-6 text-red-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Overdue Loans</p> <p className="text-2xl font-bold text-gray-900">{
stats.overdueLoans
}
</p> </div> </div> </div> </div> {

/* Recent Activity */

}
 <div className="bg-white rounded-lg shadow-sm border"> <div className="px-6 py-4 border-b border-gray-200"> <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3> </div> <div className="p-6"> <div className="space-y-4"> {
loans.slice(0, 5)
.map((loan)
 => ( <div key={
loan.id
}
 className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"> <div className="flex items-center space-x-3"> <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"> <BookOpen className="h-4 w-4 text-primary-600" /> </div> <div> <p className="text-sm font-medium text-gray-900"> {
loan.user?.username
}
 borrowed "{
loan.ebook?.title
}
" </p> <p className="text-xs text-gray-500"> {
new Date(loan.loan_date)
.toLocaleDateString()

}
 </p> </div> </div> <span className={
`px-2 py-1 text-xs font-medium rounded-full ${
 loan.is_returned ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800' 
}
`
}
> {
loan.is_returned ? 'Returned' : 'Active'
}
 </span> </div> )
)

}
 </div> </div> </div> </div> )
;
 
const UsersTab = ()
 => ( <div className="bg-white rounded-lg shadow-sm border"> <div className="px-6 py-4 border-b border-gray-200"> <h3 className="text-lg font-semibold text-gray-900">User Management</h3> </div> <div className="overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> User </th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Email </th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Role </th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Status </th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th> </tr> </thead> <tbody className="bg-white divide-y divide-gray-200"> {
users.map((user)
 => ( <tr key={
user.id
}
> <td className="px-6 py-4 whitespace-nowrap"> <div className="flex items-center"> <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"> <span className="text-sm font-medium text-primary-900"> {
user.username.charAt(0)
.toUpperCase()

}
 </span> </div> <div className="ml-3"> <div className="text-sm font-medium text-gray-900">{
user.username
}
</div> </div> </div> </td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> {
user.email
}
 </td> <td className="px-6 py-4 whitespace-nowrap"> <span className={
`px-2 py-1 text-xs font-medium rounded-full ${
 user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800' 
}
`
}
> {
user.is_admin ? 'Admin' : 'User'
}
 </span> </td> <td className="px-6 py-4 whitespace-nowrap"> <span className={
`px-2 py-1 text-xs font-medium rounded-full ${
 user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' 
}
`
}
> {
user.is_banned ? 'Banned' : 'Active'
}
 </span> </td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"> <button onClick={
()
 => handleBanUser(user.id, !user.is_banned)

}
 className={
`${
 user.is_banned ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900' 
}
`
}
 > {
user.is_banned ? 'Unban' : 'Ban'
}
 </button> <button onClick={
()
 => handleDeleteUser(user.id)

}
 className="text-red-600 hover:text-red-900" > Delete </button> </td> </tr> )
)

}
 </tbody> </table> </div> </div> )
;
 
const BooksTab = ()
 => ( <div className="space-y-6"> <div className="flex justify-between items-center"> <h3 className="text-lg font-semibold text-gray-900">Book Management</h3> <button onClick={
()
 => setShowAddBookModal(true)

}
 className="btn-primary flex items-center space-x-2" > <Plus className="h-4 w-4" /> <span>Add Book</span> </button> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {
books.map((book)
 => ( <div key={
book.id
}
 className="card p-6"> <div className="flex items-start justify-between mb-4"> <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center"> <BookOpen className="h-6 w-6 text-primary-600" /> </div> <div className="flex space-x-1"> <button className="p-1 text-gray-400 hover:text-gray-600"> <Eye className="h-4 w-4" /> </button> <button className="p-1 text-gray-400 hover:text-gray-600"> <Edit className="h-4 w-4" /> </button> <button onClick={
()
 => handleDeleteBook(book.id)

}
 className="p-1 text-red-400 hover:text-red-600" > <Trash2 className="h-4 w-4" /> </button> </div> </div> <h3 className="text-lg font-semibold text-gray-900 mb-2">{
book.title
}
</h3> <p className="text-gray-600 mb-3">{
book.author
}
</p> <div className="flex items-center justify-between text-sm"> <span className="text-gray-500"> {
book.available_copies
}
 of {
book.total_copies
}
 available </span> <span className={
`px-2 py-1 text-xs font-medium rounded-full ${
 book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' 
}
`
}
> {
book.available_copies > 0 ? 'Available' : 'Unavailable'
}
 </span> </div> </div> )
)

}
 </div> </div> )
;
 
const CategoriesTab = ()
 => ( <div className="space-y-6"> <div className="flex justify-between items-center"> <h3 className="text-lg font-semibold text-gray-900">Category Management</h3> <button className="btn-primary flex items-center space-x-2"> <Plus className="h-4 w-4" /> <span>Add Category</span> </button> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {
categories.map((category)
 => ( <div key={
category.id
}
 className="card p-4"> <div className="flex items-center justify-between"> <div> <h4 className="font-medium text-gray-900">{
category.name
}
</h4> {
category.description && ( <p className="text-sm text-gray-600 mt-1">{
category.description
}
</p> )

}
 </div> <div className="flex space-x-1"> <button className="p-1 text-gray-400 hover:text-gray-600"> <Edit className="h-4 w-4" /> </button> <button onClick={
()
 => handleDeleteCategory(category.id)

}
 className="p-1 text-red-400 hover:text-red-600" > <Trash2 className="h-4 w-4" /> </button> </div> </div> </div> )
)

}
 </div> </div> )
;
 return ( <div className="min-h-screen bg-gray-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {

/* Header */

}
 <div className="mb-8"> <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1> <p className="text-gray-600 mt-2"> Manage your library system, users, and content </p> </div> {

/* Tabs */

}
 <div className="bg-white rounded-lg shadow-sm border mb-6"> <div className="border-b border-gray-200"> <nav className="flex space-x-8 px-6"> {
[ {
 id: 'dashboard', label: 'Dashboard', icon: BarChart3 
}
, {
 id: 'users', label: 'Users', icon: Users 
}
, {
 id: 'books', label: 'Books', icon: BookOpen 
}
, {
 id: 'categories', label: 'Categories', icon: TrendingUp 
}
 ].map((tab)
 => ( <button key={
tab.id
}
 onClick={
()
 => setActiveTab(tab.id)

}
 className={
`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
 activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700' 
}
`
}
 > <tab.icon className="h-4 w-4" /> <span>{
tab.label
}
</span> </button> )
)

}
 </nav> </div> </div> {

/* Content */

}
 {
isLoading ? ( <LoadingSpinner size="large" className="py-12" /> )
 : ( <> {
activeTab === 'dashboard' && <DashboardTab />
}
 {
activeTab === 'users' && <UsersTab />
}
 {
activeTab === 'books' && <BooksTab />
}
 {
activeTab === 'categories' && <CategoriesTab />
}
 </> )

}
 {

/* Modals */

}
 <AddBookModal isOpen={
showAddBookModal
}
 onClose={
()
 => setShowAddBookModal(false)

}
 /> <ConfirmModal isOpen={
showConfirmModal
}
 onClose={
()
 => setShowConfirmModal(false)

}
 onConfirm={
confirmAction
}
 title="Confirm Action" message={
confirmAction?.message
}
 type="danger" /> </div> </div> )
;
 
}
;
 
export default AdminPage;
 