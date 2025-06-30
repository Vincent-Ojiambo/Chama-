import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminLoanDetailsPage({ loans = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loans && loans.length > 0) {
      const foundLoan = loans.find(loan => loan.id === id);
      if (foundLoan) {
        // Add mock payment data for demo purposes
        const loanWithPayments = {
          ...foundLoan,
          payments: foundLoan.payments || [
            { id: "P1", date: foundLoan.dateIssued, amount: foundLoan.amount / 6, status: "completed" },
            { id: "P2", date: new Date(new Date(foundLoan.dateIssued).setMonth(new Date(foundLoan.dateIssued).getMonth() + 1)).toISOString().split('T')[0], amount: foundLoan.amount / 6, status: "completed" },
            { id: "P3", date: new Date(new Date(foundLoan.dateIssued).setMonth(new Date(foundLoan.dateIssued).getMonth() + 2)).toISOString().split('T')[0], amount: foundLoan.amount / 6, status: "pending" },
            { id: "P4", date: new Date(new Date(foundLoan.dateIssued).setMonth(new Date(foundLoan.dateIssued).getMonth() + 3)).toISOString().split('T')[0], amount: foundLoan.amount / 6, status: "upcoming" },
            { id: "P5", date: new Date(new Date(foundLoan.dateIssued).setMonth(new Date(foundLoan.dateIssued).getMonth() + 4)).toISOString().split('T')[0], amount: foundLoan.amount / 6, status: "upcoming" },
            { id: "P6", date: foundLoan.dueDate, amount: foundLoan.amount / 6, status: "upcoming" },
          ],
          guarantors: foundLoan.guarantors || [
            { id: "G1", name: "Jane Smith", status: "approved" },
            { id: "G2", name: "Mike Johnson", status: "pending" },
          ]
        };
        setLoan(loanWithPayments);
        setError('');
      } else {
        setError('Loan not found');
      }
      setLoading(false);
    } else {
      // If no loans are passed as props, try to fetch from localStorage
      try {
        const savedLoans = JSON.parse(localStorage.getItem('loans') || '[]');
        const foundLoan = savedLoans.find(loan => loan.id === id);
        if (foundLoan) {
          setLoan(foundLoan);
        } else {
          setError('Loan not found');
        }
      } catch (err) {
        console.error('Error loading loans from localStorage:', err);
        setError('Failed to load loan details');
      }
      setLoading(false);
    }
  }, [id, loans]);

  const handleApprovePayment = (paymentId) => {
    // In a real app, this would update the payment status via API
    console.log(`Approving payment ${paymentId}`);
    // Update the local state for demo purposes
    setLoan(prev => ({
      ...prev,
      payments: prev.payments.map(p => 
        p.id === paymentId ? { ...p, status: 'completed' } : p
      )
    }));
  };

  const handleRejectLoan = () => {
    // In a real app, this would update the loan status via API
    console.log('Rejecting loan');
    setLoan(prev => ({ ...prev, status: 'rejected' }));
  };

  const handleApproveLoan = () => {
    // In a real app, this would update the loan status via API
    console.log('Approving loan');
    setLoan(prev => ({ ...prev, status: 'active' }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    // Handle undefined or null status
    if (!status) {
      status = 'pending'; // Default status if not provided
    }
    
    const statusStr = String(status).toLowerCase();
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      upcoming: "bg-gray-100 text-gray-800",
      default: "bg-gray-100 text-gray-800"
    };
    
    const displayStatus = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    const className = statusClasses[statusStr] || statusClasses.default;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {displayStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loan Not Found</h2>
          <p className="text-gray-600 mb-6">The requested loan could not be found or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/admin/loans')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Loans
          </button>
        </div>
      </div>
    );
  }

  const totalPaid = loan.payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalRemaining = loan.amount - totalPaid;
  const nextPayment = loan.payments.find(p => p.status === 'pending' || p.status === 'upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Loans
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Details</h1>
              <p className="text-gray-500">Loan ID: {loan.id}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {loan.status === 'pending' && (
                <>
                  <button
                    onClick={handleApproveLoan}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Loan
                  </button>
                  <button
                    onClick={handleRejectLoan}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Loan
                  </button>
                </>
              )}
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Borrower</p>
                  <p className="font-medium">{loan.member} <span className="text-gray-500 text-sm">(ID: {loan.memberId})</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="font-medium">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}% p.a.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Frequency</p>
                  <p className="font-medium">{loan.paymentFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Issued</p>
                  <p className="font-medium">{new Date(loan.dateIssued).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(loan.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">{loan.purpose}</p>
                </div>
              </div>
              {loan.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{loan.notes}</p>
                </div>
              )}
            </div>

            {/* Payment Schedule */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loan.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Mark as Paid
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900">
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest ({loan.interestRate}%):</span>
                  <span className="font-medium">{formatCurrency(loan.amount * (loan.interestRate / 100))}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Total Payable:</span>
                  <span className="font-bold">{formatCurrency(loan.amount * (1 + loan.interestRate / 100))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-green-600 font-medium">{formatCurrency(totalPaid)}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-medium">Remaining Balance:</span>
                  <span className="font-bold">{formatCurrency(totalRemaining)}</span>
                </div>
              </div>
            </div>

            {/* Next Payment */}
            {nextPayment && (
              <div className="bg-blue-50 rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-3">Next Payment</h2>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(nextPayment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-xl font-bold text-blue-700">{formatCurrency(nextPayment.amount)}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Record Payment
                  </button>
                </div>
              </div>
            )}

            {/* Guarantors */}
            {loan.guarantors && loan.guarantors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Guarantors</h2>
                <div className="space-y-3">
                  {loan.guarantors.map(guarantor => (
                    <div key={guarantor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{guarantor.name}</p>
                        <p className="text-sm text-gray-500">ID: {guarantor.id}</p>
                      </div>
                      {guarantor.status === 'approved' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoanDetailsPage;
