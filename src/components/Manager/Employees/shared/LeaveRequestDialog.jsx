import React, { useState, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '../../../ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { format, parseISO } from 'date-fns';
import { absenceService } from '../../../../services/absenceService';

const LeaveRequestDialog = memo(({ employee, onRequestSubmit }) => {
  const [open, setOpen] = useState(false);
  const [absenceType, setAbsenceType] = useState('');
  const [absenceStartDate, setAbsenceStartDate] = useState(null);
  const [absenceEndDate, setAbsenceEndDate] = useState(null);
  const [absenceComment, setAbsenceComment] = useState('');
  const [absenceLoading, setAbsenceLoading] = useState(false);
  const { toast } = useToast();

  const handleRequestAbsence = async () => {
    if (!absenceType || !absenceStartDate || !absenceEndDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAbsenceLoading(true);
    try {
      await absenceService.requestAbsence({
        employeeId: employee.id,
        type: absenceType,
        startDate: absenceStartDate,
        endDate: absenceEndDate,
        comment: absenceComment || '',
      });

      toast({
        title: "Success",
        description: "Absence request submitted successfully.",
      });

      setOpen(false);
      setAbsenceType('');
      setAbsenceStartDate(null);
      setAbsenceEndDate(null);
      setAbsenceComment('');
      onRequestSubmit();
    } catch (error) {
      console.error('Error submitting absence request:', error);
      toast({
        title: "Error",
        description: "Failed to submit absence request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAbsenceLoading(false);
    }
  };

  const handleSkipApproval = async () => {
    if (!absenceType || !absenceStartDate || !absenceEndDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAbsenceLoading(true);
    try {
      const response = await absenceService.skipApprovalAbsence({
        employeeId: employee.id,
        type: absenceType,
        startDate: absenceStartDate,
        endDate: absenceEndDate,
        comment: absenceComment || '',
      });

      toast({
        title: "Success",
        description: "Absence request approved successfully.",
      });

      setOpen(false);
      setAbsenceType('');
      setAbsenceStartDate(null);
      setAbsenceEndDate(null);
      setAbsenceComment('');
      onRequestSubmit();
    } catch (error) {
      console.error('Error processing absence request:', error);
      toast({
        title: "Error",
        description: "Failed to process absence request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAbsenceLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Request Absence</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Absence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Absence Type</label>
            <Select value={absenceType} onValueChange={setAbsenceType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select absence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <Input
                type="date"
                value={absenceStartDate}
                onChange={(e) => setAbsenceStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">End Date</label>
              <Input
                type="date"
                value={absenceEndDate}
                onChange={(e) => setAbsenceEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Comment</label>
            <Textarea
              value={absenceComment}
              onChange={(e) => setAbsenceComment(e.target.value)}
              placeholder="Add a comment (optional)"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="secondary" onClick={handleSkipApproval} disabled={absenceLoading}>
              Skip Approval
            </Button>
            <Button onClick={handleRequestAbsence} disabled={absenceLoading}>
              {absenceLoading ? 'Requesting...' : 'Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default LeaveRequestDialog;
