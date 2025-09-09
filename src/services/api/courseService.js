import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.courses.find(course => course.Id === parseInt(id));
  }

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.courses.map(c => c.Id)) + 1;
    const newCourse = {
      Id: newId,
      ...courseData
    };
    
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...courseData };
      return { ...this.courses[index] };
    }
    throw new Error("Course not found");
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      const deletedCourse = this.courses.splice(index, 1)[0];
      return { ...deletedCourse };
    }
    throw new Error("Course not found");
  }
}

export const courseService = new CourseService();