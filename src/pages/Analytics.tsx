
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

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

const Analytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
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

  // Filter debts based on selected filters
  const filteredDebts = debts.filter(debt => {
    if (projectFilter !== 'all' && debt.projectId !== projectFilter) {
      return false;
    }
    
    if (timeFilter !== 'all') {
      const debtDate = new Date(debt.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - debtDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (timeFilter) {
        case '30d':
          return daysDiff <= 30;
        case '90d':
          return daysDiff <= 90;
        case '1y':
          return daysDiff <= 365;
        default:
          return true;
      }
    }
    
    return true;
  });

  // Data processing for charts
  const typeData = Object.entries(
    filteredDebts.reduce((acc, debt) => {
      acc[debt.type] = (acc[debt.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({ type, count }));

  const severityData = Object.entries(
    filteredDebts.reduce((acc, debt) => {
      acc[debt.severity] = (acc[debt.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([severity, count]) => ({ severity, count }));

  const statusData = Object.entries(
    filteredDebts.reduce((acc, debt) => {
      acc[debt.status] = (acc[debt.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  // Calculate time series data (last 6 months)
  const timeSeriesData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthDebts = filteredDebts.filter(debt => {
      const debtDate = new Date(debt.createdAt);
      return debtDate >= monthStart && debtDate <= monthEnd;
    });
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      entries: monthDebts.length
    };
  });

  const COLORS = {
    Visual: '#EF4444',
    Accessibility: '#F59E0B',
    Copy: '#10B981',
    Usability: '#3B82F6'
  };

  const SEVERITY_COLORS = {
    High: '#DC2626',
    Medium: '#D97706',
    Low: '#059669'
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Insights and trends for your UX debt</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-gray-900">
                {filteredDebts.length}
              </div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-green-600">
                {filteredDebts.filter(d => d.status === 'Resolved').length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-red-600">
                {filteredDebts.filter(d => d.severity === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Severity</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-blue-600">
                {filteredDebts.filter(d => d.type === 'Accessibility').length}
              </div>
              <div className="text-sm text-gray-600">Accessibility</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Debt by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Debt by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Debt by Severity */}
          <Card>
            <CardHeader>
              <CardTitle>Debt by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="severity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="entries" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
