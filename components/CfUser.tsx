import { useEffect, useState } from "react";
import { TooltipBox } from "./TooltipBox";
import { Submission } from "@/store/submissions";
import { UserData, useUserDataStore } from "@/store/userData";

const CfUser = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState("NO");
  const updateUserData = useUserDataStore((state) => state.updateUserData);

  useEffect(() => {
    setUsername(localStorage.getItem("cf-username") || "");
    setLoggedIn(localStorage.getItem("cf-loggedIn") || "NO");
  }, []);

  const logout = () => {
    localStorage.removeItem("cf-username");
    localStorage.setItem("cf-loggedIn", "NO");
    setUsername("");
    setLoggedIn("NO");
  };

  const logIn = async () => {
    localStorage.setItem("cf-username", username);
    localStorage.setItem("cf-loggedIn", "YES");
    setLoggedIn("YES");

    const userData = await fetchUserData(username);
    if (userData) updateUserData(userData);
  };

  const fetchUserData = async (user: string) => {
    return fetch(`https://codeforces.com/api/user.status?handle=${user}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          const submissions = data.result;
          const userData: UserData = {};
          submissions.forEach((submission: Submission) => {
            const { contestId, verdict, problem, id } = submission;
            const { index } = problem;
            if (!userData[contestId]) userData[contestId] = {};
            if (verdict === "OK" && problem && index) {
              if (!userData[contestId][index]) userData[contestId][index] = [];
              const solutionLink = `https://codeforces.com/contest/${contestId}/submission/${id}`;
              const isPresent = userData[contestId][index].filter(
                (item) => item.user === user
              );
              if (!isPresent.length)
                userData[contestId][index].push({ user, solutionLink });
            }
          });
          return userData;
        }
      })
      .catch(() => {});
  };

  return (
    <div id="cf-user">
      <div className="form-group mb-2">
        <label>
          Cf Usernames
          <TooltipBox message='Separate Multiple usernames by ",". Example ashishgup,tourist' />
        </label>
        <input
          className="form-control form-control-sm"
          type="text"
          placeholder="Your codeforces handle"
          name="usernames"
          required
          value={username}
          disabled={loggedIn == "YES"}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {loggedIn ? (
        <button
          className="btn btn-danger mr-2 mt-3 btn-sm"
          type="button"
          onClick={logout}
        >
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      ) : (
        <button
          className="btn btn-success mr-2 mt-3 btn-sm"
          type="button"
          onClick={logIn}
        >
          Login
        </button>
      )}
      <button
        className="btn btn-info mt-3 btn-sm"
        type="button"
        onClick={logIn}
      >
        <i className="fas fa-redo-alt" /> Refresh
      </button>
    </div>
  );
};

export default CfUser;
