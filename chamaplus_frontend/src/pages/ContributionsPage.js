import React from "react";
import { Wallet, User, Calendar } from "lucide-react";
import StatCard from "../components/StatCard";
import { useNavigate, Link } from "react-router-dom";

function ContributionsPage() {
  const navigate = useNavigate();
  // Sample data for two chamas
  React.useEffect(() => {
    if (!localStorage.getItem('myChamas')) {
      const sampleChamas = [
        {
          id: '1',
          name: 'Mwanzo Chama',
          role: 'Member',
          totalFunds: 'KSH 145,000',
          contributionHistory: [
            { date: 'Apr 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed' },
            { date: 'Mar 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed' },
            { date: 'Feb 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed' },
            { date: 'Jan 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed' },
          ],
        },
        {
          id: '2',
          name: 'Ujenzi Chama',
          role: 'Treasurer',
          totalFunds: 'KSH 98,000',
          contributionHistory: [
            { date: 'Apr 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed' },
            { date: 'Mar 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed' },
            { date: 'Feb 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed' },
            { date: 'Jan 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed' },
          ],
        },
      ];
      localStorage.setItem('myChamas', JSON.stringify(sampleChamas));
      // Force reload to update state after setting localStorage
      window.location.reload();
    }
  }, []);

  const myChamas = JSON.parse(localStorage.getItem('myChamas') || '[]');

  // Filtering state
  const [selectedChamaIds, setSelectedChamaIds] = React.useState(myChamas.map(c => c.id));

  const allSelected = selectedChamaIds.length === myChamas.length && myChamas.length > 0;
  const handleSelectAll = (e) => {
    setSelectedChamaIds(e.target.checked ? myChamas.map(c => c.id) : []);
  };

  const handleChamaFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedChamaIds(prev => checked ? [...prev, value] : prev.filter(id => id !== value));
  };

  const filteredChamas = myChamas.filter(c => selectedChamaIds.includes(c.id));
  const contributionHistories = filteredChamas.map(chama => ({
    chamaName: chama.name,
    history: chama.contributionHistory || []
  }));

  // Aggregate totals if all selected
  let aggregateTotal = null;
  if (allSelected && filteredChamas.length > 1) {
    let totalFunds = 0;
    let allContributions = [];
    filteredChamas.forEach(chama => {
      // Remove non-numeric characters for summing
      const amount = parseInt((chama.totalFunds || '0').replace(/[^\d]/g, ''));
      totalFunds += isNaN(amount) ? 0 : amount;
      allContributions = allContributions.concat(chama.contributionHistory || []);
    });
    aggregateTotal = {
      totalFunds: `KSH ${totalFunds.toLocaleString()}`,
      contributionHistory: allContributions.sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  }

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
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">My Chama Contributions</h1>
              <p className="text-sm text-blue-50 mb-2">
                {filteredChamas.length === 1
                  ? `My Chamas > ${filteredChamas[0].name} > Contributions`
                  : 'My Chamas > Contributions'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Chamas */}
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-4 items-center">
          <span className="font-semibold text-gray-700 mr-2">Filter Chamas:</span>
          <label className="flex items-center gap-2 text-sm text-blue-700 font-semibold">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Select All
          </label>
          {myChamas.map(chama => (
            <label key={chama.id} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                value={chama.id}
                checked={selectedChamaIds.includes(chama.id)}
                onChange={handleChamaFilterChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              {chama.name}
            </label>
          ))}
        </div>

        {/* Stats Cards for each chama or aggregate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {aggregateTotal ? (
            <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow p-6 flex flex-col items-center text-center col-span-1 md:col-span-2 lg:col-span-3">
              <div className="mb-2 p-3 rounded-full bg-gradient-to-tr from-green-300 via-blue-200 to-purple-200">
                <Wallet className="text-green-700 text-2xl" />
              </div>
              <div className="font-semibold text-lg text-gray-800">All Selected Chamas</div>
              <div className="text-xs text-gray-500 mb-1">Role: Multiple</div>
              <div className="text-xs text-gray-500 mb-1">Total Contributions</div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-1">{aggregateTotal.totalFunds}</div>
            </div>
          ) : (
            filteredChamas.map((chama, idx) => (
              <div key={chama.id || idx} className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow p-6 flex flex-col items-center text-center">
                <div className="mb-2 p-3 rounded-full bg-gradient-to-tr from-green-300 via-blue-200 to-purple-200">
                  <Wallet className="text-green-700 text-2xl" />
                </div>
                <div className="font-semibold text-lg text-gray-800">{chama.name}</div>
                <div className="text-xs text-gray-500 mb-1">Role: {chama.role}</div>
                <div className="text-xs text-gray-500 mb-1">Total Contributions</div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-1">{chama.totalFunds}</div>
              </div>
            ))
          )}
        </div>

        {/* Contribution History for each chama or aggregate */}
        {aggregateTotal ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">All Selected Chamas - Contribution History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregateTotal.contributionHistory.map((contrib, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-medium">{contrib.date}</td>
                      <td className="px-4 py-3 text-blue-700 font-bold">{contrib.amount}</td>
                      <td className="px-4 py-3 text-gray-600">{contrib.method}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${contrib.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{contrib.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          contributionHistories.map(({ chamaName, history }, idx) => (
            <div key={chamaName || idx} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">{chamaName} - Contribution History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((contrib, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium">{contrib.date}</td>
                        <td className="px-4 py-3 text-blue-700 font-bold">{contrib.amount}</td>
                        <td className="px-4 py-3 text-gray-600">{contrib.method}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                            ${contrib.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{contrib.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContributionsPage; // Add the default export
