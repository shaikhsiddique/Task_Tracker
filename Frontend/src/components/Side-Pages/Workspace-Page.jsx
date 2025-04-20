import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Person from "../Person";
import axois from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import Add_User from "../Mini-Pages/Add-User";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
  listenForCallRequest,
} from "../../config/socket";
import { use } from "react";
import Markdown from "react-markdown";
import ReactDOM from "react-dom";
import { WorkSpaceContext } from "../../context/WorkSpaceContext";

function Workspace_Page() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { activeWorkspace, setActiveWorkspace } = useContext(WorkSpaceContext);
  const token = localStorage.getItem("Auth-Token");
  const [showAddUser, setshowAddUser] = useState(false);
  const [showContributorOpt, setShowContributorOpt] = useState(false);
  const [contributor, setContributor] = useState({});
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const showAddRef = useRef(null);
  const showContributorOptRef = useRef(null);
  const messageBox = useRef(null);
  const conversationArea = useRef(null);
  const showSidePanelRef = useRef(null)


  const handleSubmit = (e) => {
    if (message === "") {
      return;
    }
    const data = {
      message,
      sender: user,
    };
    setMessage("");
    e.preventDefault();
    sendMessage("workspace-message", data);
    appendSendMessage(data);
  };

  const renderMessageContent = (msg) => {
    if (msg.sender.id === "ai") {
      return (
        <div className="overflow-x-auto max-w-96 text-black p-2">
          <Markdown>{msg.message}</Markdown>
        </div>
      );
    } else {
      return (
        <div className="text-sm max-w-52 font-semibold text-black break-words whitespace-normal">
          {msg.message}
        </div>
      );
    }
  };

  const appendSendMessage = (data) => {
    const messageElement = document.createElement("div");

    messageElement.classList.add(
      "sending",
      "ml-auto",
      "max-w-52",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "rounded-md",
      "shadow",
      "w-fit"
    );

    const nameElement = document.createElement("h5");
    nameElement.classList.add("text-gray-500", "text-xs", "font-medium");
    nameElement.textContent = "You";
    messageElement.appendChild(nameElement);

    const messageTextElement = document.createElement("p");
    messageTextElement.className =
      "text-sm font-semibold text-black break-words whitespace-normal";
    messageTextElement.textContent = data.message;
    messageElement.appendChild(messageTextElement);

    messageBox.current.appendChild(messageElement);

    conversationArea.current.scrollTop = conversationArea.current.scrollHeight;
  };

  const appendReceiveMessage = (data) => {
    if (data.sender._id === user._id) {
      appendSendMessage(data);
      return null;
    }
    const messageElement = document.createElement("div");

    messageElement.classList.add(
      "incoming",
      "min-w-52",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "rounded-md",
      "shadow",
      "w-fit"
    );

    const nameElement = document.createElement("h5");
    nameElement.classList.add("text-gray-500", "text-xs", "font-medium");
    nameElement.textContent = data.sender.username;
    messageElement.appendChild(nameElement);

    const messageTextElement = document.createElement("div");
    messageTextElement.className =
      "text-sm font-semibold text-black break-words whitespace-normal";

    const renderedContent = renderMessageContent(data);
    ReactDOM.render(renderedContent, messageTextElement);
    messageElement.appendChild(messageTextElement);
    messageBox.current.appendChild(messageElement);

    conversationArea.current.scrollTop = conversationArea.current.scrollHeight;
  };

  useEffect(() => {
    axois
      .get(`/workspace/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setActiveWorkspace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    if (showContributorOptRef.current) {
      gsap.to(showContributorOptRef.current, {
        opacity: showContributorOpt ? 1 : 0,
        pointerEvents: showContributorOpt ? "auto" : "none",
        duration: 0.3,
      });
    }
  }, [showContributorOpt]);

  useEffect(() => {
    if (showAddRef.current) {
      gsap.to(showAddRef.current, {
        opacity: showAddUser ? 1 : 0,
        pointerEvents: showAddUser ? "auto" : "none",
        duration: 0.3,
      });
    }
  }, [showAddUser]);

  useEffect(() => {
    if (conversationArea.current) {
      conversationArea.current.scrollTop =
        conversationArea.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    

    if (!activeWorkspace || !activeWorkspace._id) {
      return;
    }

    const socket = initializeSocket(activeWorkspace._id);


    listenForCallRequest((data) => {
      navigate(`/collaboration/call/${data.callerId}_${activeWorkspace._id}`, {
        state: { workspace: activeWorkspace, isCaller: false },
      });
    });

    const messageHandler = (data) => {
      if (data.sender.id === user?._id) {
        appendSendMessage(data);
      } else {
        appendReceiveMessage(data);
      }
    };

    receiveMessage("workspace-message", messageHandler);

    return () => {
      if (socket) {
        socket.off("workspace-message", messageHandler);
      }
    };
  }, [activeWorkspace?._id, user]);


  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if(isDesktop){
      return
    }
    if (showSidePanel) {
      gsap.to(showSidePanelRef.current, {
        width: "500px",
        opacity: 1,
        visibility: "visible",
        duration: 0.3,
      });
    } else {
      gsap.to(showSidePanelRef.current, {
        width: '0px',
        opacity: 0,
        visibility: "hidden",
        duration: 0.3,
      });
    }
  }, [showSidePanel]);

  return (
    <main className="h-full w-full flex">
      <section ref={showSidePanelRef} className="sec-left relative h-full md:min-w-80 hidden md:visible  flex flex-col bg-slate-300 md:block">

        <div className="sidePanel w-full h-full flex flex-col gap-2 bg-zinc-200 absolute left-0 transform translate-x-0 top-0 transition-transform duration-300">
          <header className="flex justify-between min-h-[68px] items-center bg-zinc-500">
          <i onClick={()=>setShowSidePanel(false)} className="ri-arrow-left-wide-line md:hidden text-xl px-2"></i>
            <h1 className="font-semibold px-4">Collaborates</h1>
            {user._id == activeWorkspace.admin ? (
              <button
                onClick={() => setshowAddUser(true)}
                className="close-fil text-lg p-3 px-5 rounded-full"
              >
                <i className="ri-user-add-line"></i>
              </button>
            ) : (
              ""
            )}
          </header>
          <div className="users flex flex-col gap-2">
            {Array.isArray(activeWorkspace.members) &&
              activeWorkspace.members.map((member, key) => {
                if (user._id === member._id) {
                  return null;
                }
                return (
                  <Person
                    key={key}
                    member={member}
                    setShowContributorOpt={setShowContributorOpt}
                    setContributor={setContributor}
                  />
                );
              })}
          </div>
        </div>
      </section>
      <section className="h-full w-full">
        <div
          ref={conversationArea}
          className="conversation-area h-full flex-grow flex flex-col overflow-y-auto "
        >
          <div className="title w-full flex items-center md:justify-center justify-evenly border-b-2 bg-black">
            {!showSidePanel ? <p className="md:hidden block mt-2 z-20">
            <i onClick={()=>setShowSidePanel(true)} className="ri-menu-fill text-2xl text-white "></i>
            </p> :''}
            <h1 className="md:text-3xl text-2xl text-white py-4 font-semibold tracking-wide">
              {activeWorkspace.name}
            </h1>
          </div>
          <div
            ref={messageBox}
            className="message-box flex-grow flex flex-col gap-1 p-2 bg-white"
          >
            {activeWorkspace.messages &&
              activeWorkspace.messages.map((msg, index) => (
                <div key={index}>{renderMessageContent(msg)}</div>
              ))}
          </div>
          <div className="inputField flex w-full">
            <form
              className="w-full"
              action=""
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                className="p-2 px-4 border-none outline-none w-[83%] bg-gray-400 text-black placeholder-black"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                placeholder="Enter Message"
              />
              <button className={`p-3 px-4 bg-black text-white text-xl w-[17%] ${showSidePanel ? "w-full":''}`}>
                <i className="ri-send-plane-fill"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      <div
        ref={showAddRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <Add_User setshowAddUser={setshowAddUser} workspace={activeWorkspace} />
      </div>

      <div
        ref={showContributorOptRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
          <header className="flex  justify-between items-center -mt-2 mb-4">
            <h2 className="text-xl font-semibold text-center ">
              {contributor.username}
            </h2>
            <button
              onClick={() => {
                setShowContributorOpt(false);
              }}
              className="p-2  "
            >
              <i className="ri-close-large-line"></i>
            </button>
          </header>
          <div className="option-list flex flex-col gap-4 mb-16 max-h-96 overflow-auto p-4 bg-white shadow-md rounded-md">
            <Link
              to={`/task/assign/${contributor._id}`}
              className="option flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <i className="ri-task-line text-lg text-blue-600"></i>
              <p className="text-sm font-medium text-gray-700">Assign Task</p>
            </Link>

            {user._id === activeWorkspace.admin ? (
              <Link
                to={`/workspace/remove/${contributor._id}`}
                state={{ activeWorkspace }}
                className="option flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <i className="ri-user-forbid-line text-lg text-red-600"></i>
                <p className="text-sm font-medium text-gray-700">Remove User</p>
              </Link>
            ) : null}
            {activeWorkspace && activeWorkspace._id && (
             <Link
             to={`/collaboration/call/${contributor._id}_${activeWorkspace._id}_true`}
             state={{ workspace: activeWorkspace, isCaller: true }}
             className="option flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
           >
             <i className="ri-user-voice-fill text-lg text-green-600"></i>
             <p className="text-sm font-medium text-gray-700">Call</p>
           </Link>
           
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Workspace_Page;
