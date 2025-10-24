import React, {
 useState, useEffect 
}
 from 'react';
 
import {
 useAuth 
}
 from '../contexts/AuthContext';
 
import {
 useLoans 
}
 from '../contexts/LoanContext';
 
import {
 useToast 
}
 from '../contexts/ToastContext';
 
import {
 BookOpen, Calendar, Clock, CheckCircle, AlertTriangle, Eye, Download, RotateCcw 
}
 from 'lucide-react';
 
import LoadingSpinner from '../components/common/LoadingSpinner';
 
import ConfirmModal from '../components/common/ConfirmModal';
 
const LoansPage = ()
 => {
 
const {
 user 
}
 = useAuth()
;
 
const {
 loans, stats, isLoading, fetchLoans, returnBook, getUserActiveLoans, getUserLoanHistory, getOverdueLoans 
}
 = useLoans()
;
 
const {
 success, error 
}
 = useToast()
;
 
const [activeTab, setActiveTab] = useState('active')
;
 
const [returningLoan, setReturningLoan] = useState(null)
;
 
const [showReturnModal, setShowReturnModal] = useState(false)
;
 useEffect(()
 => {
 fetchLoans()
;
 
}
, [fetchLoans])
;
 
const activeLoans = getUserActiveLoans(user?.id)
;
 
const loanHistory = getUserLoanHistory(user?.id)
;
 
const overdueLoans = getOverdueLoans()
;
 
const handleReturn = (loan)
 => {
 setReturningLoan(loan)
;
 setShowReturnModal(true)
;
 
}
;
 
const confirmReturn = async ()
 => {
 if (!returningLoan)
 return;
 try {
 
const result = await returnBook(returningLoan.id)
;
 if (result.success)
 {
 success(`Successfully returned "${
returningLoan.ebook?.title
}
"`)
;
 fetchLoans()
;
 
// Refresh loans 
}
 else {
 error(result.error || 'Failed to return book')
;
 
}
 
}
 catch (err)
 {
 error('An error occurred while returning the book')
;
 
}
 finally {
 setShowReturnModal(false)
;
 setReturningLoan(null)
;
 
}
 
}
;
 
const formatDate = (dateString)
 => {
 return new Date(dateString)
.toLocaleDateString('en-US', {
 year: 'numeric', month: 'short', day: 'numeric' 
}
)
;
 
}
;
 
const getDaysUntilDue = (dueDate)
 => {
 
const now = new Date()
;
 
const due = new Date(dueDate)
;
 
const diffTime = due - now;
 
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)
)
;
 return diffDays;
 
}
;
 
const getStatusColor = (loan)
 => {
 if (loan.is_returned)
 return 'text-green-600 bg-green-100';
 if (new Date(loan.due_date)
 < new Date()
)
 return 'text-red-600 bg-red-100';
 return 'text-blue-600 bg-blue-100';
 
}
;
 
const getStatusText = (loan)
 => {
 if (loan.is_returned)
 return 'Returned';
 if (new Date(loan.due_date)
 < new Date()
)
 return 'Overdue';
 return 'Active';
 
}
;
 
const LoanCard = ({
 loan 
}
)
 => {
 
const daysUntilDue = getDaysUntilDue(loan.due_date)
;
 
const isOverdue = daysUntilDue < 0 && !loan.is_returned;
 return ( <div className="card p-6"> <div className="flex items-start justify-between"> <div className="flex-1"> <div className="flex items-center space-x-3 mb-3"> <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center"> <BookOpen className="h-6 w-6 text-primary-600" /> </div> <div> <h3 className="text-lg font-semibold text-gray-900"> {
loan.ebook?.title
}
 </h3> <p className="text-gray-600">{
loan.ebook?.author
}
</p> </div> </div> <div className="grid grid-cols-2 gap-4 mb-4"> <div className="flex items-center space-x-2 text-sm text-gray-600"> <Calendar className="h-4 w-4" /> <span>Borrowed: {
formatDate(loan.loan_date)

}
</span> </div> <div className="flex items-center space-x-2 text-sm text-gray-600"> <Clock className="h-4 w-4" /> <span>Due: {
formatDate(loan.due_date)

}
</span> </div> </div> <div className="flex items-center justify-between"> <div className="flex items-center space-x-2"> <span className={
`px-2 py-1 text-xs font-medium rounded-full ${
getStatusColor(loan)

}
`
}
> {
getStatusText(loan)

}
 </span> {
isOverdue && ( <span className="text-red-600 text-sm font-medium"> {
Math.abs(daysUntilDue)

}
 days overdue </span> )

}
 {
!loan.is_returned && !isOverdue && ( <span className="text-gray-600 text-sm"> {
daysUntilDue
}
 days remaining </span> )

}
 </div> {
!loan.is_returned && ( <button onClick={
()
 => handleReturn(loan)

}
 className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors" > <RotateCcw className="h-4 w-4" /> <span>Return</span> </button> )

}
 </div> </div> </div> </div> )
;
 
}
;
 return ( <div className="min-h-screen bg-gray-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {

/* Header */

}
 <div className="mb-8"> <h1 className="text-3xl font-bold text-gray-900">My Loans</h1> <p className="text-gray-600 mt-2"> Manage your borrowed books and view your loan history </p> </div> {

/* Stats Cards */

}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-blue-100 rounded-lg"> <BookOpen className="h-6 w-6 text-blue-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Active Loans</p> <p className="text-2xl font-bold text-gray-900">{
activeLoans.length
}
</p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-green-100 rounded-lg"> <CheckCircle className="h-6 w-6 text-green-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Returned</p> <p className="text-2xl font-bold text-gray-900"> {
loanHistory.filter(loan => loan.is_returned)
.length
}
 </p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-red-100 rounded-lg"> <AlertTriangle className="h-6 w-6 text-red-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Overdue</p> <p className="text-2xl font-bold text-gray-900"> {
activeLoans.filter(loan => new Date(loan.due_date)
 < new Date()
)
.length
}
 </p> </div> </div> </div> <div className="bg-white rounded-lg shadow-sm border p-6"> <div className="flex items-center"> <div className="p-2 bg-purple-100 rounded-lg"> <Clock className="h-6 w-6 text-purple-600" /> </div> <div className="ml-4"> <p className="text-sm font-medium text-gray-600">Total Loans</p> <p className="text-2xl font-bold text-gray-900">{
loanHistory.length
}
</p> </div> </div> </div> </div> {

/* Tabs */

}
 <div className="bg-white rounded-lg shadow-sm border mb-6"> <div className="border-b border-gray-200"> <nav className="flex space-x-8 px-6"> <button onClick={
()
 => setActiveTab('active')

}
 className={
`py-4 px-1 border-b-2 font-medium text-sm ${
 activeTab === 'active' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700' 
}
`
}
 > Active Loans ({
activeLoans.length
}
)
 </button> <button onClick={
()
 => setActiveTab('history')

}
 className={
`py-4 px-1 border-b-2 font-medium text-sm ${
 activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700' 
}
`
}
 > Loan History ({
loanHistory.length
}
)
 </button> </nav> </div> </div> {

/* Content */

}
 {
isLoading ? ( <LoadingSpinner size="large" className="py-12" /> )
 : ( <div className="space-y-6"> {
activeTab === 'active' && ( <> {
activeLoans.length === 0 ? ( <div className="text-center py-12"> <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" /> <h3 className="text-lg font-medium text-gray-900 mb-2">No active loans</h3> <p className="text-gray-600"> You haven't borrowed any books yet. Browse our collection to get started! </p> </div> )
 : ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {
activeLoans.map((loan)
 => ( <LoanCard key={
loan.id
}
 loan={
loan
}
 /> )
)

}
 </div> )

}
 </> )

}
 {
activeTab === 'history' && ( <> {
loanHistory.length === 0 ? ( <div className="text-center py-12"> <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" /> <h3 className="text-lg font-medium text-gray-900 mb-2">No loan history</h3> <p className="text-gray-600"> Your loan history will appear here once you start borrowing books. </p> </div> )
 : ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {
loanHistory.map((loan)
 => ( <LoanCard key={
loan.id
}
 loan={
loan
}
 /> )
)

}
 </div> )

}
 </> )

}
 </div> )

}
 {

/* Return Confirmation Modal */

}
 <ConfirmModal isOpen={
showReturnModal
}
 onClose={
()
 => setShowReturnModal(false)

}
 onConfirm={
confirmReturn
}
 title="Return Book" message={
`Are you sure you want to return "${
returningLoan?.ebook?.title
}
"?`
}
 confirmText="Return Book" type="warning" /> </div> </div> )
;
 
}
;
 
export default LoansPage;
 