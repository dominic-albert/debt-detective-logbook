
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderOpen, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('uxDebtUser');
    if (!userData) {
      navigate('/auth');
      return;
    }

    // Load projects from localStorage
    loadProjects();
  }, [navigate]);

  const loadProjects = () => {
    const savedProjects = localStorage.getItem('uxDebtProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Initialize with demo data
      const demoProjects: Project[] = [
        {
          id: '1',
          name: 'Main Website',
          description: 'Marketing website and landing pages',
          createdAt: new Date().toISOString(),
          openCount: 5,
          inProgressCount: 2,
          resolvedCount: 12
        },
        {
          id: '2',
          name: 'Mobile App',
          description: 'iOS and Android application',
          createdAt: new Date().toISOString(),
          openCount: 3,
          inProgressCount: 4,
          resolvedCount: 8
        }
      ];
      setProjects(demoProjects);
      localStorage.setItem('uxDebtProjects', JSON.stringify(demoProjects));
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      createdAt: new Date().toISOString(),
      openCount: 0,
      inProgressCount: 0,
      resolvedCount: 0
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('uxDebtProjects', JSON.stringify(updatedProjects));
    
    setNewProject({ name: '', description: '' });
    setIsCreateModalOpen(false);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalCount = (project: Project) => {
    return project.openCount + project.inProgressCount + project.resolvedCount;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Projects</h1>
            <p className="text-gray-600">Select a project to view and manage UX debt entries</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Project</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {getTotalCount(project)} items
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Status Counts */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Open: {project.openCount}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>In Progress: {project.inProgressCount}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Resolved: {project.resolvedCount}</span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {formatDate(project.createdAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={() => handleProjectClick(project.id)}
                      className="flex-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {
                        handleProjectClick(project.id);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Create your first project to start tracking UX debt</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
