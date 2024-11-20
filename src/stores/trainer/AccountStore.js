import { create } from 'zustand';

const useAccountStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),

  trainees: [],
  setTrainees: (trainees) => set({ trainees }),

  requests: [],
  setRequests: (requests) => set({ requests }),

  trainings: [],
  setTrainings: (trainings) => set({ trainings }),

}));

export default useAccountStore;