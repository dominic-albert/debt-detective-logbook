
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowLeft, LayoutGrid, Table, Search } from 'lucide-react';
import DebtEntryModal from '../components/DebtEntryModal';
import KanbanView from '../components/KanbanView';

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

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [debts, setDebts] = useState<UXDebt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<UXDebt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (!projectId) return;

    // Load project data
    const savedProjects = localStorage.getItem('uxDebtProjects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const currentProject = projects.find((p: any) => p.id === projectId);
      if (currentProject) {
        setProject(currentProject);
      } else {
        navigate('/projects');
        return;
      }
    }

    // Load debts for this project
    loadDebts();
  }, [projectId, navigate]);

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

  const loadDebts = () => {
    const savedDebts = localStorage.getItem('uxDebts');
    if (savedDebts) {
      const allDebts: UXDebt[] = JSON.parse(savedDebts);
      const projectDebts = allDebts.filter(debt => debt.projectId === projectId);
      setDebts(projectDebts);
    } else {
      // Initialize with demo data for this project
      const demoDebts: UXDebt[] = [
        {
          id: '1',
          projectId: projectId!,
          title: 'Button contrast too low',
          screen: 'Login Page',
          type: 'Accessibility',
          severity: 'High',
          status: 'Open',
          description: 'Primary buttons do not meet WCAG AA contrast requirements',
          recommendation: 'Update button colors to meet 4.5:1 contrast ratio',
          loggedBy: 'Design Team',
          createdAt: new Date().toISOString()
        }
      ];
      setDebts(demoDebts);
      localStorage.setItem('uxDebts', JSON.stringify(demoDebts));
    }
  };

  const handleDebtCreated = (newDebt: Omit<UXDebt, 'id' | 'createdAt'>) => {
    const debt: UXDebt = {
      ...newDebt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const savedDebts = localStorage.getItem('uxDebts');
    const allDebts: UXDebt[] = savedDebts ? JSON.parse(savedDebts) : [];
    const updatedDebts = [...allDebts, debt];
    
    localStorage.setItem('uxDebts', JSON.stringify(updatedDebts));
    loadDebts();
  };

  const handleStatusChange = (debtId: string, newStatus: UXDebt['status']) => {
    const savedDebts = localStorage.getItem('uxDebts');
    if (savedDebts) {
      const allDebts: UXDebt[] = JSON.parse(savedDebts);
      const updatedDebts = allDebts.map(debt =>
        debt.id === debtId ? { ...debt, status: newStatus } : debt
      );
      localStorage.setItem('uxDebts', JSON.stringify(updatedDebts));
      loadDebts();
    }
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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/projects')} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
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
              
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log New UX Debt
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search debts..."
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
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'table' ? (
          <Card>
            <CardHeader>
              <CardTitle>UX Debt Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Screen</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Severity</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Logged By</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDebts.map((debt) => (
                      <tr key={debt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{debt.title}</td>
                        <td className="py-3">{debt.screen}</td>
                        <td className="py-3">{debt.type}</td>
                        <td className="py-3">
                          <Badge className={getSeverityColor(debt.severity)}>{debt.severity}</Badge>
                        </td>
                        <td className="py-3">
                          <Badge className={getStatusColor(debt.status)}>{debt.status}</Badge>
                        </td>
                        <td className="py-3">{debt.loggedBy}</td>
                        <td className="py-3">{new Date(debt.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredDebts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No UX debt entries found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <KanbanView 
            debts={filteredDebts} 
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Debt Entry Modal */}
      <DebtEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDebtCreated={handleDebtCreated}
        projectId={projectId!}
      />
    </div>
  );
};

export default ProjectDashboard;
