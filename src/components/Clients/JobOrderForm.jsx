import { useState, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';

const JobOrderForm = ({ jobOrder, onSubmit, onCancel, recruiters = [] }) => {
  const { userRole } = useContext(UserRoleContext);
  const [formData, setFormData] = useState({
    title: jobOrder?.title || '',
    salary: jobOrder?.salary || '',
    receivedDate: jobOrder?.receivedDate || new Date().toISOString().split('T')[0],
    dueDate: jobOrder?.dueDate || '',
    recruiter: jobOrder?.recruiter || (userRole === 'recruiter' ? 'John Doe' : '') // TODO: Replace with actual current user
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid salary is required';
    if (!formData.receivedDate) newErrors.receivedDate = 'Received date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.recruiter) newErrors.recruiter = 'Recruiter is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        salary: parseFloat(formData.salary)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{jobOrder ? 'Edit Job Order' : 'New Job Order'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary</label>
            <Input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className={errors.salary ? 'border-destructive' : ''}
            />
            {errors.salary && <p className="text-sm text-destructive mt-1">{errors.salary}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Received Date</label>
            <Input
              type="date"
              value={formData.receivedDate}
              onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
              className={errors.receivedDate ? 'border-destructive' : ''}
            />
            {errors.receivedDate && <p className="text-sm text-destructive mt-1">{errors.receivedDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={errors.dueDate ? 'border-destructive' : ''}
            />
            {errors.dueDate && <p className="text-sm text-destructive mt-1">{errors.dueDate}</p>}
          </div>

          {userRole === 'manager' && (
            <div>
              <label className="block text-sm font-medium mb-1">Assigned Recruiter</label>
              <select
                value={formData.recruiter}
                onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
                className={`w-full border rounded-md p-2 ${errors.recruiter ? 'border-destructive' : 'border-input'}`}
              >
                <option value="">Select Recruiter</option>
                {recruiters.map((recruiter) => (
                  <option key={recruiter.id} value={recruiter.name}>
                    {recruiter.name}
                  </option>
                ))}
              </select>
              {errors.recruiter && <p className="text-sm text-destructive mt-1">{errors.recruiter}</p>}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {jobOrder ? 'Update' : 'Create'} Job Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobOrderForm;
