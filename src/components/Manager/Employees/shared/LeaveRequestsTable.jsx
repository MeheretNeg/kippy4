import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { absenceService } from '../../../../services/absenceService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { useToast } from "../../../ui/use-toast";

const LeaveRequestsTable = ({ employeeId, refreshTrigger }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        console.log('Fetching leave requests, trigger:', refreshTrigger);
        setLoading(true);
        setError(null);
        const response = await absenceService.getLeaveRequests(employeeId);
        console.log('Received response:', response);
        setLeaveRequests(response.data || []);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to fetch leave requests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [employeeId, refreshTrigger, toast]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusStyles[status.toLowerCase()] || 'bg-gray-100'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading leave requests. Please try again.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No leave requests found
              </TableCell>
            </TableRow>
          ) : (
            leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.type}</TableCell>
                <TableCell>{format(new Date(request.startDate), 'PPP')}</TableCell>
                <TableCell>{format(new Date(request.endDate), 'PPP')}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{request.comment || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveRequestsTable;
