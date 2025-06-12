
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDebts } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Clock, User, Calendar } from 'lucide-react';

const DebtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const debt = mockDebts.find(d => d.id === id);
  const [status, setStatus] = useState(debt?.status || 'Open');
  const [isEditing, setIsEditing] = useState(false);

  if (!debt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Entry not found</h2>
        <p className="text-gray-600 mb-4">The UX debt entry you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    console.log('Updating status to:', status);
    toast({
      title: "Status Updated",
      description: `Entry status has been changed to ${status}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {debt.project} - {debt.screenComponent}
            </h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{debt.type}</Badge>
              <SeverityBadge severity={debt.severity} />
              <StatusBadge status={debt.status} />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Entry'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{debt.description}</p>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{debt.recommendation}</p>
            </CardContent>
          </Card>

          {/* Screenshot */}
          {debt.screenshot && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Screenshot would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entry created</p>
                    <p className="text-sm text-gray-500">{formatDate(debt.createdAt)}</p>
                  </div>
                </div>
                
                {debt.updatedAt !== debt.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Entry updated</p>
                      <p className="text-sm text-gray-500">{formatDate(debt.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Update Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {status !== debt.status && (
                <Button 
                  onClick={handleStatusUpdate}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Update Status
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Entry Details */}
          <Card>
            <CardHeader>
              <CardTitle>Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Assignee:</span>
                <span className="font-medium">{debt.assignee || 'Unassigned'}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(debt.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {new Date(debt.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Duplicate Entry
              </Button>
              <Button variant="outline" className="w-full">
                Export Details
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Delete Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebtDetail;
