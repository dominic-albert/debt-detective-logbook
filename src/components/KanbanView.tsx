
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface UXDebt {
  id: string;
  projectId: string;
  title: string;
  screen: string;
  type: 'Visual' | 'Accessibility' | 'Copy' | 'Usability';
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Fixed' | 'Resolved';
  description: string;
  recommendation: string;
  loggedBy: string;
  createdAt: string;
  screenshot?: string;
}

interface KanbanViewProps {
  debts: UXDebt[];
  onStatusChange: (debtId: string, newStatus: UXDebt['status']) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ debts, onStatusChange }) => {
  const columns: { id: UXDebt['status']; title: string; color: string }[] = [
    { id: 'Open', title: 'Open', color: 'bg-red-50 border-red-200' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'Fixed', title: 'Fixed', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'Resolved', title: 'Resolved', color: 'bg-green-50 border-green-200' }
  ];

  const getDebtsByStatus = (status: UXDebt['status']) => {
    return debts.filter(debt => debt.status === status);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Visual': return 'bg-purple-100 text-purple-800';
      case 'Accessibility': return 'bg-blue-100 text-blue-800';
      case 'Copy': return 'bg-orange-100 text-orange-800';
      case 'Usability': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const moveToNextStatus = (debt: UXDebt) => {
    const statusFlow: Record<UXDebt['status'], UXDebt['status'] | null> = {
      'Open': 'In Progress',
      'In Progress': 'Fixed',
      'Fixed': 'Resolved',
      'Resolved': null
    };

    const nextStatus = statusFlow[debt.status];
    if (nextStatus) {
      onStatusChange(debt.id, nextStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
      {columns.map(column => {
        const columnDebts = getDebtsByStatus(column.id);
        return (
          <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {columnDebts.length}
              </Badge>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-full">
              {columnDebts.map(debt => (
                <Card key={debt.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {debt.title}
                      </CardTitle>
                      <Badge className={`text-xs ml-2 ${getSeverityColor(debt.severity)}`}>
                        {debt.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">{debt.screen}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getTypeColor(debt.type)}`}>
                          {debt.type}
                        </Badge>
                        {debt.status !== 'Resolved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveToNextStatus(debt)}
                            className="h-6 w-6 p-0"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {debt.description}
                      </p>
                      
                      <div className="text-xs text-gray-400">
                        By {debt.loggedBy} • {new Date(debt.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {columnDebts.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  No items in {column.title.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanView;
