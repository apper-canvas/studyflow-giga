import { toast } from 'react-toastify';

class AssignmentService {
  constructor() {
    this.tableName = 'assignment_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to load assignments");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            Name: assignmentData.title_c || assignmentData.title,
            title_c: assignmentData.title_c || assignmentData.title,
            description_c: assignmentData.description_c || assignmentData.description || "",
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            priority_c: assignmentData.priority_c || assignmentData.priority || "medium",
            completed_c: assignmentData.completed_c || assignmentData.completed || false,
            grade_c: assignmentData.grade_c || assignmentData.grade || null,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId)
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(assignmentData.title_c || assignmentData.title) && { 
              Name: assignmentData.title_c || assignmentData.title,
              title_c: assignmentData.title_c || assignmentData.title 
            },
            ...(assignmentData.description_c !== undefined || assignmentData.description !== undefined) && { 
              description_c: assignmentData.description_c || assignmentData.description || "" 
            },
            ...(assignmentData.due_date_c || assignmentData.dueDate) && { 
              due_date_c: assignmentData.due_date_c || assignmentData.dueDate 
            },
            ...(assignmentData.priority_c || assignmentData.priority) && { 
              priority_c: assignmentData.priority_c || assignmentData.priority 
            },
            ...(assignmentData.completed_c !== undefined || assignmentData.completed !== undefined) && { 
              completed_c: assignmentData.completed_c !== undefined ? assignmentData.completed_c : assignmentData.completed 
            },
            ...(assignmentData.grade_c !== undefined || assignmentData.grade !== undefined) && { 
              grade_c: assignmentData.grade_c !== undefined ? assignmentData.grade_c : assignmentData.grade 
            },
            ...(assignmentData.course_id_c || assignmentData.courseId) && { 
              course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId) 
            }
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return null;
    }
  }

  async markComplete(id) {
    try {
      return await this.update(id, { completed_c: true });
    } catch (error) {
      console.error("Error marking assignment complete:", error);
      toast.error("Failed to mark assignment complete");
      return null;
    }
  }
}

export const assignmentService = new AssignmentService();