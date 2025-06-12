
export interface UXDebt {
  id: string;
  project: string;
  screenComponent: string;
  type: 'Visual' | 'Accessibility' | 'Copy' | 'Usability';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  screenshot?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface FilterState {
  projects: string[];
  severity: string;
  type: string;
  status: string;
  search: string;
  dateRange: string;
}
