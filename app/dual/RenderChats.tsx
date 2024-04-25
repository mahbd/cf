import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { CFUser, fireDB } from "@/app/dual/actions";

interface Message {
  handle: string;
  message: string;
  timestamp: number;
}

interface Props {
  users: CFUser[];
}

const RenderChats = ({ users }: Props) => {
  const usersHash = users.map((user) => user.handle).join(";");
  const [messages, setMessages] = useState<Message[]>([]);
  const handle = localStorage.getItem("handle") || "";

  useEffect(() => {
    const messagesRef = ref(fireDB, `messages/${usersHash}`);
    if (!handle) {
      (document.getElementById("my_modal_1")! as HTMLDialogElement).showModal();
    }
    onValue(messagesRef, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach((child) => {
        tempMessages.push(child.val());
      });
      console.log(tempMessages);
      if (tempMessages.length !== messages.length) {
        setMessages(tempMessages);
      }
    });
  }, [usersHash]);

  const userMap = new Map<string, CFUser>();
  for (const user of users) {
    userMap.set(user.handle, user);
  }

  useEffect(() => {
    const maxIndex = messages.length - 1;
    if (maxIndex >= 0) {
      const element = document.getElementById(`chat-${maxIndex}`);
      element?.scrollIntoView();
    }
  }, [messages.length]);

  return (
    <ul className={"mx-10"}>
      {messages.map((message, index) => {
        if (handle == message.handle)
          return (
            <div id={`chat-${index}`} key={index} className={`chat chat-end`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={userMap.get(message.handle)?.avatar || ""}
                  />
                </div>
              </div>
              <div className={`chat-bubble chat-bubble-primary`}>
                {message.message}
              </div>
            </div>
          );
        if (message.handle == "BOT") {
          return (
            <div id={`chat-${index}`} key={index} className={`chat chat-start`}>
              <div className={`chat-bubble chat-bubble-warning`}>
                {message.message}
              </div>
            </div>
          );
        }
        return (
          <div id={`chat-${index}`} key={index} className={`chat chat-start`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={userMap.get(message.handle)?.avatar || ""}
                />
              </div>
            </div>
            <div className={`chat-bubble chat-bubble-info`}>
              {message.message}
            </div>
          </div>
        );
      })}
    </ul>
  );
};

export default RenderChats;
