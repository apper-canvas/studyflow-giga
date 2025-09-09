import { toast } from 'react-toastify';

class GradeService {
  constructor() {
    this.tableName = 'grade_c';
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      toast.error("Failed to load grades");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching grades for course ${courseId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [
          {
            Name: gradeData.category_c || gradeData.category || "Grade Entry",
            category_c: gradeData.category_c || gradeData.category || "Assignment",
            points_c: parseFloat(gradeData.points_c || gradeData.points),
            max_points_c: parseFloat(gradeData.max_points_c || gradeData.maxPoints),
            weight_c: parseFloat(gradeData.weight_c || gradeData.weight || 10),
            date_c: gradeData.date_c || gradeData.date,
            course_id_c: parseInt(gradeData.course_id_c || gradeData.courseId),
            assignment_id_c: gradeData.assignment_id_c || gradeData.assignmentId ? 
              parseInt(gradeData.assignment_id_c || gradeData.assignmentId) : null
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
      console.error("Error creating grade:", error?.response?.data?.message || error);
      toast.error("Failed to create grade");
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(gradeData.category_c || gradeData.category) && { 
              Name: gradeData.category_c || gradeData.category,
              category_c: gradeData.category_c || gradeData.category 
            },
            ...(gradeData.points_c !== undefined || gradeData.points !== undefined) && { 
              points_c: parseFloat(gradeData.points_c !== undefined ? gradeData.points_c : gradeData.points) 
            },
            ...(gradeData.max_points_c !== undefined || gradeData.maxPoints !== undefined) && { 
              max_points_c: parseFloat(gradeData.max_points_c !== undefined ? gradeData.max_points_c : gradeData.maxPoints) 
            },
            ...(gradeData.weight_c !== undefined || gradeData.weight !== undefined) && { 
              weight_c: parseFloat(gradeData.weight_c !== undefined ? gradeData.weight_c : gradeData.weight) 
            },
            ...(gradeData.date_c || gradeData.date) && { 
              date_c: gradeData.date_c || gradeData.date 
            },
            ...(gradeData.course_id_c || gradeData.courseId) && { 
              course_id_c: parseInt(gradeData.course_id_c || gradeData.courseId) 
            },
            ...(gradeData.assignment_id_c !== undefined || gradeData.assignmentId !== undefined) && { 
              assignment_id_c: (gradeData.assignment_id_c || gradeData.assignmentId) ? 
                parseInt(gradeData.assignment_id_c || gradeData.assignmentId) : null 
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
      console.error("Error updating grade:", error?.response?.data?.message || error);
      toast.error("Failed to update grade");
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
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      toast.error("Failed to delete grade");
      return null;
    }
  }

  // Calculate GPA for all grades or specific course
  async calculateGPA(courseId = null) {
    try {
      const grades = await this.getAll();
      
      let relevantGrades = grades;
      if (courseId) {
        relevantGrades = grades.filter(grade => 
          (grade.course_id_c && grade.course_id_c.Id === parseInt(courseId)) ||
          (typeof grade.course_id_c === 'number' && grade.course_id_c === parseInt(courseId))
        );
      }

      if (relevantGrades.length === 0) {
        return 0;
      }

      // Calculate weighted average
      let totalWeightedPoints = 0;
      let totalWeight = 0;

      relevantGrades.forEach(grade => {
        if (grade.points_c && grade.max_points_c && grade.weight_c) {
          const percentage = (grade.points_c / grade.max_points_c) * 100;
          const weightedPoints = (percentage * grade.weight_c) / 100;
          totalWeightedPoints += weightedPoints;
          totalWeight += grade.weight_c;
        }
      });

      const averagePercentage = totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;
      
      // Convert percentage to 4.0 GPA scale
      if (averagePercentage >= 97) return 4.0;
      if (averagePercentage >= 93) return 3.7;
      if (averagePercentage >= 90) return 3.3;
      if (averagePercentage >= 87) return 3.0;
      if (averagePercentage >= 83) return 2.7;
      if (averagePercentage >= 80) return 2.3;
      if (averagePercentage >= 77) return 2.0;
      if (averagePercentage >= 73) return 1.7;
      if (averagePercentage >= 70) return 1.3;
      if (averagePercentage >= 67) return 1.0;
      if (averagePercentage >= 60) return 0.7;
      return 0.0;
    } catch (error) {
      console.error("Error calculating GPA:", error);
      return 0;
    }
  }

  async calculateGoalProgress(courses) {
    try {
      const grades = await this.getAll();
      
      return courses.map(course => {
        const courseGrades = grades.filter(grade => 
          (grade.course_id_c && grade.course_id_c.Id === course.Id) ||
          (typeof grade.course_id_c === 'number' && grade.course_id_c === course.Id)
        );
        
        if (courseGrades.length === 0) {
          return {
            courseId: course.Id,
            courseName: course.name_c || course.name || 'Unknown Course',
            currentGrade: 0,
            goalGrade: course.grade_goal_c || course.gradeGoal || 85,
            progress: 0,
            status: 'no-data'
          };
        }

        // Calculate current weighted average for course
        let totalWeightedPoints = 0;
        let totalWeight = 0;

        courseGrades.forEach(grade => {
          if (grade.points_c && grade.max_points_c && grade.weight_c) {
            const percentage = (grade.points_c / grade.max_points_c) * 100;
            const weightedPoints = (percentage * grade.weight_c) / 100;
            totalWeightedPoints += weightedPoints;
            totalWeight += grade.weight_c;
          }
        });

        const currentGrade = totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;
        const goalGrade = course.grade_goal_c || course.gradeGoal || 85;
        const progress = goalGrade > 0 ? (currentGrade / goalGrade) * 100 : 0;

        let status = 'on-track';
        if (progress < 80) status = 'behind';
        else if (progress < 90) status = 'warning';
        else if (progress >= 100) status = 'achieved';

        return {
          courseId: course.Id,
          courseName: course.name_c || course.name || 'Unknown Course',
          currentGrade: currentGrade,
          goalGrade: goalGrade,
          progress: progress,
          status: status
        };
      });
    } catch (error) {
      console.error("Error calculating goal progress:", error);
      return [];
    }
  }
}

export const gradeService = new GradeService();