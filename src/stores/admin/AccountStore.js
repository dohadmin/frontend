import { create } from 'zustand';

const useAccountStore = create((set) => ({
  user: {},
  setUser: (user) => set({ user }),

  admins: [],
  setAdmins: (admins) => set({ admins }),

  trainers: [],
  setTrainers: (trainers) => set({ trainers }),

  trainees: [],
  setTrainees: (trainees) => set({ trainees }),

  requests: [],
  setRequests: (requests) => set({ requests }),

  trainings: [],
  setTrainings: (trainings) => set({ trainings }),

  certificates: [],
  setCertificates: (certificates) => set({ certificates }),
}));

export default useAccountStore;