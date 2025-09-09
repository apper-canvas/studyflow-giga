import { toast } from 'react-toastify';

class CourseService {
  constructor() {
    this.tableName = 'course_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "grade_goal_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      toast.error("Failed to load courses");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "grade_goal_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.name_c || courseData.name,
            name_c: courseData.name_c || courseData.name,
            instructor_c: courseData.instructor_c || courseData.instructor,
            schedule_c: courseData.schedule_c || courseData.schedule,
            credits_c: parseInt(courseData.credits_c || courseData.credits || 3),
            color_c: courseData.color_c || courseData.color || "#7c3aed",
            semester_c: courseData.semester_c || courseData.semester || "Fall 2024",
            grade_goal_c: parseInt(courseData.grade_goal_c || courseData.gradeGoal || 85)
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
      console.error("Error creating course:", error?.response?.data?.message || error);
      toast.error("Failed to create course");
      return null;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(courseData.name_c || courseData.name) && { 
              Name: courseData.name_c || courseData.name,
              name_c: courseData.name_c || courseData.name 
            },
            ...(courseData.instructor_c || courseData.instructor) && { 
              instructor_c: courseData.instructor_c || courseData.instructor 
            },
            ...(courseData.schedule_c || courseData.schedule) && { 
              schedule_c: courseData.schedule_c || courseData.schedule 
            },
            ...(courseData.credits_c || courseData.credits) && { 
              credits_c: parseInt(courseData.credits_c || courseData.credits) 
            },
            ...(courseData.color_c || courseData.color) && { 
              color_c: courseData.color_c || courseData.color 
            },
            ...(courseData.semester_c || courseData.semester) && { 
              semester_c: courseData.semester_c || courseData.semester 
            },
            ...(courseData.grade_goal_c || courseData.gradeGoal) && { 
              grade_goal_c: parseInt(courseData.grade_goal_c || courseData.gradeGoal) 
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
      console.error("Error updating course:", error?.response?.data?.message || error);
      toast.error("Failed to update course");
      return null;
    }
  }
}

export const courseService = new CourseService();

export const courseService = new CourseService();