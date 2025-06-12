
import React, { useState } from 'react';
import { mockDebts } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Data processing for charts
  const typeData = Object.entries(
    mockDebts.reduce((acc, debt) => {
      acc[debt.type] = (acc[debt.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({ type, count }));

  const severityData = Object.entries(
    mockDebts.reduce((acc, debt) => {
      acc[debt.severity] = (acc[debt.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([severity, count]) => ({ severity, count }));

  // Sample time series data
  const timeSeriesData = [
    { month: 'Jan', entries: 12 },
    { month: 'Feb', entries: 8 },
    { month: 'Mar', entries: 15 },
    { month: 'Apr', entries: 10 },
    { month: 'May', entries: 18 },
    { month: 'Jun', entries: 5 },
  ];

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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Insights and trends across your UX debt entries
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              <SelectItem value="website">Main Website</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
              <SelectItem value="admin">Admin Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debt by Type - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
            
            {/* Screen reader friendly table */}
            <div className="sr-only">
              <table>
                <caption>Debt Distribution by Type</caption>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {typeData.map((item) => (
                    <tr key={item.type}>
                      <td>{item.type}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Debt by Severity - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Debt by Severity Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={(entry) => SEVERITY_COLORS[entry?.severity as keyof typeof SEVERITY_COLORS] || '#8884d8'}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Screen reader friendly table */}
            <div className="sr-only">
              <table>
                <caption>Debt by Severity Level</caption>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {severityData.map((item) => (
                    <tr key={item.severity}>
                      <td>{item.severity}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Entries Over Time - Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New Entries Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
            
            {/* Screen reader friendly table */}
            <div className="sr-only">
              <table>
                <caption>New Entries Over Time</caption>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSeriesData.map((item) => (
                    <tr key={item.month}>
                      <td>{item.month}</td>
                      <td>{item.entries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-gray-900">
              {(mockDebts.filter(d => d.status === 'Resolved').length / mockDebts.length * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-gray-900">
              {mockDebts.filter(d => d.severity === 'High').length}
            </div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-gray-900">
              {mockDebts.filter(d => d.type === 'Accessibility').length}
            </div>
            <div className="text-sm text-gray-600">Accessibility Issues</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
