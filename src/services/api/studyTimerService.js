import studySessionsData from '@/services/mockData/studySessions.json';

let studySessions = [...studySessionsData];
let nextId = Math.max(...studySessions.map(s => s.Id)) + 1;

export const studyTimerService = {
  getAll: () => {
    return Promise.resolve([...studySessions]);
  },

  getById: (id) => {
    const session = studySessions.find(s => s.Id === parseInt(id));
    return Promise.resolve(session ? { ...session } : null);
  },

  getByCourseId: (courseId) => {
    const sessions = studySessions.filter(s => s.courseId === parseInt(courseId));
    return Promise.resolve(sessions.map(s => ({ ...s })));
  },

  create: (sessionData) => {
    const newSession = {
      Id: nextId++,
      courseId: sessionData.courseId,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime || null,
      duration: sessionData.duration || 0,
      status: sessionData.status || 'active',
      createdAt: new Date().toISOString()
    };
    
    studySessions.push(newSession);
    return { ...newSession };
  },

  update: (id, updateData) => {
    const index = studySessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Study session with ID ${id} not found`);
    }
    
    studySessions[index] = {
      ...studySessions[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...studySessions[index] };
  },

  delete: (id) => {
    const index = studySessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Study session with ID ${id} not found`);
    }
    
    const deletedSession = studySessions.splice(index, 1)[0];
    return { ...deletedSession };
  },

  getStudyTimeByDate: (date) => {
    const targetDate = new Date(date).toDateString();
    const sessions = studySessions.filter(s => {
      if (!s.startTime) return false;
      const sessionDate = new Date(s.startTime).toDateString();
      return sessionDate === targetDate && s.status === 'completed';
    });
    
    return Promise.resolve(sessions.map(s => ({ ...s })));
  },

  getTotalStudyTime: (courseId = null) => {
    let sessions = studySessions.filter(s => s.status === 'completed');
    
    if (courseId) {
      sessions = sessions.filter(s => s.courseId === parseInt(courseId));
    }
    
    const totalMinutes = sessions.reduce((total, session) => total + (session.duration || 0), 0);
    return Promise.resolve({ totalMinutes, sessionCount: sessions.length });
  }
};