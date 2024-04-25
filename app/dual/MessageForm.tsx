import { useState } from "react";
import { sendMessage} from "@/app/dual/actions";

interface Props {
  usersHash: string;
}

const MessageForm = ({ usersHash }: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <div
      className="chat-form bottom-0 absolute w-full md:w-96 h-24"
      style={{ margin: "0 auto" }}
    >
      <div className={"flex"}>
        <textarea
          id={"message-area"}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="textarea textarea-primary textarea-bordered rounded-2xl w-full h-auto"
        />
        <button
          disabled={message === ""}
          className="btn btn-primary rounded-2xl ms-2"
          onClick={() => sendMessage(message, usersHash)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageForm;
