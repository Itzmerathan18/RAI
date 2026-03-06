import axios from 'axios';

// All API calls are now relative to the Next.js app itself — no separate backend needed
const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token from localStorage
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
export const createFaculty = (data: object) => api.post('/faculty', data);
export const updateFaculty = (id: string, data: object) => api.put(`/faculty/${id}`, data);
export const deleteFaculty = (id: string) => api.delete(`/faculty/${id}`);

// Projects
export const getProjects = (params?: Record<string, string>) => api.get('/projects', { params });
export const createProject = (data: object) => api.post('/projects', data);
export const updateProject = (id: string, data: object) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Placements
export const getPlacements = (params?: Record<string, string>) => api.get('/placements', { params });
export const createPlacement = (data: object) => api.post('/placements', data);
export const updatePlacement = (id: string, data: object) => api.put(`/placements/${id}`, data);
export const deletePlacement = (id: string) => api.delete(`/placements/${id}`);

// Notices
export const getNotices = (params?: Record<string, string>) => api.get('/notices', { params });
export const createNotice = (data: object) => api.post('/notices', data);
export const updateNotice = (id: string, data: object) => api.put(`/notices/${id}`, data);
export const deleteNotice = (id: string) => api.delete(`/notices/${id}`);

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

// About
export const getAbout = () => api.get('/about');
export const updateAbout = (data: object) => api.put('/about', data);

// Analytics
export const getAnalytics = () => api.get('/analytics');

// Auth
export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Upload to Cloudinary (via our API route)
export const uploadMedia = (data: string, folder?: string, resource_type?: string) =>
    api.post('/upload', { data, folder: folder || 'rai-website', resource_type: resource_type || 'auto' });

export default api;
