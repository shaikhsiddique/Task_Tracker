import React from "react";

function Person({ setShowContributorOpt, setContributor, member }) {
  console.log(member);
  return (
    <div
      onClick={() => {
        setShowContributorOpt(true);
        setContributor(member);
      }}
      className="user cursor-pointer flex gap-2 p-2 items-center hover:bg-zinc-300"
    >
      <div
        className="aspect-square rounded-full p-1 px-2 w-7 h-7 flex items-center justify-center bg-slate-400"
        style={{
          backgroundImage: `url(${member?.profileimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <h1 className="font-semibold text-sm">{member?.username}</h1>
    </div>
  );
}

export default Person;
