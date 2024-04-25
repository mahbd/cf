import axios from "axios";
import { initializeApp } from "firebase/app";
import {getDatabase, ref, set, increment, push} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4jY-CWQR0VIqbCMh3DLnNQ160obEbrqw",
  authDomain: "cf-db-da5b0.firebaseapp.com",
  databaseURL:
    "https://cf-db-da5b0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cf-db-da5b0",
  storageBucket: "cf-db-da5b0.appspot.com",
  messagingSenderId: "481849825537",
  appId: "1:481849825537:web:cb2b4642f704988bb9e300",
  measurementId: "G-HKBDV9JKD3",
};

const app = initializeApp(firebaseConfig);
export const fireDB = getDatabase(app);

interface CFSubmission {
  id: number;
  contestId: number;
  verdict: "OK" | "WRONG_ANSWER";
  problem: { contestId: number; index: string };
}

export interface CFUser {
  maxRating: number;
  firstName: string;
  lastName: string;
  handle: string;
  avatar: string;
}

export interface CFProblem {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
}

export const getRandomProblem = async (users: string[]) => {
  const solvedProblems = new Set();
  let maxRating = 0;
  for (const user of users) {
    const res = await axios.get<{ result: CFSubmission[] }>(
      `https://codeforces.com/api/user.status?handle=${user}`,
    );

    for (const submission of res.data.result) {
      if (submission.verdict === "OK") {
        const problemID = `/contest/${submission.contestId}/problem/${submission.problem.index}`;
        solvedProblems.add(problemID);
      }
    }

    const userRes = await axios.get<{ result: CFUser[] }>(
      `https://codeforces.com/api/user.info?handles=${user}`,
    );
    maxRating = Math.max(maxRating, userRes.data.result[0].maxRating);
  }

  maxRating = Math.ceil(maxRating / 100) * 100;
  const res2 = await axios.get<{ result: { problems: CFProblem[] } }>(
    "https://codeforces.com/api/problemset.problems",
  );
  const solvableProblems = res2.data.result.problems.filter(
    (problem) =>
      problem.rating &&
      problem.rating === maxRating &&
      !solvedProblems.has(
        `/contest/${problem.contestId}/problem/${problem.index}`,
      ),
  );

  return solvableProblems[Math.floor(Math.random() * solvableProblems.length)];
};

export const markComplete = async (user: CFUser, problem: CFProblem) => {
  const res = await axios.get<{ result: CFSubmission[] }>(
    `https://codeforces.com/api/user.status?handle=${user.handle}&from=1&count=10`,
  );

  for (const submission of res.data.result) {
    if (submission.verdict === "OK") {
      if (
        submission.contestId === problem.contestId &&
        submission.problem.index === problem.index
      ) {
        const winRef = ref(fireDB, `wins/${user.handle}`);
        await set(winRef, increment(1));
        return true;
      }
    }
  }
  return false;
};



  export const sendMessage = (message: string, usersHash: string, senderHandle?: string) => {
    const messagesRef = ref(fireDB, `messages/${usersHash}`);
    const handle = senderHandle || localStorage.getItem("handle");
    if (!handle) {
      (document.getElementById("my_modal_1")! as HTMLDialogElement).showModal();
      return;
    }
    const messageArea = document.getElementById(
      "message-area",
    ) as HTMLTextAreaElement;
    messageArea.value = "";
    push(messagesRef, {
      message,
      handle,
      timestamp: new Date().getTime(),
    });
  };
