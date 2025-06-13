
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, ExternalLink } from 'lucide-react';

interface DebtEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDebtCreated: (debt: {
    projectId: string;
    title: string;
    screen: string;
    type: 'Visual' | 'Accessibility' | 'Copy' | 'Usability';
    severity: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Fixed' | 'Resolved';
    description: string;
    recommendation: string;
    loggedBy: string;
    figmaLink?: string;
    screenshot?: string;
  }) => void;
  projectId: string;
}

const DebtEntryModal: React.FC<DebtEntryModalProps> = ({
  isOpen,
  onClose,
  onDebtCreated,
  projectId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    screen: '',
    type: '' as 'Visual' | 'Accessibility' | 'Copy' | 'Usability' | '',
    severity: '' as 'High' | 'Medium' | 'Low' | '',
    status: 'Open' as 'Open' | 'In Progress' | 'Fixed' | 'Resolved',
    description: '',
    recommendation: '',
    loggedBy: '',
    figmaLink: '',
    screenshot: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.screen.trim()) newErrors.screen = 'Screen/Component is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.recommendation.trim()) newErrors.recommendation = 'Recommendation is required';
    if (!formData.loggedBy.trim()) newErrors.loggedBy = 'Logged by is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onDebtCreated({
      projectId,
      title: formData.title,
      screen: formData.screen,
      type: formData.type as 'Visual' | 'Accessibility' | 'Copy' | 'Usability',
      severity: formData.severity as 'High' | 'Medium' | 'Low',
      status: formData.status,
      description: formData.description,
      recommendation: formData.recommendation,
      loggedBy: formData.loggedBy,
      figmaLink: formData.figmaLink,
      screenshot: formData.screenshot
    });

    // Reset form
    setFormData({
      title: '',
      screen: '',
      type: '',
      severity: '',
      status: 'Open',
      description: '',
      recommendation: '',
      loggedBy: '',
      figmaLink: '',
      screenshot: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-violet-50 to-purple-50">
        <DialogHeader>
          <DialogTitle className="text-violet-900">Log New UX Debt</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-violet-900">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief title describing the issue"
                  className={errors.title ? 'border-red-500' : 'border-violet-300'}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="screen" className="text-violet-900">Screen/Component *</Label>
                <Input
                  id="screen"
                  value={formData.screen}
                  onChange={(e) => handleInputChange('screen', e.target.value)}
                  placeholder="e.g., Login Page, Navigation Bar"
                  className={errors.screen ? 'border-red-500' : 'border-violet-300'}
                />
                {errors.screen && <p className="text-sm text-red-500 mt-1">{errors.screen}</p>}
              </div>

              <div>
                <Label htmlFor="type" className="text-violet-900">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : 'border-violet-300'}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Accessibility">Accessibility</SelectItem>
                    <SelectItem value="Copy">Copy</SelectItem>
                    <SelectItem value="Usability">Usability</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="severity" className="text-violet-900">Severity *</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger className={errors.severity ? 'border-red-500' : 'border-violet-300'}>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.severity && <p className="text-sm text-red-500 mt-1">{errors.severity}</p>}
              </div>

              <div>
                <Label htmlFor="status" className="text-violet-900">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-violet-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="figmaLink" className="text-violet-900">Figma Link</Label>
                <div className="relative">
                  <Input
                    id="figmaLink"
                    value={formData.figmaLink}
                    onChange={(e) => handleInputChange('figmaLink', e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="border-violet-300 pr-10"
                  />
                  {formData.figmaLink && (
                    <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-violet-500" />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="loggedBy" className="text-violet-900">Logged By *</Label>
                <Input
                  id="loggedBy"
                  value={formData.loggedBy}
                  onChange={(e) => handleInputChange('loggedBy', e.target.value)}
                  placeholder="Your name or team"
                  className={errors.loggedBy ? 'border-red-500' : 'border-violet-300'}
                />
                {errors.loggedBy && <p className="text-sm text-red-500 mt-1">{errors.loggedBy}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-violet-900">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the UX issue"
                  rows={4}
                  className={errors.description ? 'border-red-500' : 'border-violet-300'}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="recommendation" className="text-violet-900">Recommendation *</Label>
                <Textarea
                  id="recommendation"
                  value={formData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  placeholder="Suggested fix or improvement"
                  rows={4}
                  className={errors.recommendation ? 'border-red-500' : 'border-violet-300'}
                />
                {errors.recommendation && <p className="text-sm text-red-500 mt-1">{errors.recommendation}</p>}
              </div>

              <div>
                <Label htmlFor="screenshot" className="text-violet-900">Screenshot</Label>
                {!formData.screenshot ? (
                  <div className="border-2 border-dashed border-violet-300 rounded-lg p-6 bg-violet-50/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-violet-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-violet-900">
                            Upload a screenshot
                          </span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-violet-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.screenshot}
                      alt="Screenshot"
                      className="w-full h-32 object-cover rounded-lg border border-violet-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t border-violet-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-violet-300 text-violet-700 hover:bg-violet-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              Log UX Debt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DebtEntryModal;
