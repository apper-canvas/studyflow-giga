import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.assignments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.assignments.find(assignment => assignment.Id === parseInt(id));
  }

  async getByCourseId(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.assignments.filter(assignment => assignment.courseId === courseId.toString());
  }

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.assignments.map(a => a.Id)) + 1;
    const newAssignment = {
      Id: newId,
      ...assignmentData,
      courseId: assignmentData.courseId.toString()
    };
    
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      this.assignments[index] = { 
        ...this.assignments[index], 
        ...assignmentData,
        courseId: assignmentData.courseId ? assignmentData.courseId.toString() : this.assignments[index].courseId
      };
      return { ...this.assignments[index] };
    }
    throw new Error("Assignment not found");
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      const deletedAssignment = this.assignments.splice(index, 1)[0];
      return { ...deletedAssignment };
    }
    throw new Error("Assignment not found");
  }

  async markComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const assignment = this.assignments.find(a => a.Id === parseInt(id));
    if (assignment) {
      assignment.completed = true;
      return { ...assignment };
    }
    throw new Error("Assignment not found");
  }
}

export const assignmentService = new AssignmentService();