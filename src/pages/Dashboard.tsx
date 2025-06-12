
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockDebts } from '../data/mockData';
import { FilterState } from '../types/debt';
import DebtTable from '../components/DebtTable';
import FilterBar from '../components/FilterBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    projects: [],
    severity: '',
    type: '',
    status: '',
    search: '',
    dateRange: ''
  });

  const filteredDebts = useMemo(() => {
    return mockDebts.filter(debt => {
      // Project filter
      if (filters.projects.length > 0 && filters.projects[0] && !filters.projects.includes(debt.project)) {
        return false;
      }

      // Severity filter
      if (filters.severity && debt.severity !== filters.severity) {
        return false;
      }

      // Type filter
      if (filters.type && debt.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && debt.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          debt.description.toLowerCase().includes(searchTerm) ||
          debt.recommendation.toLowerCase().includes(searchTerm) ||
          debt.screenComponent.toLowerCase().includes(searchTerm) ||
          debt.project.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [filters]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">UX Debt Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track and manage UX debt across all projects
          </p>
        </div>
        <Link to="/new">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Debt
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-gray-900">{mockDebts.length}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-red-600">
            {mockDebts.filter(d => d.status === 'Open').length}
          </div>
          <div className="text-sm text-gray-600">Open Items</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-amber-600">
            {mockDebts.filter(d => d.severity === 'High').length}
          </div>
          <div className="text-sm text-gray-600">High Severity</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-semibold text-green-600">
            {mockDebts.filter(d => d.status === 'Resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <DebtTable debts={filteredDebts} />

      {/* Results summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredDebts.length} of {mockDebts.length} entries
      </div>
    </div>
  );
};

export default Dashboard;
