import {
  CFProblem,
  CFUser,
  fireDB,
  getRandomProblem,
  markComplete,
  sendMessage,
} from "@/app/dual/actions";
import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";

interface Props {
  users: CFUser[];
}

const SideBar = ({ users }: Props) => {
  const [isWin, setIsWin] = useState(false);
  return (
    <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <ProblemSection users={users} setIsWin={setIsWin} />
      <UserSection users={users} />
      <WinLoseModal isWin={isWin} />
    </div>
  );
};

export default SideBar;

interface ProblemSectionProps {
  users: CFUser[];
  setIsWin: (isWin: boolean) => void;
}

const ProblemSection = ({ users, setIsWin }: ProblemSectionProps) => {
  const usersHash = users.map((user) => user.handle).join(";");
  const userHandles = users.map((user) => user.handle);
  const [problem, setProblem] = useState<CFProblem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const problemRef = ref(fireDB, `problem/${usersHash}`);

    onValue(problemRef, (snapshot) => {
      setIsLoading(false);
      const problem = snapshot.val();
      setProblem(problem);
    });
  }, [usersHash]);

  const onSetProblem = async () => {
    setIsLoading(true);
    const newProblem = await getRandomProblem(userHandles);
    const problemRef = ref(fireDB, `problem/${usersHash}`);
    await set(problemRef, newProblem);
  };

  const onClearProblem = async () => {
    setIsLoading(true);
    const problemRef = ref(fireDB, `problem/${usersHash}`);
    await set(problemRef, null);
  };

  const handle = localStorage.getItem("handle") || "";
  const currentUser = users.find((user) => user.handle === handle);
  if (!currentUser) {
    return <div>Invalid user</div>;
  }

  return (
    <div>
      <h2 className={"text-2xl font-bold"}>Selected Problem</h2>
      {problem ? (
        <div>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Name: </span>
            <a
              className={"link link-secondary"}
              href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
              target={"_blank"}
            >
              {problem.name}
            </a>
          </p>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Contest: </span>
            <a
              className={"link link-secondary"}
              href={`https://codeforces.com/contest/${problem.contestId}/`}
              target={"_blank"}
            >
              {problem.contestId}
            </a>
          </p>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Difficulty: </span>
            {problem.rating}
          </p>
        </div>
      ) : (
        <div>
          <p>No problem selected</p>
        </div>
      )}
      {!problem && (
        <button className="btn btn-sm btn-primary mt-4" onClick={onSetProblem}>
          {isLoading ? <Loading /> : "Select Random Problem"}
        </button>
      )}
      {problem && (
        <button className="btn btn-sm btn-warning mt-4" onClick={onSetProblem}>
          {isLoading ? <Loading /> : "Change Problem"}
        </button>
      )}
      {problem && (
        <button
          className="btn btn-sm btn-success mt-4 ms-2"
          onClick={async () => {
            const res = await markComplete(currentUser, problem);
            if (res) {
              await onClearProblem();
              sendMessage(
                `BOT: ${problem.name} solved by ${currentUser.handle}`,
                usersHash,
                "BOT",
              );
            } else {
              setIsLoading(false);
            }
            setIsWin(res);
            (
              document.getElementById("my_modal_2")! as HTMLDialogElement
            ).showModal();
          }}
        >
          {isLoading ? <Loading /> : "Mark Solved"}
        </button>
      )}
    </div>
  );
};

const UserSection = ({ users }: { users: CFUser[] }) => {
  const [wins, setWins] = useState<number[]>(Array(users.length).fill(0));
  useEffect(() => {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      onValue(ref(fireDB, `wins/${user.handle}`), (snapshot) => {
        const wins = snapshot.val() || 0;
        setWins((prev) => {
          const newWins = [...prev];
          newWins[i] = wins;
          return newWins;
        });
      });
    }
  }, [users]);
  return (
    <div>
      <h2 className={"text-2xl font-bold mt-5"}>Users</h2>
      {users.map((user, index) => (
        <div key={index} className={"bg-gray-800 rounded-2xl p-2 my-2"}>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Handle: </span>
            <a
              className={"link link-secondary"}
              href={`https://codeforces.com/profile/${user.handle}/`}
              target={"_blank"}
            >
              {user.handle}
            </a>
          </p>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Max Rating: </span>
            {user.maxRating}
          </p>
          <p className={"text-lg"}>
            <span className={"font-bold"}>Win Count: </span>
            {wins[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

const WinLoseModal = ({ isWin }: { isWin: boolean }) => {
  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isWin ? "You Win!" : "Unsolved!"}
        </h3>
        <p className="py-4">
          {isWin
            ? "Congratulations!! You solved the problem!"
            : "You didn't solved the problem!"}
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const Loading = () => {
  return <span className="loading loading-spinner loading-md"></span>;
};
