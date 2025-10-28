import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLoans } from '../contexts/LoanContext';
import { useToast } from '../contexts/ToastContext';
import { BookOpen, Calendar, Clock, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';

// -------------------------
// Helper Functions
// -------------------------
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusColor = (loan) => {
  if (loan?.is_returned) return 'text-green-600 bg-green-100';
  if (loan?.due_date && new Date(loan.due_date) < new Date()) return 'text-red-600 bg-red-100';
  return 'text-blue-600 bg-blue-100';
};

const getStatusText = (loan) => {
  if (loan?.is_returned) return 'Returned';
  if (loan?.due_date && new Date(loan.due_date) < new Date()) return 'Overdue';
  return 'Active';
};

// -------------------------
// Components
// -------------------------
const LoanCard = ({ loan, onReturn }) => {
  if (!loan) return null;
  const daysUntilDue = getDaysUntilDue(loan?.due_date);
  const isOverdue = daysUntilDue < 0 && !loan?.is_returned;

  return (
    <div className="card p-6 bg-white rounded-lg shadow-md border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{loan?.ebook?.title || 'Untitled Book'}</h3>
              <p className="text-gray-600">{loan?.ebook?.author || 'Unknown Author'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Borrowed: {formatDate(loan?.loan_date)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Due: {formatDate(loan?.due_date)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan)}`}>
                {getStatusText(loan)}
              </span>
              {isOverdue && <span className="text-red-600 text-sm font-medium">{Math.abs(daysUntilDue)} days overdue</span>}
              {!loan?.is_returned && !isOverdue && <span className="text-gray-600 text-sm">{daysUntilDue} days remaining</span>}
            </div>
            {!loan?.is_returned && onReturn && (
              <button
                onClick={() => onReturn(loan)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Return</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, bg }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center">
      <div className={`p-2 ${bg} rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const TabButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
  >
    {label} ({count})
  </button>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-12">
    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
    <p className="text-gray-600">Your loans will appear here once you borrow books.</p>
  </div>
);

const LoanGrid = ({ loans, onReturn }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {loans.map((loan) => (
      <LoanCard key={loan?.id} loan={loan} onReturn={onReturn} />
    ))}
  </div>
);

// -------------------------
// Main Component
// -------------------------
const LoansPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { loans = [], isLoading, fetchLoans, returnBook, getUserActiveLoans, getUserLoanHistory, getOverdueLoans } = useLoans();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('active');
  const [returningLoan, setReturningLoan] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchLoans();
  }, [isAuthenticated]);

  const activeLoans = getUserActiveLoans(user?.id) ?? [];
  const loanHistory = getUserLoanHistory(user?.id) ?? [];

  const handleReturn = (loan) => {
    setReturningLoan(loan);
    setShowReturnModal(true);
  };

  const confirmReturn = async () => {
    if (!returningLoan) return;
    try {
      const result = await returnBook(returningLoan.id);
      if (result?.success) {
        success(`Successfully returned "${returningLoan?.ebook?.title || 'book'}"`);
        fetchLoans();
      } else {
        error(result?.error || 'Failed to return book');
      }
    } catch (err) {
      console.error(err);
      error('An error occurred while returning the book');
    } finally {
      setShowReturnModal(false);
      setReturningLoan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
          <p className="text-gray-600 mt-2">Manage your borrowed books and view your loan history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Active Loans" icon={<BookOpen className="h-6 w-6 text-blue-600" />} value={activeLoans.length} bg="bg-blue-100" />
          <StatsCard title="Returned" icon={<CheckCircle className="h-6 w-6 text-green-600" />} value={loanHistory.filter(l => l?.is_returned).length} bg="bg-green-100" />
          <StatsCard title="Overdue" icon={<AlertTriangle className="h-6 w-6 text-red-600" />} value={activeLoans.filter(l => l?.due_date && new Date(l.due_date) < new Date()).length} bg="bg-red-100" />
          <StatsCard title="Total Loans" icon={<Clock className="h-6 w-6 text-purple-600" />} value={loanHistory.length} bg="bg-purple-100" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton label="Active Loans" count={activeLoans.length} active={activeTab === 'active'} onClick={() => setActiveTab('active')} />
              <TabButton label="Loan History" count={loanHistory.length} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            </nav>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner size="large" className="py-12" />
        ) : (
          <div className="space-y-6">
            {activeTab === 'active' ? (
              activeLoans.length === 0 ? <EmptyState message="No active loans" /> : <LoanGrid loans={activeLoans} onReturn={handleReturn} />
            ) : (
              loanHistory.length === 0 ? <EmptyState message="No loan history" /> : <LoanGrid loans={loanHistory} onReturn={handleReturn} />
            )}
          </div>
        )}

        {/* Return Modal */}
        <ConfirmModal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          onConfirm={confirmReturn}
          title="Return Book"
          message={`Are you sure you want to return "${returningLoan?.ebook?.title || 'this book'}"?`}
          confirmText="Return Book"
          type="warning"
        />
      </div>
    </div>
  );
};

export default LoansPage;
