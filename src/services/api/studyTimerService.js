import { toast } from "react-toastify";
import React from "react";

class StudyTimerService {
  constructor() {
    this.tableName = 'study_session_c';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "start_time_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching study sessions:", error?.response?.data?.message || error);
      toast.error("Failed to load study sessions");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching study session ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "start_time_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching study sessions for course ${courseId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  create(sessionData) {
    // For timer functionality, create synchronously and then persist to database
    const tempSession = {
      Id: Date.now(), // Temporary ID
      Name: `Study Session - ${new Date().toLocaleDateString()}`,
      course_id_c: parseInt(sessionData.courseId || sessionData.course_id_c),
      start_time_c: sessionData.startTime || sessionData.start_time_c,
      end_time_c: sessionData.endTime || sessionData.end_time_c || null,
      duration_c: parseInt(sessionData.duration || sessionData.duration_c || 0),
      status_c: sessionData.status || sessionData.status_c || 'active',
      created_at_c: sessionData.createdAt || sessionData.created_at_c || new Date().toISOString()
    };

    // Persist to database in background
    this.persistSession(tempSession);
    
    return tempSession;
  }

  async persistSession(sessionData) {
    try {
      const params = {
        records: [
          {
            Name: sessionData.Name || `Study Session - ${new Date().toLocaleDateString()}`,
            course_id_c: parseInt(sessionData.course_id_c),
            start_time_c: sessionData.start_time_c,
            end_time_c: sessionData.end_time_c,
            duration_c: parseInt(sessionData.duration_c || 0),
            status_c: sessionData.status_c || 'active',
            created_at_c: sessionData.created_at_c || new Date().toISOString()
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.results && response.results[0] && response.results[0].success ? 
        response.results[0].data : null;
    } catch (error) {
      console.error("Error persisting study session:", error?.response?.data?.message || error);
      return null;
    }
  }

  update(id, updateData) {
    // For timer functionality, update synchronously
    const updatedData = {
      ...updateData,
      end_time_c: updateData.endTime || updateData.end_time_c,
      duration_c: parseInt(updateData.duration || updateData.duration_c || 0),
      status_c: updateData.status || updateData.status_c
    };

    // Persist to database in background
    this.persistUpdate(id, updatedData);
    
    return { Id: id, ...updatedData };
  }

  async persistUpdate(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.end_time_c) && { end_time_c: updateData.end_time_c },
            ...(updateData.duration_c !== undefined) && { duration_c: parseInt(updateData.duration_c) },
            ...(updateData.status_c) && { status_c: updateData.status_c }
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.results && response.results[0] && response.results[0].success ? 
        response.results[0].data : null;
    } catch (error) {
      console.error("Error updating study session:", error?.response?.data?.message || error);
      return null;
    }
  }

  delete(id) {
    // For timer functionality, delete synchronously
    this.persistDelete(id);
    return true;
  }

  async persistDelete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting study session:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getStudyTimeByDate(date) {
    try {
      const targetDate = new Date(date).toDateString();
      const sessions = await this.getAll();
      
      const filteredSessions = sessions.filter(s => {
        if (!s.start_time_c) return false;
        const sessionDate = new Date(s.start_time_c).toDateString();
        return sessionDate === targetDate && s.status_c === 'completed';
      });
      
      return filteredSessions;
    } catch (error) {
      console.error("Error getting study time by date:", error);
      return [];
    }
  }

  async getTotalStudyTime(courseId = null) {
    try {
      const sessions = await this.getAll();
      
      let filteredSessions = sessions.filter(s => s.status_c === 'completed');
      
      if (courseId) {
        filteredSessions = filteredSessions.filter(s => 
          (s.course_id_c && s.course_id_c.Id === parseInt(courseId)) ||
          (typeof s.course_id_c === 'number' && s.course_id_c === parseInt(courseId))
        );
      }
      
      const totalMinutes = filteredSessions.reduce((total, session) => 
        total + (session.duration_c || 0), 0);
      
      return { totalMinutes, sessionCount: filteredSessions.length };
    } catch (error) {
      console.error("Error getting total study time:", error);
      return { totalMinutes: 0, sessionCount: 0 };
    }
  }
}

export const studyTimerService = new StudyTimerService();