import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoansPage() {

  const [loans, setLoans] = useState([
    {
      id: "1",
      chama: "Ujenzi Chama",
      amount: "KSH 15,000",
      appliedDate: "Apr 20, 2025",
      status: "Approved",
      dueDate: "Jul 20, 2025",
    },
    {
      id: "2",
      chama: "Mwanzo Chama",
      amount: "KSH 8,000",
      appliedDate: "Mar 10, 2025",
      status: "Repaid",
      dueDate: "Jun 10, 2025",
    },
    {
      id: "3",
      chama: "Ujenzi Chama",
      amount: "KSH 20,000",
      appliedDate: "Feb 5, 2025",
      status: "Rejected",
      dueDate: "N/A",
    },
  ]);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [form, setForm] = useState({ chama: "", amount: "" });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!form.chama || !form.amount) return;
    const newLoan = {
      id: Date.now().toString(),
      chama: form.chama,
      amount: `KSH ${parseFloat(form.amount).toLocaleString()}`,
      appliedDate: new Date().toLocaleDateString(),
      status: "Pending",
      dueDate: "TBD",
    };
    setLoans([newLoan, ...loans]);
    setShowApplyForm(false);
    setForm({ chama: "", amount: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Loans</h1>
            <p className="text-lg text-blue-50">Manage your chama loans</p>
          </div>
          <button
            onClick={() => setShowApplyForm(true)}
            className="mt-6 md:mt-0 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center text-base transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <span className="mr-2 text-2xl">+</span> Apply for Loan
          </button>
        </div>

        {/* Apply Loan Modal */}
        {showApplyForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                onClick={() => setShowApplyForm(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Apply for a New Loan</h2>
              <form onSubmit={handleApply} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Chama Name</label>
                  <input
                    type="text"
                    name="chama"
                    value={form.chama}
                    onChange={handleFormChange}
                    className="w-full border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter chama name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Loan Amount (KSH)</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    className="w-full border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter amount"
                    required
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loans Table/Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Loan History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 sm:table">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Chama</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Applied Date</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-2 sm:px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => (
                  <tr key={loan.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-medium">{loan.chama}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-700 font-bold">{loan.amount}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">{loan.appliedDate}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${loan.status === 'Approved' ? 'bg-green-100 text-green-700' : loan.status === 'Repaid' ? 'bg-blue-100 text-blue-700' : loan.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{loan.status}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">{loan.dueDate}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                      <Link
                        to={`/loan-details/${loan.id}`}
                        state={{ loan }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View more
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoansPage;
