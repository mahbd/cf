import Dual from "@/app/dual/Dual";
import axios from "axios";
import { CFUser } from "@/app/dual/actions";

interface Props {
  searchParams: {
    users?: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  if (!searchParams.users) {
    return <div>User must be provided</div>;
  }

  const users = [];
  for (const user of searchParams.users.split(";")) {
    const userRes = await axios.get<{ result: CFUser[] }>(
      `https://codeforces.com/api/user.info?handles=${user}`,
    );
    if (!userRes.data.result) {
        return <div>User not found with handle {user}</div>;
    }
    users.push(userRes.data.result[0]);
  }
  return <Dual users={users} />;
};

export default Page;
