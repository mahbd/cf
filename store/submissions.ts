import { create } from "zustand";

export interface Submission {
  contestId: number;
  verdict: "OK" | "WRONG_ANSWER";
  problem: { index: string };
  id: number;
}

interface SubmissionsState {
  submissions: { [key: number]: Submission };
  addSubmission: (submission: Submission) => void;
  getSubmission: (id: number) => Submission;
}

export const useSubmissionsStore = create<SubmissionsState>()((set, get) => ({
  userData: {},
  submissions: {},
  addSubmission: (submission) =>
    set((state) => ({
      submissions: { ...state.submissions, [submission.id]: submission },
    })),
  getSubmission: (id) => {
    const submission = get().submissions[id];
    if (!submission) throw new Error(`Submission ${id} not found`);
    return submission;
  },
}));
