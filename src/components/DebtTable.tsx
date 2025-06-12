
import React from 'react';
import { Link } from 'react-router-dom';
import { UXDebt } from '../types/debt';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface DebtTableProps {
  debts: UXDebt[];
}

const DebtTable: React.FC<DebtTableProps> = ({ debts }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project & Screen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debts.map((debt) => (
              <tr key={debt.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{debt.project}</div>
                    <div className="text-sm text-gray-500">{debt.screenComponent}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{debt.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SeverityBadge severity={debt.severity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={debt.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(debt.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/debt/${debt.id}`}>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {debts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No UX debt entries found.</p>
        </div>
      )}
    </div>
  );
};

export default DebtTable;
