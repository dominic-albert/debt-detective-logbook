
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload } from 'lucide-react';

const NewEntry: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    project: '',
    screenComponent: '',
    type: '',
    severity: '',
    description: '',
    recommendation: '',
    screenshot: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.screenComponent) newErrors.screenComponent = 'Screen/Component name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.recommendation.trim()) newErrors.recommendation = 'Recommendation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    console.log('Submitting debt entry:', formData);
    
    toast({
      title: "Success!",
      description: "UX debt entry has been created successfully.",
    });
    
    navigate('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  const isFormValid = formData.project && formData.screenComponent && formData.type && 
                     formData.severity && formData.description.trim() && formData.recommendation.trim();

  return (
    <div className="max-w-2xl mx-auto">
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
        <h1 className="text-2xl font-semibold text-gray-900">Log New UX Debt</h1>
        <p className="text-gray-600 mt-1">
          Document UX issues that need attention across your projects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entry Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project">
                Project <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.project} onValueChange={(value) => handleInputChange('project', value)}>
                <SelectTrigger id="project" className={errors.project ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && <p className="text-sm text-red-600">{errors.project}</p>}
            </div>

            {/* Screen/Component */}
            <div className="space-y-2">
              <Label htmlFor="screenComponent">
                Screen/Component Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="screenComponent"
                value={formData.screenComponent}
                onChange={(e) => handleInputChange('screenComponent', e.target.value)}
                placeholder="e.g., Navigation Header, Login Form"
                className={errors.screenComponent ? 'border-red-500' : ''}
              />
              {errors.screenComponent && <p className="text-sm text-red-600">{errors.screenComponent}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select debt type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Accessibility">Accessibility</SelectItem>
                  <SelectItem value="Copy">Copy</SelectItem>
                  <SelectItem value="Usability">Usability</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Severity */}
            <div className="space-y-3">
              <Label>
                Severity <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.severity}
                onValueChange={(value) => handleInputChange('severity', value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="high" />
                  <Label htmlFor="high" className="text-red-600 font-medium">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium" className="text-amber-600 font-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="low" />
                  <Label htmlFor="low" className="text-green-600 font-medium">Low</Label>
                </div>
              </RadioGroup>
              {errors.severity && <p className="text-sm text-red-600">{errors.severity}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the UX issue in detail..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Recommendation */}
            <div className="space-y-2">
              <Label htmlFor="recommendation">
                Recommendation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="recommendation"
                value={formData.recommendation}
                onChange={(e) => handleInputChange('recommendation', e.target.value)}
                placeholder="Suggest how to fix this issue..."
                rows={4}
                className={errors.recommendation ? 'border-red-500' : ''}
              />
              {errors.recommendation && <p className="text-sm text-red-600">{errors.recommendation}</p>}
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label htmlFor="screenshot">Screenshot (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <Label htmlFor="screenshot" className="cursor-pointer">
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                </Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {formData.screenshot && (
                  <p className="text-sm text-green-600 mt-2">
                    File selected: {formData.screenshot.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEntry;
