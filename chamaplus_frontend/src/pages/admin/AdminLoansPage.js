import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminLoansPage({ loans = [], setLoans }) {
  // Default loans data if none is provided
  const defaultLoans = [
    {
      id: "1",
      member: "John Doe",
      amount: 50000,
      status: "active",
      dateIssued: "2025-05-01",
      dueDate: "2025-11-01",
      interestRate: 10,
      purpose: "Business expansion",
      payments: [
        { date: "2025-06-01", amount: 10000 },
        { date: "2025-07-01", amount: 10000 }
      ]
    },
    {
      id: "2",
      member: "Jane Smith",
      amount: 30000,
      status: "pending",
      dateIssued: "2025-05-15",
      dueDate: "2025-08-15",
      interestRate: 8,
      purpose: "School fees",
      payments: []
    },
    {
      id: "3",
      member: "Mike Johnson",
      amount: 25000,
      status: "paid",
      dateIssued: "2025-04-10",
      dueDate: "2025-07-10",
      interestRate: 12,
      purpose: "Medical bills",
      payments: [
        { date: "2025-05-10", amount: 25000 }
      ]
    }
  ];
  
  // Use the provided loans or default to sample data
  const [localLoans, setLocalLoans] = useState(loans.length > 0 ? loans : defaultLoans);
  
  // Update local loans when the prop changes
  useEffect(() => {
    if (loans.length > 0) {
      setLocalLoans(loans);
    }
  }, [loans]);

  const [showNewLoanForm, setShowNewLoanForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredLoans, setFilteredLoans] = useState([]);
  
  // Update filtered loans when status filter or loans change
  useEffect(() => {
    const filtered = (selectedStatus === "all" 
      ? [...localLoans] 
      : localLoans.filter(loan => loan.status === selectedStatus))
      .sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued));
    
    setFilteredLoans(filtered);
  }, [selectedStatus, localLoans]);

  const [formData, setFormData] = useState({
    member: "",
    amount: "",
    purpose: "",
    interestRate: 10,
    dueDate: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApproveLoan = (loanId) => {
    // In a real app, this would make an API call to approve the loan
    console.log(`Approving loan ${loanId}`);
    // Update the local state for demo purposes
    const updatedLoans = localLoans.map(loan => 
      loan.id === loanId ? { ...loan, status: 'active' } : loan
    );
    setLocalLoans(updatedLoans);
    
    // If setLoans is provided, update the parent state as well
    if (setLoans) {
      setLoans(updatedLoans);
    }
  };

  const handleRejectLoan = (loanId) => {
    // In a real app, this would make an API call to reject the loan
    console.log(`Rejecting loan ${loanId}`);
    // Update the local state for demo purposes
    const updatedLoans = localLoans.map(loan => 
      loan.id === loanId ? { ...loan, status: 'rejected' } : loan
    );
    setLocalLoans(updatedLoans);
    
    // If setLoans is provided, update the parent state as well
    if (setLoans) {
      setLoans(updatedLoans);
    }
  };

  const handleSubmitNewLoan = (e) => {
    e.preventDefault();
    const newLoan = {
      id: Date.now().toString(),
      member: formData.member,
      amount: parseFloat(formData.amount),
      status: "pending",
      dateIssued: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      interestRate: parseFloat(formData.interestRate),
      purpose: formData.purpose,
      payments: []
    };
    
    setLoans([...loans, newLoan]);
    setShowNewLoanForm(false);
    setFormData({
      member: "",
      amount: "",
      purpose: "",
      interestRate: 10,
      dueDate: ""
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status.toLowerCase()] || statusClasses.default}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4">
      <div className="flex items-center mb-6">
        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 sm:mb-2 drop-shadow-lg">Loan Management</h1>
              <p className="text-sm sm:text-base text-blue-50">Manage and track all chama loans</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 pr-8 w-full"
                >
                  <option value="all" className="bg-white text-gray-800">All Loans</option>
                  <option value="pending" className="bg-white text-gray-800">Pending</option>
                  <option value="active" className="bg-white text-gray-800">Active</option>
                  <option value="paid" className="bg-white text-gray-800">Paid</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowNewLoanForm(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow-md transition-all whitespace-nowrap"
              >
                + New Loan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Loans</p>
            <p className="text-2xl font-bold">{filteredLoans.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold">{filteredLoans.filter(l => l.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Amount Disbursed</p>
            <p className="text-2xl font-bold">
              {formatCurrency(filteredLoans.reduce((sum, loan) => sum + loan.amount, 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Pending Approval</p>
            <p className="text-2xl font-bold">{loans.filter(l => l.status === 'pending').length}</p>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Issued
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {loan.member.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{loan.member}</div>
                          <div className="text-sm text-gray-500">{loan.purpose}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{formatCurrency(loan.amount)}</div>
                      <div className="text-sm text-gray-500">{loan.interestRate}% interest</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(loan.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.dateIssued).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/loans/${loan.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                      {loan.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveLoan(loan.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-1 sm:mt-0"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectLoan(loan.id)}
                            className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-1 sm:mt-0"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {loan.status === 'active' && (
                        <button 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-1 sm:mt-0"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Loan Modal */}
      {showNewLoanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Loan</h3>
                <button
                  onClick={() => setShowNewLoanForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitNewLoan} className="space-y-4">
                <div>
                  <label htmlFor="member" className="block text-sm font-medium text-gray-700">Member Name</label>
                  <input
                    type="text"
                    id="member"
                    name="member"
                    value={formData.member}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (KES)</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                    <input
                      type="number"
                      id="interestRate"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                  <input
                    type="text"
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewLoanForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Loan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLoansPage;
