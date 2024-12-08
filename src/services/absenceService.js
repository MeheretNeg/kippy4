import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const absenceService = {
  requestAbsence: async (absenceData) => {
    try {
      console.log('Sending absence request:', absenceData);
      const response = await axiosInstance.post('/absences/request', absenceData);
      console.log('Received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in requestAbsence:', error.response || error);
      throw error;
    }
  },

  skipApprovalAbsence: async (absenceData) => {
    try {
      console.log('Sending skip approval request:', absenceData);
      const response = await axiosInstance.post('/absences/skip-approval', absenceData);
      console.log('Received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in skipApprovalAbsence:', error.response || error);
      throw error;
    }
  },

  getLeaveRequests: async (employeeId) => {
    try {
      console.log('Fetching leave requests for employee:', employeeId);
      const response = await axiosInstance.get(`/absences/${employeeId}`);
      console.log('Received leave requests:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getLeaveRequests:', error.response || error);
      throw error;
    }
  }
};
