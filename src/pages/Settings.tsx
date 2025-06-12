import React, { useState } from 'react';
import { mockProjects } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Users, FolderOpen } from 'lucide-react';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [newProjectName, setNewProjectName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const mockUsers = [
    { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin' },
    { id: '2', name: 'Alex Rodriguez', email: 'alex@company.com', role: 'Member' },
    { id: '3', name: 'Maria Santos', email: 'maria@company.com', role: 'Member' },
    { id: '4', name: 'David Kim', email: 'david@company.com', role: 'Member' },
  ];

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    console.log('Adding project:', newProjectName);
    toast({
      title: "Project Added",
      description: `${newProjectName} has been added to your projects.`,
    });
    setNewProjectName('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;
    
    console.log('Adding user:', newUserEmail);
    toast({
      title: "User Invited",
      description: `Invitation sent to ${newUserEmail}.`,
    });
    setNewUserEmail('');
  };

  const handleDeleteProject = (projectName: string) => {
    console.log('Deleting project:', projectName);
    toast({
      title: "Project Deleted",
      description: `${projectName} has been removed.`,
      variant: "destructive",
    });
  };

  const handleRemoveUser = (userName: string) => {
    console.log('Removing user:', userName);
    toast({
      title: "User Removed",
      description: `${userName} has been removed from the team.`,
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your projects, team members, and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Project */}
            <form onSubmit={handleAddProject} className="space-y-3">
              <Label htmlFor="newProject">Add New Project</Label>
              <div className="flex space-x-2">
                <Input
                  id="newProject"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Existing Projects */}
            <div className="space-y-3">
              <Label>Existing Projects</Label>
              <div className="space-y-2">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-gray-600">{project.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New User */}
            <form onSubmit={handleAddUser} className="space-y-3">
              <Label htmlFor="newUser">Invite Team Member</Label>
              <div className="flex space-x-2">
                <Input
                  id="newUser"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="email@company.com"
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Existing Users */}
            <div className="space-y-3">
              <Label>Team Members</Label>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {user.role !== 'Admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Management */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debt Types */}
            <div className="space-y-3">
              <Label>Debt Types</Label>
              <div className="space-y-2">
                {['Visual', 'Accessibility', 'Copy', 'Usability'].map((type) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{type}</span>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity Levels */}
            <div className="space-y-3">
              <Label>Severity Levels</Label>
              <div className="space-y-2">
                {['High', 'Medium', 'Low'].map((severity) => (
                  <div key={severity} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{severity}</span>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive weekly reminders and high-severity alerts</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Export</p>
              <p className="text-sm text-gray-600">Export all debt entries to CSV</p>
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Backup & Restore</p>
              <p className="text-sm text-gray-600">Backup your data and settings</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
