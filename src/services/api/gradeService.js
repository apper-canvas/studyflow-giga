import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.grades];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.grades.find(grade => grade.Id === parseInt(id));
  }

  async getByCourseId(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.grades.filter(grade => grade.courseId === courseId.toString());
  }

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.grades.map(g => g.Id)) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      courseId: gradeData.courseId.toString(),
      assignmentId: gradeData.assignmentId ? gradeData.assignmentId.toString() : null
    };
    
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      this.grades[index] = { 
        ...this.grades[index], 
        ...gradeData,
        courseId: gradeData.courseId ? gradeData.courseId.toString() : this.grades[index].courseId,
        assignmentId: gradeData.assignmentId ? gradeData.assignmentId.toString() : this.grades[index].assignmentId
      };
      return { ...this.grades[index] };
    }
    throw new Error("Grade not found");
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.grades.findIndex(grade => grade.Id === parseInt(id));
    if (index !== -1) {
      const deletedGrade = this.grades.splice(index, 1)[0];
      return { ...deletedGrade };
    }
    throw new Error("Grade not found");
  }

  // Calculate GPA for all courses or specific course
async calculateGPA(courseId = null) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let relevantGrades = [...this.grades];
    if (courseId) {
      relevantGrades = this.grades.filter(grade => grade.courseId === courseId.toString());
    }

    if (relevantGrades.length === 0) {
      return 0;
    }

    // Calculate weighted average
    let totalWeightedPoints = 0;
    let totalWeight = 0;

    relevantGrades.forEach(grade => {
      const percentage = (grade.points / grade.maxPoints) * 100;
      const weightedPoints = (percentage * grade.weight) / 100;
      totalWeightedPoints += weightedPoints;
      totalWeight += grade.weight;
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
  }

  async calculateGoalProgress(courses) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return courses.map(course => {
      const courseGrades = this.grades.filter(grade => grade.courseId === course.Id.toString());
      
      if (courseGrades.length === 0) {
        return {
          courseId: course.Id,
          courseName: course.name,
          currentGrade: 0,
          goalGrade: course.gradeGoal || 85,
          progress: 0,
          status: 'no-data'
        };
      }

      // Calculate current weighted average for course
      let totalWeightedPoints = 0;
      let totalWeight = 0;

      courseGrades.forEach(grade => {
        const percentage = (grade.points / grade.maxPoints) * 100;
        const weightedPoints = (percentage * grade.weight) / 100;
        totalWeightedPoints += weightedPoints;
        totalWeight += grade.weight;
      });

      const currentGrade = totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;
      const goalGrade = course.gradeGoal || 85;
      const progress = goalGrade > 0 ? (currentGrade / goalGrade) * 100 : 0;

      let status = 'on-track';
      if (progress < 80) status = 'behind';
      else if (progress < 90) status = 'warning';
      else if (progress >= 100) status = 'achieved';

      return {
        courseId: course.Id,
        courseName: course.name,
        currentGrade: currentGrade,
        goalGrade: goalGrade,
        progress: progress,
        status: status
      };
    });
  }
}

export const gradeService = new GradeService();