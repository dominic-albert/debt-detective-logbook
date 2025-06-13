
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, MoreVertical, Edit, Trash, LayoutGrid, Table } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import KanbanView from '@/components/KanbanView';

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
  const [filteredDebts, setFilteredDebts] = useState<UXDebt[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    // Load data from localStorage
    const savedDebts = localStorage.getItem('uxDebts');
    const savedProjects = localStorage.getItem('uxDebtProjects');
    
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts));
    } else {
      // Add placeholder content
      const placeholderDebts: UXDebt[] = [
        {
          id: '1',
          projectId: '1',
          title: 'Button contrast too low on login page',
          screen: 'Login Page',
          type: 'Accessibility',
          severity: 'High',
          status: 'Open',
          description: 'Primary buttons do not meet WCAG AA contrast requirements. Users with visual impairments may have difficulty seeing the buttons.',
          recommendation: 'Update button colors to meet 4.5:1 contrast ratio. Consider using darker blue (#1d4ed8) for better accessibility.',
          loggedBy: 'Sarah Chen',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          projectId: '1',
          title: 'Inconsistent spacing in navigation menu',
          screen: 'Dashboard',
          type: 'Visual',
          severity: 'Medium',
          status: 'In Progress',
          description: 'Navigation items have uneven padding and margins, creating a visually inconsistent experience.',
          recommendation: 'Standardize spacing using design system tokens. Apply consistent 16px padding to all nav items.',
          loggedBy: 'Mike Rodriguez',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          projectId: '2',
          title: 'Confusing error message on form submission',
          screen: 'Contact Form',
          type: 'Copy',
          severity: 'High',
          status: 'Open',
          description: 'Error message "Invalid input" is too generic and doesn\'t help users understand what went wrong.',
          recommendation: 'Provide specific error messages like "Please enter a valid email address" or "Phone number must be 10 digits".',
          loggedBy: 'Jessica Park',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          projectId: '1',
          title: 'Mobile menu difficult to close',
          screen: 'Mobile Navigation',
          type: 'Usability',
          severity: 'Medium',
          status: 'Fixed',
          description: 'Users struggle to close the mobile menu - the X button is too small and close to other interactive elements.',
          recommendation: 'Increase touch target size to 44px minimum and add more spacing around the close button.',
          loggedBy: 'Alex Thompson',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setDebts(placeholderDebts);
      localStorage.setItem('uxDebts', JSON.stringify(placeholderDebts));
    }
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = debts;

    if (searchTerm) {
      filtered = filtered.filter(debt =>
        debt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.screen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(debt => debt.severity === filters.severity);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(debt => debt.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(debt => debt.status === filters.status);
    }

    setFilteredDebts(filtered);
  }, [debts, searchTerm, filters]);

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

  const handleStatusChange = (debtId: string, newStatus: UXDebt['status']) => {
    const updatedDebts = debts.map(debt =>
      debt.id === debtId ? { ...debt, status: newStatus } : debt
    );
    setDebts(updatedDebts);
    localStorage.setItem('uxDebts', JSON.stringify(updatedDebts));
  };

  const handleDeleteDebt = (debtId: string) => {
    const updatedDebts = debts.filter(debt => debt.id !== debtId);
    setDebts(updatedDebts);
    localStorage.setItem('uxDebts', JSON.stringify(updatedDebts));
  };

  const handleEditDebt = (debtId: string) => {
    console.log('Edit debt:', debtId);
    // TODO: Implement edit functionality
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">UX Debt Management</h1>
            <p className="text-gray-600">Track and resolve user experience issues across all projects</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-l-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Log
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search debt entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Accessibility">Accessibility</SelectItem>
                  <SelectItem value="Copy">Copy</SelectItem>
                  <SelectItem value="Usability">Usability</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="space-y-4">
            {filteredDebts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No debt entries found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDebts.map((debt) => (
                <Card key={debt.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{debt.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Badge className={getSeverityColor(debt.severity)}>
                              {debt.severity}
                            </Badge>
                            <Badge className={getStatusColor(debt.status)}>
                              {debt.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {getProjectName(debt.projectId)} • {debt.screen}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDebt(debt.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                        <p className="text-sm text-gray-700">{debt.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Recommendation</h4>
                        <p className="text-sm text-gray-700">{debt.recommendation}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                        <div className="flex items-center space-x-4">
                          <span>Type: {debt.type}</span>
                          <span>By: {debt.loggedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(debt.createdAt).toLocaleDateString()}</span>
                          <Button variant="outline" size="sm" className="h-7">
                            View Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <KanbanView 
            debts={filteredDebts} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default DebtList;
