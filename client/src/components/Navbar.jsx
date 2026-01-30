import React from "react";
import Avatar from "./Avtar.jsx";

function Navbar() {
  return (
    <div className=" flex justify-between items-center ">
      <nav className=" w-full py-4 px-6 bg-linear-to-bl from-slate-900 via-slate-700 to-slate-800 text-white flex justify-between items-center rounded-b-xl">
        {/* Left section */}
        <div className="flex flex-col px-4">
          <h1 className=" font-bold text-3xl bg-linear-to-r from-blue-400 via-teal-500 to-green-500 bg-clip-text text-transparent">
            API Testing
          </h1>
          <p className=" font-serif text-2xl">A clean api testing tool</p>
        </div>

        {/* Center section */}
        <div className="font-serif text-2xl flex items-center gap-2 cursor-pointer -px-4">
          <link rel="stylesheet" href="" /><div className="flex justify-center items-center w-10 h-10 border border-slate-500 rounded-sm font-bold">
    +
  </div>
  <span className="text-2xl">Change workspace</span>
        </div>

        {/* Right section */}

       <div className="flex items-center gap-2 cursor-pointer">
        <Avatar name="Paras" image={null} />
       <span className="text-xl">Profile</span>
       </div>
      </nav>
    </div>
  );
}

export default Navbar;
