"use client";

import { CFUser } from "@/app/dual/actions";
import MessageForm from "@/app/dual/MessageForm";
import SideBar from "@/app/dual/SideBar";
import RenderChats from "@/app/dual/RenderChats";

const DualPage = ({ users }: { users: CFUser[] }) => {
  users.sort((a, b) => a.handle.localeCompare(b.handle));
  const usersHash = users.map((user) => user.handle).join(";");

  // @ts-ignore
  const totalHeight = window.innerHeight - 120;

  console.log("rendering");

  return (
    <div>
      <SelectUserPopup handles={users.map((user) => user.handle)} />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <label htmlFor="my-drawer-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current drawer-button lg:hidden absolute m-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        <div className="drawer-content flex flex-col">
          <div className={"overflow-y-scroll"} style={{ height: totalHeight }}>
            <RenderChats users={users} />
          </div>

          <div className={"fixed bottom-0 w-full"}>
            <div className="flex justify-center">
              <MessageForm usersHash={usersHash} />
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <SideBar users={users} />
        </div>
      </div>
    </div>
  );
};

export default DualPage;

const SelectUserPopup = ({ handles }: { handles: string[] }) => {
  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Select Your Handle Name</h3>
          {handles.map((handle, index) => (
            <button
              key={index}
              className="btn btn-primary me-5 rounded-2xl"
              onClick={() => {
                localStorage.setItem("handle", handle);
                (
                  document.getElementById("my_modal_1")! as HTMLDialogElement
                ).close();
              }}
            >
              {handle}
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
};
