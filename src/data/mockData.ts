
import { UXDebt, Project } from '../types/debt';

export const mockProjects: Project[] = [
  { id: '1', name: 'Main Website', description: 'Company website redesign' },
  { id: '2', name: 'Mobile App', description: 'iOS and Android application' },
  { id: '3', name: 'Admin Dashboard', description: 'Internal admin panel' },
  { id: '4', name: 'Customer Portal', description: 'Client-facing portal' },
];

export const mockDebts: UXDebt[] = [
  {
    id: '1',
    project: 'Main Website',
    screenComponent: 'Navigation Header',
    type: 'Accessibility',
    severity: 'High',
    description: 'Navigation links lack proper ARIA labels and keyboard focus indicators',
    recommendation: 'Add aria-label attributes and implement visible focus states for all interactive elements',
    status: 'Open',
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    project: 'Mobile App',
    screenComponent: 'Login Form',
    type: 'Usability',
    severity: 'Medium',
    description: 'Password field shows unclear error messages when validation fails',
    recommendation: 'Implement specific error messages for different password requirements',
    status: 'In Progress',
    createdAt: '2024-06-09T14:30:00Z',
    updatedAt: '2024-06-11T09:15:00Z',
    assignee: 'Alex Rodriguez'
  },
  {
    id: '3',
    project: 'Admin Dashboard',
    screenComponent: 'Data Table',
    type: 'Visual',
    severity: 'Low',
    description: 'Table headers are not properly aligned with data columns',
    recommendation: 'Adjust CSS grid or table layout to ensure proper alignment',
    status: 'Resolved',
    createdAt: '2024-06-08T16:45:00Z',
    updatedAt: '2024-06-12T11:20:00Z',
    assignee: 'Maria Santos'
  },
  {
    id: '4',
    project: 'Customer Portal',
    screenComponent: 'File Upload',
    type: 'Copy',
    severity: 'Medium',
    description: 'Upload instructions are unclear and cause user confusion',
    recommendation: 'Rewrite upload instructions with clear steps and file format requirements',
    status: 'Open',
    createdAt: '2024-06-07T13:20:00Z',
    updatedAt: '2024-06-07T13:20:00Z',
    assignee: 'David Kim'
  },
  {
    id: '5',
    project: 'Main Website',
    screenComponent: 'Contact Form',
    type: 'Accessibility',
    severity: 'High',
    description: 'Form validation errors are not announced to screen readers',
    recommendation: 'Implement ARIA live regions for form validation feedback',
    status: 'Open',
    createdAt: '2024-06-06T11:10:00Z',
    updatedAt: '2024-06-06T11:10:00Z',
    assignee: 'Sarah Chen'
  }
];
