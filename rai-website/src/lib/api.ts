import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('rai_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Faculty
export const getFaculty = (params?: Record<string, string>) => api.get('/faculty', { params });
export const getFacultyById = (id: string) => api.get(`/faculty/${id}`);
export const createFaculty = (data: FormData) => api.post('/faculty', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateFaculty = (id: string, data: FormData) => api.put(`/faculty/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteFaculty = (id: string) => api.delete(`/faculty/${id}`);

// Projects
export const getProjects = (params?: Record<string, string>) => api.get('/projects', { params });
export const createProject = (data: object) => api.post('/projects', data);
export const updateProject = (id: string, data: object) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Placements
export const getPlacements = () => api.get('/placements');
export const createPlacement = (data: object) => api.post('/placements', data);
export const updatePlacement = (id: string, data: object) => api.put(`/placements/${id}`, data);

// Notices
export const getNotices = (params?: Record<string, string>) => api.get('/notices', { params });
export const createNotice = (data: FormData) => api.post('/notices', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateNotice = (id: string, data: object) => api.put(`/notices/${id}`, data);
export const deleteNotice = (id: string) => api.delete(`/notices/${id}`);

// Events
export const getEvents = (params?: Record<string, string>) => api.get('/events', { params });
export const createEvent = (data: FormData) => api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEvent = (id: string, data: object) => api.put(`/events/${id}`, data);
export const deleteEvent = (id: string) => api.delete(`/events/${id}`);

// Students
export const getStudents = (params?: Record<string, string>) => api.get('/students', { params });
export const createStudent = (data: object) => api.post('/students', data);
export const updateStudent = (id: string, data: object) => api.put(`/students/${id}`, data);

// Alumni
export const getAlumni = (params?: Record<string, string>) => api.get('/alumni', { params });
export const createAlumni = (data: object) => api.post('/alumni', data);
export const updateAlumni = (id: string, data: object) => api.put(`/alumni/${id}`, data);
export const deleteAlumni = (id: string) => api.delete(`/alumni/${id}`);

// Research
export const getResearch = (params?: Record<string, string>) => api.get('/research', { params });
export const getResearchById = (id: string) => api.get(`/research/${id}`);
export const createResearch = (data: object) => api.post('/research', data);
export const updateResearch = (id: string, data: object) => api.put(`/research/${id}`, data);
export const deleteResearch = (id: string) => api.delete(`/research/${id}`);

// Publications
export const getPublications = (params?: Record<string, string>) => api.get('/publications', { params });
export const createPublication = (data: object) => api.post('/publications', data);
export const updatePublication = (id: string, data: object) => api.put(`/publications/${id}`, data);
export const deletePublication = (id: string) => api.delete(`/publications/${id}`);

// Labs
export const getLabs = () => api.get('/labs');
export const createLab = (data: object) => api.post('/labs', data);
export const updateLab = (id: string, data: object) => api.put(`/labs/${id}`, data);
export const deleteLab = (id: string) => api.delete(`/labs/${id}`);

// Achievements
export const getAchievements = (params?: Record<string, string>) => api.get('/achievements', { params });
export const createAchievement = (data: object) => api.post('/achievements', data);
export const updateAchievement = (id: string, data: object) => api.put(`/achievements/${id}`, data);
export const deleteAchievement = (id: string) => api.delete(`/achievements/${id}`);

// Gallery
export const getGallery = (params?: Record<string, string>) => api.get('/gallery', { params });
export const getGalleryById = (id: string) => api.get(`/gallery/${id}`);
export const createGallery = (data: object) => api.post('/gallery', data);
export const updateGallery = (id: string, data: object) => api.put(`/gallery/${id}`, data);
export const deleteGallery = (id: string) => api.delete(`/gallery/${id}`);

// Analytics
export const getAnalytics = () => api.get('/analytics');

// Auth
export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

export default api;
