
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';

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
      screenshot: ''
    });
    
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, screenshot: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setFormData(prev => ({ ...prev, screenshot: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log New UX Debt</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief title describing the issue"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="screen">Screen/Component *</Label>
                <Input
                  id="screen"
                  value={formData.screen}
                  onChange={(e) => handleInputChange('screen', e.target.value)}
                  placeholder="e.g., Login Page, Navigation Bar"
                  className={errors.screen ? 'border-red-500' : ''}
                />
                {errors.screen && <p className="text-sm text-red-500 mt-1">{errors.screen}</p>}
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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
                <Label htmlFor="severity">Severity *</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger className={errors.severity ? 'border-red-500' : ''}>
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="loggedBy">Logged By *</Label>
                <Input
                  id="loggedBy"
                  value={formData.loggedBy}
                  onChange={(e) => handleInputChange('loggedBy', e.target.value)}
                  placeholder="Your name or team"
                  className={errors.loggedBy ? 'border-red-500' : ''}
                />
                {errors.loggedBy && <p className="text-sm text-red-500 mt-1">{errors.loggedBy}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the UX issue"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="recommendation">Recommendation *</Label>
                <Textarea
                  id="recommendation"
                  value={formData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  placeholder="Suggested fix or improvement"
                  rows={4}
                  className={errors.recommendation ? 'border-red-500' : ''}
                />
                {errors.recommendation && <p className="text-sm text-red-500 mt-1">{errors.recommendation}</p>}
              </div>

              <div>
                <Label htmlFor="screenshot">Screenshot</Label>
                {!formData.screenshot ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
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
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.screenshot}
                      alt="Screenshot"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Log UX Debt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DebtEntryModal;
