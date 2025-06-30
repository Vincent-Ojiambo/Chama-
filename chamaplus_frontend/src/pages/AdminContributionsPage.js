import React, { useState } from 'react';
import { Wallet, CheckCircle, XCircle } from 'lucide-react';

function AdminContributionsPage() {
  // Sample admin data structure
  const [chamas, setChamas] = useState([
    {
      id: '1',
      name: 'Mwanzo Chama',
      totalFunds: 'KSH 145,000',
      members: [
        {
          name: 'John Doe',
          role: 'Member',
          pendingContributions: [
            { date: 'Apr 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Pending', receipt: 'MPESA_123456' },
            { date: 'Mar 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed', receipt: 'MPESA_123457' }
          ],
          completedContributions: [
            { date: 'Feb 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed', receipt: 'MPESA_123458' },
            { date: 'Jan 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed', receipt: 'MPESA_123459' }
          ]
        },
        {
          name: 'Jane Smith',
          role: 'Member',
          pendingContributions: [
            { date: 'Apr 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Pending', receipt: 'MPESA_123460' }
          ],
          completedContributions: [
            { date: 'Mar 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed', receipt: 'MPESA_123461' },
            { date: 'Feb 15, 2025', amount: 'KSH 2,000', method: 'M-Pesa', status: 'Completed', receipt: 'MPESA_123462' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Ujenzi Chama',
      totalFunds: 'KSH 98,000',
      members: [
        {
          name: 'Peter Kimani',
          role: 'Treasurer',
          pendingContributions: [
            { date: 'Apr 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Pending', receipt: 'BANK_123456' }
          ],
          completedContributions: [
            { date: 'Mar 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed', receipt: 'BANK_123457' },
            { date: 'Feb 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed', receipt: 'BANK_123458' }
          ]
        },
        {
          name: 'Sarah Mwangi',
          role: 'Member',
          pendingContributions: [],
          completedContributions: [
            { date: 'Apr 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed', receipt: 'BANK_123459' },
            { date: 'Mar 10, 2025', amount: 'KSH 3,000', method: 'Bank', status: 'Completed', receipt: 'BANK_123460' }
          ]
        }
      ]
    }
  ]);

  // State for filters
  const [selectedMember, setSelectedMember] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Get filtered contributions
  const filteredContributions = (chamas[0]?.members || [])
    .filter(member => !selectedMember || member.name === selectedMember)
    .flatMap(member => {
      const memberContributions = [
        ...(member.pendingContributions || []),
        ...(member.completedContributions || [])
      ];
      return memberContributions.map(contrib => ({
        ...contrib,
        memberName: member.name,
        chamaId: chamas.find(c => c.members.some(m => m.name === member.name))?.id || ''
      }));
    })
    .filter(contrib => !statusFilter || contrib.status === statusFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Handle contribution approval/rejection
  const handleContributionStatus = (contribution, status) => {
    setChamas(prevChamas => {
      return prevChamas.map(chama => {
        return {
          ...chama,
          members: chama.members.map(member => {
            const updatedMember = {
              ...member,
              pendingContributions: member.pendingContributions.map(pending => 
                pending.receipt === contribution.receipt ? { ...pending, status } : pending
              ),
              completedContributions: member.completedContributions.map(completed => 
                completed.receipt === contribution.receipt ? { ...completed, status } : completed
              )
            };
            return updatedMember;
          })
        };
      });
    });
  };

  // Calculate aggregate total
  const aggregateTotal = (chamas[0]?.members || [])
    .reduce((total, member) => {
      return total + (member.completedContributions || []).reduce((contribTotal, contrib) => {
        try {
          const amount = parseFloat(contrib.amount.toString().replace(/[^\d.]/g, ''));
          return isNaN(amount) ? contribTotal : contribTotal + amount;
        } catch (e) {
          console.error('Error parsing amount:', contrib.amount, e);
          return contribTotal;
        }
      }, 0);
    }, 0) || 0;

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Manage Chama Contributions</h1>
        
        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full text-sm sm:text-base px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="">All Members</option>
              {chamas.flatMap(chama => chama.members || []).map((member, index) => (
                <option key={`${member.name}-${index}`} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-sm sm:text-base px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {aggregateTotal > 0 ? (
            <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="mb-2 p-2 sm:p-3 rounded-full bg-gradient-to-tr from-green-300 via-blue-200 to-purple-200">
                <Wallet className="text-green-700 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-semibold text-base sm:text-lg text-gray-800">Total Contributions</div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-1">
                KSH {aggregateTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="mb-2 p-2 sm:p-3 rounded-full bg-gradient-to-tr from-green-300 via-blue-200 to-purple-200">
                <Wallet className="text-green-700 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-semibold text-base sm:text-lg text-gray-800">{chamas[0]?.name || 'No Chama Selected'}</div>
              <div className="text-xs text-gray-500 mb-1">Total Funds: {chamas[0]?.totalFunds || 'N/A'}</div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-1">
                {chamas[0]?.members?.reduce((total, member) => 
                  total + (member.completedContributions || []).reduce((sum, contrib) => {
                    try {
                      return sum + parseFloat(contrib.amount?.toString().replace(/[^\d.]/g, '') || 0);
                    } catch (e) {
                      return sum;
                    }
                  }, 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                }
              </div>
            </div>
          )}
        </div>

        {/* Contribution Table */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">Contribution History</h2>
          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="hidden sm:table-header-group">
                <tr>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Member</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Chama</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Method</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContributions.map((contrib) => {
                  const member = chamas.flatMap(chama => chama.members || [])
                    .find(m => (m.pendingContributions || []).some(c => c.receipt === contrib.receipt) ||
                         (m.completedContributions || []).some(c => c.receipt === contrib.receipt));
                  const chama = chamas.find(c => c.members?.some(m => m.name === member?.name));
                  
                  if (!member || !chama) return null;
                  
                  return (
                    <tr 
                      key={`${contrib.receipt}-${contrib.status}`} 
                      className="hover:bg-blue-50 transition-colors block sm:table-row border-b sm:border-b-0 last:border-b-0"
                    >
                      {/* Mobile View */}
                      <td className="block sm:hidden px-2 sm:px-3 py-3 text-sm text-gray-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {chama.name} • {contrib.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{contrib.amount}</div>
                            <div className="text-xs">
                              {contrib.status === 'Completed' ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  {contrib.status}
                                </span>
                              ) : contrib.status === 'Rejected' ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                  {contrib.status}
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                  {contrib.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          {contrib.status === 'Pending' ? (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleContributionStatus(contrib, 'Completed')}
                                className="flex-1 sm:flex-none flex items-center justify-center px-2 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleContributionStatus(contrib, 'Rejected')}
                                className="flex-1 sm:flex-none flex items-center justify-center px-2 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">
                              Method: {contrib.method}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Desktop View */}
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {member.name}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {chama.name}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {contrib.date}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {contrib.amount}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {contrib.method}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          contrib.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          contrib.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {contrib.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-sm text-right">
                        {contrib.status === 'Pending' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleContributionStatus(contrib, 'Completed')}
                              className="inline-flex items-center px-2 py-1 text-xs sm:px-3 sm:py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              onClick={() => handleContributionStatus(contrib, 'Rejected')}
                              className="inline-flex items-center px-2 py-1 text-xs sm:px-3 sm:py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredContributions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                      No contributions found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminContributionsPage;
