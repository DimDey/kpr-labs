import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text) => set((state) => ({ 
        tasks: [...state.tasks, { 
          id: Date.now(), 
          text, 
          description: '', 
          completed: false, 
          subtasks: [] 
        }] 
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      // Подзадачи
      addSubtask: (taskId, text) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: [...t?.subtasks ?? [], { id: Date.now(), text, completed: false }]
        } : t)
      })),
      toggleSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          subtasks: t?.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        } : t)
      }))
    }),
    { name: 'devpulse-tasks' }
  )
);