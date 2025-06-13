
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink, GripVertical } from 'lucide-react';

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
  figmaLink?: string;
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
    { id: 'Fixed', title: 'Fixed', color: 'bg-amber-50 border-amber-200' },
    { id: 'Resolved', title: 'Resolved', color: 'bg-emerald-50 border-emerald-200' }
  ];

  const getDebtsByStatus = (status: UXDebt['status']) => {
    return debts.filter(debt => debt.status === status);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
          <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="outline" className="text-xs bg-white/70">
                {columnDebts.length}
              </Badge>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-full">
              {columnDebts.map(debt => (
                <Card key={debt.id} className="shadow-sm hover:shadow-lg transition-all duration-200 cursor-move group bg-white/80 backdrop-blur-sm border-violet-200 hover:border-violet-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1">
                        <GripVertical className="h-4 w-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                        <CardTitle className="text-sm font-medium line-clamp-2 text-violet-900">
                          {debt.title}
                        </CardTitle>
                      </div>
                      <Badge className={`text-xs ml-2 ${getSeverityColor(debt.severity)}`}>
                        {debt.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-xs text-violet-600 font-medium">{debt.screen}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getTypeColor(debt.type)}`}>
                          {debt.type}
                        </Badge>
                        {debt.status !== 'Resolved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveToNextStatus(debt)}
                            className="h-6 w-6 p-0 hover:bg-violet-100"
                            title="Move to next status"
                          >
                            <ChevronRight className="h-3 w-3 text-violet-600" />
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-violet-500 line-clamp-2">
                        {debt.description}
                      </p>
                      
                      {debt.figmaLink && (
                        <div className="flex items-center text-xs text-violet-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <a 
                            href={debt.figmaLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Figma Link
                          </a>
                        </div>
                      )}
                      
                      <div className="text-xs text-violet-400">
                        By {debt.loggedBy} • {new Date(debt.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {columnDebts.length === 0 && (
                <div className="text-center text-violet-500 text-sm py-8 bg-white/50 rounded-lg border-2 border-dashed border-violet-300">
                  No items in {column.title.toLowerCase()}
                  <p className="text-xs mt-1 text-violet-400">Drag items here</p>
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
