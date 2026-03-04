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

// Auth
export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

export default api;
