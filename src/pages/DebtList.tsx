
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

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

const DebtList: React.FC = () => {
  const [debts, setDebts] = useState<UXDebt[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedDebts = localStorage.getItem('uxDebts');
    const savedProjects = localStorage.getItem('uxDebtProjects');
    
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts));
    }
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Fixed': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All UX Debt</h1>
            <p className="text-gray-600">View and manage all UX debt entries across projects</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Debt List */}
        <div className="space-y-4">
          {debts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No debt entries yet</h3>
              <p className="text-gray-600">Start by creating your first UX debt entry</p>
            </div>
          ) : (
            debts.map((debt) => (
              <Card key={debt.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{debt.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {getProjectName(debt.projectId)} • {debt.screen}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getSeverityColor(debt.severity)}>
                        {debt.severity}
                      </Badge>
                      <Badge className={getStatusColor(debt.status)}>
                        {debt.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{debt.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Type: {debt.type}</span>
                        <span>By: {debt.loggedBy}</span>
                      </div>
                      <span>{new Date(debt.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DebtList;
