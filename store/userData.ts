import { create } from "zustand";

export interface UserData {
  [key: string]: {
    [key: string]: { user: string; solutionLink: string }[];
  };
}

interface userDataState {
  userData: UserData;
  updateUserData: (userData: UserData) => void;
}

export const useUserDataStore = create<userDataState>((set) => ({
  userData: {},
  updateUserData: (userData) => set({ userData }),
}));
