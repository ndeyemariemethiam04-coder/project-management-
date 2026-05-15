import { create } from 'zustand';
import api from '../api/axios';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/projects');
      set({ projects: res.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchProject: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/projects/${id}`);
      set({ currentProject: res.data });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (projectData) => {
    const res = await api.post('/projects', projectData);
    set({ projects: [...get().projects, res.data] });
    return res.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
    set({ projects: get().projects.filter(p => p.id !== id) });
  },

  createTask: async (taskData) => {
    const res = await api.post('/tasks', taskData);
    // Refresh current project to show new task
    if (get().currentProject) {
      get().fetchProject(get().currentProject.id);
    }
    return res.data;
  },

  moveTask: async (taskId, columnId, order) => {
    await api.patch(`/tasks/${taskId}/move`, { columnId, order });
    if (get().currentProject) {
      get().fetchProject(get().currentProject.id);
    }
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    if (get().currentProject) {
      get().fetchProject(get().currentProject.id);
    }
  }
}));

export default useProjectStore;
