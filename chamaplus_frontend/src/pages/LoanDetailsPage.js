import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoanDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const loan = location.state?.loan;
  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-gray-600">No Loan selected.</div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/loans');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h1 className="text-2xl font-extrabold text-blue-800 mb-4">Loan Details</h1>
        <div className="mb-4 text-gray-700">
          <strong>Chama:</strong> {loan.chama}
        </div>
        <div className="mb-4 text-gray-700">
          <strong>Amount:</strong> {loan.amount}
        </div>
        <div className="mb-4 text-gray-700">
          <strong>Applied Date:</strong> {loan.appliedDate}
        </div>
        <div className="mb-4 text-gray-700">
          <strong>Status:</strong> {loan.status}
        </div>
        <div className="mb-4 text-gray-700">
          <strong>Due Date:</strong> {loan.dueDate}
        </div>
        {/* Add more details here as needed, such as repayment schedule, interest, etc. */}
        <button
          className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg text-base transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={handleBack}
        >
          Back to Loans
        </button>
      </div>
    </div>
  );
}

export default LoanDetailsPage;
