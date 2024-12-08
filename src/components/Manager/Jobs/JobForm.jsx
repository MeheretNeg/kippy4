import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const emptyJob = {
  title: '',
  client: '',
  location: '',
  salary: '',
  description: '',
  priority: 'Medium',
  status: 'Open',
  assignedRecruiters: []
};

const JobForm = ({ open, onOpenChange, onSubmit, initialData, recruiters, mode }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: mode === 'edit' ? {
      title: initialData?.title || '',
      client: initialData?.client || '',
      location: initialData?.location || '',
      salary: initialData?.salary || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'Medium',
      status: initialData?.status || 'Open',
      assignedRecruiters: initialData?.assignedRecruiters || []
    } : emptyJob
  });

  // Reset form when mode changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      reset(mode === 'edit' ? {
        title: initialData?.title || '',
        client: initialData?.client || '',
        location: initialData?.location || '',
        salary: initialData?.salary || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'Medium',
        status: initialData?.status || 'Open',
        assignedRecruiters: initialData?.assignedRecruiters || []
      } : emptyJob);
    }
  }, [open, mode, initialData, reset]);

  const onFormSubmit = (data) => {
    const formattedData = {
      ...data,
      assignedRecruiters: Array.isArray(data.assignedRecruiters) 
        ? data.assignedRecruiters.map(id => recruiters.find(r => r.id.toString() === id))
        : []
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Job' : 'Edit Job'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Job title is required' })}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              {...register('client', { required: 'Client is required' })}
              className={errors.client ? 'border-red-500' : ''}
            />
            {errors.client && (
              <p className="text-red-500 text-sm">{errors.client.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location', { required: 'Location is required' })}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              {...register('salary', { required: 'Salary is required' })}
              className={errors.salary ? 'border-red-500' : ''}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm">{errors.salary.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue('priority', value)}
              defaultValue={watch('priority')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value)}
              defaultValue={watch('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Hold">Hold</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assigned Recruiters</Label>
            <Select
              onValueChange={(value) => setValue('assignedRecruiters', [value])}
              defaultValue={watch('assignedRecruiters')?.[0] || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a recruiter" />
              </SelectTrigger>
              <SelectContent>
                {recruiters.map((recruiter) => (
                  <SelectItem key={recruiter.id} value={recruiter.id.toString()}>
                    {recruiter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(emptyJob);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Job' : 'Update Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
